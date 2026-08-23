export type ServiceCategory = "facial" | "body";

export type RetreatService = {
  id: string;
  sku: string | null;
  category: ServiceCategory;
  collection: string;
  level: string;
  name: string;
  englishName: string;
  description: string;
  duration: number;
  price: number;
  image: string;
  imagePosition?: string;
};

export const services: RetreatService[] = [
  {
    id: "AC016",
    sku: "AC016",
    category: "facial",
    collection: "Facial Retreat",
    level: "Essential",
    name: "Chăm Sóc Da Thông Thoáng",
    englishName: "Sakura Clear Care",
    description:
      "Làm sạch dịu nhẹ, loại bỏ bụi bẩn và dầu thừa trên bề mặt, giúp da có cảm giác sạch, thông thoáng và dễ chịu hơn.",
    duration: 60,
    price: 499000,
    image: "/images/facial-opener.webp",
  },
  {
    id: "AC017",
    sku: "AC017",
    category: "facial",
    collection: "Facial Retreat",
    level: "Enhanced",
    name: "Chăm Sóc Da Dầu & Dễ Bít Tắc",
    englishName: "Sakura Clear Plus",
    description:
      "Chăm sóc nhiều bước tập trung làm sạch bề mặt, hỗ trợ kiểm soát cảm giác dầu thừa và duy trì bề mặt da sạch, thoáng, cân bằng hơn.",
    duration: 90,
    price: 999000,
    image: "/images/facial-opener.webp",
  },
  {
    id: "FF021",
    sku: "FF021",
    category: "facial",
    collection: "Facial Retreat",
    level: "Essential",
    name: "Căng Mịn & Tươi Tắn",
    englishName: "Sakura Smooth & Fresh Facial",
    description:
      "Làm sạch, cấp ẩm và chăm sóc nhẹ nhàng giúp bề mặt da mềm mại, tươi tắn và trông căng mịn hơn sau trải nghiệm.",
    duration: 60,
    price: 499000,
    image: "/images/youthful-glow.webp",
  },
  {
    id: "FF023",
    sku: "FF023",
    category: "facial",
    collection: "Facial Retreat",
    level: "Essential",
    name: "Dưỡng Sáng & Đều Màu Da",
    englishName: "Sakura Radiance Care",
    description:
      "Kết hợp làm sạch và dưỡng ẩm với mỹ phẩm dùng ngoài da, giúp bề mặt da trông tươi sáng, mềm mại và đều màu hơn.",
    duration: 90,
    price: 999000,
    image: "/images/golden-skin.webp",
  },
  {
    id: "FF024",
    sku: "FF024",
    category: "facial",
    collection: "Facial Retreat",
    level: "Essential",
    name: "Cấp Ẩm Collagen",
    englishName: "Sakura Collagen Hydration Care",
    description:
      "Bổ sung độ ẩm với sản phẩm chăm sóc da chứa thành phần phù hợp, giúp bề mặt da mềm mại, mượt mà và dễ chịu hơn.",
    duration: 90,
    price: 999000,
    image: "/images/skin-balance.webp",
  },
  {
    id: "FF029",
    sku: "FF029",
    category: "facial",
    collection: "Facial Retreat",
    level: "Essential",
    name: "Làm Sạch & Cân Bằng Da",
    englishName: "Sakura Deep Clean Balance",
    description:
      "Chăm sóc làm sạch nhiều bước nhằm loại bỏ bụi bẩn, dầu thừa và cặn mỹ phẩm trên bề mặt, giúp da sạch thoáng và dễ chịu hơn.",
    duration: 60,
    price: 649000,
    image: "/images/skin-balance.webp",
  },
  {
    id: "SK029",
    sku: "SK029",
    category: "facial",
    collection: "Signature Facial",
    level: "Signature",
    name: "Đá Ấm Thư Giãn Da Mặt",
    englishName: "Sakura Warm Stone Facial",
    description:
      "Kết hợp chăm sóc da mặt với đá ấm sử dụng nhẹ nhàng bên ngoài, mang lại cảm giác thư giãn, ấm dịu và giúp bề mặt da mềm mại hơn.",
    duration: 90,
    price: 1199000,
    image: "/images/warm-stone-facial.webp",
  },
  {
    id: "FA034",
    sku: "FA034",
    category: "facial",
    collection: "Signature Facial",
    level: "Signature",
    name: "Golden Skin 24K – Dưỡng Ẩm & Sáng Mịn",
    englishName: "Golden Skin 24K Radiance Facial",
    description:
      "Chăm sóc da với sản phẩm mỹ phẩm 24K dùng ngoài da, kết hợp làm sạch và cấp ẩm, giúp bề mặt da mềm mại, mịn màng và trông rạng rỡ hơn.",
    duration: 90,
    price: 1399000,
    image: "/images/golden-skin.webp",
  },
  {
    id: "YOUTHFUL-GLOW",
    sku: null,
    category: "facial",
    collection: "Signature Facial",
    level: "Signature",
    name: "Sakura Youthful Glow – Chăm Sóc Căng Mịn Đa Bước",
    englishName: "Sakura Youthful Glow Facial",
    description:
      "Trải nghiệm chăm sóc da nhiều bước tập trung làm sạch, cấp ẩm và làm mềm bề mặt, giúp da trông tươi tắn, căng mịn và được chăm sóc kỹ lưỡng hơn.",
    duration: 90,
    price: 1499000,
    image: "/images/youthful-glow.webp",
  },
  {
    id: "FA036",
    sku: "FA036",
    category: "facial",
    collection: "Facial Advanced",
    level: "Advanced",
    name: "Ekskêption × CO₂ – Làm Mới Bề Mặt Da",
    englishName: "Ekskêption × CO₂ Surface Renewal Care",
    description:
      "Kết hợp các sản phẩm chăm sóc dùng ngoài da nhằm làm sạch, làm mềm lớp sừng bề mặt và mang lại cảm giác da tươi mới, mịn màng hơn sau trải nghiệm.",
    duration: 90,
    price: 1799000,
    image: "/images/surface-renewal.webp",
  },
  {
    id: "FA037",
    sku: "FA037",
    category: "facial",
    collection: "Facial Advanced",
    level: "Advanced",
    name: "Làm Dịu & Cân Bằng Da",
    englishName: "Sakura Skin Balance Care",
    description:
      "Chăm sóc dịu nhẹ với các bước làm sạch và cấp ẩm, giúp bề mặt da có cảm giác êm dịu, mềm mại và cân bằng hơn.",
    duration: 90,
    price: 1799000,
    image: "/images/skin-balance.webp",
  },
  {
    id: "DIAMOND-FACE",
    sku: null,
    category: "facial",
    collection: "Signature Facial",
    level: "Signature",
    name: "Diamond Skin Face – Căng Mịn & Dưỡng Ẩm",
    englishName: "Diamond Skin Face Care",
    description:
      "Chăm sóc da mặt theo nhiều bước với mỹ phẩm dùng ngoài da, tập trung làm sạch và cấp ẩm để bề mặt da trông mềm mại, căng mịn và tươi tắn hơn.",
    duration: 100,
    price: 1799000,
    image: "/images/diamond-skin.webp",
  },
  {
    id: "DIAMOND-NECK",
    sku: null,
    category: "facial",
    collection: "Signature Facial",
    level: "Signature Extension",
    name: "Diamond Skin Neck – Chăm Sóc Vùng Cổ Mềm Mịn",
    englishName: "Diamond Skin Neck Care",
    description:
      "Chăm sóc vùng cổ bằng các bước làm sạch, cấp ẩm và dưỡng da bên ngoài, giúp bề mặt da vùng cổ mềm mại, mượt mà và được chăm sóc đồng đều hơn.",
    duration: 30,
    price: 1299000,
    image: "/images/neck-shoulder.webp",
  },
  {
    id: "BD002",
    sku: "BD002",
    category: "body",
    collection: "Body Retreat",
    level: "Essential",
    name: "Đá Ấm Thư Giãn Toàn Thân",
    englishName: "Warm Stone Relaxing Body Care",
    description:
      "Chăm sóc cơ thể bằng thao tác thư giãn kết hợp đá ấm sử dụng bên ngoài da, mang lại cảm giác ấm áp, dễ chịu và giúp cơ thể thư thả sau một ngày dài.",
    duration: 60,
    price: 549000,
    image: "/images/body-stone.webp",
  },
  {
    id: "BD003",
    sku: "BD003",
    category: "body",
    collection: "Body Retreat",
    level: "Essential",
    name: "Đá Ấm Thư Giãn Toàn Thân",
    englishName: "Warm Stone Relaxing Body Care",
    description:
      "Chăm sóc cơ thể bằng thao tác thư giãn kết hợp đá ấm sử dụng bên ngoài da, mang lại cảm giác ấm áp, dễ chịu và giúp cơ thể thư thả sau một ngày dài.",
    duration: 90,
    price: 699000,
    image: "/images/body-stone.webp",
  },
  {
    id: "BD005",
    sku: "BD005",
    category: "body",
    collection: "Body Retreat",
    level: "Essential",
    name: "Ngải Cứu Ấm Dịu Toàn Thân",
    englishName: "Warm Mugwort Body Care",
    description:
      "Kết hợp chăm sóc cơ thể nhẹ nhàng với ngải cứu ấm sử dụng bên ngoài, tạo cảm giác ấm dịu, thư giãn và thoải mái trong suốt thời gian trải nghiệm.",
    duration: 90,
    price: 699000,
    image: "/images/mugwort.webp",
  },
  {
    id: "BD007",
    sku: "BD007",
    category: "body",
    collection: "Body Retreat",
    level: "Signature Body",
    name: "Gừng & Đá Muối Ấm Dịu Toàn Thân",
    englishName: "Ginger & Himalayan Salt Warm Body Care",
    description:
      "Kết hợp sản phẩm gừng dùng ngoài da và đá muối ấm trong trải nghiệm chăm sóc cơ thể, mang lại cảm giác ấm áp, thư thái và nhẹ nhàng.",
    duration: 90,
    price: 699000,
    image: "/images/ginger-salt.webp",
  },
  {
    id: "BD008",
    sku: "BD008",
    category: "body",
    collection: "Body Retreat",
    level: "Enhanced",
    name: "Nến Dưỡng Ấm Toàn Thân",
    englishName: "Warm Candle Body Care",
    description:
      "Sử dụng sản phẩm nến chăm sóc da phù hợp để tạo độ ấm dịu khi thoa ngoài da, giúp bề mặt da mềm mại hơn và mang lại cảm giác thư giãn.",
    duration: 90,
    price: 699000,
    image: "/images/candle.webp",
  },
  {
    id: "BD011",
    sku: "BD011",
    category: "body",
    collection: "Body Retreat",
    level: "Essential",
    name: "Thư Giãn Vùng Cổ Vai",
    englishName: "Neck & Shoulder Relaxing Care",
    description:
      "Tập trung chăm sóc thư giãn vùng cổ và vai bằng các thao tác nhẹ nhàng bên ngoài, phù hợp cho khách muốn dành thời gian nghỉ ngơi sau khi ngồi hoặc làm việc lâu.",
    duration: 60,
    price: 499000,
    image: "/images/neck-shoulder.webp",
  },
  {
    id: "BD012",
    sku: "BD012",
    category: "body",
    collection: "Body Retreat",
    level: "Enhanced",
    name: "Thư Giãn Cổ Vai Kết Hợp Ủ Ấm",
    englishName: "Neck & Shoulder Warm Wrap Care",
    description:
      "Chăm sóc thư giãn vùng cổ vai kết hợp bước ủ ấm bên ngoài, tạo cảm giác ấm dịu, dễ chịu và thư thái hơn trong thời gian trải nghiệm.",
    duration: 60,
    price: 549000,
    image: "/images/neck-shoulder.webp",
  },
  {
    id: "BR050",
    sku: "BR050",
    category: "body",
    collection: "Body Retreat",
    level: "Premium Body",
    name: "Dưỡng Sáng & Làm Mềm Da Cơ Thể",
    englishName: "Body Brightening & Softening Care",
    description:
      "Chăm sóc bề mặt da cơ thể bằng sản phẩm mỹ phẩm dùng ngoài da, kết hợp làm sạch và dưỡng ẩm để da trông tươi sáng, mềm mại và mịn màng hơn.",
    duration: 90,
    price: 1799000,
    image: "/images/body-softening.webp",
  },
];

export const featuredServiceIds = ["SK029", "FA034", "DIAMOND-FACE", "BD007"];

export const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("vi-VN").format(price)} VND`;

export const webPrice = (price: number) => Math.round(price * 0.8);

export const savings = (price: number) => price - webPrice(price);
