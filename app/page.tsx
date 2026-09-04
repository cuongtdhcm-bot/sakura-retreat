import SakuraExperience from "./SakuraExperience";
import { services, webPrice } from "./services";

const firstVisitOffers = [
  {
    "@type": "Offer",
    name: "Body Welcome — Ưu đãi khách lần đầu",
    sku: "FIRST-BODY-90",
    price: 399000,
    priceCurrency: "VND",
    description:
      "Khách lần đầu chọn 01 trong 05 trải nghiệm Body Welcome từ 60 đến 90 phút, phục vụ theo tiêu chuẩn 01 khách, 01 phòng riêng, 01 giường. Giá Signature Welcome 399.000 VND.",
    itemOffered: {
      "@type": "Service",
      name: "Body Welcome",
      alternateName: "First-Visit Private Body Care",
    },
  },
  {
    "@type": "Offer",
    name: "Face Welcome — Ưu đãi khách lần đầu",
    sku: "FIRST-FACE",
    price: 599000,
    priceCurrency: "VND",
    description:
      "Khách lần đầu chọn 01 trong 06 trải nghiệm Facial có giá niêm yết đến 999.000 VND. Giá Signature Welcome 599.000 VND.",
    itemOffered: {
      "@type": "Service",
      name: "Face Welcome",
      alternateName: "First-Visit Private Facial Care",
    },
  },
  {
    "@type": "Offer",
    name: "Face & Body Welcome — Ưu đãi khách lần đầu",
    sku: "FIRST-FACE-BODY",
    price: 999000,
    priceCurrency: "VND",
    description:
      "Khách lần đầu kết hợp 01 Face Welcome và 01 Body Welcome trong cùng lịch hẹn. Giá Signature Welcome 999.000 VND.",
    itemOffered: {
      "@type": "Service",
      name: "Face & Body Welcome",
      alternateName: "First-Visit Facial & Body Care",
    },
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "DaySpa",
  name: "SĀKURĀ RETREAT",
  alternateName: "The Signature Private Retreat",
  description:
    "Private Botanical Skin & Body Retreat tại Khu dân cư Trung Sơn – Him Lam, Hồ Chí Minh.",
  url: "https://sakuraretreat.vn",
  telephone: "+84912355503",
  priceRange: "399.000–1.799.000 VND",
  image: "https://sakuraretreat.vn/og-sakura-retreat.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "05 Đường số 4A, Khu dân cư Trung Sơn – Him Lam",
    addressLocality: "Bình Hưng",
    addressRegion: "Hồ Chí Minh",
    addressCountry: "VN",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    opens: "09:00",
    closes: "20:30",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "SĀKURĀ Retreat Experiences — Direct Web Privilege",
    itemListElement: [...firstVisitOffers, ...services.map((service) => ({
      "@type": "Offer",
      name: service.name,
      sku: service.sku ?? service.id,
      price: webPrice(service.price),
      priceCurrency: "VND",
      description: `${service.duration} phút · Giá đặt trực tiếp trên website, giảm 20% từ giá niêm yết ${service.price} VND.`,
      itemOffered: {
        "@type": "Service",
        name: service.name,
        alternateName: service.englishName,
        description: service.description,
      },
    }))],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SakuraExperience />
    </>
  );
}
