/** Cloudflare Worker entry point for SĀKURĀ RETREAT. */
import {
  handleImageOptimization,
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  EMAIL: {
    send(message: {
      to: string[];
      from: { email: string; name?: string };
      subject: string;
      html?: string;
      text?: string;
    }): Promise<{ messageId?: string }>;
  };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: {
          format: string;
          quality: number;
        }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const BOOKING_RECIPIENTS = [
  "cuongtd.hcm@gmail.com",
  "thecouplespavn@gmail.com",
  "maimummim1989@gmail.com",
];

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function handleBookingRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const data = (await request.json()) as {
      guestName?: string;
      guestPhone?: string;
      guestNote?: string;
      serviceId?: string;
      serviceName?: string;
      serviceEnglishName?: string;
      duration?: number;
      listedPrice?: number;
      websitePrice?: number;
      date?: string;
      formattedDate?: string;
      time?: string;
      language?: string;
    };

    const guestName = String(data.guestName ?? "").trim();
    const guestPhone = String(data.guestPhone ?? "").trim();
    const guestNote = String(data.guestNote ?? "").trim();

    if (!guestName) {
      return Response.json(
        { ok: false, error: "Missing guest name" },
        { status: 400 },
      );
    }

    if (guestPhone.replace(/\D/g, "").length < 9) {
      return Response.json(
        { ok: false, error: "Invalid phone number" },
        { status: 400 },
      );
    }

    if (!data.serviceName || !data.date || !data.time) {
      return Response.json(
        { ok: false, error: "Incomplete booking information" },
        { status: 400 },
      );
    }

    const formatMoney = (value: number | undefined) =>
      new Intl.NumberFormat("vi-VN").format(Number(value ?? 0));

    const bookingDate = data.formattedDate ?? data.date;
    const subject = `[SĀKURĀ RETREAT] Đặt lịch mới — ${guestName} — ${bookingDate} ${data.time}`;

    const text = [
      "SĀKURĀ RETREAT — YÊU CẦU ĐẶT LỊCH MỚI",
      "",
      `Khách hàng: ${guestName}`,
      `Điện thoại: ${guestPhone}`,
      `Dịch vụ: ${data.serviceName}`,
      data.serviceEnglishName ? `English: ${data.serviceEnglishName}` : "",
      data.serviceId ? `Mã dịch vụ: ${data.serviceId}` : "",
      `Thời lượng: ${data.duration ?? ""} phút`,
      `Giá niêm yết: ${formatMoney(data.listedPrice)} VND`,
      `Giá website: ${formatMoney(data.websitePrice)} VND`,
      `Ngày: ${bookingDate}`,
      `Giờ: ${data.time}`,
      `Ghi chú: ${guestNote || "Không có"}`,
      `Ngôn ngữ website: ${data.language === "en" ? "English" : "Tiếng Việt"}`,
      "",
      "Vui lòng kiểm tra lịch và liên hệ khách để xác nhận.",
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#233228">
        <h2>SĀKURĀ RETREAT — Yêu cầu đặt lịch mới</h2>
        <p><strong>Khách:</strong> ${escapeHtml(guestName)}</p>
        <p><strong>Điện thoại:</strong> ${escapeHtml(guestPhone)}</p>
        <p><strong>Dịch vụ:</strong> ${escapeHtml(data.serviceName)}</p>
        <p><strong>Thời lượng:</strong> ${escapeHtml(data.duration)} phút</p>
        <p><strong>Giá niêm yết:</strong> ${formatMoney(data.listedPrice)} VND</p>
        <p><strong>Giá website:</strong> ${formatMoney(data.websitePrice)} VND</p>
        <p><strong>Ngày:</strong> ${escapeHtml(bookingDate)}</p>
        <p><strong>Giờ:</strong> ${escapeHtml(data.time)}</p>
        <p><strong>Ghi chú:</strong> ${escapeHtml(guestNote || "Không có")}</p>
      </div>
    `;

    const result = await env.EMAIL.send({
      to: BOOKING_RECIPIENTS,
      from: {
        email: "booking@sakuraretreat.vn",
        name: "SĀKURĀ RETREAT Booking",
      },
      subject,
      text,
      html,
    });

    return Response.json({
      ok: true,
      messageId: result?.messageId ?? null,
    });
  } catch (error) {
    console.error("Booking email failed", error);
    return Response.json(
      { ok: false, error: "Unable to send booking request" },
      { status: 500 },
    );
  }
}

const worker = {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/booking") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { Allow: "POST" },
        });
      }

      return handleBookingRequest(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(
        request,
        {
          fetchAsset: (path) =>
            env.ASSETS.fetch(new Request(new URL(path, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body)
              .transform(width > 0 ? { width } : {})
              .output({ format, quality });
            return result.response();
          },
        },
        allowedWidths,
      );
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
