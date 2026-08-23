import SakuraExperience from "./SakuraExperience";
import { services, webPrice } from "./services";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "DaySpa",
  name: "SĀKURĀ RETREAT",
  alternateName: "The Signature Private Retreat",
  description:
    "Private Botanical Skin & Body Retreat tại Khu dân cư Trung Sơn, Hồ Chí Minh.",
  url: "https://sakuraretreat.vn",
  telephone: "+84912355503",
  priceRange: "499.000–1.799.000 VND",
  image: "https://sakuraretreat.vn/og-sakura-retreat.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "05 Đường số 4A, Khu dân cư Trung Sơn",
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
    itemListElement: services.map((service) => ({
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
    })),
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
