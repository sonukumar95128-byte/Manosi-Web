// Single source of truth for the demo/seed content.
// Imported by server.mjs (to seed data/db.json) and by App.jsx (as the
// offline fallback shown when the admin API is unreachable).

export const seedOrders = [
  { id: "ORD-178419250789", status: "Pending payment", statusKey: "pending", customer: "ghghghgh", phone: "+91 21321", address: "nvcgcd, bh, j - 3244, India", item: "Rose Gold Diamond Earrings", quantity: 1, total: "₹18,003", date: "15 Jul 2026, 06:10 pm", dateISO: "2026-07-15" },
  { id: "ORD-1783862406916", status: "Pending payment", statusKey: "pending", customer: "Test", phone: "+91 81405 16517", address: "Bsj, near Jsjs, Jsjesjsj, Jej - Jsjs, India", item: "Rose Gold Diamond Earrings", quantity: 1, total: "₹17,803", date: "12 Jul 2026, 06:50 pm", dateISO: "2026-07-12" },
  { id: "ORD-1783029108842", status: "Paid", statusKey: "paid", customer: "Priya Sharma", phone: "+91 98765 43210", address: "Bandra West, Mumbai - 400050, India", item: "Yellow Gold Diamond Bracelet", quantity: 1, total: "₹34,819", date: "10 Jul 2026, 02:25 pm", dateISO: "2026-07-10" },
  { id: "ORD-1782965401288", status: "Pending payment", statusKey: "pending", customer: "Nisha Rao", phone: "+91 99887 77665", address: "Indiranagar, Bengaluru - 560038, India", item: "Rose Gold Diamond Bracelet", quantity: 1, total: "₹27,181", date: "09 Jul 2026, 11:40 am", dateISO: "2026-07-09" },
  { id: "ORD-1782119085120", status: "Paid", statusKey: "paid", customer: "Kavya Iyer", phone: "+91 90909 12345", address: "T Nagar, Chennai - 600017, India", item: "Natural Diamond Nosepin", quantity: 1, total: "₹28,500", date: "06 Jul 2026, 08:18 pm", dateISO: "2026-07-06" },
  { id: "ORD-1781849921124", status: "Pending payment", statusKey: "pending", customer: "Aarohi Shah", phone: "+91 98222 44110", address: "Satellite, Ahmedabad - 380015, India", item: "Everyday Diamond Pendant", quantity: 1, total: "₹82,000", date: "04 Jul 2026, 05:04 pm", dateISO: "2026-07-04" },
  { id: "ORD-1781023304501", status: "Pending payment", statusKey: "pending", customer: "Ritika Shah", phone: "+91 91234 56780", address: "Koregaon Park, Pune - 411001, India", item: "Lightweight Diamond Necklace", quantity: 1, total: "₹64,000", date: "01 Jul 2026, 01:12 pm", dateISO: "2026-07-01" },
];

export const seedCoupons = [
  { id: "JB50", code: "JB50", type: "% off", value: "8", minOrder: "No minimum", expires: "2026-12-31", active: true },
  { id: "DAZZLING20", code: "DAZZLING20", type: "% off", value: "5", minOrder: "No minimum", expires: "2026-12-31", active: true },
  { id: "WELCOME20", code: "WELCOME20", type: "Flat ₹ off", value: "200", minOrder: "₹5,000", expires: "2026-09-30", active: false },
];

export const seedHomepageSections = [
  { id: "hero", title: "Hero Banner Carousel", note: "Full-screen image-only slider", action: "Manage banners →", visible: true },
  { id: "collections", title: "Collections Carousel", note: "Home collection cards - 1080 x 760 images", action: "Manage collections →", visible: true },
  { id: "bestsellers", title: "Trending Now Products", note: "Product carousel shown after collections", action: "Choose products →", visible: true },
  { id: "offer", title: "Campaign Banner Carousel", note: "Wide image-only promotional slider", action: "Manage banners →", visible: true },
  { id: "arrivals", title: "New Arrivals Products", note: "Fresh drops product carousel", action: "Choose products →", visible: true },
  { id: "reels", title: "Manosi in Motion Reels", note: "Video carousel with linked products", action: "Manage reels →", visible: true },
  { id: "badges", title: "Manosi Promises", note: "Trust and service promise icons", action: "Edit promises →", visible: true },
  { id: "testimonials", title: "Customer Testimonials", note: "Approved customer notes carousel", action: "Manage testimonials →", visible: true },
  { id: "instagram", title: "Instagram Feed", note: "Social media post preview grid", action: "Manage posts →", visible: true },
];

export const seedTestimonials = [
  { id: "aarohi", name: "Aarohi Mehta", rating: 5, status: "Approved", featured: true, quote: "The ring exceeded my expectations - the craftsmanship is stunning and it arrived beautifully packaged. Customer service was wonderful throughout." },
  { id: "priya", name: "Priya Nair", rating: 4, status: "Approved", featured: false, quote: "Gorgeous earrings, exactly like the pictures. Delivery was quick and the return policy gave me peace of mind." },
  { id: "kavya", name: "Kavya Reddy", rating: 5, status: "Approved", featured: false, quote: "Bought this necklace for my anniversary and it is even more beautiful in person. The hallmark certification made me trust the purchase completely." },
];

export const seedReviews = [
  { id: "review-1", customer: "Aarohi Mehta", product: "Natural Diamond Daily Ring", rating: 5, status: "pending", text: "Lightweight and beautifully finished." },
  { id: "review-2", customer: "Priya Nair", product: "Natural Diamond Earrings", rating: 4, status: "approved", text: "Looks premium and arrived safely." },
];

export const seedBanners = [
  { id: "hero-main", title: "Hero full-screen banner", desktop: "1920 x 980 desktop", mobile: "1080 x 1440 mobile", note: "Image-only, auto slide", image: "/src/assets/real-products/ring-lifestyle.webp", active: true },
  { id: "collection-strip", title: "Collection carousel", desktop: "520 x 620 card", mobile: "2 cards on mobile", note: "Infinite smooth loop", image: "/src/assets/real-products/earrings-lifestyle.webp", active: true },
  { id: "campaign-wide", title: "Campaign banner carousel", desktop: "1680 x 610 wide", mobile: "86vw mobile", note: "No text overlay", image: "/src/assets/real-products/necklace-lifestyle.webp", active: true },
];

export const seedCollections = [
  { id: "rings", name: "Love Forever", subtitle: "Rings Collection", category: "Rings", count: "8 products", image: "/src/assets/real-products/ring.webp", tone: "cocoa", visible: true },
  { id: "earrings", name: "Mini Me", subtitle: "Earrings Collection", category: "Earrings", count: "8 products", image: "/src/assets/real-products/earrings.webp", tone: "emerald", visible: true },
  { id: "necklace", name: "Everyday Line", subtitle: "Necklace Collection", category: "Necklace", count: "8 products", image: "/src/assets/real-products/necklace.webp", tone: "sand", visible: true },
  { id: "pendant", name: "Petals", subtitle: "Pendant Collection", category: "Pendant", count: "8 products", image: "/src/assets/real-products/pendant.webp", tone: "blush", visible: true },
  { id: "bracelet", name: "Daily Stack", subtitle: "Bracelet Collection", category: "Bracelet", count: "8 products", image: "/src/assets/real-products/bracelet.webp", tone: "sage", visible: true },
  { id: "nosepins", name: "Nazaakat", subtitle: "Nosepins Collection", category: "Nosepins", count: "8 products", image: "/src/assets/real-products/nosepin.webp", tone: "marigold", visible: true },
];

export const seedSettings = {
  goldMode: "Auto (Live)",
  goldRate: "0",
  showGoldRate: false,
  announcement: "Certified Diamonds - Hallmarked Gold - Free Shipping Across India",
  upi: "7077596064@ybi",
  whatsapp: "",
  freeShippingThreshold: "1000",
  payments: { upi: true, card: true, netbanking: true, cod: true },
  gstGold: "3",
  tally: {
    enabled: false,
    endpoint: "",
    authHeader: "",
    authToken: "",
    companyName: "",
    voucherType: "Sales",
    salesLedger: "Sales",
    cgstLedger: "Output CGST",
    sgstLedger: "Output SGST",
    igstLedger: "Output IGST",
    roundOffLedger: "Round Off",
    shippingLedger: "Freight & Delivery",
    sellerState: "",
    hsnCode: "7113",
    pricesIncludeGst: true,
    autoSyncOnPaid: true,
    maxAttempts: 5,
  },
};

export function seedReels(catalogProducts = []) {
  return [
    { id: "daily-ring-story", title: "Diamonds are all you need...", productLabel: "Daily Ring Story", productId: catalogProducts[0]?.id || "aura", image: "/src/assets/real-products/ring-lifestyle.webp", videoUrl: "", active: true },
    { id: "office-sparkle", title: "Lightweight hoops in motion", productLabel: "Office Sparkle", productId: catalogProducts[1]?.id || "eternal", image: "/src/assets/real-products/earrings-lifestyle.webp", videoUrl: "", active: true },
    { id: "necklace-edit", title: "Your everyday necklace edit", productLabel: "Necklace Set", productId: catalogProducts[2]?.id || "emerald", image: "/src/assets/real-products/necklace-lifestyle.webp", videoUrl: "", active: true },
    { id: "pendant-glow", title: "Pendant glow for every day", productLabel: "Pendant Reel", productId: catalogProducts[3]?.id || "marquise", image: "/src/assets/real-products/pendant-lifestyle.webp", videoUrl: "", active: true },
    { id: "bracelet-stack", title: "Slim bracelet styling", productLabel: "Stack Story", productId: catalogProducts[4]?.id || "bracelet", image: "/src/assets/real-products/bracelet-lifestyle.webp", videoUrl: "", active: true },
  ];
}

export function seedHomepageProducts(catalogProducts = []) {
  return {
    trending: catalogProducts.slice(0, 4).map((product) => product.id),
    arrivals: catalogProducts.slice(2, 6).map((product) => product.id),
    featured: catalogProducts.slice(0, 4).map((product) => product.id),
  };
}
