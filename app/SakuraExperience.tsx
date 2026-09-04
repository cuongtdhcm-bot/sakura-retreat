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
import { type RetreatService, services, webPrice } from "./services";

type Copy = (typeof ui)[Language];
type ServiceFilter = "all" | "facial" | "signature" | "body";
type BookingIntent = "first" | "facial" | "body" | "signature";
type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;
type QrChannel = { name: string; image: string } | null;
type WelcomeKind = "body" | "face" | "combo";

type FirstVisitOffer = {
  id: string;
  kind: WelcomeKind;
  name: Record<Language, string>;
  eyebrow: Record<Language, string>;
  shortDescription: Record<Language, string>;
  price: number;
  listedPrice: number | null;
};

type BookingSelection = {
  id: string;
  name: string;
  secondary: string;
  durationLabel: string;
  durationMinutes: number;
  price: number;
  listedPrice: number | null;
  image: string;
  badge: string;
  isFirstVisit: boolean;
  choiceLines: string[];
};

const PHONE_DISPLAY = "09123 555 03";
const PHONE_NUMBER = "0912355503";
const ZALO_URL = "https://zaloapp.com/qr/p/uor4ye42w7z6";
const MESSENGER_URL = "https://m.me/111809981268423";
const WHATSAPP_URL = "https://wa.me/84912355503";
const DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=10.738059359900387%2C106.68995647497859";
const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.953603801484!2d106.68995647497859!3d10.738059359900387!2m3!1f0!2f0!3f0!3m2!1i1024!1i768!4f13.1!3m3!1m2!1s0x31752f6f94ecd005%3A0x48740bf7253a3a2c!2sSAKURA%20RETREAT!5e0!3m2!1svi!2s!4v1787383247500!5m2!1svi!2s";

const bodyWelcomeIds = ["BD003", "BD005", "BD007", "BD008", "BD011"];
const bodyWelcomeChoices = services.filter((service) =>
  bodyWelcomeIds.includes(service.id),
);
const facialWelcomeChoices = services.filter(
  (service) => service.category === "facial" && service.price <= 999000,
);
const defaultBodyChoice =
  bodyWelcomeChoices.find((service) => service.id === "BD003") ?? bodyWelcomeChoices[0];
const defaultFacialChoice =
  facialWelcomeChoices.find((service) => service.id === "FF024") ?? facialWelcomeChoices[0];

const firstVisitOffers: FirstVisitOffer[] = [
  {
    id: "FIRST-BODY-90",
    kind: "body",
    name: { vi: "Body Welcome", en: "Body Welcome" },
    eyebrow: {
      vi: "SIGNATURE WELCOME 01 · KHÁCH LẦN ĐẦU TRẢI NGHIỆM",
      en: "SIGNATURE WELCOME · OUR RECOMMENDED BEGINNING",
    },
    shortDescription: {
      vi: "Chọn 01 trong 05 trải nghiệm chăm sóc cơ thể · 01 khách · 01 phòng riêng · 01 giường.",
      en: "Choose one of five body-care experiences · one guest · one private room · one bed.",
    },
    price: 399000,
    listedPrice: 699000,
  },
  {
    id: "FIRST-FACE",
    kind: "face",
    name: { vi: "Face Welcome", en: "Face Welcome" },
    eyebrow: {
      vi: "SIGNATURE WELCOME 02 · KHÁCH LẦN ĐẦU TRẢI NGHIỆM",
      en: "SIGNATURE WELCOME 02 · FIRST-TIME GUESTS",
    },
    shortDescription: {
      vi: "Chọn 01 trong 06 trải nghiệm chăm sóc da có giá niêm yết đến 999K.",
      en: "Choose one of six facial experiences listed at up to 999K.",
    },
    price: 599000,
    listedPrice: 999000,
  },
  {
    id: "FIRST-FACE-BODY",
    kind: "combo",
    name: { vi: "Face & Body Welcome", en: "Face & Body Welcome" },
    eyebrow: {
      vi: "SIGNATURE WELCOME 03 · TRẢI NGHIỆM TRỌN VẸN",
      en: "SIGNATURE WELCOME 03 · THE COMPLETE WELCOME",
    },
    shortDescription: {
      vi: "Kết hợp 01 Face Welcome và 01 Body Welcome trong cùng một lịch hẹn.",
      en: "Combine one Face Welcome and one Body Welcome in a single visit.",
    },
    price: 999000,
    listedPrice: 1698000,
  },
];

const qrChannels = [
  { name: "Zalo", image: "/concierge/zalo.jpg" },
  { name: "KakaoTalk", image: "/concierge/kakaotalk.png" },
  { name: "Telegram", image: "/concierge/telegram.png" },
  { name: "WeChat", image: "/concierge/wechat.png" },
];

const pageCopy = {
  vi: {
    nav: { welcome: "Signature Welcome", retreat: "Không gian riêng", collection: "Menu tham khảo", visit: "Chỉ đường" },
    hero: {
      eyebrow: "THE SIGNATURE PRIVATE RETREAT · TRUNG SƠN",
      welcome: "WELCOME TO SĀKURĀ",
      title: "Bước vào một khoảng nghỉ được dành riêng cho bạn.",
      body: "Giữa Khu dân cư Trung Sơn – Him Lam, SĀKURĀ đón bạn trong một villa phủ xanh, nơi trải nghiệm chăm sóc da và cơ thể được chuẩn bị với sự riêng tư, chỉn chu và nhịp nghỉ thư thái.",
      primary: "Khám phá Body Welcome",
      reserve: "Giữ lịch 399K",
      opening: "MỞ CỬA HẰNG NGÀY · 09:00 — 20:30",
      soundOn: "Tắt âm thanh thư giãn",
      soundOff: "Bật âm thanh thư giãn",
      soundHint: "Âm thanh chỉ phát khi bạn chủ động bật",
    },
    heroOffer: {
      label: "ƯU ĐÃI SIGNATURE · CHỈ DÀNH CHO KHÁCH LẦN ĐẦU TRẢI NGHIỆM",
      title: "Body Welcome",
      detail: "Chọn 01 trong 05 trải nghiệm · 01 khách · 01 phòng riêng",
      listed: "Giá trị lựa chọn đến 699.000",
      price: "399.000",
      currency: "VND",
      alternate: "Xem đủ 03 Signature Welcome",
    },
    arrival: {
      eyebrow: "A PRIVATE ARRIVAL",
      title: "Sự đón tiếp bắt đầu trước khi bạn bước qua cánh cửa.",
      body: "Sau khi lịch hẹn được xác nhận, đội ngũ SĀKURĀ chuẩn bị phòng riêng, ghi nhận lựa chọn chăm sóc và những lưu ý cần thiết để đón bạn đúng giờ, đúng trải nghiệm.",
      moments: [
        ["01", "Một nơi chốn để chậm lại", "Villa nhiều mảng xanh, ánh sáng tự nhiên và chất liệu mộc tại Khu dân cư Trung Sơn – Him Lam."],
        ["02", "Riêng tư theo đúng nghĩa", "Mỗi lịch hẹn được phục vụ theo tiêu chuẩn một khách, một phòng riêng và một giường."],
        ["03", "Chuẩn bị theo lịch hẹn", "Đội ngũ đặt lịch ghi nhận lựa chọn, kiểm tra khung giờ và xác nhận cùng bạn trước khi đến."],
      ],
    },
    bodyWelcome: {
      eyebrow: "SIGNATURE WELCOME · KHÁCH LẦN ĐẦU TRẢI NGHIỆM",
      title: "Body Welcome",
      headline: "Một mức ưu đãi. Năm lựa chọn chăm sóc cơ thể.",
      body: "Trong lần đầu trải nghiệm tại SĀKURĀ, bạn được chọn 01 trong 05 dịch vụ chăm sóc cơ thể dưới đây. Không gian riêng được chuẩn bị cho duy nhất một khách trong suốt thời gian phục vụ.",
      selection: "Buffet lựa chọn Body Welcome",
      selectionHint: "Chọn 01 trải nghiệm bạn mong muốn",
      selected: "Lựa chọn hiện tại",
      included: [
        "01 khách · 01 phòng riêng · 01 giường",
        "Chọn 01 trong 05 trải nghiệm · 60 hoặc 90 phút",
        "Áp dụng duy nhất cho khách lần đầu trải nghiệm tại SĀKURĀ",
      ],
      listed: "Giá trị lựa chọn đến",
      welcome: "Giá Signature Welcome",
      save: "Bạn tiết kiệm đến 300.000 VND",
      cta: "Giữ Body Welcome · 399K",
      condition: "Ưu đãi được dành riêng một lần cho mỗi khách trong lần đầu trải nghiệm tại SĀKURĀ. Đội ngũ đặt lịch sẽ xác nhận điều kiện áp dụng trước khi hoàn tất lịch hẹn.",
    },
    faceWelcome: {
      eyebrow: "SIGNATURE WELCOME 02",
      title: "Face Welcome",
      headline: "Chăm sóc làn da theo lựa chọn phù hợp với bạn.",
      body: "Dành cho khách lần đầu trải nghiệm, Face Welcome cho phép bạn chọn 01 trong 06 dịch vụ Facial có giá niêm yết đến 999.000 VND, trong một phòng chăm sóc riêng đã được chuẩn bị trước.",
      facialTitle: "Buffet lựa chọn Face Welcome",
      facialHint: "Chọn 01 Facial có giá niêm yết từ 999K trở xuống.",
      priceLabel: "Giá Signature Welcome",
      cta: "Giữ Face Welcome · 599K",
      condition: "Áp dụng duy nhất cho khách lần đầu trải nghiệm tại SĀKURĀ.",
    },
    combo: {
      eyebrow: "SIGNATURE WELCOME 03",
      title: "Face & Body Welcome",
      headline: "Một lịch hẹn trọn vẹn cho làn da và cơ thể.",
      body: "Kết hợp trọn vẹn Face Welcome và Body Welcome trong cùng một lần ghé thăm. Bạn có thể lựa chọn dịch vụ phù hợp trong hai bộ sưu tập khi đến SĀKURĀ; đội ngũ sẽ dành đủ thời gian và chuẩn bị không gian tương ứng.",
      feature: "01 Face Welcome + 01 Body Welcome",
      priceLabel: "Giá Signature Welcome",
      cta: "Giữ Face & Body Welcome · 999K",
      condition: "Áp dụng duy nhất cho khách lần đầu trải nghiệm tại SĀKURĀ.",
    },
    privateRetreat: {
      eyebrow: "PRIVATE BOTANICAL RETREAT",
      title: "Một khoảng nghỉ biệt lập giữa nhịp sống thành phố.",
      body: "SĀKURĀ Retreat đặt tại một villa phủ xanh ở Khu dân cư Trung Sơn – Him Lam. Ánh sáng tự nhiên, phòng chăm sóc riêng và nhịp phục vụ được sắp xếp theo lịch hẹn tạo nên cảm giác kín đáo, thư thái và trọn vẹn.",
      facts: ["01 KHÁCH", "01 PHÒNG RIÊNG", "01 GIƯỜNG", "XÁC NHẬN LỊCH TRƯỚC KHI ĐẾN"],
      cta: "Chọn khoảng riêng của tôi",
    },
    collection: {
      eyebrow: "THE RETREAT COLLECTION",
      title: "Trọn bộ trải nghiệm tại SĀKURĀ.",
      body: "Ba Signature Welcome được dành riêng cho lần ghé thăm đầu tiên. Trong những lần trở lại, bạn có thể lựa chọn toàn bộ Facial Retreat và Body Retreat với ưu đãi 20% khi đặt lịch trực tiếp trên website.",
      facial: "Facial Retreat", bodyLabel: "Body Retreat", direct: "Ưu đãi 20% khi đặt trực tiếp", open: "Xem toàn bộ dịch vụ", close: "Toàn bộ dịch vụ đang hiển thị",
    },
    booking: {
      firstIntent: ["Signature Welcome", "Dành cho khách lần đầu"],
      intentTitle: "Bạn muốn SĀKURĀ chuẩn bị trải nghiệm nào?",
      firstServiceTitle: "Chọn Signature Welcome dành cho lần ghé thăm đầu tiên.",
      selectedFirst: "Signature Welcome · khách lần đầu",
      selectedDirect: "Ưu đãi website · 20%",
      welcomeCondition: "Ưu đãi chỉ áp dụng một lần cho khách lần đầu trải nghiệm tại SĀKURĀ.",
      chooseOffer: "Chọn Signature Welcome", chooseBody: "Chọn 01 trong 05 trải nghiệm Body Welcome", chooseFacial: "Chọn 01 Facial có giá niêm yết đến 999K",
    },
    mobile: { eyebrow: "BODY WELCOME · LẦN ĐẦU", cta: "Giữ lịch · 399K" },
  },
  en: {
    nav: { welcome: "Signature Welcome", retreat: "Private retreat", collection: "Full menu", visit: "Directions" },
    hero: {
      eyebrow: "THE SIGNATURE PRIVATE RETREAT · TRUNG SON",
      welcome: "WELCOME TO SĀKURĀ",
      title: "Enter a private pause, prepared entirely for you.",
      body: "In a botanical villa within the Trung Son – Him Lam residential enclave, SĀKURĀ welcomes you to considered facial and body care shaped by privacy, attentive preparation and an unhurried pace.",
      primary: "Discover Body Welcome", reserve: "Reserve at 399K", opening: "OPEN DAILY · 09:00 — 20:30",
      soundOn: "Turn off retreat sound", soundOff: "Turn on retreat sound", soundHint: "Sound plays only when you choose to begin",
    },
    heroOffer: {
      label: "SIGNATURE OFFER · EXCLUSIVELY FOR FIRST-TIME GUESTS", title: "Body Welcome",
      detail: "Choose one of five experiences · one guest · one private room", listed: "Experience value up to 699,000", price: "399,000", currency: "VND",
      alternate: "Discover all three Signature Welcomes",
    },
    arrival: {
      eyebrow: "A PRIVATE ARRIVAL", title: "Your welcome begins before you cross the threshold.",
      body: "Once your appointment is confirmed, the SĀKURĀ team prepares your private room and notes your selected care and preferences, ready to welcome you at the arranged time.",
      moments: [
        ["01", "A place to slow down", "A botanical villa shaped by natural light and honest materials in the Trung Son – Him Lam residential enclave."],
        ["02", "Privacy, properly considered", "Every appointment follows one clear standard: one guest, one private room and one bed."],
        ["03", "Prepared by appointment", "Our reservation team records your selection, reviews availability and confirms the details before your arrival."],
      ],
    },
    bodyWelcome: {
      eyebrow: "SIGNATURE WELCOME · FIRST-TIME GUESTS", title: "Body Welcome", headline: "One welcome rate. Five ways to care for your body.",
      body: "For your first experience at SĀKURĀ, choose one of the five body-care services below. A private room is prepared for one guest only throughout your appointment.",
      selection: "Body Welcome selection", selectionHint: "Choose one experience", selected: "Currently selected",
      included: ["One guest · one private room · one bed", "Choose one of five experiences · 60 or 90 minutes", "Exclusively for first-time guests at SĀKURĀ"],
      listed: "Experience value up to", welcome: "Signature Welcome rate", save: "Save up to 300,000 VND", cta: "Reserve Body Welcome · 399K",
      condition: "This Signature Welcome may be enjoyed once by each first-time guest. Our reservation team will confirm eligibility before completing your appointment.",
    },
    faceWelcome: {
      eyebrow: "SIGNATURE WELCOME 02", title: "Face Welcome", headline: "Facial care selected around what feels right for you.",
      body: "Created for first-time guests, Face Welcome invites you to choose one of six Facial experiences listed at up to 999,000 VND, in a private treatment room prepared in advance.",
      facialTitle: "Face Welcome selection", facialHint: "Choose one Facial listed at 999K or below.", priceLabel: "Signature Welcome rate",
      cta: "Reserve Face Welcome · 599K", condition: "Available exclusively to first-time guests at SĀKURĀ.",
    },
    combo: {
      eyebrow: "SIGNATURE WELCOME 03", title: "Face & Body Welcome", headline: "One complete appointment for skin and body.",
      body: "Combine Face Welcome and Body Welcome in a single visit. Choose the experiences that suit you when you arrive; our team will allow the appropriate time and prepare the corresponding private setting.",
      feature: "One Face Welcome + one Body Welcome", priceLabel: "Signature Welcome rate",
      cta: "Reserve Face & Body Welcome · 999K", condition: "Available exclusively to first-time guests at SĀKURĀ.",
    },
    privateRetreat: {
      eyebrow: "PRIVATE BOTANICAL RETREAT", title: "A secluded pause within the rhythm of the city.",
      body: "SĀKURĀ Retreat is set in a botanical villa in the Trung Son – Him Lam residential enclave. Natural light, private treatment rooms and service arranged by appointment create a discreet, unhurried and complete sense of rest.",
      facts: ["ONE GUEST", "ONE PRIVATE ROOM", "ONE BED", "CONFIRMED BEFORE ARRIVAL"], cta: "Choose my private time",
    },
    collection: {
      eyebrow: "THE RETREAT COLLECTION", title: "The complete SĀKURĀ collection.",
      body: "Three Signature Welcomes are reserved for a first visit. When you return, the complete Facial Retreat and Body Retreat collection is available with a 20% privilege for direct website reservations.",
      facial: "Facial Retreat", bodyLabel: "Body Retreat", direct: "20% direct reservation privilege", open: "View all experiences", close: "All experiences are displayed",
    },
    booking: {
      firstIntent: ["Signature Welcome", "Exclusively for a first visit"], intentTitle: "What would you like SĀKURĀ to prepare?",
      firstServiceTitle: "Choose a Signature Welcome for your first visit.", selectedFirst: "Signature Welcome · first visit",
      selectedDirect: "Website privilege · 20%", welcomeCondition: "This offer is available once, exclusively to first-time guests at SĀKURĀ.",
      chooseOffer: "Choose your Signature Welcome", chooseBody: "Choose one of five Body Welcome experiences", chooseFacial: "Choose one Facial listed at up to 999K",
    },
    mobile: { eyebrow: "BODY WELCOME · FIRST VISIT", cta: "Reserve · 399K" },
  },
} as const;

function Arrow({ diagonal = false, down = false }: { diagonal?: boolean; down?: boolean }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">{down ? <path d="M12 4v16m0 0 6-6m-6 6-6-6" /> : diagonal ? <path d="M6 18 18 6m0 0H8m10 0v10" /> : <path d="M4 12h16m0 0-6-6m6 6-6 6" />}</svg>;
}
function CloseIcon() { return <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>; }
function CalendarIcon() { return <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2" /><path d="M8 3v5M16 3v5M3.5 10h17" /></svg>; }
function PhoneIcon() { return <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path d="M6.5 3.8 9 7.9 7.4 9.7c1.1 2.4 3 4.3 5.4 5.4l1.8-1.6 4.1 2.4-.5 3.4c-.1.8-.8 1.4-1.6 1.4C9.2 20.1 3.9 14.8 3.3 7.4c-.1-.8.5-1.5 1.3-1.6l1.9-.3Z" /></svg>; }
function MessageIcon() { return <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path d="M20 15.5a3 3 0 0 1-3 3H9l-5 3V8.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z" /><path d="M8 10.5h8M8 14h5" /></svg>; }
function SoundIcon({ active }: { active: boolean }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 10v4h3l4 3V7L8 10H5Z" />{active ? <><path d="M15 9.5c1.2 1.4 1.2 3.6 0 5" /><path d="M18 7c2.8 2.8 2.8 7.2 0 10" /></> : <path d="m16 9 5 6m0-6-5 6" />}</svg>;
}
function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) { return <p className={"kicker" + (light ? " light" : "")}><span />{children}</p>; }
function serviceName(service: RetreatService, lang: Language) { return lang === "vi" ? service.name : service.englishName; }
function secondaryName(service: RetreatService, lang: Language) { return lang === "vi" ? service.englishName : service.name; }
function serviceDescription(service: RetreatService, lang: Language) { return lang === "vi" ? service.description : descriptionsEn[service.id] ?? service.description; }
function money(value: number) { return new Intl.NumberFormat("vi-VN").format(value); }

function PriceBlock({ service, copy, compact = false }: { service: RetreatService; copy: Copy; compact?: boolean }) {
  return <div className={"price-block" + (compact ? " compact" : "")}><div><span>{copy.common.listed}</span><p><del>{money(service.price)}</del><small>VND</small></p></div><div><span>{copy.common.direct}</span><p><strong>{money(webPrice(service.price))}</strong><small>VND</small></p></div>{!compact && <em>{copy.common.privilege}</em>}</div>;
}

function formatBookingDate(value: string, lang: Language) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value + "T12:00:00"));
}

function offerSelection(offer: FirstVisitOffer, lang: Language, bodyChoice: RetreatService, facialChoice: RetreatService): BookingSelection {
  const isFace = offer.kind === "face";
  const isCombo = offer.kind === "combo";
  const durationMinutes = isCombo ? 180 : isFace ? facialChoice.duration : bodyChoice.duration;
  const bodyLabel = serviceName(bodyChoice, lang);
  const facialLabel = serviceName(facialChoice, lang);
  const choiceLines = isCombo
    ? []
    : lang === "vi"
      ? [isFace ? `Lựa chọn Face: ${facialLabel}` : `Lựa chọn Body: ${bodyLabel}`]
      : [isFace ? `Face selection: ${facialLabel}` : `Body selection: ${bodyLabel}`];
  const secondary = isCombo
    ? (lang === "vi" ? "Lựa chọn Face & Body khi đến SĀKURĀ" : "Choose your Face & Body experiences at SĀKURĀ")
    : isFace ? facialLabel : bodyLabel;
  const durationLabel = isCombo
    ? (lang === "vi" ? "Khoảng 120–180 phút" : "Approximately 120–180 minutes")
    : `${durationMinutes} ${lang === "vi" ? "phút" : "minutes"}`;
  return {
    id: offer.id, name: offer.name[lang], secondary,
    durationLabel, durationMinutes, price: offer.price,
    listedPrice: offer.listedPrice, image: isFace ? facialChoice.image : bodyChoice.image,
    badge: pageCopy[lang].booking.selectedFirst, isFirstVisit: true, choiceLines,
  };
}

function serviceSelection(service: RetreatService, lang: Language): BookingSelection {
  return {
    id: service.id, name: serviceName(service, lang), secondary: secondaryName(service, lang),
    durationLabel: `${service.duration} ${lang === "vi" ? "phút" : "minutes"}`, durationMinutes: service.duration,
    price: webPrice(service.price), listedPrice: service.price, image: service.image,
    badge: pageCopy[lang].booking.selectedDirect, isFirstVisit: false, choiceLines: [],
  };
}

function bookingMessage({ lang, selection, date, time, guestName, guestPhone, guestNote }: { lang: Language; selection: BookingSelection; date: string; time: string; guestName: string; guestPhone: string; guestNote: string }) {
  const lines = lang === "vi"
    ? ["SĀKURĀ RETREAT — YÊU CẦU ĐẶT LỊCH", `Khách: ${guestName}`, `Điện thoại: ${guestPhone}`, `Trải nghiệm: ${selection.name}`, ...selection.choiceLines, `Thời lượng dự kiến: ${selection.durationLabel}`, selection.listedPrice ? `Giá trị lựa chọn đến: ${money(selection.listedPrice)} VND` : "", `Giá đặt lịch: ${money(selection.price)} VND`, selection.isFirstVisit ? pageCopy.vi.booking.welcomeCondition : "", `Thời gian mong muốn: ${formatBookingDate(date, lang)} · ${time}`, guestNote ? `Lưu ý: ${guestNote}` : "", "Nhờ đội ngũ SĀKURĀ kiểm tra và xác nhận lịch giúp tôi."]
    : ["SĀKURĀ RETREAT — PRIVATE RESERVATION REQUEST", `Guest: ${guestName}`, `Phone: ${guestPhone}`, `Experience: ${selection.name}`, ...selection.choiceLines, `Estimated duration: ${selection.durationLabel}`, selection.listedPrice ? `Selection value up to: ${money(selection.listedPrice)} VND` : "", `Reservation rate: ${money(selection.price)} VND`, selection.isFirstVisit ? pageCopy.en.booking.welcomeCondition : "", `Preferred time: ${formatBookingDate(date, lang)} · ${time}`, guestNote ? `Note: ${guestNote}` : "", "Please ask the SĀKURĀ team to review and confirm my appointment."];
  return lines.filter(Boolean).join("\n");
}

export default function SakuraExperience() {
  const [lang, setLang] = useState<Language>("vi");
  const [headerSolid, setHeaderSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [activeServiceId, setActiveServiceId] = useState("SK029");
  const [sheetServiceId, setSheetServiceId] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);
  const [bookingIntent, setBookingIntent] = useState<BookingIntent>("first");
  const [selectedOfferId, setSelectedOfferId] = useState(firstVisitOffers[0].id);
  const [welcomeBodyId, setWelcomeBodyId] = useState(defaultBodyChoice.id);
  const [welcomeFacialId, setWelcomeFacialId] = useState(defaultFacialChoice.id);
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
  const ambientAudioRef = useRef<HTMLAudioElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const journeyFrameRef = useRef<number | null>(null);
  const journeyActiveRef = useRef(0);
  const journeyMoveRef = useRef<((index: number) => void) | null>(null);

  const copy = ui[lang];
  const local = pageCopy[lang];
  const activeService = services.find((service) => service.id === activeServiceId) ?? services[0];
  const sheetService = sheetServiceId ? services.find((service) => service.id === sheetServiceId) ?? null : null;
  const selectedService = services.find((service) => service.id === selectedServiceId) ?? services[0];
  const selectedOffer = firstVisitOffers.find((offer) => offer.id === selectedOfferId) ?? firstVisitOffers[0];
  const selectedBodyChoice = bodyWelcomeChoices.find((service) => service.id === welcomeBodyId) ?? defaultBodyChoice;
  const selectedFacialChoice = facialWelcomeChoices.find((service) => service.id === welcomeFacialId) ?? defaultFacialChoice;
  const bookingSelection = bookingIntent === "first" ? offerSelection(selectedOffer, lang, selectedBodyChoice, selectedFacialChoice) : serviceSelection(selectedService, lang);

  const filteredServices = useMemo(() => services.filter((service) => {
    if (serviceFilter === "all") return true;
    if (serviceFilter === "facial") return service.category === "facial";
    if (serviceFilter === "body") return service.category === "body";
    return service.level.toLowerCase().includes("signature");
  }), [serviceFilter]);

  const bookingServices = useMemo(() => services.filter((service) => {
    if (bookingIntent === "signature") return service.level.toLowerCase().includes("signature");
    if (bookingIntent === "facial" || bookingIntent === "body") return service.category === bookingIntent;
    return false;
  }), [bookingIntent]);

  const dates = useMemo(() => Array.from({ length: 12 }, (_, index) => {
    const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() + index);
    return { value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`, weekday: new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", { weekday: "short" }).format(date), day: String(date.getDate()).padStart(2, "0"), month: new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", { month: "short" }).format(date) };
  }), [lang]);

  const timeSlots: string[] = [];
  const openingMinute = 9 * 60;
  const closingMinute = 20 * 60 + 30;
  for (let minute = openingMinute; minute + bookingSelection.durationMinutes <= closingMinute; minute += 30) {
    timeSlots.push(`${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
  }

  const requestMessage = bookingMessage({ lang, selection: bookingSelection, date: selectedDate, time: selectedTime, guestName, guestPhone, guestNote });

  useEffect(() => { document.documentElement.lang = lang; window.localStorage.setItem("sakura-language", lang); }, [lang]);
  useEffect(() => { const onScroll = () => setHeaderSolid(window.scrollY > 36); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { const locked = menuOpen || bookingOpen || Boolean(sheetServiceId) || Boolean(qrChannel); document.body.style.overflow = locked ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen, bookingOpen, sheetServiceId, qrChannel]);
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key !== "Escape") return; setMenuOpen(false); setBookingOpen(false); setSheetServiceId(null); setQrChannel(null); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, []);
  useEffect(() => { if (bookingOpen) window.setTimeout(() => bookingRef.current?.focus(), 50); }, [bookingOpen]);
  useEffect(() => () => { ambientAudioRef.current?.pause(); }, []);
  useEffect(() => {
    const journey = journeyRef.current;
    if (!journey) return;
    const scenes = Array.from(journey.querySelectorAll<HTMLElement>("[data-journey-scene]"));
    const markers = Array.from(journey.querySelectorAll<HTMLElement>("[data-journey-marker]"));
    const steps = Array.from(journey.querySelectorAll<HTMLElement>("[data-journey-step]"));
    if (!scenes.length) return;
    let lastActive = -1;
    let journeyTop = window.scrollY + journey.getBoundingClientRect().top;
    let snapOffsets: number[] = [];
    let wheelTotal = 0;
    let wheelTriggered = false;
    let wheelIdleTimer: number | null = null;
    let touchStartY: number | null = null;
    let touchLastY: number | null = null;
    let touchCaptured = false;

    const activateScene = (requestedIndex: number) => {
      const active = Math.max(0, Math.min(scenes.length - 1, requestedIndex));
      const previous = journeyActiveRef.current;
      journeyActiveRef.current = active;
      journey.dataset.activeScene = String(active);
      journey.dataset.direction = active >= previous ? "forward" : "backward";
      journey.style.setProperty("--journey-progress", String(active / Math.max(1, scenes.length - 1)));

      scenes.forEach((scene, index) => {
        const isCurrent = index === active;
        scene.dataset.position = isCurrent ? "current" : index < active ? "past" : "future";
        scene.toggleAttribute("data-current", isCurrent);
        scene.setAttribute("aria-hidden", isCurrent ? "false" : "true");
        scene.inert = !isCurrent;
      });

      if (active !== lastActive) {
        lastActive = active;
        markers.forEach((marker, index) => {
          marker.toggleAttribute("data-current", index === active);
          if (index === active) marker.setAttribute("aria-current", "step");
          else marker.removeAttribute("aria-current");
        });
      }
    };

    const measureJourney = () => {
      journeyTop = window.scrollY + journey.getBoundingClientRect().top;
      snapOffsets = [0, ...steps.map((step) => window.scrollY + step.getBoundingClientRect().top - journeyTop)];
      scheduleJourney();
    };

    const closestScene = () => {
      const localY = window.scrollY - journeyTop;
      let closest = 0;
      let shortestDistance = Number.POSITIVE_INFINITY;
      snapOffsets.forEach((offset, index) => {
        const distance = Math.abs(localY - offset);
        if (distance < shortestDistance) { shortestDistance = distance; closest = index; }
      });
      return closest;
    };

    const updateJourney = () => {
      journeyFrameRef.current = null;
      activateScene(closestScene());
    };

    const scheduleJourney = () => {
      if (journeyFrameRef.current !== null) return;
      journeyFrameRef.current = window.requestAnimationFrame(updateJourney);
    };

    const moveToScene = (requestedIndex: number) => {
      const index = Math.max(0, Math.min(scenes.length - 1, requestedIndex));
      if (index === journeyActiveRef.current && Math.abs(window.scrollY - (journeyTop + (snapOffsets[index] ?? 0))) < 2) return;
      activateScene(index);
      window.scrollTo(0, journeyTop + (snapOffsets[index] ?? 0));
    };

    const isJourneyPaging = () => {
      const first = journeyTop - 2;
      const last = journeyTop + (snapOffsets[snapOffsets.length - 1] ?? 0) + 2;
      return window.scrollY >= first && window.scrollY <= last;
    };

    const resetWheelGesture = () => {
      wheelTotal = 0;
      wheelTriggered = false;
      wheelIdleTimer = null;
    };

    const onWheel = (event: WheelEvent) => {
      if (document.body.style.overflow === "hidden") return;
      if (!isJourneyPaging() || event.ctrlKey) return;
      const normalizedDelta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      const direction = normalizedDelta > 0 ? 1 : normalizedDelta < 0 ? -1 : 0;
      const active = journeyActiveRef.current;
      const canMove = direction > 0 ? active < scenes.length - 1 : direction < 0 && active > 0;
      if (!canMove) return;

      event.preventDefault();
      wheelTotal += normalizedDelta;
      if (wheelIdleTimer !== null) window.clearTimeout(wheelIdleTimer);
      wheelIdleTimer = window.setTimeout(resetWheelGesture, 170);
      if (wheelTriggered || Math.abs(wheelTotal) < 18) return;

      wheelTriggered = true;
      moveToScene(active + (wheelTotal > 0 ? 1 : -1));
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || !isJourneyPaging()) return;
      touchStartY = event.touches[0].clientY;
      touchLastY = touchStartY;
      touchCaptured = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null || event.touches.length !== 1) return;
      touchLastY = event.touches[0].clientY;
      const delta = touchStartY - touchLastY;
      if (Math.abs(delta) < 2) return;
      const active = journeyActiveRef.current;
      const canMove = delta > 0 ? active < scenes.length - 1 : active > 0;
      if (!canMove) return;
      if (event.cancelable) event.preventDefault();
      touchCaptured = true;
    };

    const onTouchEnd = () => {
      if (touchStartY === null || touchLastY === null) return;
      const delta = touchStartY - touchLastY;
      if (touchCaptured && Math.abs(delta) >= 32) moveToScene(journeyActiveRef.current + (delta > 0 ? 1 : -1));
      touchStartY = null;
      touchLastY = null;
      touchCaptured = false;
    };

    const onJourneyKeyDown = (event: KeyboardEvent) => {
      if (!isJourneyPaging() || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select")) return;
      const forward = event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ";
      const backward = event.key === "ArrowUp" || event.key === "PageUp";
      if (!forward && !backward) return;
      const active = journeyActiveRef.current;
      const next = active + (forward ? 1 : -1);
      if (next < 0 || next >= scenes.length) return;
      event.preventDefault();
      moveToScene(next);
    };

    measureJourney();
    journeyMoveRef.current = moveToScene;
    scenes.forEach((scene) => scene.querySelectorAll("img").forEach((image) => image.decode?.().catch(() => undefined)));
    updateJourney();
    window.addEventListener("scroll", scheduleJourney, { passive: true });
    window.addEventListener("resize", measureJourney, { passive: true });
    journey.addEventListener("wheel", onWheel, { passive: false });
    journey.addEventListener("touchstart", onTouchStart, { passive: true });
    journey.addEventListener("touchmove", onTouchMove, { passive: false });
    journey.addEventListener("touchend", onTouchEnd, { passive: true });
    journey.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onJourneyKeyDown);
    return () => {
      window.removeEventListener("scroll", scheduleJourney);
      window.removeEventListener("resize", measureJourney);
      journey.removeEventListener("wheel", onWheel);
      journey.removeEventListener("touchstart", onTouchStart);
      journey.removeEventListener("touchmove", onTouchMove);
      journey.removeEventListener("touchend", onTouchEnd);
      journey.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onJourneyKeyDown);
      if (wheelIdleTimer !== null) window.clearTimeout(wheelIdleTimer);
      if (journeyFrameRef.current !== null) window.cancelAnimationFrame(journeyFrameRef.current);
      journeyMoveRef.current = null;
    };
  }, []);
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-view"));
    if (!nodes.length || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.revealed = "true"; observer.unobserve(entry.target); } });
    }, { threshold: 0.14 });
    nodes.forEach((node) => observer.observe(node));
    return () => { observer.disconnect(); document.documentElement.classList.remove("motion-ready"); };
  }, []);

  function scrollTo(id: string) {
    setMenuOpen(false);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  function goToJourneyScene(index: number) {
    journeyMoveRef.current?.(index);
  }

  async function toggleSoundscape() {
    const audio = ambientAudioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); setSoundOn(false); return; }
    audio.volume = 0.6;
    try { await audio.play(); setSoundOn(true); }
    catch { setSoundOn(false); }
  }

  function chooseBookingIntent(intent: BookingIntent) {
    setBookingIntent(intent);
    if (intent === "first") setSelectedOfferId(firstVisitOffers[0].id);
    else { const first = services.find((service) => intent === "signature" ? service.level.toLowerCase().includes("signature") : service.category === intent); if (first) setSelectedServiceId(first.id); }
    setSelectedDate(""); setSelectedTime(""); setBookingStep(2);
  }

  function openBooking(options?: { offerId?: string; serviceId?: string; firstChoice?: boolean }) {
    if (options?.offerId || options?.firstChoice) { setBookingIntent("first"); setSelectedOfferId(options?.offerId ?? firstVisitOffers[0].id); setBookingStep(2); }
    else if (options?.serviceId) { const service = services.find((item) => item.id === options.serviceId); if (service) { setSelectedServiceId(service.id); setBookingIntent(service.level.toLowerCase().includes("signature") ? "signature" : service.category); setBookingStep(3); } }
    else setBookingStep(1);
    setSelectedDate(""); setSelectedTime(""); setCopied(false); setSheetServiceId(null); setBookingOpen(true);
  }

  function selectFilter(filter: ServiceFilter) {
    setServiceFilter(filter);
    const first = services.find((service) => filter === "all" ? true : filter === "signature" ? service.level.toLowerCase().includes("signature") : service.category === filter);
    if (first) setActiveServiceId(first.id);
  }
  function selectService(service: RetreatService) { setActiveServiceId(service.id); if (window.matchMedia("(max-width: 860px)").matches) setSheetServiceId(service.id); }
  async function copyAndOpenZalo() { try { await navigator.clipboard.writeText(requestMessage); setCopied(true); } catch { setCopied(false); } window.open(ZALO_URL, "_blank", "noopener,noreferrer"); }
  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !guestName.trim() ||
      guestPhone.replace(/\D/g, "").length < 9 ||
      !selectedDate ||
      !selectedTime ||
      bookingSubmitting
    ) {
      return;
    }

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
          guestNote: [...bookingSelection.choiceLines, guestNote.trim()]
            .filter(Boolean)
            .join(" | "),
          serviceId: bookingSelection.id,
          serviceName: bookingSelection.name,
          serviceEnglishName: bookingSelection.secondary,
          duration: bookingSelection.durationMinutes,
          listedPrice: bookingSelection.listedPrice ?? bookingSelection.price,
          websitePrice: bookingSelection.price,
          date: selectedDate,
          formattedDate: formatBookingDate(selectedDate, lang),
          time: selectedTime,
          language: lang,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error ?? "Booking request failed");
      }

      setBookingStep(6);
    } catch (error) {
      console.error("Booking request failed", error);
      window.alert(
        lang === "vi"
          ? "SĀKURĀ chưa nhận được yêu cầu đặt lịch. Vui lòng thử lại hoặc liên hệ đội ngũ SĀKURĀ qua Zalo."
          : "SĀKURĀ could not receive your reservation request. Please try again or contact the SĀKURĀ team via Zalo.",
      );
    } finally {
      setBookingSubmitting(false);
    }
  }

  const renderServiceDetail = (service: RetreatService, mobile = false) => (
    <div className={"service-detail-content" + (mobile ? " service-detail-mobile" : "")}>
      <p className="service-meta">{`${service.sku ?? service.id} · ${service.collection} · ${service.duration} ${copy.common.minutes}`}</p>
      <h3>{serviceName(service, lang)}</h3><small>{secondaryName(service, lang)}</small><p className="service-description">{serviceDescription(service, lang)}</p>
      <PriceBlock service={service} copy={copy} /><button type="button" className="button-dark" onClick={() => openBooking({ serviceId: service.id })}>{copy.common.choose}<Arrow /></button><p className="legal-copy">{copy.common.legal}</p>
    </div>
  );

  const bookingIntents: BookingIntent[] = ["first", "body", "facial", "signature"];
  const bookingIntentLabels: Record<BookingIntent, readonly [string, string]> = { first: local.booking.firstIntent, facial: copy.booking.intents.facial, body: copy.booking.intents.body, signature: copy.booking.intents.signature };
  const facialCount = services.filter((service) => service.category === "facial").length;
  const bodyCount = services.filter((service) => service.category === "body").length;

  return (
    <>
      <audio ref={ambientAudioRef} loop preload="none" onPlay={() => setSoundOn(true)} onPause={() => setSoundOn(false)}>
        <source src="/audio/sakura-retreat-ambient.mp3" type="audio/mpeg" />
        <source src="/audio/sakura-retreat-ambient.ogg" type="audio/ogg" />
      </audio>
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <header className={"site-header" + (headerSolid ? " solid" : "")}>
        <button type="button" className="brand-button" onClick={() => scrollTo("arrival")} aria-label="SĀKURĀ Retreat"><img src="/brand/sakura-lockup.png" alt="SĀKURĀ — The Signature Private Retreat" /></button>
        <nav className="desktop-nav" aria-label={lang === "vi" ? "Điều hướng chính" : "Primary navigation"}><button type="button" onClick={() => scrollTo("body-welcome")}>{local.nav.welcome}</button><button type="button" onClick={() => scrollTo("private-retreat")}>{local.nav.retreat}</button><button type="button" onClick={() => scrollTo("collection")}>{local.nav.collection}</button><button type="button" onClick={() => scrollTo("visit")}>{local.nav.visit}</button></nav>
        <div className="header-actions"><button type="button" className={"ambient-header" + (soundOn ? " active" : "")} onClick={toggleSoundscape} aria-pressed={soundOn} aria-label={soundOn ? local.hero.soundOn : local.hero.soundOff}><SoundIcon active={soundOn} /></button><button type="button" className="language-button" onClick={() => setLang(lang === "vi" ? "en" : "vi")}>{copy.language}</button><button type="button" className="reserve-button" onClick={() => openBooking({ firstChoice: true })}>{lang === "vi" ? "Body Welcome · 399K" : "Reserve · 399K"}<CalendarIcon /></button><button type="button" className={"menu-button" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? (lang === "vi" ? "Đóng menu" : "Close menu") : (lang === "vi" ? "Mở menu" : "Open menu")}><span /><span /></button></div>
      </header>

      <div className={"menu-overlay" + (menuOpen ? " open" : "")} aria-hidden={!menuOpen}>
        <div className="menu-visual"><img src="/images/villa.webp" alt="" loading="lazy" /><span /></div>
        <nav aria-label={lang === "vi" ? "Điều hướng chính" : "Primary navigation"}>{[["01", local.nav.welcome, "body-welcome"], ["02", local.nav.retreat, "private-retreat"], ["03", local.nav.collection, "collection"], ["04", local.nav.visit, "visit"]].map(([number, label, id]) => <button key={id} type="button" onClick={() => scrollTo(id)}><span>{number}</span><strong>{label}</strong><Arrow /></button>)}<button className="menu-reserve" type="button" onClick={() => { setMenuOpen(false); openBooking({ firstChoice: true }); }}>{local.mobile.cta}<CalendarIcon /></button><div className="menu-contact"><a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a><span>{copy.footer.hours}</span></div></nav>
      </div>

      <main id="main-content">
        <section className="cinematic-journey" id="arrival" ref={journeyRef} aria-label={lang === "vi" ? "Hành trình Signature Welcome" : "Signature Welcome journey"}>
          <div className="journey-stage">
            <article className="journey-scene journey-arrival" data-journey-scene data-current aria-hidden="false">
              <div className="journey-media" aria-hidden="true"><img src="/images/villa.webp" alt="" fetchPriority="high" /><span className="journey-shade" /><span className="journey-light" /><span className="journey-depth depth-one" /><span className="journey-depth depth-two" /></div>
              <div className="journey-frame" aria-hidden="true"><span /><span /></div>
              <div className="journey-content journey-content-arrival">
                <div className="journey-copy"><p className="hero-eyebrow">{local.hero.eyebrow}</p><span className="hero-welcome">{local.hero.welcome}</span><h1 id="hero-title">{local.hero.title}</h1><p>{local.hero.body}</p><div className="hero-actions"><button type="button" className="button-gold" onClick={() => goToJourneyScene(1)}>{local.hero.primary}<Arrow down /></button><button type="button" className="button-glass" onClick={() => openBooking({ offerId: "FIRST-BODY-90" })}>{local.hero.reserve}<CalendarIcon /></button></div><button type="button" className={"sound-control" + (soundOn ? " active" : "")} onClick={toggleSoundscape} aria-pressed={soundOn}><SoundIcon active={soundOn} /><span><strong>{soundOn ? local.hero.soundOn : local.hero.soundOff}</strong><small>{local.hero.soundHint}</small></span></button></div>
                <aside className="journey-offer-card" aria-label={local.heroOffer.title}><p>{local.heroOffer.label}</p><div><span>01</span><h2>{local.heroOffer.title}</h2></div><small>{local.heroOffer.detail}</small><del>{local.heroOffer.listed}</del><strong>{local.heroOffer.price}<em>{local.heroOffer.currency}</em></strong><button type="button" onClick={() => openBooking({ offerId: "FIRST-BODY-90" })}>{local.hero.reserve}<Arrow /></button></aside>
              </div>
            </article>

            <article className="journey-scene journey-body" data-journey-scene aria-hidden="true">
              <div className="journey-media" aria-hidden="true"><img src="/images/body-stone.webp" alt="" loading="eager" decoding="async" fetchPriority="high" /><span className="journey-shade" /><span className="journey-light warm" /><span className="journey-depth depth-one" /><span className="journey-depth depth-two" /></div>
              <div className="journey-content journey-content-offer"><div className="journey-offer-copy"><p>01 · SIGNATURE WELCOME</p><h2>Body<br />Welcome</h2><h3>{lang === "vi" ? "Chọn 01 trong 05 trải nghiệm chăm sóc cơ thể." : "Choose one of five body-care experiences."}</h3><ul>{bodyWelcomeChoices.map((service) => <li key={service.id}>{serviceName(service, lang)} <span>{service.duration} {copy.common.minutes}</span></li>)}</ul></div><div className="journey-offer-action"><span>{lang === "vi" ? "KHÁCH LẦN ĐẦU TRẢI NGHIỆM" : "FIRST-TIME GUESTS"}</span><del>699.000 VND</del><strong>399.000<small>VND</small></strong><p>{lang === "vi" ? "Một khách · một phòng riêng · một giường" : "One guest · one private room · one bed"}</p><button type="button" className="button-gold" onClick={() => openBooking({ offerId: "FIRST-BODY-90" })}>{local.bodyWelcome.cta}<Arrow /></button><button type="button" className="journey-detail-link" onClick={() => scrollTo("body-welcome")}>{lang === "vi" ? "Xem đầy đủ 05 lựa chọn" : "View all five selections"}<Arrow diagonal /></button></div></div>
            </article>

            <article className="journey-scene journey-face" data-journey-scene aria-hidden="true">
              <div className="journey-media" aria-hidden="true"><img src="/images/diamond-skin.webp" alt="" loading="eager" decoding="async" fetchPriority="high" /><span className="journey-shade" /><span className="journey-light" /><span className="journey-depth depth-one" /><span className="journey-depth depth-two" /></div>
              <div className="journey-content journey-content-offer"><div className="journey-offer-copy"><p>02 · SIGNATURE WELCOME</p><h2>Face<br />Welcome</h2><h3>{lang === "vi" ? "Chọn 01 trong 06 trải nghiệm chăm sóc da." : "Choose one of six facial experiences."}</h3><ul className="journey-face-list">{facialWelcomeChoices.map((service) => <li key={service.id}>{serviceName(service, lang)} <span>{service.duration} {copy.common.minutes}</span></li>)}</ul></div><div className="journey-offer-action"><span>{lang === "vi" ? "KHÁCH LẦN ĐẦU TRẢI NGHIỆM" : "FIRST-TIME GUESTS"}</span><del>{lang === "vi" ? "Giá trị lựa chọn đến 999.000 VND" : "Selection value up to 999,000 VND"}</del><strong>599.000<small>VND</small></strong><p>{lang === "vi" ? "Chăm sóc da trong không gian riêng" : "Facial care in a private setting"}</p><button type="button" className="button-gold" onClick={() => openBooking({ offerId: "FIRST-FACE" })}>{local.faceWelcome.cta}<Arrow /></button><button type="button" className="journey-detail-link" onClick={() => scrollTo("face-welcome")}>{lang === "vi" ? "Xem chi tiết Face Welcome" : "Explore Face Welcome"}<Arrow diagonal /></button></div></div>
            </article>

            <article className="journey-scene journey-combo" data-journey-scene aria-hidden="true">
              <div className="journey-media journey-media-pair" aria-hidden="true"><img src="/images/diamond-skin.webp" alt="" loading="eager" decoding="async" /><img src="/images/body-stone.webp" alt="" loading="eager" decoding="async" /><span className="journey-shade" /><span className="journey-light warm" /></div>
              <div className="journey-content journey-content-combo"><img className="journey-mark" src="/brand/sakura-mark.png" alt="" aria-hidden="true" /><p>03 · SIGNATURE WELCOME</p><h2>Face <i>&amp;</i> Body<br />Welcome</h2><h3>{lang === "vi" ? "Hai trải nghiệm. Một lịch hẹn được chuẩn bị trọn vẹn." : "Two experiences. One complete private appointment."}</h3><div className="journey-combo-rate"><span>{lang === "vi" ? "DÀNH RIÊNG CHO KHÁCH LẦN ĐẦU" : "EXCLUSIVELY FOR FIRST-TIME GUESTS"}</span><strong>999.000<small>VND</small></strong></div><div className="journey-combo-actions"><button type="button" className="button-gold" onClick={() => openBooking({ offerId: "FIRST-FACE-BODY" })}>{local.combo.cta}<Arrow /></button><button type="button" className="button-glass" onClick={() => scrollTo("arrival-story")}>{lang === "vi" ? "Tiếp tục khám phá" : "Continue exploring"}<Arrow down /></button></div></div>
            </article>

            <nav className="journey-progress" aria-label={lang === "vi" ? "Tiến trình hành trình" : "Journey progress"}>{["Arrival", "Body", "Face", "Complete"].map((label, index) => <button key={label} type="button" data-journey-marker data-current={index === 0 ? "" : undefined} onClick={() => goToJourneyScene(index)}><span>{String(index + 1).padStart(2, "0")}</span><em>{label}</em></button>)}</nav>
            <div className="journey-scroll-cue" aria-hidden="true"><span />{lang === "vi" ? "CUỘN ĐỂ CHUYỂN CẢNH" : "SCROLL TO MOVE THROUGH"}</div>
          </div>
          <div className="journey-track" aria-hidden="true"><span className="journey-step" data-journey-step /><span className="journey-step" data-journey-step /><span className="journey-step" data-journey-step /></div>
        </section>

        <section className="arrival-story reveal-on-view" id="arrival-story" aria-labelledby="arrival-story-title">
          <div className="arrival-lead"><div className="arrival-lead-visual" aria-hidden="true"><img src="/images/villa.webp" alt="" loading="lazy" /><span /><div><small>TRUNG SƠN · HIM LAM</small><strong>PRIVATE BOTANICAL VILLA</strong></div></div><header><Kicker>{local.arrival.eyebrow}</Kicker><h2 id="arrival-story-title">{local.arrival.title}</h2><p>{local.arrival.body}</p><div className="arrival-standard"><span>01</span><p><strong>{lang === "vi" ? "LỊCH HẸN ĐƯỢC CHUẨN BỊ RIÊNG" : "PREPARED AROUND YOUR APPOINTMENT"}</strong><small>{lang === "vi" ? "Không gian, thời lượng và lựa chọn chăm sóc được sắp xếp trước khi đón bạn." : "Your room, time and care selection are arranged before you arrive."}</small></p></div></header></div>
          <div className="arrival-moments">{local.arrival.moments.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </section>

        <section className="body-welcome reveal-on-view" id="body-welcome" aria-labelledby="body-welcome-title">
          <div className="body-welcome-visual"><img key={selectedBodyChoice.id} src={selectedBodyChoice.image} alt={serviceName(selectedBodyChoice, lang)} loading="lazy" /><div className="visual-badge"><span>{String(bodyWelcomeChoices.findIndex((service) => service.id === selectedBodyChoice.id) + 1).padStart(2, "0")}</span><small>/ {String(bodyWelcomeChoices.length).padStart(2, "0")}</small></div><p>{local.bodyWelcome.selected}<strong>{serviceName(selectedBodyChoice, lang)}</strong></p></div>
          <div className="body-welcome-content"><Kicker>{local.bodyWelcome.eyebrow}</Kicker><p className="welcome-number">WELCOME 01</p><h2 id="body-welcome-title">{local.bodyWelcome.title}</h2><h3>{local.bodyWelcome.headline}</h3><p className="welcome-intro">{local.bodyWelcome.body}</p>
            <div className="body-choice-head"><div><span>{local.bodyWelcome.selection}</span><small>{local.bodyWelcome.selectionHint}</small></div><strong>{String(bodyWelcomeChoices.length).padStart(2, "0")}</strong></div>
            <div className="body-choice-list" role="radiogroup" aria-label={local.bodyWelcome.selection}>{bodyWelcomeChoices.map((service, index) => <button key={service.id} type="button" role="radio" aria-checked={welcomeBodyId === service.id} className={welcomeBodyId === service.id ? "active" : ""} onClick={() => setWelcomeBodyId(service.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{serviceName(service, lang)}</strong><small>{secondaryName(service, lang)}</small></div><em>{service.duration}</em></button>)}</div>
            <ul className="welcome-inclusions">{local.bodyWelcome.included.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul>
            <div className="welcome-rate"><div><small>{local.bodyWelcome.listed}</small><del>699.000 VND</del><em>{local.bodyWelcome.save}</em></div><div><small>{local.bodyWelcome.welcome}</small><strong>399.000</strong><span>VND</span></div></div>
            <button type="button" className="welcome-cta" onClick={() => openBooking({ offerId: "FIRST-BODY-90" })}>{local.bodyWelcome.cta}<Arrow /></button><p className="welcome-condition">{local.bodyWelcome.condition}</p>
          </div>
        </section>

        <section className="face-body-welcome face-welcome reveal-on-view" id="face-welcome" aria-labelledby="face-welcome-title">
          <div className="combo-copy"><Kicker light>{local.faceWelcome.eyebrow}</Kicker><p className="welcome-number light">WELCOME 02</p><h2 id="face-welcome-title">{local.faceWelcome.title}</h2><h3>{local.faceWelcome.headline}</h3><p>{local.faceWelcome.body}</p>
            <div className="combo-selection"><header><span>{local.faceWelcome.facialTitle}</span><small>{local.faceWelcome.facialHint}</small></header><div className="facial-choice-list" role="radiogroup" aria-label={local.faceWelcome.facialTitle}>{facialWelcomeChoices.map((service, index) => <button key={service.id} type="button" role="radio" aria-checked={welcomeFacialId === service.id} className={welcomeFacialId === service.id ? "active" : ""} onClick={() => setWelcomeFacialId(service.id)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{serviceName(service, lang)}</strong><small>{service.duration} {copy.common.minutes} · {money(service.price)} VND</small></button>)}</div></div>
            <div className="combo-rate"><span>{local.faceWelcome.priceLabel}</span><strong>599.000</strong><small>VND</small></div><button type="button" className="combo-cta" onClick={() => openBooking({ offerId: "FIRST-FACE" })}>{local.faceWelcome.cta}<Arrow /></button><p className="combo-condition">{local.faceWelcome.condition}</p>
          </div>
          <div className="combo-visual face-welcome-visual" aria-hidden="true"><div className="combo-image-main"><img className="face-image-backdrop" key={`${selectedFacialChoice.id}-backdrop`} src={selectedFacialChoice.image} alt="" loading="lazy" /><img className="face-image-subject" key={selectedFacialChoice.id} src={selectedFacialChoice.image} alt="" loading="lazy" /><span>FACIAL · ≤ 999K</span></div><div className="combo-monogram"><img src="/brand/sakura-mark.png" alt="" loading="lazy" /></div></div>
        </section>

        <section className="welcome-combination reveal-on-view" id="face-body-welcome" aria-labelledby="combo-title">
          <div className="welcome-combination-media" aria-hidden="true"><figure><img src="/images/diamond-skin.webp" alt="" loading="lazy" /><figcaption>FACE WELCOME</figcaption></figure><figure><img src="/images/body-stone.webp" alt="" loading="lazy" /><figcaption>BODY WELCOME</figcaption></figure><span /></div>
          <article><Kicker light>{local.combo.eyebrow}</Kicker><p className="welcome-number light">WELCOME 03</p><h2 id="combo-title">{local.combo.title}</h2><h3>{local.combo.headline}</h3><p>{local.combo.body}</p><div className="combination-feature"><span>01</span><strong>{local.combo.feature}</strong></div><div className="combo-rate"><span>{local.combo.priceLabel}</span><strong>999.000</strong><small>VND</small></div><button type="button" className="combo-cta" onClick={() => openBooking({ offerId: "FIRST-FACE-BODY" })}>{local.combo.cta}<Arrow /></button><p className="combo-condition">{local.combo.condition}</p></article>
        </section>

        <section className="private-retreat reveal-on-view" id="private-retreat" aria-labelledby="private-retreat-title"><div className="private-retreat-image"><img src="/images/villa.webp" alt="" loading="lazy" /><span /></div><div className="private-retreat-card"><Kicker light>{local.privateRetreat.eyebrow}</Kicker><h2 id="private-retreat-title">{local.privateRetreat.title}</h2><p>{local.privateRetreat.body}</p><div className="retreat-facts">{local.privateRetreat.facts.map((fact, index) => <span key={fact}><small>{String(index + 1).padStart(2, "0")}</small>{fact}</span>)}</div><button type="button" onClick={() => openBooking({ offerId: "FIRST-BODY-90" })}>{local.privateRetreat.cta}<Arrow /></button></div></section>

        <section className="collection-section open reveal-on-view" id="collection" aria-labelledby="collection-title">
          <header className="collection-heading"><Kicker>{local.collection.eyebrow}</Kicker><div><h2 id="collection-title">{local.collection.title}</h2><p>{local.collection.body}</p></div></header>
          <div className="collection-summary"><article><span>{String(facialCount).padStart(2, "0")}</span><div><strong>{local.collection.facial}</strong><small>{lang === "vi" ? "Từ 60 phút" : "From 60 minutes"}</small></div></article><article><span>{String(bodyCount).padStart(2, "0")}</span><div><strong>{local.collection.bodyLabel}</strong><small>{lang === "vi" ? "Từ 60 phút" : "From 60 minutes"}</small></div></article><article className="collection-privilege"><span>20%</span><div><strong>{local.collection.direct}</strong><small>{lang === "vi" ? "Giá ưu đãi hiển thị rõ trên từng dịch vụ" : "The direct rate is shown on every experience"}</small></div></article><div className="collection-visible-label"><span>{local.collection.open}</span><Arrow down /></div></div>
          <div className="collection-expanded"><div className="collection-tabs" role="group" aria-label={lang === "vi" ? "Lọc dịch vụ" : "Filter experiences"}>{(Object.keys(copy.collection.filters) as ServiceFilter[]).map((filter) => { const count = services.filter((service) => filter === "all" ? true : filter === "signature" ? service.level.toLowerCase().includes("signature") : service.category === filter).length; return <button key={filter} type="button" className={serviceFilter === filter ? "active" : ""} onClick={() => selectFilter(filter)} aria-pressed={serviceFilter === filter}>{copy.collection.filters[filter]}<span>{String(count).padStart(2, "0")}</span></button>; })}</div><div className="collection-browser"><aside className="service-feature"><div className="service-feature-image"><img key={activeService.id} src={activeService.image} alt="" loading="lazy" /><span>{activeService.collection}</span></div>{renderServiceDetail(activeService)}</aside><div className="service-list">{filteredServices.map((service, index) => <button key={service.id} type="button" className={"service-row" + (activeServiceId === service.id ? " active" : "")} onClick={() => selectService(service)}><span className="service-index">{String(index + 1).padStart(2, "0")}</span><img src={service.image} alt="" loading="lazy" /><div className="service-row-name"><small>{service.collection}</small><strong>{serviceName(service, lang)}</strong><span>{secondaryName(service, lang)}</span></div><p className="service-row-time"><strong>{service.duration}</strong><span>{copy.common.minutes}</span></p><div className="service-row-price"><del>{money(service.price)}</del><strong>{money(webPrice(service.price))}</strong><small>VND</small></div><Arrow /></button>)}</div></div></div>
        </section>

        <section className="reservation-invitation reveal-on-view" aria-labelledby="reservation-invitation-title"><div><img src="/images/body-stone.webp" alt="" loading="lazy" /><span /></div><article><span>YOUR SIGNATURE WELCOME</span><h2 id="reservation-invitation-title">{lang === "vi" ? "Khoảng nghỉ riêng của bạn bắt đầu từ một lựa chọn phù hợp." : "Your private pause begins with the right welcome."}</h2><p>{lang === "vi" ? "Chọn Signature Welcome, ngày và giờ thuận tiện. Đội ngũ SĀKURĀ sẽ kiểm tra lịch trống và liên hệ xác nhận trước khi chuẩn bị phòng đón bạn." : "Choose your Signature Welcome and preferred arrival time. The SĀKURĀ team will review availability and confirm the details before preparing your room."}</p><button type="button" onClick={() => openBooking({ firstChoice: true })}>{lang === "vi" ? "Chọn Signature Welcome" : "Choose a Signature Welcome"}<CalendarIcon /></button></article></section>

        <section className="visit-section reveal-on-view" id="visit" aria-labelledby="visit-title"><div className="visit-copy"><Kicker>{copy.visit.eyebrow}</Kicker><h2 id="visit-title">{copy.visit.title}</h2><p>{copy.visit.address}</p><span>{copy.visit.hint}</span><a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">{copy.visit.directions}<Arrow diagonal /></a></div><div className="map-frame"><iframe src={MAP_EMBED} width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title={lang === "vi" ? "Bản đồ SĀKURĀ Retreat" : "Map to SĀKURĀ Retreat"} /></div></section>

        <section className="concierge-section reveal-on-view" aria-labelledby="concierge-title"><header><Kicker light>{copy.concierge.eyebrow}</Kicker><h2 id="concierge-title">{copy.concierge.title}</h2><p>{copy.concierge.body}</p></header><div className="concierge-columns"><article><div className="concierge-label"><span>01</span><h3>{copy.concierge.vietnam}</h3><a className="phone-number" href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a></div><div className="concierge-links"><a href={ZALO_URL} target="_blank" rel="noreferrer"><MessageIcon /><span><small>PRIVATE CHAT</small>{copy.concierge.zalo}</span><Arrow diagonal /></a><a href={MESSENGER_URL} target="_blank" rel="noreferrer"><MessageIcon /><span><small>PRIVATE CHAT</small>{copy.concierge.messenger}</span><Arrow diagonal /></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageIcon /><span><small>PRIVATE CHAT</small>{copy.concierge.whatsapp}</span><Arrow diagonal /></a><a href={`tel:${PHONE_NUMBER}`}><PhoneIcon /><span><small>09:00 — 20:30</small>{copy.concierge.call}</span><Arrow /></a></div></article><article><div className="concierge-label"><span>02</span><h3>{copy.concierge.international}</h3><p>QR GUEST ASSISTANCE</p></div><div className="international-links">{qrChannels.filter((channel) => channel.name !== "Zalo").map((channel) => <button key={channel.name} type="button" onClick={() => setQrChannel(channel)}><span>{channel.name}</span><small>{copy.concierge.showQr}</small><Arrow diagonal /></button>)}</div></article></div></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><img src="/brand/sakura-lockup.png" alt="SĀKURĀ Retreat" loading="lazy" /><p>{copy.footer.line}</p><span>{copy.footer.idea}</span></div><div className="footer-info"><div><small>VISIT</small><span>{copy.visit.address}</span></div><div><small>{lang === "vi" ? "HỖ TRỢ ĐẶT LỊCH" : "RESERVATION ASSISTANCE"}</small><a className="phone-number" href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a></div><div><small>OPENING HOURS</small><span>{copy.footer.hours}</span></div></div><div className="footer-bottom"><span>© 2026 SĀKURĀ RETREAT</span><div><a href={ZALO_URL} target="_blank" rel="noreferrer">ZALO</a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WHATSAPP</a><a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">GOOGLE MAPS</a><button type="button" onClick={() => scrollTo("arrival")}>{copy.footer.top} ↑</button></div></div></footer>
      <button className="mobile-reserve" type="button" onClick={() => openBooking({ offerId: "FIRST-BODY-90" })}><span><small>{local.mobile.eyebrow}</small>{local.mobile.cta}</span><CalendarIcon /></button>

      {sheetService && <div className="service-sheet" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSheetServiceId(null); }}><div role="dialog" aria-modal="true" aria-labelledby="sheet-title"><button type="button" className="sheet-close" onClick={() => setSheetServiceId(null)} aria-label={copy.collection.close}><CloseIcon /></button><div className="sheet-image"><img src={sheetService.image} alt="" /><span>{sheetService.collection}</span></div><div id="sheet-title">{renderServiceDetail(sheetService, true)}</div></div></div>}
      {qrChannel && <div className="qr-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setQrChannel(null); }}><div role="dialog" aria-modal="true" aria-labelledby="qr-title"><button type="button" onClick={() => setQrChannel(null)} aria-label={copy.concierge.closeQr}><CloseIcon /></button><p>INTERNATIONAL GUEST ASSISTANCE</p><h2 id="qr-title">{qrChannel.name}</h2><img src={qrChannel.image} alt={`${qrChannel.name} QR code`} /><span>{copy.concierge.scan}</span></div></div>}

      {bookingOpen && <div className="booking-shell" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}><div className="booking-panel" role="dialog" aria-modal="true" aria-labelledby="booking-title" tabIndex={-1} ref={bookingRef}>
        <header className="booking-header"><div><p>{copy.booking.eyebrow}</p><span>{bookingSelection.badge}</span></div><div><small>{`${copy.booking.step} ${bookingStep} ${copy.booking.of} 6`}</small><button type="button" onClick={() => setBookingOpen(false)} aria-label={lang === "vi" ? "Đóng đặt lịch" : "Close reservation"}><CloseIcon /></button></div></header>
        <div className="booking-progress" aria-hidden="true">{[1, 2, 3, 4, 5, 6].map((step) => <span key={step} className={bookingStep >= step ? "active" : ""} />)}</div>
        <div className="booking-body">
          {bookingStep === 1 && <section className="booking-step"><p>{copy.booking.intentEyebrow}</p><h2 id="booking-title">{local.booking.intentTitle}</h2><div className="booking-intents">{bookingIntents.map((intent, index) => <button key={intent} type="button" className={intent === "first" ? "featured" : ""} onClick={() => chooseBookingIntent(intent)}><span>{`0${index + 1}`}</span><strong>{bookingIntentLabels[intent][0]}</strong><small>{bookingIntentLabels[intent][1]}</small><Arrow /></button>)}</div></section>}
          {bookingStep === 2 && <section className="booking-step"><p>{copy.booking.serviceEyebrow}</p><h2 id="booking-title">{bookingIntent === "first" ? local.booking.firstServiceTitle : copy.booking.serviceTitle}</h2>
            {bookingIntent === "first" ? <div className="booking-welcome-customizer"><div className="booking-offer-switch" role="radiogroup" aria-label={local.booking.chooseOffer}>{firstVisitOffers.map((offer, index) => <button key={offer.id} type="button" role="radio" aria-checked={selectedOfferId === offer.id} className={selectedOfferId === offer.id ? "active" : ""} onClick={() => setSelectedOfferId(offer.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{offer.name[lang]}</strong><small>{offer.shortDescription[lang]}</small></div><em>{money(offer.price)}<small>VND</small></em></button>)}</div>
              {selectedOffer.kind === "body" && <fieldset className="booking-choice-fieldset"><legend>{local.booking.chooseBody}</legend><div className="booking-choice-grid">{bodyWelcomeChoices.map((service) => <button key={service.id} type="button" className={welcomeBodyId === service.id ? "active" : ""} onClick={() => setWelcomeBodyId(service.id)}><strong>{serviceName(service, lang)}</strong><small>{service.duration} {copy.common.minutes}</small></button>)}</div></fieldset>}
              {selectedOffer.kind === "face" && <fieldset className="booking-choice-fieldset"><legend>{local.booking.chooseFacial}</legend><div className="booking-choice-grid facial">{facialWelcomeChoices.map((service) => <button key={service.id} type="button" className={welcomeFacialId === service.id ? "active" : ""} onClick={() => setWelcomeFacialId(service.id)}><strong>{serviceName(service, lang)}</strong><small>{service.duration} {copy.common.minutes} · {money(service.price)} VND</small></button>)}</div></fieldset>}
              {selectedOffer.kind === "combo" && <div className="booking-combo-note"><span>FACE + BODY</span><p>{lang === "vi" ? "Bạn sẽ lựa chọn 01 Face Welcome và 01 Body Welcome phù hợp khi đến SĀKURĀ. Đội ngũ dành trước khung thời gian cần thiết cho cả hai trải nghiệm." : "Choose one Face Welcome and one Body Welcome when you arrive. Our team will reserve the appropriate time for both experiences."}</p></div>}
              <div className="booking-welcome-summary"><span>{bookingSelection.name}</span><strong>{money(bookingSelection.price)} VND</strong><p>{bookingSelection.choiceLines.length ? bookingSelection.choiceLines.map((line) => <small key={line}>✓ {line}</small>) : <small>✓ {bookingSelection.secondary}</small>}</p></div><p className="booking-condition">{local.booking.welcomeCondition}</p></div>
              : <div className="booking-service-list">{bookingServices.map((service) => <button key={service.id} type="button" className={selectedServiceId === service.id ? "active" : ""} onClick={() => setSelectedServiceId(service.id)}><img src={service.image} alt="" /><span><strong>{serviceName(service, lang)}</strong><small>{`${service.duration} ${copy.common.minutes} · ${money(webPrice(service.price))} VND`}</small></span><em>✓</em></button>)}</div>}
            <div className="booking-actions"><button type="button" onClick={() => setBookingStep(1)}>{copy.booking.back}</button><button className="booking-primary" type="button" onClick={() => { setSelectedDate(""); setSelectedTime(""); setBookingStep(3); }}>{copy.booking.next}<Arrow /></button></div></section>}
          {bookingStep === 3 && <section className="booking-step"><p>{copy.booking.dateEyebrow}</p><h2 id="booking-title">{copy.booking.dateTitle}</h2><div className="booking-selection"><span>{bookingSelection.name}</span><strong>{`${bookingSelection.durationLabel} · ${money(bookingSelection.price)} VND`}</strong><small>{bookingSelection.secondary}</small></div><div className="date-grid">{dates.map((date) => <button key={date.value} type="button" className={selectedDate === date.value ? "active" : ""} onClick={() => { setSelectedDate(date.value); setSelectedTime(""); }}><span>{date.weekday}</span><strong>{date.day}</strong><small>{date.month}</small></button>)}</div><div className="booking-actions"><button type="button" onClick={() => setBookingStep(2)}>{copy.booking.back}</button><button className="booking-primary" type="button" disabled={!selectedDate} onClick={() => setBookingStep(4)}>{copy.booking.next}<Arrow /></button></div></section>}
          {bookingStep === 4 && <section className="booking-step"><p>{copy.booking.timeEyebrow}</p><h2 id="booking-title">{copy.booking.timeTitle}</h2><div className="booking-selection"><span>{formatBookingDate(selectedDate, lang)}</span><strong>{bookingSelection.name}</strong><small>{bookingSelection.durationLabel}</small></div><div className="time-grid">{timeSlots.map((time) => <button key={time} type="button" className={selectedTime === time ? "active" : ""} onClick={() => setSelectedTime(time)}>{time}</button>)}</div><div className="booking-actions"><button type="button" onClick={() => setBookingStep(3)}>{copy.booking.back}</button><button className="booking-primary" type="button" disabled={!selectedTime} onClick={() => setBookingStep(5)}>{copy.booking.next}<Arrow /></button></div></section>}
          {bookingStep === 5 && <form className="booking-step" onSubmit={submitBooking}><p>{copy.booking.guestEyebrow}</p><h2 id="booking-title">{copy.booking.guestTitle}</h2><div className="booking-selection"><span>{bookingSelection.name}</span><strong>{`${formatBookingDate(selectedDate, lang)} · ${selectedTime}`}</strong><small>{`${money(bookingSelection.price)} VND · ${bookingSelection.badge}`}</small></div><label htmlFor="guest-name">{copy.booking.name}</label><input id="guest-name" autoComplete="name" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder={copy.booking.namePlaceholder} required /><label htmlFor="guest-phone">{copy.booking.phone}</label><input id="guest-phone" type="tel" inputMode="tel" autoComplete="tel" value={guestPhone} onChange={(event) => setGuestPhone(event.target.value)} placeholder={PHONE_DISPLAY} required /><label htmlFor="guest-note">{copy.booking.note}</label><textarea id="guest-note" rows={4} value={guestNote} onChange={(event) => setGuestNote(event.target.value)} placeholder={copy.booking.notePlaceholder} /><small className="booking-privacy">{copy.booking.privacy}</small><div className="booking-actions"><button type="button" onClick={() => setBookingStep(4)}>{copy.booking.back}</button><button className="booking-primary" type="submit" disabled={bookingSubmitting}>
              {bookingSubmitting ? (lang === "vi" ? "Đang gửi..." : "Sending...") : copy.booking.complete}<Arrow />
            </button></div></form>}
          {bookingStep === 6 && <section className="booking-step booking-ready"><img src="/brand/sakura-mark.png" alt="" /><p>{copy.booking.readyEyebrow}</p><h2 id="booking-title">{copy.booking.readyTitle}</h2><p>{copy.booking.readyBody}</p><div className="booking-selection"><span>{bookingSelection.name}</span><strong>{`${formatBookingDate(selectedDate, lang)} · ${selectedTime}`}</strong><small>{`${money(bookingSelection.price)} VND · ${bookingSelection.badge}`}</small></div><button className="booking-primary" type="button" onClick={copyAndOpenZalo}>{copied ? `${copy.booking.zalo} ✓` : copy.booking.zalo}<Arrow diagonal /></button><a className="booking-primary whatsapp" href={`${WHATSAPP_URL}?text=${encodeURIComponent(requestMessage)}`} target="_blank" rel="noreferrer">{copy.booking.whatsapp}<Arrow diagonal /></a><a className="ready-link" href={MESSENGER_URL} target="_blank" rel="noreferrer">{copy.booking.messenger}<Arrow diagonal /></a><a className="ready-link" href={`tel:${PHONE_NUMBER}`}>{copy.booking.call}<PhoneIcon /></a><small className="ready-note">{copy.booking.confirmation}</small><button className="start-over" type="button" onClick={() => { setBookingStep(1); setSelectedDate(""); setSelectedTime(""); }}>{copy.booking.again}</button></section>}
        </div>
      </div></div>}
    </>
  );
}
