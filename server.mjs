import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { catalogProducts } from "./src/catalogData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "db.json");
const port = Number(process.env.PORT || 5175);
const rupee = String.fromCharCode(8377);

const seedOrders = [
  { id: "ORD-178419250789", status: "Pending payment", statusKey: "pending", customer: "ghghghgh", phone: "+91 21321", address: "nvcgcd, bh, j - 3244, India", item: "Rose Gold Diamond Earrings", quantity: 1, total: `${rupee}18,003`, date: "15 Jul 2026, 06:10 pm", dateISO: "2026-07-15" },
  { id: "ORD-1783862406916", status: "Pending payment", statusKey: "pending", customer: "Test", phone: "+91 81405 16517", address: "Bsj, near Jsjs, Jsjesjsj, Jej - Jsjs, India", item: "Rose Gold Diamond Earrings", quantity: 1, total: `${rupee}17,803`, date: "12 Jul 2026, 06:50 pm", dateISO: "2026-07-12" },
  { id: "ORD-1783029108842", status: "Paid", statusKey: "paid", customer: "Priya Sharma", phone: "+91 98765 43210", address: "Bandra West, Mumbai - 400050, India", item: "Yellow Gold Diamond Bracelet", quantity: 1, total: `${rupee}34,819`, date: "10 Jul 2026, 02:25 pm", dateISO: "2026-07-10" },
  { id: "ORD-1782965401288", status: "Pending payment", statusKey: "pending", customer: "Nisha Rao", phone: "+91 99887 77665", address: "Indiranagar, Bengaluru - 560038, India", item: "Rose Gold Diamond Bracelet", quantity: 1, total: `${rupee}27,181`, date: "09 Jul 2026, 11:40 am", dateISO: "2026-07-09" },
  { id: "ORD-1782119085120", status: "Paid", statusKey: "paid", customer: "Kavya Iyer", phone: "+91 90909 12345", address: "T Nagar, Chennai - 600017, India", item: "Natural Diamond Nosepin", quantity: 1, total: `${rupee}28,500`, date: "06 Jul 2026, 08:18 pm", dateISO: "2026-07-06" },
  { id: "ORD-1781849921124", status: "Pending payment", statusKey: "pending", customer: "Aarohi Shah", phone: "+91 98222 44110", address: "Satellite, Ahmedabad - 380015, India", item: "Everyday Diamond Pendant", quantity: 1, total: `${rupee}82,000`, date: "04 Jul 2026, 05:04 pm", dateISO: "2026-07-04" },
  { id: "ORD-1781023304501", status: "Pending payment", statusKey: "pending", customer: "Ritika Shah", phone: "+91 91234 56780", address: "Koregaon Park, Pune - 411001, India", item: "Lightweight Diamond Necklace", quantity: 1, total: `${rupee}64,000`, date: "01 Jul 2026, 01:12 pm", dateISO: "2026-07-01" },
];

function seedDb() {
  return {
    products: catalogProducts,
    orders: seedOrders,
    coupons: [
      { id: "JB50", code: "JB50", type: "% off", value: "8", minOrder: "No minimum", expires: "2026-12-31", active: true },
      { id: "DAZZLING20", code: "DAZZLING20", type: "% off", value: "5", minOrder: "No minimum", expires: "2026-12-31", active: true },
      { id: "WELCOME20", code: "WELCOME20", type: `Flat ${rupee} off`, value: "200", minOrder: `${rupee}5,000`, expires: "2026-09-30", active: false },
    ],
    homepageSections: [
      { id: "hero", title: "Hero Banner Carousel", note: "Full-screen image-only slider", action: "Manage banners ->", visible: true },
      { id: "collections", title: "Collections Carousel", note: "Home collection cards - 1080 x 760 images", action: "Manage collections ->", visible: true },
      { id: "bestsellers", title: "Trending Now Products", note: "Product carousel shown after collections", action: "Choose products ->", visible: true },
      { id: "offer", title: "Campaign Banner Carousel", note: "Wide image-only promotional slider", action: "Manage banners ->", visible: true },
      { id: "arrivals", title: "New Arrivals Products", note: "Fresh drops product carousel", action: "Choose products ->", visible: true },
      { id: "reels", title: "Manosi in Motion Reels", note: "Video carousel with linked products", action: "Manage reels ->", visible: true },
      { id: "badges", title: "Manosi Promises", note: "Trust and service promise icons", action: "Edit promises ->", visible: true },
      { id: "testimonials", title: "Customer Testimonials", note: "Approved customer notes carousel", action: "Manage testimonials ->", visible: true },
      { id: "instagram", title: "Instagram Feed", note: "Social media post preview grid", action: "Manage posts ->", visible: true },
    ],
    testimonials: [
      { id: "aarohi", name: "Aarohi Mehta", rating: 5, status: "Approved", featured: true, quote: "The ring exceeded my expectations - the craftsmanship is stunning and it arrived beautifully packaged. Customer service was wonderful throughout." },
      { id: "priya", name: "Priya Nair", rating: 4, status: "Approved", featured: false, quote: "Gorgeous earrings, exactly like the pictures. Delivery was quick and the return policy gave me peace of mind." },
      { id: "kavya", name: "Kavya Reddy", rating: 5, status: "Approved", featured: false, quote: "Bought this necklace for my anniversary and it is even more beautiful in person. The hallmark certification made me trust the purchase completely." },
    ],
    reviews: [],
    banners: [
      { id: "hero-main", title: "Hero full-screen banner", desktop: "1920 x 980 desktop", mobile: "1080 x 1440 mobile", note: "Image-only, auto slide", image: "/src/assets/real-products/ring-lifestyle.webp", active: true },
      { id: "collection-strip", title: "Collection carousel", desktop: "520 x 620 card", mobile: "2 cards on mobile", note: "Infinite smooth loop", image: "/src/assets/real-products/earrings-lifestyle.webp", active: true },
      { id: "campaign-wide", title: "Campaign banner carousel", desktop: "1680 x 610 wide", mobile: "86vw mobile", note: "No text overlay", image: "/src/assets/real-products/necklace-lifestyle.webp", active: true },
    ],
    homepageProducts: {
      trending: catalogProducts.slice(0, 4).map((product) => product.id),
      arrivals: catalogProducts.slice(2, 6).map((product) => product.id),
      featured: catalogProducts.slice(0, 4).map((product) => product.id),
    },
    reels: [
      { id: "daily-ring-story", title: "Diamonds are all you need...", productLabel: "Daily Ring Story", productId: catalogProducts[0]?.id || "aura", image: "/src/assets/real-products/ring-lifestyle.webp", videoUrl: "", active: true },
      { id: "office-sparkle", title: "Lightweight hoops in motion", productLabel: "Office Sparkle", productId: catalogProducts[1]?.id || "eternal", image: "/src/assets/real-products/earrings-lifestyle.webp", videoUrl: "", active: true },
      { id: "necklace-edit", title: "Your everyday necklace edit", productLabel: "Necklace Set", productId: catalogProducts[2]?.id || "emerald", image: "/src/assets/real-products/necklace-lifestyle.webp", videoUrl: "", active: true },
      { id: "pendant-glow", title: "Pendant glow for every day", productLabel: "Pendant Reel", productId: catalogProducts[3]?.id || "marquise", image: "/src/assets/real-products/pendant-lifestyle.webp", videoUrl: "", active: true },
      { id: "bracelet-stack", title: "Slim bracelet styling", productLabel: "Stack Story", productId: catalogProducts[4]?.id || "bracelet", image: "/src/assets/real-products/bracelet-lifestyle.webp", videoUrl: "", active: true },
    ],
    collections: [
      { id: "bridal", name: "Bridal", count: "8 products", image: "/src/assets/real-products/necklace-lifestyle.webp", visible: true },
      { id: "everyday-light", name: "Everyday Light", count: "8 products", image: "/src/assets/real-products/earrings-lifestyle.webp", visible: true },
      { id: "gifting", name: "Gifting", count: "8 products", image: "/src/assets/real-products/bracelet-lifestyle.webp", visible: true },
    ],
    customers: [],
    settings: {
      goldMode: "Auto (Live)",
      goldRate: "0",
      showGoldRate: false,
      announcement: "Certified Diamonds - Hallmarked Gold - Free Shipping Across India",
      upi: "7077596064@ybi",
      freeShippingThreshold: "1000",
      payments: { upi: true, card: true, netbanking: true, cod: true },
      gstGold: "3",
    },
  };
}

async function readDb() {
  await mkdir(dataDir, { recursive: true });
  if (!existsSync(dbPath)) await writeDb(seedDb());
  const db = JSON.parse(await readFile(dbPath, "utf8"));
  const seed = seedDb();
  let changed = false;
  for (const [key, value] of Object.entries(seed)) {
    if (db[key] === undefined) {
      db[key] = value;
      changed = true;
    }
  }
  if (changed) await writeDb(db);
  return db;
}

async function writeDb(db) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
}

async function bodyJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function send(res, status, data) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  res.end(JSON.stringify(data));
}

function priceNumber(value) {
  return Number(String(value || "").replace(/[^0-9]/g, ""));
}

function priceFormat(value) {
  return `${rupee}${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;
}

function applyPatch(list, id, patch) {
  return list.map((item) => String(item.id) === String(id) ? { ...item, ...patch } : item);
}

createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true });
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (!url.pathname.startsWith("/api")) return send(res, 404, { error: "Not found" });
    const db = await readDb();

    if (req.method === "GET" && url.pathname === "/api/admin") return send(res, 200, db);

    if (req.method === "PATCH" && url.pathname.startsWith("/api/orders/")) {
      const id = decodeURIComponent(url.pathname.split("/").pop());
      db.orders = applyPatch(db.orders, id, await bodyJson(req));
      await writeDb(db);
      return send(res, 200, db);
    }

    if (req.method === "POST" && url.pathname === "/api/products") {
      const product = await bodyJson(req);
      db.products = [{ ...product, id: product.id || `manual-${Date.now()}` }, ...db.products];
      await writeDb(db);
      return send(res, 200, db);
    }

    if (req.method === "POST" && url.pathname === "/api/products/bulk-upload") {
      const { products = [] } = await bodyJson(req);
      const existingBySku = new Map(db.products.map((product, index) => [String(product.sku || product.id || index).toLowerCase(), { product, index }]));
      let added = 0;
      let updated = 0;
      for (const item of products) {
        if (!item?.name) continue;
        const key = String(item.sku || item.id || item.name).toLowerCase();
        const nextProduct = { ...item, id: item.id || item.sku?.toLowerCase() || `bulk-${Date.now()}-${added}` };
        if (existingBySku.has(key)) {
          const { product, index } = existingBySku.get(key);
          db.products[index] = { ...product, ...nextProduct, id: product.id };
          updated += 1;
        } else {
          db.products.unshift(nextProduct);
          added += 1;
        }
      }
      await writeDb(db);
      return send(res, 200, { ...db, importSummary: { added, updated } });
    }

    if (req.method === "POST" && url.pathname === "/api/products/bulk-price") {
      const { category, direction, mode, value } = await bodyJson(req);
      const amount = Number(value || 0);
      db.products = db.products.map((product) => {
        const label = { Bracelet: "Bracelets", Necklace: "Necklaces", Pendant: "Pendants", Nosepins: "Nose Pins" }[product.category] || product.category;
        if (category !== "All categories" && label !== category) return product;
        const current = priceNumber(product.price);
        const delta = mode === "percent" ? current * (amount / 100) : amount;
        const next = direction === "increase" ? current + delta : current - delta;
        return { ...product, price: priceFormat(next), salePrice: priceFormat(next) };
      });
      await writeDb(db);
      return send(res, 200, db);
    }

    if (req.method === "PATCH" && url.pathname.startsWith("/api/products/")) {
      const id = decodeURIComponent(url.pathname.split("/").pop());
      db.products = applyPatch(db.products, id, await bodyJson(req));
      await writeDb(db);
      return send(res, 200, db);
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/api/products/")) {
      const id = decodeURIComponent(url.pathname.split("/").pop());
      db.products = db.products.filter((product) => String(product.id) !== String(id));
      await writeDb(db);
      return send(res, 200, db);
    }

    const collectionMap = {
      "/api/coupons": "coupons",
      "/api/homepage": "homepageSections",
      "/api/homepage-products": "homepageProducts",
      "/api/reels": "reels",
      "/api/testimonials": "testimonials",
      "/api/reviews": "reviews",
      "/api/banners": "banners",
      "/api/collections": "collections",
      "/api/customers": "customers",
      "/api/settings": "settings",
    };

    if ((req.method === "PUT" || req.method === "PATCH") && collectionMap[url.pathname]) {
      db[collectionMap[url.pathname]] = await bodyJson(req);
      await writeDb(db);
      return send(res, 200, db);
    }

    return send(res, 404, { error: "Route not found" });
  } catch (error) {
    return send(res, 500, { error: error.message });
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Manosi admin API running at http://127.0.0.1:${port}`);
});
