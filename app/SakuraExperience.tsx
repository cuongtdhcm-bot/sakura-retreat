"use client";

/* eslint-disable @next/next/no-img-element */

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { descriptionsEn, type Language, ui } from "./content";
import {
  type RetreatService,
  services,
  webPrice,
} from "./services";

type Copy = (typeof ui)[Language];
type Focus = "facial" | "body";
type DurationPreference = "any" | "short" | "classic" | "extended";
type ServiceFilter = "all" | "facial" | "signature" | "body";
type BookingIntent = "facial" | "body" | "signature";
type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;
type QrChannel = { name: string; image: string } | null;

const PHONE_DISPLAY = "09123 555 03";
const PHONE_NUMBER = "0912355503";
const ZALO_URL = "https://zaloapp.com/qr/p/uor4ye42w7z6";
const MESSENGER_URL = "https://m.me/111809981268423";
const WHATSAPP_URL = "https://wa.me/84912355503";
const DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=10.738059359900387%2C106.68995647497859";
const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.953603801484!2d106.68995647497859!3d10.738059359900387!2m3!1f0!2f0!3f0!3m2!1i1024!1i768!4f13.1!3m3!1m2!1s0x31752f6f94ecd005%3A0x48740bf7253a3a2c!2sSAKURA%20RETREAT!5e0!3m2!1svi!2s!4v1787383247500!5m2!1svi!2s";

const journeyAnchors = [0, 0.19, 0.39, 0.59, 0.79, 1] as const;
const signatureAnchors = [0, 0.5, 1] as const;
const signatureIds = ["SK029", "FA034", "DIAMOND-FACE"] as const;
const qrChannels = [
  { name: "Zalo", image: "/concierge/zalo.jpg" },
  { name: "KakaoTalk", image: "/concierge/kakaotalk.png" },
  { name: "Telegram", image: "/concierge/telegram.png" },
  { name: "WeChat", image: "/concierge/wechat.png" },
];

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

function Arrow({ diagonal = false, down = false }: { diagonal?: boolean; down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      {down ? (
        <path d="M12 4v16m0 0 6-6m-6 6-6-6" />
      ) : diagonal ? (
        <path d="M6 18 18 6m0 0H8m10 0v10" />
      ) : (
        <path d="M4 12h16m0 0-6-6m6 6-6 6" />
      )}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M8 3v5M16 3v5M3.5 10h17" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <path d="M6.5 3.8 9 7.9 7.4 9.7c1.1 2.4 3 4.3 5.4 5.4l1.8-1.6 4.1 2.4-.5 3.4c-.1.8-.8 1.4-1.6 1.4C9.2 20.1 3.9 14.8 3.3 7.4c-.1-.8.5-1.5 1.3-1.6l1.9-.3Z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <path d="M20 15.5a3 3 0 0 1-3 3H9l-5 3V8.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z" />
      <path d="M8 10.5h8M8 14h5" />
    </svg>
  );
}

function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`kicker ${light ? "light" : ""}`}>
      <span />
      {children}
    </p>
  );
}

function serviceName(service: RetreatService, lang: Language) {
  return lang === "vi" ? service.name : service.englishName;
}

function secondaryName(service: RetreatService, lang: Language) {
  return lang === "vi" ? service.englishName : service.name;
}

function serviceDescription(service: RetreatService, lang: Language) {
  return lang === "vi" ? service.description : descriptionsEn[service.id];
}

function money(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function PriceBlock({
  service,
  copy,
  compact = false,
  light = false,
}: {
  service: RetreatService;
  copy: Copy;
  compact?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`price-block ${compact ? "compact" : ""} ${light ? "light" : ""}`}>
      <div>
        <span>{copy.common.listed}</span>
        <p><del>{money(service.price)}</del><small>VND</small></p>
      </div>
      <div>
        <span>{copy.common.direct}</span>
        <p><strong>{money(webPrice(service.price))}</strong><small>VND</small></p>
      </div>
      {!compact && <em>{copy.common.privilege}</em>}
    </div>
  );
}

function formatBookingDate(value: string, lang: Language) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function CinematicJourney({
  copy,
  lang,
  onBook,
  onExplore,
}: {
  copy: Copy;
  lang: Language;
  onBook: () => void;
  onExplore: () => void;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sceneElements = Array.from(root.querySelectorAll<HTMLElement>(".cinema-scene"));
    const needElements = Array.from(root.querySelectorAll<HTMLElement>(".need-visual"));
    const needCopyElements = Array.from(root.querySelectorAll<HTMLElement>(".need-copy-item"));
    const progressLine = root.querySelector<HTMLElement>(".journey-line span");

    let current = 0;
    let target = 0;
    let frame = 0;
    let lastActive = -1;

    const targetFromScroll = () => {
      const travel = Math.max(1, root.offsetHeight - window.innerHeight);
      return clamp(-root.getBoundingClientRect().top / travel);
    };

    const render = (progress: number) => {
      sceneElements.forEach((scene, index) => {
        if (!scene) return;
        const anchor = journeyAnchors[index];
        const local = clamp((progress - anchor + 0.15) / 0.3);
        const opacity = clamp(1 - Math.abs(progress - anchor) / 0.205);
        scene.style.setProperty("--scene-progress", local.toFixed(4));
        scene.style.setProperty("--scene-opacity", opacity.toFixed(4));
        scene.style.setProperty("--scene-blur", `${((1 - opacity) * 4.5).toFixed(2)}px`);
        scene.style.zIndex = String(10 + Math.round(opacity * 10));
      });

      const pauseLocal = clamp((progress - journeyAnchors[2] + 0.15) / 0.3);
      const needPhase = pauseLocal * 2;
      needElements.forEach((frameElement, index) => {
        if (!frameElement) return;
        const opacity = clamp(1 - Math.abs(needPhase - index) * 1.35);
        frameElement.style.setProperty("--need-opacity", opacity.toFixed(4));
        frameElement.style.setProperty("--need-progress", clamp(needPhase - index + 0.5).toFixed(4));
        const copyElement = needCopyElements[index];
        copyElement?.style.setProperty("--need-opacity", opacity.toFixed(4));
      });

      if (progressLine) progressLine.style.transform = window.innerWidth <= 820 ? `scaleX(${progress})` : `scaleY(${progress})`;
      const nearest = journeyAnchors.reduce(
        (best, anchor, index) =>
          Math.abs(anchor - progress) < Math.abs(journeyAnchors[best] - progress) ? index : best,
        0,
      );
      if (nearest !== lastActive) {
        lastActive = nearest;
        setActiveScene(nearest);
      }
    };

    const tick = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.0007) current = target;
      render(current);
      if (current !== target) frame = window.requestAnimationFrame(tick);
      else frame = 0;
    };

    const update = () => {
      target = targetFromScroll();
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    current = targetFromScroll();
    target = current;
    render(current);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [copy]);

  const goToScene = (index: number) => {
    const root = rootRef.current;
    if (!root) return;
    const travel = Math.max(1, root.offsetHeight - window.innerHeight);
    window.scrollTo({ top: root.offsetTop + journeyAnchors[index] * travel, behavior: "smooth" });
  };

  return (
    <section className="cinematic-journey" id="journey" ref={rootRef} aria-label="SĀKURĀ immersive journey">
      <div className="cinematic-stage">
        <article className="cinema-scene scene-arrival">
          <img className="scene-background" src="/images/villa.webp" alt={lang === "vi" ? "Villa xanh SĀKURĀ Retreat tại Trung Sơn" : "The botanical SĀKURĀ Retreat villa in Trung Son"} fetchPriority="high" />
          <img className="scene-foreground" src="/images/villa.webp" alt="" />
          <div className="scene-shade" />
          <div className="scene-copy scene-copy-left">
            <p className="scene-eyebrow">{copy.journey.scenes.arrival.eyebrow}</p>
            <h1>{copy.journey.scenes.arrival.title.map((line, index) => <span key={line} className={index === 2 ? "accent" : ""}>{line}</span>)}</h1>
            <p className="scene-body">{copy.journey.scenes.arrival.body}</p>
            <div className="scene-actions">
              <button type="button" className="button-gold" onClick={() => goToScene(1)}>{copy.journey.scenes.arrival.primary}<Arrow down /></button>
              <button type="button" className="button-glass" onClick={onBook}>{copy.journey.scenes.arrival.secondary}<Arrow diagonal /></button>
            </div>
          </div>
          <p className="scene-meta">{copy.journey.scenes.arrival.meta}</p>
        </article>

        <article className="cinema-scene scene-threshold">
          <img className="scene-background" src="/images/villa.webp" alt="" />
          <img className="scene-foreground" src="/images/villa.webp" alt="" />
          <div className="scene-shade" />
          <div className="threshold-frame" aria-hidden="true"><span /><span /></div>
          <div className="scene-copy scene-copy-center">
            <p className="scene-eyebrow">{copy.journey.scenes.threshold.eyebrow}</p>
            <h2>{copy.journey.scenes.threshold.title}</h2>
            <p className="scene-body">{copy.journey.scenes.threshold.body}</p>
            <strong className="scene-signature">{copy.journey.scenes.threshold.meta}</strong>
          </div>
        </article>

        <article className="cinema-scene scene-pause">
          <div className="need-visuals">
            {["/images/facial-opener.webp", "/images/body-opener.webp", "/images/villa.webp"].map((image, index) => (
              <div className="need-visual" key={image}>
                <img src={image} alt="" />
                <span>{copy.journey.scenes.pause.items[index][0]}</span>
              </div>
            ))}
          </div>
          <div className="scene-shade" />
          <div className="scene-copy scene-copy-split">
            <div>
              <p className="scene-eyebrow">{copy.journey.scenes.pause.eyebrow}</p>
              <h2>{copy.journey.scenes.pause.title}</h2>
              <p className="scene-body">{copy.journey.scenes.pause.body}</p>
            </div>
            <div className="need-copy">
              {copy.journey.scenes.pause.items.map(([number, title, body], index) => (
                <article key={title} className={activeScene === 2 ? `need-copy-item need-${index}` : "need-copy-item"}>
                  <span>{number}</span><h3>{title}</h3><p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </article>

        <article className="cinema-scene scene-facial">
          <img className="scene-background" src="/images/facial-opener.webp" alt={lang === "vi" ? "Trải nghiệm Facial Retreat" : "Facial Retreat experience"} />
          <img className="scene-foreground scene-foreground-detail" src="/images/warm-stone-facial.webp" alt="" />
          <div className="scene-shade" />
          <div className="scene-copy scene-copy-right">
            <p className="scene-eyebrow">{copy.journey.scenes.facial.eyebrow}</p>
            <h2>{copy.journey.scenes.facial.title}</h2>
            <p className="scene-body">{copy.journey.scenes.facial.body}</p>
            <strong className="scene-signature">{copy.journey.scenes.facial.meta}</strong>
          </div>
        </article>

        <article className="cinema-scene scene-body">
          <img className="scene-background" src="/images/body-opener.webp" alt={lang === "vi" ? "Trải nghiệm Body Retreat" : "Body Retreat experience"} />
          <img className="scene-foreground scene-foreground-detail" src="/images/body-stone.webp" alt="" />
          <div className="scene-shade" />
          <div className="scene-copy scene-copy-left">
            <p className="scene-eyebrow">{copy.journey.scenes.body.eyebrow}</p>
            <h2>{copy.journey.scenes.body.title}</h2>
            <p className="scene-body">{copy.journey.scenes.body.body}</p>
            <strong className="scene-signature">{copy.journey.scenes.body.meta}</strong>
          </div>
        </article>

        <article className="cinema-scene scene-retreat">
          <img className="scene-background" src="/images/villa.webp" alt="" />
          <img className="scene-foreground" src="/images/villa.webp" alt="" />
          <div className="scene-shade" />
          <div className="scene-copy scene-copy-center">
            <img className="scene-brand-mark" src="/brand/sakura-mark.png" alt="" />
            <p className="scene-eyebrow">{copy.journey.scenes.retreat.eyebrow}</p>
            <h2>{copy.journey.scenes.retreat.title}</h2>
            <p className="scene-body">{copy.journey.scenes.retreat.body}</p>
            <div className="scene-actions">
              <button type="button" className="button-gold" onClick={onExplore}>{copy.journey.scenes.retreat.primary}<Arrow down /></button>
              <button type="button" className="button-glass" onClick={onBook}>{copy.journey.scenes.retreat.secondary}<Arrow diagonal /></button>
            </div>
          </div>
        </article>

        <aside className="journey-progress" aria-label="Journey progress">
          <div className="journey-line"><span /></div>
          <div>
            {copy.journey.progress.map((label, index) => (
              <button key={label} type="button" className={activeScene === index ? "active" : ""} onClick={() => goToScene(index)} aria-current={activeScene === index ? "step" : undefined}>
                <span>0{index + 1}</span><em>{label}</em>
              </button>
            ))}
          </div>
        </aside>
        <div className="journey-hint"><span>{lang === "vi" ? "VUỐT ĐỂ TIẾN SÂU" : "SCROLL TO TRAVEL FORWARD"}</span><Arrow down /></div>
      </div>
    </section>
  );
}

function SignatureJourney({
  copy,
  lang,
  onBook,
}: {
  copy: Copy;
  lang: Language;
  onBook: (serviceId: string) => void;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const signatureServices = signatureIds.map((id) => services.find((service) => service.id === id)).filter(Boolean) as RetreatService[];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panelElements = Array.from(root.querySelectorAll<HTMLElement>(".signature-panel"));
    const timeline = root.querySelector<HTMLElement>(".signature-timeline span");
    let current = 0;
    let target = 0;
    let frame = 0;
    let lastActive = -1;

    const targetFromScroll = () => {
      const travel = Math.max(1, root.offsetHeight - window.innerHeight);
      return clamp(-root.getBoundingClientRect().top / travel);
    };
    const render = (progress: number) => {
      panelElements.forEach((panel, index) => {
        if (!panel) return;
        const anchor = signatureAnchors[index];
        const local = clamp((progress - anchor + 0.28) / 0.56);
        const opacity = clamp(1 - Math.abs(progress - anchor) / 0.53);
        panel.style.setProperty("--signature-progress", local.toFixed(4));
        panel.style.setProperty("--signature-opacity", opacity.toFixed(4));
        panel.style.zIndex = String(10 + Math.round(opacity * 10));
      });
      if (timeline) timeline.style.transform = `scaleX(${progress})`;
      const nearest = signatureAnchors.reduce(
        (best, anchor, index) => Math.abs(anchor - progress) < Math.abs(signatureAnchors[best] - progress) ? index : best,
        0,
      );
      if (nearest !== lastActive) {
        lastActive = nearest;
        setActive(nearest);
      }
    };
    const tick = () => {
      current += (target - current) * 0.15;
      if (Math.abs(target - current) < 0.0007) current = target;
      render(current);
      if (current !== target) frame = window.requestAnimationFrame(tick);
      else frame = 0;
    };
    const update = () => {
      target = targetFromScroll();
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    current = targetFromScroll();
    target = current;
    render(current);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [copy]);

  return (
    <section className="signature-journey" id="signatures" ref={rootRef} aria-labelledby="signature-title">
      <div className="signature-stage">
        <header className="signature-heading">
          <Kicker light>{copy.signatures.eyebrow}</Kicker>
          <div><h2 id="signature-title">{copy.signatures.title}</h2><p>{copy.signatures.body}</p></div>
        </header>
        {signatureServices.map((service, index) => (
          <article className="signature-panel" key={service.id}>
            <div className="signature-visual">
              <img src={service.image} alt={serviceName(service, lang)} />
              <span>0{index + 1}</span>
            </div>
            <div className="signature-copy">
              <p>{service.collection} · {service.duration} {copy.common.minutes}</p>
              <h3>{serviceName(service, lang)}</h3>
              <small>{secondaryName(service, lang)}</small>
              <p className="signature-emotion">{copy.signatures.emotional[index]}</p>
              <PriceBlock service={service} copy={copy} compact light />
              <button type="button" onClick={() => onBook(service.id)}>{copy.common.choose}<Arrow diagonal /></button>
            </div>
          </article>
        ))}
        <div className="signature-timeline" aria-hidden="true"><span /></div>
        <p className="signature-counter"><span>0{active + 1}</span> / 03</p>
      </div>
    </section>
  );
}

function bookingMessage({
  lang,
  service,
  date,
  time,
  guestName,
  guestPhone,
  guestNote,
}: {
  lang: Language;
  service: RetreatService;
  date: string;
  time: string;
  guestName: string;
  guestPhone: string;
  guestNote: string;
}) {
  const lines = lang === "vi"
    ? [
        "SĀKURĀ RETREAT — YÊU CẦU ĐẶT LỊCH",
        `Khách: ${guestName}`,
        `Điện thoại: ${guestPhone}`,
        `Dịch vụ: ${service.name}`,
        `Thời lượng: ${service.duration} phút`,
        `Giá niêm yết: ${money(service.price)} VND`,
        `Giá ưu đãi website: ${money(webPrice(service.price))} VND`,
        `Thời gian mong muốn: ${formatBookingDate(date, lang)} · ${time}`,
        guestNote ? `Lưu ý: ${guestNote}` : "",
        "Nhờ SĀKURĀ Concierge kiểm tra và xác nhận lịch giúp tôi.",
      ]
    : [
        "SĀKURĀ RETREAT — PRIVATE RESERVATION REQUEST",
        `Guest: ${guestName}`,
        `Phone: ${guestPhone}`,
        `Experience: ${service.englishName}`,
        `Duration: ${service.duration} minutes`,
        `Listed price: ${money(service.price)} VND`,
        `Direct website rate: ${money(webPrice(service.price))} VND`,
        `Preferred arrival: ${formatBookingDate(date, lang)} · ${time}`,
        guestNote ? `Note: ${guestNote}` : "",
        "Please ask SĀKURĀ Concierge to review and confirm my appointment.",
      ];
  return lines.filter(Boolean).join("\n");
}

export default function SakuraExperience() {
  const [lang, setLang] = useState<Language>("vi");
  const [headerSolid, setHeaderSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [focus, setFocus] = useState<Focus>("facial");
  const [durationPreference, setDurationPreference] = useState<DurationPreference>("any");
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [activeServiceId, setActiveServiceId] = useState("SK029");
  const [sheetServiceId, setSheetServiceId] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);
  const [bookingIntent, setBookingIntent] = useState<BookingIntent>("facial");
  const [selectedServiceId, setSelectedServiceId] = useState("SK029");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestNote, setGuestNote] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrChannel, setQrChannel] = useState<QrChannel>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  const copy = ui[lang];
  const activeService = services.find((service) => service.id === activeServiceId) ?? services[0];
  const sheetService = sheetServiceId ? services.find((service) => service.id === sheetServiceId) ?? null : null;
  const selectedService = services.find((service) => service.id === selectedServiceId) ?? services[0];

  const finderResults = useMemo(() => {
    const categoryServices = services.filter((service) => service.category === focus);
    const durationMatch = (service: RetreatService) => {
      if (durationPreference === "short") return service.duration <= 60;
      if (durationPreference === "classic") return service.duration > 60 && service.duration <= 90;
      if (durationPreference === "extended") return service.duration >= 100;
      return true;
    };
    const preferred = categoryServices.filter(durationMatch);
    return [...preferred, ...categoryServices.filter((service) => !preferred.includes(service))]
      .sort((a, b) => {
        const score = (service: RetreatService) =>
          (service.level.toLowerCase().includes("signature") ? 3 : 0) +
          (durationMatch(service) ? 5 : 0);
        return score(b) - score(a);
      })
      .slice(0, 3);
  }, [durationPreference, focus]);

  const filteredServices = useMemo(() => services.filter((service) => {
    if (serviceFilter === "all") return true;
    if (serviceFilter === "facial") return service.category === "facial";
    if (serviceFilter === "body") return service.category === "body";
    return service.level.toLowerCase().includes("signature");
  }), [serviceFilter]);

  const bookingServices = useMemo(() => services.filter((service) => {
    if (bookingIntent === "signature") return service.level.toLowerCase().includes("signature");
    return service.category === bookingIntent;
  }), [bookingIntent]);

  const dates = useMemo(() => Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      weekday: new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", { weekday: "short" }).format(date),
      day: String(date.getDate()).padStart(2, "0"),
      month: new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", { month: "short" }).format(date),
    };
  }), [lang]);

  const timeSlots = useMemo(() => {
    const result: string[] = [];
    const opening = 9 * 60;
    const closing = 20 * 60 + 30;
    for (let minute = opening; minute + selectedService.duration <= closing; minute += 30) {
      result.push(`${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
    }
    return result;
  }, [selectedService.duration]);

  const requestMessage = bookingMessage({ lang, service: selectedService, date: selectedDate, time: selectedTime, guestName, guestPhone, guestNote });

  useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const lite = window.innerWidth < 820 && (memory <= 4 || navigator.hardwareConcurrency <= 4);
    document.documentElement.dataset.motionTier = lite ? "lite" : "full";
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem("sakura-language", lang);
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setHeaderSolid(window.scrollY > 70);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const locked = menuOpen || bookingOpen || Boolean(sheetServiceId) || Boolean(qrChannel);
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, bookingOpen, sheetServiceId, qrChannel]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setBookingOpen(false);
      setSheetServiceId(null);
      setQrChannel(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (bookingOpen) window.setTimeout(() => bookingRef.current?.focus(), 50);
  }, [bookingOpen]);

  function scrollTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function chooseBookingIntent(intent: BookingIntent) {
    setBookingIntent(intent);
    const first = services.find((service) => intent === "signature" ? service.level.toLowerCase().includes("signature") : service.category === intent);
    if (first) setSelectedServiceId(first.id);
    setSelectedDate("");
    setSelectedTime("");
    setBookingStep(2);
  }

  function openBooking(serviceId?: string) {
    if (serviceId) {
      const service = services.find((item) => item.id === serviceId);
      if (service) {
        setSelectedServiceId(service.id);
        setBookingIntent(service.level.toLowerCase().includes("signature") ? "signature" : service.category);
        setBookingStep(3);
      }
    } else {
      setBookingStep(1);
    }
    setSelectedDate("");
    setSelectedTime("");
    setCopied(false);
    setSheetServiceId(null);
    setBookingOpen(true);
  }

  function selectFilter(filter: ServiceFilter) {
    setServiceFilter(filter);
    const first = services.find((service) => filter === "all" ? true : filter === "signature" ? service.level.toLowerCase().includes("signature") : service.category === filter);
    if (first) setActiveServiceId(first.id);
  }

  function selectService(service: RetreatService) {
    setActiveServiceId(service.id);
    if (window.matchMedia("(max-width: 820px)").matches) setSheetServiceId(service.id);
  }

  async function copyAndOpenZalo() {
    try {
      await navigator.clipboard.writeText(requestMessage);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.open(ZALO_URL, "_blank", "noopener,noreferrer");
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (
    !guestName.trim() ||
    guestPhone.replace(/\D/g, "").length < 9 ||
    !selectedDate ||
    !selectedTime
  ) {
    return;
  }

  if (bookingSubmitting) return;

  setBookingSubmitting(true);

  try {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        guestNote: guestNote.trim(),

        serviceId: selectedService.sku ?? selectedService.id,
        serviceName: selectedService.name,
        serviceEnglishName: selectedService.englishName,
        duration: selectedService.duration,

        listedPrice: selectedService.price,
        websitePrice: webPrice(selectedService.price),

        date: selectedDate,
        formattedDate: formatBookingDate(selectedDate, lang),
        time: selectedTime,

        language: lang,
      }),
    });

    if (!response.ok) {
      throw new Error("Booking request failed");
    }

    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.error ?? "Booking request failed");
    }

    setBookingStep(6);
  } catch (error) {
    console.error(error);

    window.alert(
      lang === "vi"
        ? "SĀKURĀ chưa nhận được yêu cầu đặt lịch. Vui lòng thử lại hoặc liên hệ Concierge qua Zalo."
        : "SĀKURĀ could not receive your reservation request. Please try again or contact Concierge via Zalo.",
    );
  } finally {
    setBookingSubmitting(false);
  }
}

  const renderServiceDetail = (service: RetreatService, mobile = false) => (
    <div className={`service-detail-content ${mobile ? "mobile" : ""}`}>
      <p className="service-meta">{service.sku ?? service.id} · {service.collection} · {service.duration} {copy.common.minutes}</p>
      <h3>{serviceName(service, lang)}</h3>
      <small>{secondaryName(service, lang)}</small>
      <p className="service-description">{serviceDescription(service, lang)}</p>
      <PriceBlock service={service} copy={copy} />
      <div className="service-notes">
        <article><span>01</span><div><h4>{copy.collection.suitable}</h4><p>{service.category === "facial" ? copy.collection.facialSuitable : copy.collection.bodySuitable}</p></div></article>
        <article><span>02</span><div><h4>{copy.collection.preparation}</h4><p>{service.category === "facial" ? copy.collection.facialPreparation : copy.collection.bodyPreparation}</p></div></article>
      </div>
      <button type="button" className="button-dark" onClick={() => openBooking(service.id)}>{copy.common.choose}<Arrow /></button>
      <p className="legal-copy">{copy.common.legal}</p>
    </div>
  );

  return (
    <>
      <a className="skip-link" href="#main-content">{copy.skip}</a>

      <header className={`site-header ${headerSolid ? "solid" : ""}`}>
        <button type="button" className="brand-button" onClick={() => scrollTo("journey")} aria-label="SĀKURĀ Retreat">
          <img src="/brand/sakura-lockup.png" alt="SĀKURĀ — The Signature Private Retreat" />
        </button>
        <p className="header-coordinate">10.7381° N · TRUNG SON</p>
        <div className="header-actions">
          <button type="button" className="language-button" onClick={() => setLang(lang === "vi" ? "en" : "vi")}>{copy.language}</button>
          <button type="button" className="reserve-button" onClick={() => openBooking()}>{copy.reserve}<CalendarIcon /></button>
          <button type="button" className={`menu-button ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}><span /><span /></button>
        </div>
      </header>

      <div className={`menu-overlay ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="menu-visual"><img src="/images/villa.webp" alt="" /><span /></div>
        <nav aria-label={lang === "vi" ? "Điều hướng chính" : "Primary navigation"}>
          {[
            ["01", copy.nav.journey, "journey"],
            ["02", copy.nav.forYou, "finder"],
            ["03", copy.nav.signatures, "signatures"],
            ["04", copy.nav.collection, "collection"],
            ["05", copy.nav.visit, "visit"],
          ].map(([number, label, id]) => <button key={id} type="button" onClick={() => scrollTo(id)}><span>{number}</span><strong>{label}</strong><Arrow /></button>)}
          <div className="menu-contact"><a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a><span>{copy.footer.hours}</span></div>
        </nav>
      </div>

      <main id="main-content">
        <CinematicJourney copy={copy} lang={lang} onBook={() => openBooking()} onExplore={() => scrollTo("finder")} />

        <section className="welcome-section" aria-labelledby="welcome-title">
          <div className="welcome-intro">
            <Kicker>{copy.welcome.eyebrow}</Kicker>
            <h2 id="welcome-title">{copy.welcome.title}</h2>
            <p>{copy.welcome.body}</p>
          </div>
          <div className="welcome-image"><img src="/images/villa.webp" alt="" /><span>PRIVATE BY DESIGN</span></div>
          <div className="welcome-pillars">
            {copy.welcome.pillars.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </section>

        <section className="finder-section" id="finder" aria-labelledby="finder-title">
          <header className="finder-heading">
            <Kicker light>{copy.finder.eyebrow}</Kicker>
            <h2 id="finder-title">{copy.finder.title}</h2>
            <p>{copy.finder.body}</p>
          </header>
          <div className="finder-interface">
            <div className="finder-controls">
              <fieldset>
                <legend><span>01</span>{copy.finder.focusLabel}</legend>
                <div className="focus-switch">
                  {(["facial", "body"] as Focus[]).map((item) => <button key={item} type="button" className={focus === item ? "active" : ""} onClick={() => setFocus(item)}><small>{copy.finder.focus[item][1]}</small><strong>{copy.finder.focus[item][0]}</strong><Arrow /></button>)}
                </div>
              </fieldset>
              <fieldset>
                <legend><span>02</span>{copy.finder.timeLabel}</legend>
                <div className="duration-switch">
                  {(Object.keys(copy.finder.time) as DurationPreference[]).map((item) => <button key={item} type="button" className={durationPreference === item ? "active" : ""} onClick={() => setDurationPreference(item)}>{copy.finder.time[item]}</button>)}
                </div>
              </fieldset>
            </div>
            <div className="finder-results" aria-live="polite">
              <div className="finder-result-heading"><span>{copy.finder.result}</span><small>03 EXPERIENCES</small></div>
              {finderResults.map((service, index) => (
                <article key={service.id}>
                  <img src={service.image} alt="" />
                  <span className="finder-number">0{index + 1}</span>
                  <div><p>{service.collection} · {service.duration} {copy.common.minutes}</p><h3>{serviceName(service, lang)}</h3><small>{secondaryName(service, lang)}</small><PriceBlock service={service} copy={copy} compact light /><button type="button" onClick={() => openBooking(service.id)}>{copy.finder.viewTimes}<Arrow /></button></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SignatureJourney copy={copy} lang={lang} onBook={openBooking} />

        <section className="body-feature" aria-labelledby="body-feature-title">
          <div className="body-feature-visual"><img src="/images/body-stone.webp" alt="" /><span>DEEPER · WARMER · SLOWER</span></div>
          <div className="body-feature-copy"><Kicker light>{copy.bodyFeature.eyebrow}</Kicker><h2 id="body-feature-title">{copy.bodyFeature.title}</h2><p>{copy.bodyFeature.body}</p><strong>{copy.bodyFeature.note}</strong><button type="button" onClick={() => openBooking("BD003")}>{copy.common.choose}<Arrow diagonal /></button></div>
        </section>

        <section className="collection-section" id="collection" aria-labelledby="collection-title">
          <header className="collection-heading">
            <Kicker>{copy.collection.eyebrow}</Kicker>
            <div><h2 id="collection-title">{copy.collection.title}</h2><p>{copy.collection.body}</p></div>
          </header>
          <div className="privilege-panel"><span>20%</span><div><p>DIRECT RESERVATION PRIVILEGE</p><h3>{copy.collection.privilegeTitle}</h3><p>{copy.collection.privilegeBody}</p></div></div>
          <div className="collection-tabs" role="group" aria-label={lang === "vi" ? "Lọc dịch vụ" : "Filter experiences"}>
            {(Object.keys(copy.collection.filters) as ServiceFilter[]).map((filter) => {
              const count = services.filter((service) => filter === "all" ? true : filter === "signature" ? service.level.toLowerCase().includes("signature") : service.category === filter).length;
              return <button key={filter} type="button" className={serviceFilter === filter ? "active" : ""} onClick={() => selectFilter(filter)} aria-pressed={serviceFilter === filter}>{copy.collection.filters[filter]}<span>{String(count).padStart(2, "0")}</span></button>;
            })}
          </div>
          <div className="collection-browser">
            <aside className="service-feature">
              <div className="service-feature-image"><img key={activeService.id} src={activeService.image} alt="" /><span>{activeService.collection}</span></div>
              {renderServiceDetail(activeService)}
            </aside>
            <div className="service-list">
              {filteredServices.map((service, index) => (
                <button key={service.id} type="button" className={`service-row ${activeServiceId === service.id ? "active" : ""}`} onClick={() => selectService(service)}>
                  <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
                  <img src={service.image} alt="" />
                  <div className="service-row-name"><small>{service.collection}</small><strong>{serviceName(service, lang)}</strong><span>{secondaryName(service, lang)}</span></div>
                  <p className="service-row-time"><strong>{service.duration}</strong><span>{copy.common.minutes}</span></p>
                  <div className="service-row-price"><del>{money(service.price)}</del><strong>{money(webPrice(service.price))}</strong><small>VND</small></div>
                  <Arrow />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="booking-lead" aria-labelledby="booking-lead-title">
          <img src="/images/villa.webp" alt="" />
          <div className="booking-lead-shade" />
          <div className="booking-lead-copy"><Kicker light>{copy.bookingLead.eyebrow}</Kicker><h2 id="booking-lead-title">{copy.bookingLead.title}</h2><p>{copy.bookingLead.body}</p><button type="button" onClick={() => openBooking()}>{copy.bookingLead.cta}<CalendarIcon /></button><div>{copy.bookingLead.notes.map((note, index) => <span key={note}>0{index + 1} · {note}</span>)}</div></div>
        </section>

        <section className="visit-section" id="visit" aria-labelledby="visit-title">
          <div className="visit-copy"><Kicker>{copy.visit.eyebrow}</Kicker><h2 id="visit-title">{copy.visit.title}</h2><p>{copy.visit.address}</p><span>{copy.visit.hint}</span><a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">{copy.visit.directions}<Arrow diagonal /></a></div>
          <div className="map-frame"><iframe src={MAP_EMBED} width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title={lang === "vi" ? "Bản đồ SĀKURĀ Retreat" : "Map to SĀKURĀ Retreat"} /></div>
        </section>

        <section className="concierge-section" aria-labelledby="concierge-title">
          <header><Kicker light>{copy.concierge.eyebrow}</Kicker><h2 id="concierge-title">{copy.concierge.title}</h2><p>{copy.concierge.body}</p></header>
          <div className="concierge-columns">
            <article><div className="concierge-label"><span>01</span><h3>{copy.concierge.vietnam}</h3><a className="phone-number" href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a></div><div className="concierge-links"><a href={ZALO_URL} target="_blank" rel="noreferrer"><MessageIcon /><span><small>PRIVATE CHAT</small>{copy.concierge.zalo}</span><Arrow diagonal /></a><a href={MESSENGER_URL} target="_blank" rel="noreferrer"><MessageIcon /><span><small>PRIVATE CHAT</small>{copy.concierge.messenger}</span><Arrow diagonal /></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageIcon /><span><small>PRIVATE CHAT</small>{copy.concierge.whatsapp}</span><Arrow diagonal /></a><a href={`tel:${PHONE_NUMBER}`}><PhoneIcon /><span><small>09:00 — 20:30</small>{copy.concierge.call}</span><Arrow /></a></div></article>
            <article><div className="concierge-label"><span>02</span><h3>{copy.concierge.international}</h3><p>QR GUEST ASSISTANCE</p></div><div className="international-links">{qrChannels.filter((channel) => channel.name !== "Zalo").map((channel) => <button key={channel.name} type="button" onClick={() => setQrChannel(channel)}><span>{channel.name}</span><small>{copy.concierge.showQr}</small><Arrow diagonal /></button>)}</div></article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><img src="/brand/sakura-lockup.png" alt="SĀKURĀ Retreat" /><p>{copy.footer.line}</p><span>{copy.footer.idea}</span></div>
        <div className="footer-info"><div><small>VISIT</small><span>{copy.visit.address}</span></div><div><small>PRIVATE CONCIERGE</small><a className="phone-number" href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a></div><div><small>OPENING HOURS</small><span>{copy.footer.hours}</span></div></div>
        <div className="footer-bottom"><span>© 2026 SĀKURĀ RETREAT</span><div><a href={ZALO_URL} target="_blank" rel="noreferrer">ZALO</a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WHATSAPP</a><a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">GOOGLE MAPS</a><button type="button" onClick={() => scrollTo("journey")}>{copy.footer.top} ↑</button></div></div>
      </footer>

      <button className="mobile-reserve" type="button" onClick={() => openBooking()}><span><small>DIRECT · 20%</small>{copy.reserve}</span><CalendarIcon /></button>

      {sheetService && <div className="service-sheet" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSheetServiceId(null); }}><div role="dialog" aria-modal="true" aria-labelledby="sheet-title"><button type="button" className="sheet-close" onClick={() => setSheetServiceId(null)} aria-label={copy.collection.close}><CloseIcon /></button><div className="sheet-image"><img src={sheetService.image} alt="" /><span>{sheetService.collection}</span></div><div id="sheet-title">{renderServiceDetail(sheetService, true)}</div></div></div>}

      {qrChannel && <div className="qr-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setQrChannel(null); }}><div role="dialog" aria-modal="true" aria-labelledby="qr-title"><button type="button" onClick={() => setQrChannel(null)} aria-label={copy.concierge.closeQr}><CloseIcon /></button><p>INTERNATIONAL GUEST ASSISTANCE</p><h2 id="qr-title">{qrChannel.name}</h2><img src={qrChannel.image} alt={`${qrChannel.name} QR code`} /><span>{copy.concierge.scan}</span></div></div>}

      {bookingOpen && <div className="booking-shell" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}>
        <div className="booking-panel" role="dialog" aria-modal="true" aria-labelledby="booking-title" tabIndex={-1} ref={bookingRef}>
          <header className="booking-header"><div><p>{copy.booking.eyebrow}</p><span>{copy.common.privilege}</span></div><div><small>{copy.booking.step} {bookingStep} {copy.booking.of} 6</small><button type="button" onClick={() => setBookingOpen(false)} aria-label="Close"><CloseIcon /></button></div></header>
          <div className="booking-progress" aria-hidden="true">{[1, 2, 3, 4, 5, 6].map((step) => <span key={step} className={bookingStep >= step ? "active" : ""} />)}</div>
          <div className="booking-body">
            {bookingStep === 1 && <section className="booking-step"><p>{copy.booking.intentEyebrow}</p><h2 id="booking-title">{copy.booking.intentTitle}</h2><div className="intent-grid">{(["facial", "body", "signature"] as BookingIntent[]).map((intent, index) => <button key={intent} type="button" onClick={() => chooseBookingIntent(intent)}><span>0{index + 1}</span><strong>{copy.booking.intents[intent][0]}</strong><small>{copy.booking.intents[intent][1]}</small><Arrow /></button>)}</div></section>}
            {bookingStep === 2 && <section className="booking-step"><p>{copy.booking.serviceEyebrow}</p><h2 id="booking-title">{copy.booking.serviceTitle}</h2><div className="booking-service-list">{bookingServices.map((service) => <button key={service.id} type="button" className={selectedServiceId === service.id ? "selected" : ""} onClick={() => setSelectedServiceId(service.id)}><img src={service.image} alt="" /><span><small>{service.duration} {copy.common.minutes}</small><strong>{serviceName(service, lang)}</strong><em>{money(webPrice(service.price))} VND</em></span><i /></button>)}</div><div className="booking-actions"><button type="button" onClick={() => setBookingStep(1)}>{copy.booking.back}</button><button className="booking-primary" type="button" onClick={() => { setSelectedDate(""); setSelectedTime(""); setBookingStep(3); }}>{copy.booking.next}<Arrow /></button></div></section>}
            {bookingStep === 3 && <section className="booking-step"><p>{copy.booking.dateEyebrow}</p><h2 id="booking-title">{copy.booking.dateTitle}</h2><div className="booking-selection"><span>{serviceName(selectedService, lang)}</span><strong>{selectedService.duration} {copy.common.minutes} · {money(webPrice(selectedService.price))} VND</strong></div><div className="date-strip">{dates.map((date) => <button key={date.value} type="button" className={selectedDate === date.value ? "selected" : ""} onClick={() => { setSelectedDate(date.value); setSelectedTime(""); }}><span>{date.weekday}</span><strong>{date.day}</strong><small>{date.month}</small></button>)}</div><div className="booking-actions"><button type="button" onClick={() => setBookingStep(2)}>{copy.booking.back}</button><button className="booking-primary" type="button" disabled={!selectedDate} onClick={() => setBookingStep(4)}>{copy.booking.next}<Arrow /></button></div></section>}
            {bookingStep === 4 && <section className="booking-step"><p>{copy.booking.timeEyebrow}</p><h2 id="booking-title">{copy.booking.timeTitle}</h2><div className="booking-selection"><span>{formatBookingDate(selectedDate, lang)}</span><strong>{serviceName(selectedService, lang)}</strong></div><div className="time-grid">{timeSlots.map((time) => <button key={time} type="button" className={selectedTime === time ? "selected" : ""} onClick={() => setSelectedTime(time)}>{time}</button>)}</div><div className="booking-actions"><button type="button" onClick={() => setBookingStep(3)}>{copy.booking.back}</button><button className="booking-primary" type="button" disabled={!selectedTime} onClick={() => setBookingStep(5)}>{copy.booking.next}<Arrow /></button></div></section>}
            {bookingStep === 5 && <form className="booking-step" onSubmit={submitBooking}><p>{copy.booking.guestEyebrow}</p><h2 id="booking-title">{copy.booking.guestTitle}</h2><div className="booking-selection"><span>{serviceName(selectedService, lang)}</span><strong>{formatBookingDate(selectedDate, lang)} · {selectedTime}</strong><small>{money(webPrice(selectedService.price))} VND · DIRECT 20%</small></div><label htmlFor="guest-name">{copy.booking.name}</label><input id="guest-name" autoComplete="name" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder={copy.booking.namePlaceholder} required /><label htmlFor="guest-phone">{copy.booking.phone}</label><input id="guest-phone" type="tel" inputMode="tel" autoComplete="tel" value={guestPhone} onChange={(event) => setGuestPhone(event.target.value)} placeholder={PHONE_DISPLAY} required /><label htmlFor="guest-note">{copy.booking.note}</label><textarea id="guest-note" rows={4} value={guestNote} onChange={(event) => setGuestNote(event.target.value)} placeholder={copy.booking.notePlaceholder} /><small className="booking-privacy">{copy.booking.privacy}</small><div className="booking-actions"><button type="button" onClick={() => setBookingStep(4)}>{copy.booking.back}</button><button
  className="booking-primary"
  type="submit"
  disabled={bookingSubmitting}
>
  {bookingSubmitting
    ? (lang === "vi" ? "Đang gửi..." : "Sending...")
    : copy.booking.complete}
  <Arrow />
</button></div></form>}
            {bookingStep === 6 && <section className="booking-step booking-ready"><img src="/brand/sakura-mark.png" alt="" /><p>{copy.booking.readyEyebrow}</p><h2 id="booking-title">{copy.booking.readyTitle}</h2><p>{copy.booking.readyBody}</p><div className="ready-summary"><span>{serviceName(selectedService, lang)}</span><strong>{formatBookingDate(selectedDate, lang)} · {selectedTime}</strong><small>{money(webPrice(selectedService.price))} VND · DIRECT 20%</small></div><button className="booking-primary" type="button" onClick={copyAndOpenZalo}>{copied ? `${copy.booking.zalo} ✓` : copy.booking.zalo}<Arrow diagonal /></button><a className="booking-primary whatsapp" href={`${WHATSAPP_URL}?text=${encodeURIComponent(requestMessage)}`} target="_blank" rel="noreferrer">{copy.booking.whatsapp}<Arrow diagonal /></a><a className="ready-link" href={MESSENGER_URL} target="_blank" rel="noreferrer">{copy.booking.messenger}<Arrow diagonal /></a><a className="ready-link" href={`tel:${PHONE_NUMBER}`}>{copy.booking.call}<PhoneIcon /></a><small className="ready-note">{copy.booking.confirmation}</small><button className="start-over" type="button" onClick={() => { setBookingStep(1); setSelectedDate(""); setSelectedTime(""); }}>{copy.booking.again}</button></section>}
          </div>
        </div>
      </div>}
    </>
  );
}
