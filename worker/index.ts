/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
   EMAIL: {
    send(message: {
      to: string[];
      from: {
        email: string;
        name?: string;
      };
      subject: string;
      html?: string;
      text?: string;
    }): Promise<{
      messageId: string;
    }>;
  };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {const BOOKING_RECIPIENTS = [
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
    const data = await request.json() as {
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

    const currency = (value: number | undefined) =>
      new Intl.NumberFormat("vi-VN").format(Number(value ?? 0));

    const subject =
      `[SĀKURĀ RETREAT] Đặt lịch mới — ${guestName} — ${data.formattedDate ?? data.date} ${data.time}`;

    const text = [
      "SĀKURĀ RETREAT — YÊU CẦU ĐẶT LỊCH MỚI",
      "",
      `Khách hàng: ${guestName}`,
      `Điện thoại: ${guestPhone}`,
      "",
      `Dịch vụ: ${data.serviceName}`,
      data.serviceEnglishName
        ? `Tên tiếng Anh: ${data.serviceEnglishName}`
        : "",
      data.serviceId ? `Mã dịch vụ: ${data.serviceId}` : "",
      `Thời lượng: ${data.duration ?? ""} phút`,
      `Giá niêm yết: ${currency(data.listedPrice)} VND`,
      `Giá website: ${currency(data.websitePrice)} VND`,
      "",
      `Ngày mong muốn: ${data.formattedDate ?? data.date}`,
      `Giờ mong muốn: ${data.time}`,
      "",
      guestNote ? `Lưu ý của khách: ${guestNote}` : "Lưu ý của khách: Không có",
      "",
      `Ngôn ngữ website: ${data.language === "en" ? "English" : "Tiếng Việt"}`,
      `Thời điểm gửi: ${new Date().toISOString()}`,
      "",
      "Vui lòng kiểm tra lịch và liên hệ khách để xác nhận.",
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#233228">
        <div style="padding:28px;background:#31483a;color:#fff">
          <div style="font-size:12px;letter-spacing:2px">SĀKURĀ RETREAT</div>
          <h1 style="margin:10px 0 0;font-size:24px">
            Yêu cầu đặt lịch mới
          </h1>
        </div>

        <div style="padding:28px;border:1px solid #e5e5df;border-top:0">
          <h2 style="font-size:18px;margin-top:0">Thông tin khách hàng</h2>

          <p><strong>Khách:</strong> ${escapeHtml(guestName)}</p>
          <p>
            <strong>Điện thoại:</strong>
            <a href="tel:${escapeHtml(guestPhone)}">
              ${escapeHtml(guestPhone)}
            </a>
          </p>

          <hr style="border:0;border-top:1px solid #e5e5df;margin:24px 0">

          <h2 style="font-size:18px">Thông tin lịch hẹn</h2>

          <p><strong>Dịch vụ:</strong> ${escapeHtml(data.serviceName)}</p>

          ${
            data.serviceEnglishName
              ? `<p><strong>English:</strong> ${escapeHtml(data.serviceEnglishName)}</p>`
              : ""
          }

          ${
            data.serviceId
              ? `<p><strong>Mã dịch vụ:</strong> ${escapeHtml(data.serviceId)}</p>`
              : ""
          }

          <p><strong>Thời lượng:</strong> ${escapeHtml(data.duration)} phút</p>

          <p>
            <strong>Giá niêm yết:</strong>
            ${currency(data.listedPrice)} VND
          </p>

          <p>
            <strong>Giá ưu đãi website:</strong>
            ${currency(data.websitePrice)} VND
          </p>

          <p>
            <strong>Ngày:</strong>
            ${escapeHtml(data.formattedDate ?? data.date)}
          </p>

          <p>
            <strong>Giờ:</strong>
            ${escapeHtml(data.time)}
          </p>

          <hr style="border:0;border-top:1px solid #e5e5df;margin:24px 0">

          <h2 style="font-size:18px">Lưu ý</h2>

          <p>
            ${guestNote ? escapeHtml(guestNote) : "Khách không để lại ghi chú."}
          </p>

          <div style="margin-top:28px;padding:16px;background:#f5f4ef">
            <strong>Cần xác nhận lịch</strong><br>
            Vui lòng kiểm tra tình trạng phòng và liên hệ khách qua số điện thoại trên.
          </div>
        </div>
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
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Booking email failed", error);

    return Response.json(
      {
        ok: false,
        error: "Unable to send booking request",
      },
      { status: 500 },
    );
  }
}
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/api/booking") {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          Allow: "POST",
        },
      });
    }

    return handleBookingRequest(request, env);
  }

  if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
