import { useEffect, useMemo, useState } from "react";
import { catalogProducts } from "./catalogData";
import { publicAssetUrl, withCloudinaryImages } from "./cloudinary";

const sampleProducts = [
  {
    id: "aura",
    name: "Natural Diamond Daily Ring",
    category: "Rings",
    price: "₹42,500",
    image: "/src/assets/real-products/ring.webp",
    lifestyle: "/src/assets/real-products/ring-lifestyle.webp",
    detail:
      "A lightweight natural diamond ring designed for office, brunch, and everyday Indian styling.",
    specs: ["Natural diamonds", "18k yellow gold", "Lightweight band", "Daily comfort fit"],
  },
  {
    id: "eternal",
    name: "Natural Diamond Earrings",
    category: "Earrings",
    price: "₹58,000",
    image: "/src/assets/real-products/earrings.webp",
    lifestyle: "/src/assets/real-products/earrings-lifestyle.webp",
    detail:
      "Small diamond hoops with soft sparkle, made for regular wear without feeling heavy.",
    specs: ["Pair set", "Natural diamonds", "Secure clasp", "Lightweight profile"],
  },
  {
    id: "emerald",
    name: "Lightweight Diamond Necklace",
    category: "Necklace",
    price: "₹64,000",
    image: "/src/assets/real-products/necklace.webp",
    lifestyle: "/src/assets/real-products/necklace-lifestyle.webp",
    detail:
      "A delicate natural diamond necklace that sits lightly and pairs with Indian or western wear.",
    specs: ["Natural diamonds", "Lightweight chain", "Everyday length", "Office friendly"],
  },
  {
    id: "marquise",
    name: "Everyday Diamond Pendant",
    category: "Pendant",
    price: "₹82,000",
    image: "/src/assets/real-products/pendant.webp",
    lifestyle: "/src/assets/real-products/pendant-lifestyle.webp",
    detail:
      "A minimal diamond pendant with a refined everyday shape and soft sparkle.",
    specs: ["Natural diamonds", "Light pendant", "Fine gold chain", "Regular wear"],
  },
  {
    id: "bracelet",
    name: "Slim Diamond Bracelet",
    category: "Bracelet",
    price: "₹74,000",
    image: "/src/assets/real-products/bracelet.webp",
    lifestyle: "/src/assets/real-products/bracelet-lifestyle.webp",
    detail:
      "A slim natural diamond bracelet that layers easily with a watch, kada, or daily gold bangle.",
    specs: ["Natural diamonds", "Slim line", "Secure clasp", "Easy stack styling"],
  },
  {
    id: "bands",
    name: "Natural Diamond Nosepin",
    category: "Nosepins",
    price: "₹28,500",
    image: "/src/assets/real-products/nosepin.webp",
    lifestyle: "/src/assets/real-products/nosepin-lifestyle.webp",
    detail:
      "A tiny natural diamond nosepin with a light profile for daily Indian wear.",
    specs: ["Natural diamond", "Lightweight profile", "Daily wear", "Indian styling"],
  },
];

const products = (catalogProducts.length ? catalogProducts : sampleProducts).map(withCloudinaryImages);
const categoryFeature = (category, fallbackIndex) => products.find((product) => product.category === category) || sampleProducts[fallbackIndex];
const categoryFallbackImages = {
  Rings: "/src/assets/real-products/ring.webp",
  Earrings: "/src/assets/real-products/earrings.webp",
  Necklace: "/src/assets/real-products/necklace.webp",
  Pendant: "/src/assets/real-products/pendant.webp",
  Bracelet: "/src/assets/real-products/bracelet.webp",
  Nosepins: "/src/assets/real-products/nosepin.webp",
};

const categoryLifestyleFallbackImages = {
  Rings: "/src/assets/real-products/ring-lifestyle.webp",
  Earrings: "/src/assets/real-products/earrings-lifestyle.webp",
  Necklace: "/src/assets/real-products/necklace-lifestyle.webp",
  Pendant: "/src/assets/real-products/pendant-lifestyle.webp",
  Bracelet: "/src/assets/real-products/bracelet-lifestyle.webp",
  Nosepins: "/src/assets/real-products/nosepin-lifestyle.webp",
};

function imageFallbackFor(product, lifestyle = false) {
  const category = product?.category || "Rings";
  return (lifestyle ? categoryLifestyleFallbackImages[category] : categoryFallbackImages[category]) || categoryFallbackImages.Rings;
}

function setImageFallback(event, fallback) {
  if (event.currentTarget.dataset.fallbackApplied) return;
  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.src = imageUrl(fallback);
}

function imageUrl(url) {
  return publicAssetUrl(url);
}

const pages = [
  ["home", "HOME"],
  ["collections", "COLLECTIONS"],
  ["new-arrivals", "NEW ARRIVALS"],
  ["education", "4CS GUIDE"],
  ["bespoke", "BESPOKE"],
  ["concierge", "CONCIERGE"],
];

const categories = ["All", "Rings", "Earrings", "Necklace", "Pendant", "Bracelet", "Nosepins"];

const menuCategories = ["Rings", "Earrings", "Necklace", "Pendant", "Bracelet", "Nosepins"];

function defaultShopBannerImage(category) {
  const lookupCategory = category === "All" ? "Necklace" : category;
  return imageFallbackFor(categoryFeature(lookupCategory, 2), true);
}

function shopBannerImage(category, categoryBanners = {}) {
  return categoryBanners?.[category] || defaultShopBannerImage(category);
}

function cleanPrice(value) {
  const digits = String(value || "").replace(/[^0-9]/g, "");
  return digits ? `₹${Number(digits).toLocaleString("en-IN")}` : "Price on request";
}

function numericPrice(value) {
  return Number(String(value || "").replace(/[^0-9]/g, "")) || 0;
}

function productMetal(product) {
  return product.goldColour || (product.detail || "").match(/(Rose Gold|Yellow Gold|White Gold)/i)?.[0] || "Natural Gold";
}

function productKarat(product) {
  return product.goldKarat || (product.detail || "").match(/\b(14KT|18KT|22KT|14K|18K|22K)\b/i)?.[0] || "14KT";
}

function deliveryText(product) {
  return product.inStock === false ? "Made to order" : "Ships in 48 hrs";
}

const testimonials = [
  {
    quote: "The earrings feel light enough for office, but still polished for dinner. I finally found diamonds I can wear four days a week.",
    person: "Ananya Mehta",
    date: "January 8, 2026",
  },
  {
    quote: "My pendant works with kurtas, shirts, and sarees without feeling too dressy. The sparkle is subtle in the best way.",
    person: "Ritika Shah",
    date: "February 2, 2026",
  },
  {
    quote: "I wanted natural diamonds for regular wear, not only weddings. Manosi made the choice feel simple and modern.",
    person: "Nisha Rao",
    date: "February 18, 2026",
  },
  {
    quote: "The bracelet is slim, comfortable, and easy to layer with my watch. It feels like everyday luxury.",
    person: "Kavya Iyer",
    date: "March 4, 2026",
  },
  {
    quote: "Their styling notes helped me choose a ring that feels personal, Indian, and still very light on the hand.",
    person: "Meera Doshi",
    date: "March 21, 2026",
  },
  {
    quote: "The nosepin is tiny but beautifully finished. I wanted something refined for daily wear, and this is exactly that.",
    person: "Priya Nair",
    date: "April 6, 2026",
  },
];

const promiseItems = [
  ["diamond", "Certified natural diamonds", "Every piece is selected for real, wearable sparkle."],
  ["workspace_premium", "BIS hallmarked gold", "Clear purity standards for daily confidence."],
  ["sync_alt", "Lifetime exchange", "A practical promise for jewellery you keep close."],
  ["assignment_return", "Easy 30-day return", "Simple support if the piece is not quite right."],
  ["local_shipping", "Secure shipping", "Careful packing for fine jewellery deliveries."],
  ["inventory_2", "Manosi quality check", "Finished, inspected, and prepared before dispatch."],
];

const instagramPosts = [
  ["Daily ring stack", "Office-ready natural diamond rings", products[0]],
  ["Soft hoop sparkle", "Light earrings for regular wear", products[1]],
  ["Kurta pairing", "Minimal necklace styling", products[2]],
  ["Pendant detail", "Tiny diamonds, easy polish", products[3]],
  ["Bracelet layer", "Slim shine with watches", products[4]],
  ["Nosepin note", "Indian daily-wear detail", products[5]],
];

const dummyOrders = [
  ["MD-1024", "Aarohi Shah", "Natural Diamond Earrings", "Paid", "Mumbai", "₹58,000"],
  ["MD-1025", "Neha Kapoor", "Slim Diamond Bracelet", "Pending", "Delhi", "₹74,000"],
  ["MD-1026", "Isha Mehta", "Everyday Diamond Pendant", "Packed", "Ahmedabad", "₹82,000"],
  ["MD-1027", "Riya Nair", "Natural Diamond Nosepin", "Delivered", "Bengaluru", "₹28,500"],
];

const dummyCustomers = [
  ["Priya Sharma", "Mumbai", "High intent", "Wishlist: 3"],
  ["Kavya Iyer", "Chennai", "Repeat buyer", "Orders: 2"],
  ["Ananya Mehta", "Pune", "Concierge lead", "Budget: ₹75k"],
];

const dummyBanners = [
  ["Hero carousel", "3 live banners", "Auto-slide active"],
  ["Collections strip", "6 categories", "Rings leading"],
  ["Campaign carousel", "3 banners", "Image-only mode"],
];

const dummyPromotions = [
  ["MANOSI10", "10% styling appointment benefit", "Active"],
  ["FREESHIP", "Free insured shipping", "Active"],
  ["DIAMONDCARE", "Complimentary cleaning note", "Draft"],
];

function priceToNumber(price) {
  return Number(price.replace(/[^0-9]/g, ""));
}

function IconButton({ label, onClick, active }) {
  return (
    <button className={`icon-button ${active ? "is-active" : ""}`} onClick={onClick} aria-label={label}>
      <span className="material-symbols-rounded">{label}</span>
    </button>
  );
}

function PageHero({ eyebrow, title, copy, image, dark = false }) {
  return (
    <section className={`page-hero ${dark ? "dark" : ""}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      {image && (
        <figure>
          <img src={imageUrl(image)} alt={title} />
        </figure>
      )}
    </section>
  );
}

function ProductCard({ product, favorite, onFavorite, onOpen }) {
  return (
    <article className="product-card">
      <button className="favorite" onClick={() => onFavorite(product.id)} aria-label={`Favorite ${product.name}`}>
        <span className="material-symbols-rounded">{favorite ? "favorite" : "favorite"}</span>
      </button>
      <span className="product-badge">{deliveryText(product)}</span>
      <button className="product-image-button" onClick={() => onOpen(product)}>
        <img src={imageUrl(product.image)} alt={product.name} onError={(event) => setImageFallback(event, imageFallbackFor(product))} />
      </button>
      <p>{product.category} · {productMetal(product)}</p>
      <h4>{product.name}</h4>
      <div className="product-tags">
        <span>{productKarat(product)}</span>
        <span>Natural diamonds</span>
      </div>
      <div className="product-meta">
        <span>{cleanPrice(product.salePrice || product.price)}</span>
        <button onClick={() => onOpen(product)}>DETAILS</button>
      </div>
    </article>
  );
}

function pickProductsByIds(ids, fallbackProducts) {
  const selected = (ids || [])
    .map((id) => products.find((product) => product.id === id || product.sku === id))
    .filter(Boolean);
  return selected.length ? selected : fallbackProducts;
}

function HomePage({ setPage, openProduct, openCategory, homepageProducts, homepageReels, homepageCollections }) {
  const ringFeature = categoryFeature("Rings", 0);
  const earringFeature = categoryFeature("Earrings", 1);
  const necklaceFeature = categoryFeature("Necklace", 2);
  const pendantFeature = categoryFeature("Pendant", 3);
  const braceletFeature = categoryFeature("Bracelet", 4);
  const nosepinFeature = categoryFeature("Nosepins", 5);
  const heroSlides = [
    imageFallbackFor(ringFeature, true),
    imageFallbackFor(necklaceFeature, true),
    imageFallbackFor(braceletFeature, true),
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const [motionMuted, setMotionMuted] = useState(true);

  const defaultCollectionCards = [
    {
      title: "Love Forever",
      subtitle: "Rings Collection",
      category: "Rings",
      image: imageFallbackFor(ringFeature),
      tone: "cocoa",
    },
    {
      title: "Mini Me",
      subtitle: "Earrings Collection",
      category: "Earrings",
      image: imageFallbackFor(earringFeature),
      tone: "emerald",
    },
    {
      title: "Everyday Line",
      subtitle: "Necklace Collection",
      category: "Necklace",
      image: imageFallbackFor(necklaceFeature),
      tone: "sand",
    },
    {
      title: "Petals",
      subtitle: "Pendant Collection",
      category: "Pendant",
      image: imageFallbackFor(pendantFeature),
      tone: "blush",
    },
    {
      title: "Daily Stack",
      subtitle: "Bracelet Collection",
      category: "Bracelet",
      image: imageFallbackFor(braceletFeature),
      tone: "sage",
    },
    {
      title: "Nazaakat",
      subtitle: "Nosepins Collection",
      category: "Nosepins",
      image: imageFallbackFor(nosepinFeature),
      tone: "marigold",
    },
  ];
  const collectionToneList = ["cocoa", "emerald", "sand", "blush", "sage", "marigold"];
  const configuredCollectionCards = (homepageCollections || [])
    .filter((collection) => collection.visible !== false)
    .map((collection, index) => {
      const category = collection.category || (menuCategories.includes(collection.name) ? collection.name : "All");
      const feature = categoryFeature(category, index % sampleProducts.length);
      return {
        title: collection.title || collection.name || feature.category,
        subtitle: collection.subtitle || `${category === "All" ? collection.name || "Shop" : category} Collection`,
        category,
        image: collection.image || imageFallbackFor(feature),
        tone: collection.tone || collectionToneList[index % collectionToneList.length],
      };
    });
  const collectionCards = configuredCollectionCards.length ? configuredCollectionCards : defaultCollectionCards;
  const trendingProducts = pickProductsByIds(homepageProducts?.trending, products.slice(0, 4));
  const [collectionSlide, setCollectionSlide] = useState(collectionCards.length);
  const [collectionSnap, setCollectionSnap] = useState(false);
  const [trendingSlide, setTrendingSlide] = useState(trendingProducts.length);
  const [trendingSnap, setTrendingSnap] = useState(false);
  const collectionLoopCards = [...collectionCards, ...collectionCards, ...collectionCards];
  const trendingLoopProducts = [...trendingProducts, ...trendingProducts, ...trendingProducts];
  const activeCollectionDot = ((collectionSlide % collectionCards.length) + collectionCards.length) % collectionCards.length;
  const activeTrendingDot = ((trendingSlide % trendingProducts.length) + trendingProducts.length) % trendingProducts.length;
  const arrivalProducts = pickProductsByIds(homepageProducts?.arrivals, products.slice(2, 6));
  const [arrivalSlide, setArrivalSlide] = useState(arrivalProducts.length);
  const [arrivalSnap, setArrivalSnap] = useState(false);
  const arrivalLoopProducts = [...arrivalProducts, ...arrivalProducts, ...arrivalProducts];
  const activeArrivalDot = ((arrivalSlide % arrivalProducts.length) + arrivalProducts.length) % arrivalProducts.length;
  const fallbackMotionReels = [
    { id: "daily-ring-story", product: ringFeature, videoUrl: "", poster: imageFallbackFor(ringFeature, true) },
    { id: "office-sparkle", product: earringFeature, videoUrl: "", poster: imageFallbackFor(earringFeature, true) },
    { id: "necklace-edit", product: necklaceFeature, videoUrl: "", poster: imageFallbackFor(necklaceFeature, true) },
    { id: "pendant-glow", product: pendantFeature, videoUrl: "", poster: imageFallbackFor(pendantFeature, true) },
    { id: "bracelet-stack", product: braceletFeature, videoUrl: "", poster: imageFallbackFor(braceletFeature, true) },
  ];
  const configuredMotionReels = (homepageReels || [])
    .filter((reel) => reel.active !== false)
    .map((reel) => {
      const product = products.find((item) => item.id === reel.productId || item.sku === reel.productId) || ringFeature;
      return {
        id: reel.id || product.id,
        product,
        videoUrl: reel.videoUrl || "",
        poster: imageFallbackFor(product, true),
      };
    });
  const motionReels = configuredMotionReels.length ? configuredMotionReels : fallbackMotionReels;
  const [motionSlide, setMotionSlide] = useState(0);

  const promoSlides = [
    {
      eyebrow: "MANOSI PRESENTS",
      title: "Floral Bloom",
      copy: "Lightweight diamond pieces inspired by soft petals and everyday Indian elegance.",
      category: "Pendant",
      image: imageFallbackFor(products[3], true),
      tone: "sunset",
    },
    {
      eyebrow: "DAILY DIAMONDS",
      title: "Office to Evening",
      copy: "Rings, earrings and necklaces made to move through your whole day.",
      category: "Rings",
      image: imageFallbackFor(products[0], true),
      tone: "ivory",
    },
    {
      eyebrow: "LIGHTWEIGHT EDIT",
      title: "Modern Indian Wear",
      copy: "Natural diamonds that pair with kurtas, shirts, sarees and dresses.",
      category: "Necklace",
      image: imageFallbackFor(products[2], true),
      tone: "rose",
    },
  ];
  const [promoSlide, setPromoSlide] = useState(promoSlides.length);
  const [promoSnap, setPromoSnap] = useState(false);
  const promoLoopSlides = [...promoSlides, ...promoSlides, ...promoSlides];
  const activePromoDot = ((promoSlide % promoSlides.length) + promoSlides.length) % promoSlides.length;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  function changeSlide(direction) {
    setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  }

  function moveCollection(direction) {
    setCollectionSlide((current) => current + direction);
  }

  function moveTrending(direction) {
    setTrendingSlide((current) => current + direction);
  }

  function moveArrival(direction) {
    setArrivalSlide((current) => current + direction);
  }

  function moveMotion(direction) {
    setMotionSlide((current) => (current + direction + motionReels.length) % motionReels.length);
  }

  function maximizeMotion(videoId) {
    const video = document.getElementById(videoId);
    if (video?.requestFullscreen) video.requestFullscreen();
  }

  function movePromo(direction) {
    setPromoSlide((current) => current + direction);
  }

  function handleCollectionTransitionEnd() {
    if (collectionSlide >= collectionCards.length * 2 || collectionSlide < collectionCards.length) {
      setCollectionSnap(true);
      setCollectionSlide(activeCollectionDot + collectionCards.length);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setCollectionSnap(false));
      });
    }
  }

  function handleTrendingTransitionEnd() {
    if (trendingSlide >= trendingProducts.length * 2 || trendingSlide < trendingProducts.length) {
      setTrendingSnap(true);
      setTrendingSlide(activeTrendingDot + trendingProducts.length);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setTrendingSnap(false));
      });
    }
  }

  function handleArrivalTransitionEnd() {
    if (arrivalSlide >= arrivalProducts.length * 2 || arrivalSlide < arrivalProducts.length) {
      setArrivalSnap(true);
      setArrivalSlide(activeArrivalDot + arrivalProducts.length);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setArrivalSnap(false));
      });
    }
  }

  function handlePromoTransitionEnd() {
    if (promoSlide >= promoSlides.length * 2 || promoSlide < promoSlides.length) {
      setPromoSnap(true);
      setPromoSlide(activePromoDot + promoSlides.length);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setPromoSnap(false));
      });
    }
  }

  return (
    <>
      <section className="hero hero-banner" aria-label="Featured Manosi banner carousel">
        {heroSlides.map((slide, index) => (
          <img
            className={`hero-slide ${activeSlide === index ? "is-active" : ""}`}
            key={slide}
            src={slide}
            alt=""
            aria-hidden={activeSlide !== index}
          />
        ))}
        <div className="hero-carousel-controls" aria-label="Banner controls">
          <button onClick={() => changeSlide(-1)} aria-label="Previous banner">
            <span className="material-symbols-rounded">west</span>
          </button>
          <div className="hero-dots">
            {heroSlides.map((slide, index) => (
              <button
                className={activeSlide === index ? "is-active" : ""}
                key={slide}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show banner ${index + 1}`}
              />
            ))}
          </div>
          <button onClick={() => changeSlide(1)} aria-label="Next banner">
            <span className="material-symbols-rounded">east</span>
          </button>
        </div>
      </section>

      <section className="collection-showcase">
        <div className="collection-title">
          <span />
          <h3>Collections</h3>
          <span />
        </div>
        <div className="collection-carousel">
          <button className="collection-nav prev" onClick={() => moveCollection(-1)} aria-label="Previous collections">
            <span className="material-symbols-rounded">west</span>
          </button>
          <div className="collection-window">
            <div
              className={`collection-track ${collectionSnap ? "is-snapping" : ""}`}
              style={{ "--collection-index": collectionSlide }}
              onTransitionEnd={handleCollectionTransitionEnd}
            >
              {collectionLoopCards.map((card, index) => (
                <article className={`collection-card ${card.tone}`} key={`${card.category}-${index}`}>
                  <div className="collection-copy">
                    <h4>{card.title}</h4>
                    <p>{card.subtitle}</p>
                  </div>
                  <img src={imageUrl(card.image)} alt={card.subtitle} onError={(event) => setImageFallback(event, categoryFallbackImages[card.category] || categoryFallbackImages.Rings)} />
                  <button onClick={() => openCategory(card.category)}>Shop Now</button>
                </article>
              ))}
            </div>
          </div>
          <button className="collection-nav next" onClick={() => moveCollection(1)} aria-label="Next collections">
            <span className="material-symbols-rounded">east</span>
          </button>
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Bestsellers</p>
            <h3>Trending Now</h3>
          </div>
          <button className="text-link" onClick={() => setPage("collections")}>View all pieces</button>
        </div>
        <div className="trending-carousel">
          <button className="trending-nav prev" onClick={() => moveTrending(-1)} aria-label="Previous trending products">
            <span className="material-symbols-rounded">west</span>
          </button>
          <div className="trending-window">
            <div
              className={`product-grid trending-grid ${trendingSnap ? "is-snapping" : ""}`}
              style={{ "--trending-index": trendingSlide }}
              onTransitionEnd={handleTrendingTransitionEnd}
            >
              {trendingLoopProducts.map((product, index) => (
                <ProductCard key={`${product.id}-${index}`} product={product} onOpen={openProduct} onFavorite={() => {}} />
              ))}
            </div>
          </div>
          <button className="trending-nav next" onClick={() => moveTrending(1)} aria-label="Next trending products">
            <span className="material-symbols-rounded">east</span>
          </button>
        </div>
      </section>

      <section className="promo-carousel-section">
        <div className="promo-carousel">
          <button className="promo-nav prev" onClick={() => movePromo(-1)} aria-label="Previous campaign banner">
            <span className="material-symbols-rounded">west</span>
          </button>
          <div className="promo-window">
            <div
              className={`promo-track ${promoSnap ? "is-snapping" : ""}`}
              style={{ "--promo-index": promoSlide }}
              onTransitionEnd={handlePromoTransitionEnd}
            >
              {promoLoopSlides.map((slide, index) => (
                <article className={`promo-slide ${slide.tone}`} key={`${slide.title}-${index}`}>
                  <button className="promo-image-button" onClick={() => openCategory(slide.category)} aria-label={`Shop ${slide.category}`}>
                    <img src={imageUrl(slide.image)} alt="" onError={(event) => setImageFallback(event, imageFallbackFor({ category: slide.category }, true))} />
                  </button>
                </article>
              ))}
            </div>
          </div>
          <button className="promo-nav next" onClick={() => movePromo(1)} aria-label="Next campaign banner">
            <span className="material-symbols-rounded">east</span>
          </button>
        </div>
        <div className="promo-dots">
          {promoSlides.map((slide, index) => (
            <button
              className={activePromoDot === index ? "is-active" : ""}
              key={slide.title}
              onClick={() => setPromoSlide(index + promoSlides.length)}
              aria-label={`Show campaign ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="new-arrivals-home">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Fresh Drops</p>
            <h3>New Arrivals</h3>
          </div>
          <button className="text-link" onClick={() => setPage("new-arrivals")}>View the edit</button>
        </div>
        <div className="arrival-carousel">
          <button className="arrival-nav prev" onClick={() => moveArrival(-1)} aria-label="Previous new arrivals">
            <span className="material-symbols-rounded">west</span>
          </button>
          <div className="arrival-window">
            <div
              className={`arrival-track ${arrivalSnap ? "is-snapping" : ""}`}
              style={{ "--arrival-index": arrivalSlide }}
              onTransitionEnd={handleArrivalTransitionEnd}
            >
              {arrivalLoopProducts.map((product, index) => (
                <ProductCard key={`${product.id}-arrival-${index}`} product={product} onOpen={openProduct} onFavorite={() => {}} />
              ))}
            </div>
          </div>
          <button className="arrival-nav next" onClick={() => moveArrival(1)} aria-label="Next new arrivals">
            <span className="material-symbols-rounded">east</span>
          </button>
        </div>
      </section>

      <section className="motion">
        <div className="motion-heading">
          <p className="eyebrow">Live brilliance</p>
          <h3>Manosi in Motion</h3>
        </div>
        <div className="motion-stage">
          <button className="motion-nav prev" onClick={() => moveMotion(-1)} aria-label="Previous video">
            <span className="material-symbols-rounded">chevron_left</span>
          </button>
          <div className="motion-stack">
            {motionReels.map((reel, index) => {
              const offset = (index - motionSlide + motionReels.length) % motionReels.length;
              const position = offset === 0 ? "is-active" : offset === 1 ? "is-next" : offset === 2 ? "is-far-next" : offset === motionReels.length - 1 ? "is-prev" : "is-far-prev";
              const videoId = `motion-video-${reel.id}-${index}`;

              return (
                <article className={`motion-reel ${position}`} key={`${reel.id}-${index}`} onClick={() => setMotionSlide(index)}>
                  {reel.videoUrl ? (
                    <video id={videoId} src={reel.videoUrl} poster={imageUrl(reel.poster)} autoPlay={position === "is-active"} muted={motionMuted} loop playsInline />
                  ) : (
                    <img src={imageUrl(reel.poster)} alt="" onError={(event) => setImageFallback(event, imageFallbackFor(reel.product, true))} />
                  )}
                  <button className="motion-product-link" onClick={(event) => { event.stopPropagation(); openProduct(reel.product); }} aria-label={`Open ${reel.product.name}`} />
                  <button className="motion-product" onClick={(event) => { event.stopPropagation(); openProduct(reel.product); }}>
                    <img src={imageUrl(reel.product.image)} alt="" onError={(event) => setImageFallback(event, imageFallbackFor(reel.product))} />
                    <span>{reel.product.name}</span>
                    <span className="material-symbols-rounded">chevron_right</span>
                  </button>
                  <div className="motion-controls">
                    <button onClick={(event) => { event.stopPropagation(); setMotionMuted((current) => !current); }} aria-label={motionMuted ? "Unmute video" : "Mute video"}>
                      <span className="material-symbols-rounded">{motionMuted ? "volume_off" : "volume_up"}</span>
                    </button>
                    <button onClick={(event) => { event.stopPropagation(); maximizeMotion(videoId); }} aria-label="Maximize video">
                      <span className="material-symbols-rounded">fullscreen</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <button className="motion-nav next" onClick={() => moveMotion(1)} aria-label="Next video">
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
        </div>
      </section>

      <section className="promise-section">
        <div className="promise-sparkle" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="promise-heading">
          <p>Manosi</p>
          <h3>Promises</h3>
        </div>
        <div className="promise-cloud">
          {promiseItems.map(([icon, label, copy], index) => (
            <article className={`promise-item promise-${index + 1}`} key={label}>
              <div className="promise-icon">
                <span className="material-symbols-rounded">{icon}</span>
              </div>
              <h4>{label}</h4>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <Testimonials />

      <section className="guide-home">
        <div className="guide-copy">
          <p className="eyebrow">Mastery</p>
          <h3>Natural diamonds, clearly explained</h3>
          <p>
            Understand cut, clarity, color, and carat in simple language before choosing jewellery you will actually wear often.
          </p>
          <button onClick={() => setPage("education")}>VIEW THE GUIDE</button>
        </div>
        <div className="guide-grid">
          {[
            ["Cut", "Brightness that shows even in small daily-wear diamonds."],
            ["Clarity", "Clean sparkle selected for close-up everyday wear."],
            ["Color", "Warm, wearable diamonds balanced with Indian gold tones."],
            ["Carat", "Right-sized diamonds that stay light and comfortable."],
          ].map(([title, copy]) => (
            <article key={title}>
              <h5>{title}</h5>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <InstagramSection />
    </>
  );
}

function CollectionsPage({ favorites, toggleFavorite, openProduct, initialCategory, categoryBanners }) {
  const [category, setCategory] = useState(initialCategory || "All");
  const [metal, setMetal] = useState("All metals");
  const [karat, setKarat] = useState("All karats");
  const [maxPrice, setMaxPrice] = useState(125000);
  const [sort, setSort] = useState("Featured");
  useEffect(() => {
    setCategory(initialCategory || "All");
  }, [initialCategory]);
  const categoryOptions = categories.filter((item) => item !== "All");
  const metalOptions = [...new Set(products.map(productMetal))];
  const karatOptions = [...new Set(products.map(productKarat))];
  const maxCatalogPrice = Math.max(125000, ...products.map((product) => numericPrice(product.salePrice || product.price)));
  const priceStep = 5000;
  const visible = useMemo(() => {
    const filtered = products.filter((product) => {
      const price = numericPrice(product.salePrice || product.price);
      const matchesCategory = category === "All" || product.category === category;
      const matchesMetal = metal === "All metals" || productMetal(product) === metal;
      const matchesKarat = karat === "All karats" || productKarat(product) === karat;
      const matchesPrice = price <= maxPrice;
      return matchesCategory && matchesMetal && matchesKarat && matchesPrice;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Price low to high") return numericPrice(a.salePrice || a.price) - numericPrice(b.salePrice || b.price);
      if (sort === "Price high to low") return numericPrice(b.salePrice || b.price) - numericPrice(a.salePrice || a.price);
      if (sort === "Newest") return String(b.sku || b.id).localeCompare(String(a.sku || a.id));
      return Number(b.featured || 0) - Number(a.featured || 0);
    });
  }, [category, metal, karat, maxPrice, sort]);

  return (
    <>
      <section className="shop-banner" aria-label={`${category === "All" ? "All Jewellery" : category} banner`}>
        <img
          src={shopBannerImage(category, categoryBanners)}
          alt=""
          onError={(event) => setImageFallback(event, defaultShopBannerImage(category))}
        />
      </section>
      <section className="catalog-layout">
        <aside className="filter-panel">
          <div>
            <p className="eyebrow">Filter</p>
            <h4>Find your piece</h4>
          </div>
          <div className="filter-group">
            <span>Category</span>
            <div className="filter-inline filter-inline-categories">
            {categoryOptions.map((item) => (
              <label className="filter-check" key={item}>
                <input type="checkbox" checked={category === item} onChange={() => setCategory(category === item ? "All" : item)} />
                <span>{item}</span>
              </label>
            ))}
            </div>
          </div>
          <div className="filter-group filter-metal-group">
            <span>Metal</span>
            <div className="metal-swatches">
            {metalOptions.map((item) => (
              <label className="metal-option" key={item}>
                <input type="checkbox" checked={metal === item} onChange={() => setMetal(metal === item ? "All metals" : item)} />
                <i className={`metal-dot metal-${item.toLowerCase().replace(/\s+/g, "-")}`} />
                <span>{item}</span>
              </label>
            ))}
            </div>
          </div>
          <div className="filter-group filter-karat-group">
            <span>Karat</span>
            <div className="karat-chips">
            {karatOptions.map((item) => (
              <label className="karat-option" key={item}>
                <input type="checkbox" checked={karat === item} onChange={() => setKarat(karat === item ? "All karats" : item)} />
                <span>{item.replace("KT", "K")}</span>
              </label>
            ))}
            </div>
          </div>
          <div className="filter-group price-slider-group">
            <span>Price</span>
            <div className="price-readout">
              <b>Up to {cleanPrice(maxPrice)}</b>
              <small>Drag to set budget</small>
            </div>
            <input type="range" min="10000" max={maxCatalogPrice} step={priceStep} value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
            <div className="price-scale"><span>₹10k</span><span>{cleanPrice(maxCatalogPrice)}</span></div>
          </div>
          <button className="clear-filters" onClick={() => { setCategory("All"); setMetal("All metals"); setKarat("All karats"); setMaxPrice(maxCatalogPrice); }}>
            Clear filters
          </button>
        </aside>
        <div>
          <div className="catalog-bar">
            <div>
              <strong>{visible.length} designs</strong>
              <span>{category === "All" ? "All Jewellery" : category} · certified natural diamonds</span>
            </div>
            <label>Sort by
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                {["Featured", "Newest", "Price low to high", "Price high to low"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <div className="product-grid catalog-grid">
            {visible.map((product, index) => (
              <ProductCard
                key={`${product.id}-${product.sku || index}`}
                product={product}
                favorite={favorites.has(product.id)}
                onFavorite={toggleFavorite}
                onOpen={openProduct}
              />
            ))}
          </div>
          {!visible.length && <p className="empty-state">No pieces found in this filter. Try All Jewellery or another budget range.</p>}
        </div>
      </section>
    </>
  );
}

function ProductPage({ product, favorites, toggleFavorite, addToCart, openProduct }) {
  const fallbackIndex = Math.max(0, products.findIndex((item) => item.id === product.id));
  const galleryImages = [
    product.image,
    product.lifestyle,
    ...(product.images || []),
    products[(fallbackIndex + 1) % products.length]?.image,
  ].filter(Boolean).filter((image, index, list) => list.indexOf(image) === index).slice(0, 4);
  const [activeImage, setActiveImage] = useState(galleryImages[0] || imageFallbackFor(product));
  const [goldColour, setGoldColour] = useState(productMetal(product));
  const [purity, setPurity] = useState(productKarat(product).replace("KT", "K"));
  const [length, setLength] = useState(product.category === "Necklace" ? "16 inch" : "Standard size");
  const salePrice = cleanPrice(product.salePrice || product.price);
  const regularPrice = product.regularPrice ? cleanPrice(product.regularPrice) : "";
  const collectionLabel = `${product.category}${product.category.endsWith("s") ? "" : "s"} Collection`;

  useEffect(() => {
    setActiveImage(galleryImages[0] || imageFallbackFor(product));
    setGoldColour(productMetal(product));
    setPurity(productKarat(product).replace("KT", "K"));
    setLength(product.category === "Necklace" ? "16 inch" : "Standard size");
  }, [product.id]);

  return (
    <>
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <button>Home</button>
        <span>/</span>
        <button>{product.category}</button>
        <span>/</span>
        <b>{product.name}</b>
      </nav>
      <section className="product-page">
        <div className="product-gallery">
          <div className="product-main-image">
            <img src={imageUrl(activeImage)} alt={product.name} onError={(event) => setImageFallback(event, imageFallbackFor(product, true))} />
            <span>1 / {galleryImages.length}</span>
            <button className="gallery-zoom" aria-label="Zoom image">
              <span className="material-symbols-rounded">search</span>
            </button>
          </div>
          <div className="product-thumbnails">
            {galleryImages.map((image, index) => (
              <button className={activeImage === image ? "is-active" : ""} key={`${image}-${index}`} onClick={() => setActiveImage(image)} aria-label={`View image ${index + 1}`}>
                <img src={imageUrl(image)} alt="" onError={(event) => setImageFallback(event, imageFallbackFor(product, index === 1))} />
              </button>
            ))}
          </div>
        </div>
        <div className="product-detail">
          <button className="product-share" aria-label="Share product">
            <span className="material-symbols-rounded">share</span>
          </button>
          <p className="eyebrow">{collectionLabel}</p>
          <h2>{product.name}</h2>
          <div className="product-rating-row">
            <span>★★★★★</span>
            <b>4.8</b>
            <small>7 reviews</small>
            <i>{product.inStock === false ? "Made to order" : "In stock"}</i>
            <small>SKU: {product.sku || product.id}</small>
          </div>
          <div className="product-price-line">
            <strong>{salePrice}</strong>
            {regularPrice && <span>{regularPrice}</span>}
            <em>Everyday diamond edit</em>
          </div>
          <p className="product-tax-note">Inclusive of all taxes · Price breakup available below</p>
          <div className="product-offers">
            <article>
              <span>Special offer</span>
              <b>Pay less at checkout</b>
              <p>Flat 8% off on prepaid orders</p>
              <button>Apply JB50</button>
            </article>
            <article>
              <span>Special offer</span>
              <b>Extra shine benefit</b>
              <p>Flat 5% off, no minimum order value</p>
              <button>Apply DAZZLING20</button>
            </article>
          </div>
          <div className="product-option-block">
            <span>Gold colour</span>
            <div className="product-metal-options">
              {["Rose Gold", "White Gold", "Yellow Gold"].map((option) => (
                <button className={goldColour === option ? "is-selected" : ""} key={option} onClick={() => setGoldColour(option)}>
                  <i className={`metal-dot metal-${option.toLowerCase().replace(/\s+/g, "-")}`} />
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="product-option-block">
            <span>Gold purity</span>
            <div className="product-purity-options">
              {["14K", "18K"].map((option) => (
                <button className={purity === option ? "is-selected" : ""} key={option} onClick={() => setPurity(option)}>{option}</button>
              ))}
            </div>
          </div>
          <div className="product-option-block">
            <span>Length</span>
            <select value={length} onChange={(event) => setLength(event.target.value)}>
              {["Standard size", "14 inch", "16 inch", "18 inch", "20 inch"].map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="detail-actions product-action-grid">
            <button onClick={() => addToCart(product)}>Add to Cart</button>
            <button className="buy-now" onClick={() => addToCart(product)}>Buy Now</button>
            <button className="wishlist-square" onClick={() => toggleFavorite(product.id)} aria-label="Save product">
              <span className="material-symbols-rounded">{favorites.has(product.id) ? "favorite" : "favorite"}</span>
            </button>
            <a className="whatsapp-buy" href="https://wa.me/" target="_blank" rel="noreferrer">
              Buy on WhatsApp
            </a>
          </div>
          <dl>
            {product.specs.map((spec, index) => (
              <div key={spec}>
                <dt>0{index + 1}</dt>
                <dd>{spec}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="products-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recommended</p>
            <h3>Pair with</h3>
          </div>
        </div>
        <div className="product-grid">
          {products.filter((item) => item.id !== product.id).slice(0, 3).map((item) => (
            <ProductCard key={item.id} product={item} favorite={favorites.has(item.id)} onFavorite={toggleFavorite} onOpen={openProduct} />
          ))}
        </div>
      </section>
    </>
  );
}

function NewArrivalsPage({ openProduct }) {
  return (
    <>
      <PageHero
        eyebrow="New Arrivals"
        title="New daily-wear diamonds"
        copy="Easy rings, hoops, mangalsutra pendants, studs, and bracelets with real natural diamonds and a soft Indian luxury mood."
        image={products[4].image}
        dark
      />
      <section className="arrival-feature">
        {products.slice(2, 6).map((product, index) => (
          <article key={`${product.id}-arrival-page-${product.sku || index}`}>
            <img src={imageUrl(product.image)} alt={product.name} onError={(event) => setImageFallback(event, imageFallbackFor(product))} />
            <div>
              <p className="eyebrow">{product.category}</p>
              <h3>{product.name}</h3>
              <p>{product.detail}</p>
              <button onClick={() => openProduct(product)}>View Details</button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function EducationPage() {
  const guides = [
    ["Cut", "A good cut keeps even small everyday diamonds bright in office light, daylight, and evening settings."],
    ["Clarity", "We choose natural diamonds that look clean and lively when worn close to the face or hand."],
    ["Color", "Diamond tone is balanced with Indian yellow gold, rose gold, and everyday styling."],
    ["Carat", "The right carat is comfortable, wearable, and proportional, not unnecessarily heavy."],
  ];

  return (
    <>
      <PageHero
        eyebrow="Mastery"
        title="Choose natural diamonds with confidence"
        copy="Simple guidance on cut, clarity, color, and carat for lightweight jewellery you can wear often, not only lock away."
        image={products[0].image}
      />
      <section className="guide-page">
        {guides.map(([title, copy]) => (
          <article key={title}>
            <span>{title.slice(0, 1)}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </>
  );
}

function BespokePage({ setCartOpen }) {
  return (
    <>
      <PageHero
        eyebrow="Personal Styling"
        title="Create your daily diamond stack"
        copy="Build a lightweight set around your lifestyle: office earrings, a mangalsutra pendant, a slim bracelet, or a ring you never need to remove."
        image={products[5].image}
        dark
      />
      <section className="process">
        {["Lifestyle Fit", "Diamond Selection", "Gold Tone", "Comfort Check", "Final Styling"].map((step, index) => (
          <article key={step}>
            <span>0{index + 1}</span>
            <h3>{step}</h3>
            <p>
              {index === 0 && "Tell us how you dress daily: workwear, kurtas, sarees, western wear, or festive regular wear."}
              {index === 1 && "Pick natural diamonds that look bright while keeping the piece light and comfortable."}
              {index === 2 && "Choose yellow, rose, or white gold according to your skin tone and existing jewellery."}
              {index === 3 && "Review clasp, weight, length, and daily movement before the final piece is made."}
              {index === 4 && "Receive styling suggestions for stacking, gifting, and regular care."}
            </p>
          </article>
        ))}
      </section>
      <section className="bespoke-cta">
        <h3>Build a regular-wear diamond look</h3>
        <button onClick={() => setCartOpen(true)}>Start Designing</button>
      </section>
    </>
  );
}

function ConciergePage({ notice, setNotice }) {
  function submit(event) {
    event.preventDefault();
    setNotice("Your concierge request is ready. We will prepare a private appointment summary.");
  }

  return (
    <>
      <PageHero
        eyebrow="Concierge"
        title="Find what you will actually wear"
        copy="Ask for help choosing lightweight natural diamond jewellery for office, gifting, mangalsutra styling, travel, or daily wear."
        image={products[1].image}
      />
      <section className="contact-page">
        <form onSubmit={submit}>
          <label>
            Name
            <input required placeholder="Your name" />
          </label>
          <label>
            Email
            <input required type="email" placeholder="you@example.com" />
          </label>
          <label>
            Interest
            <select defaultValue="Daily-wear styling">
              <option>Daily-wear styling</option>
              <option>Mangalsutra pendant</option>
              <option>Office jewellery</option>
              <option>Gifting help</option>
            </select>
          </label>
          <label>
            Message
            <textarea placeholder="Tell us your daily style, budget, and what type of lightweight diamond piece you want." />
          </label>
          <button>Request Concierge</button>
          {notice && <p className="notice">{notice}</p>}
        </form>
        <div className="concierge-cards">
          <article><h3>Try Daily</h3><p>Compare small hoops, studs, pendants, and bracelets by comfort and routine.</p></article>
          <article><h3>Style Indian</h3><p>Pair diamonds with kurtas, sarees, office shirts, dresses, and festive looks.</p></article>
          <article><h3>Care Simply</h3><p>Easy cleaning and storage guidance for jewellery you wear regularly.</p></article>
        </div>
      </section>
    </>
  );
}

function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(testimonials.length);
  const [testimonialSnap, setTestimonialSnap] = useState(false);
  const testimonialLoop = [...testimonials, ...testimonials, ...testimonials];
  const activeTestimonialDot = ((activeTestimonial % testimonials.length) + testimonials.length) % testimonials.length;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => current + 1);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  function moveTestimonial(direction) {
    setActiveTestimonial((current) => current + direction);
  }

  function handleTestimonialTransitionEnd() {
    if (activeTestimonial >= testimonials.length * 2 || activeTestimonial < testimonials.length) {
      setTestimonialSnap(true);
      setActiveTestimonial(activeTestimonialDot + testimonials.length);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setTestimonialSnap(false));
      });
    }
  }

  return (
    <section className="testimonials">
      <div className="testimonial-heading">
        <p className="eyebrow">Customer Notes</p>
        <h3>Worn every day, remembered often</h3>
      </div>
      <div className="testimonial-slider">
        <button className="testimonial-nav prev" onClick={() => moveTestimonial(-1)} aria-label="Previous testimonial">
          <span className="material-symbols-rounded">west</span>
        </button>
        <div className="testimonial-window">
          <div
            className={`testimonial-track ${testimonialSnap ? "is-snapping" : ""}`}
            style={{ "--testimonial-index": activeTestimonial }}
            onTransitionEnd={handleTestimonialTransitionEnd}
          >
            {testimonialLoop.map((item, index) => (
              <article className={index === activeTestimonial ? "is-featured" : ""} key={`${item.person}-${index}`}>
                <div>
                  <strong>{item.person}</strong>
                  <span>{item.date}</span>
                </div>
                <p>{item.quote}</p>
                <span className="quote-mark">format_quote</span>
              </article>
            ))}
          </div>
        </div>
        <button className="testimonial-nav next" onClick={() => moveTestimonial(1)} aria-label="Next testimonial">
          <span className="material-symbols-rounded">east</span>
        </button>
      </div>
      <div className="testimonial-dots">
        {testimonials.map((item, index) => (
          <button
            className={activeTestimonialDot === index ? "is-active" : ""}
            key={item.person}
            onClick={() => setActiveTestimonial(index + testimonials.length)}
            aria-label={`Show testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function InstagramSection() {
  return (
    <section className="instagram-section">
      <div className="social-heading">
        <div>
          <p className="eyebrow">Social</p>
          <h3>Follow Manosi</h3>
        </div>
        <a className="social-follow-link" href="https://www.instagram.com/">Follow on Instagram</a>
      </div>
      <div className="instagram-grid">
        {instagramPosts.slice(0, 5).map(([title, copy, product]) => (
          <article key={title}>
            <img src={imageUrl(product.lifestyle || product.image)} alt={title} onError={(event) => setImageFallback(event, imageFallbackFor(product, true))} />
          </article>
        ))}
      </div>
    </section>
  );
}

function CartPage({ cartItems, updateCartQuantity, removeFromCart, setPage }) {
  const subtotal = cartItems.reduce((sum, item) => sum + priceToNumber(item.product.price) * item.quantity, 0);
  const gst = Math.round(subtotal * 0.03);
  const total = subtotal + gst;

  return (
    <section className="commerce-page">
      <div className="commerce-heading">
        <p className="eyebrow">Shopping Bag</p>
        <h3>Your Manosi Bag</h3>
      </div>
      <div className="commerce-layout">
        <div className="cart-list">
          {cartItems.length === 0 && <p className="empty-state">Your bag is empty. Add a lightweight diamond piece to begin.</p>}
          {cartItems.map((item) => (
            <article key={item.product.id}>
              <img src={imageUrl(item.product.image)} alt={item.product.name} onError={(event) => setImageFallback(event, imageFallbackFor(item.product))} />
              <div>
                <p>{item.product.category}</p>
                <h4>{item.product.name}</h4>
                <strong>{item.product.price}</strong>
                <div className="quantity-control">
                  <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}>+</button>
                  <button onClick={() => removeFromCart(item.product.id)}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="order-summary">
          <h4>Order Summary</h4>
          <p><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></p>
          <p><span>Estimated GST</span><strong>₹{gst.toLocaleString("en-IN")}</strong></p>
          <p><span>Shipping</span><strong>Free</strong></p>
          <div><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
          <button onClick={() => setPage("checkout")} disabled={!cartItems.length}>Checkout</button>
        </aside>
      </div>
    </section>
  );
}

function CheckoutPage({ cartItems, setNotice, setPage }) {
  const subtotal = cartItems.reduce((sum, item) => sum + priceToNumber(item.product.price) * item.quantity, 0);

  function submit(event) {
    event.preventDefault();
    setNotice("Checkout request saved. Admin can review this order in the panel.");
    setPage("admin");
  }

  return (
    <section className="checkout-page">
      <div>
        <p className="eyebrow">Secure Checkout</p>
        <h3>Delivery details</h3>
        <form onSubmit={submit}>
          <input placeholder="Full name" required />
          <input placeholder="Mobile number" required />
          <input placeholder="Email address" type="email" required />
          <textarea placeholder="Complete Indian shipping address" required />
          <select defaultValue="UPI">
            <option>UPI</option>
            <option>Credit / Debit Card</option>
            <option>Net Banking</option>
            <option>Pay in Store</option>
          </select>
          <button disabled={!cartItems.length}>Place Order Request</button>
        </form>
      </div>
      <aside className="order-summary">
        <h4>Bag Total</h4>
        {cartItems.map((item) => (
          <p key={item.product.id}><span>{item.product.name} x {item.quantity}</span><strong>{item.product.price}</strong></p>
        ))}
        <div><span>Estimated total</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
      </aside>
    </section>
  );
}

function WishlistPage({ favorites, toggleFavorite, openProduct }) {
  const saved = products.filter((product) => favorites.has(product.id));

  return (
    <section className="products-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Wishlist</p>
          <h3>Saved Pieces</h3>
        </div>
      </div>
      {saved.length === 0 ? <p className="empty-state">No saved pieces yet. Tap the heart on any product.</p> : (
        <div className="product-grid">
          {saved.map((product, index) => (
            <ProductCard key={`${product.id}-wishlist-${product.sku || index}`} product={product} favorite onFavorite={toggleFavorite} onOpen={openProduct} />
          ))}
        </div>
      )}
    </section>
  );
}

function LegacyAdminPage({ cartItems, favorites }) {
  const totalInventory = products.length;
  const bagValue = cartItems.reduce((sum, item) => sum + priceToNumber(item.product.price) * item.quantity, 0);

  return (
    <section className="admin-page">
      <div className="commerce-heading">
        <p className="eyebrow">Store Manager</p>
        <h3>Manosi Admin Panel</h3>
      </div>
      <div className="admin-metrics">
        <article><span>{totalInventory}</span><p>Live products</p></article>
        <article><span>{favorites.size}</span><p>Wishlist saves</p></article>
        <article><span>{cartItems.length}</span><p>Bag items</p></article>
        <article><span>₹{bagValue.toLocaleString("en-IN")}</span><p>Current cart value</p></article>
      </div>
      <div className="admin-grid">
        <section>
          <h4>Product Catalogue</h4>
          {products.map((product, index) => (
            <article key={`${product.id}-legacy-${product.sku || index}`}>
              <img src={imageUrl(product.image)} alt="" />
              <div><strong>{product.name}</strong><span>{product.category} · {product.price}</span></div>
              <button>Edit</button>
            </article>
          ))}
        </section>
        <section>
          <h4>Store Controls</h4>
          {["Hero banners", "Collections", "Instagram posts", "Orders", "Customer requests", "Promotions"].map((item) => (
            <button key={item}>{item}</button>
          ))}
        </section>
      </div>
      <div className="admin-ops">
        <section>
          <h4>Recent Orders</h4>
          {dummyOrders.map(([id, customer, item, status, city, value]) => (
            <article key={id}>
              <strong>{id}</strong>
              <span>{customer}</span>
              <span>{item}</span>
              <span>{city}</span>
              <span className={`status ${status.toLowerCase()}`}>{status}</span>
              <b>{value}</b>
            </article>
          ))}
        </section>
        <section>
          <h4>Customer CRM</h4>
          {dummyCustomers.map(([name, city, tag, note]) => (
            <article key={name}>
              <strong>{name}</strong>
              <span>{city}</span>
              <span>{tag}</span>
              <b>{note}</b>
            </article>
          ))}
        </section>
        <section>
          <h4>Content & Campaigns</h4>
          {dummyBanners.map(([name, count, status]) => (
            <article key={name}>
              <strong>{name}</strong>
              <span>{count}</span>
              <b>{status}</b>
            </article>
          ))}
          {dummyPromotions.map(([code, offer, status]) => (
            <article key={code}>
              <strong>{code}</strong>
              <span>{offer}</span>
              <b>{status}</b>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}

function AdminDashboardOld({ cartItems, favorites, setPage }) {
  const totalInventory = products.length;
  const pendingOrders = dummyOrders.filter((order) => ["Pending", "Packed"].includes(order[3])).length;
  const bagValue = cartItems.reduce((sum, item) => sum + priceToNumber(item.product.price) * item.quantity, 0);
  const revenue = dummyOrders.reduce((sum, order) => sum + priceToNumber(order[5]), 0) + bagValue;
  const adminNav = [
    ["dashboard", "Dashboard"],
    ["inventory_2", "Products"],
    ["currency_rupee", "Bulk Pricing"],
    ["shopping_bag", "Orders"],
    ["home", "Homepage"],
    ["view_carousel", "Banners"],
    ["percent", "Offers & coupons"],
    ["reviews", "Testimonials"],
    ["edit_square", "Product Reviews"],
    ["category", "Collections"],
    ["groups", "Customers"],
    ["settings", "Settings"],
  ];

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <button className="admin-logo" onClick={() => setPage("home")}>
          <strong>Manosi</strong>
          <span>Diamonds</span>
        </button>
        <p>Admin panel</p>
        <nav>
          {adminNav.map(([icon, label], index) => (
            <button className={index === 0 ? "is-active" : ""} key={label}>
              <span className="material-symbols-rounded">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="admin-dashboard">
        <div className="admin-stat-row">
          <article><p>Products</p><strong>{totalInventory}</strong></article>
          <article><p>Orders</p><strong>{dummyOrders.length + cartItems.length}</strong></article>
          <article><p>Pending fulfillment</p><strong>{pendingOrders}</strong></article>
          <article><p>Revenue (demo)</p><strong>₹{revenue.toLocaleString("en-IN")}</strong></article>
        </div>

        <section className="admin-table-card">
          <div className="admin-section-title">
            <h4>Recent orders</h4>
            <button>Create manual order</button>
          </div>
          <div className="admin-table">
            <div className="admin-table-head">
              <span>Order</span>
              <span>Customer</span>
              <span>Item</span>
              <span>Status</span>
              <span>Total</span>
            </div>
            {dummyOrders.map(([id, customer, item, status, city, value]) => (
              <article key={id}>
                <strong>{id}</strong>
                <span>{customer}<small>{city}</small></span>
                <span>{item}</span>
                <span className={`status ${status.toLowerCase()}`}>{status}</span>
                <b>{value}</b>
              </article>
            ))}
          </div>
        </section>

        <div className="admin-management-grid">
          <section>
            <div className="admin-section-title">
              <h4>Products</h4>
              <button>Add product</button>
            </div>
            {products.slice(0, 5).map((product, index) => (
              <article key={`${product.id}-manager-${product.sku || index}`}>
                <img src={imageUrl(product.image)} alt="" />
                <div><strong>{product.name}</strong><span>{product.category} · {product.price}</span></div>
                <button>Edit</button>
              </article>
            ))}
          </section>

          <section>
            <div className="admin-section-title">
              <h4>Homepage</h4>
              <button>Update</button>
            </div>
            {dummyBanners.map(([name, count, status]) => (
              <article className="admin-mini-row" key={name}>
                <strong>{name}</strong>
                <span>{count}</span>
                <b>{status}</b>
              </article>
            ))}
          </section>

          <section>
            <div className="admin-section-title">
              <h4>Offers & coupons</h4>
              <button>Create</button>
            </div>
            {dummyPromotions.map(([code, offer, status]) => (
              <article className="admin-mini-row" key={code}>
                <strong>{code}</strong>
                <span>{offer}</span>
                <b>{status}</b>
              </article>
            ))}
          </section>

          <section>
            <div className="admin-section-title">
              <h4>Customers</h4>
              <button>Export</button>
            </div>
            {dummyCustomers.map(([name, city, tag, note]) => (
              <article className="admin-mini-row" key={name}>
                <strong>{name}</strong>
                <span>{city} · {tag}</span>
                <b>{note}</b>
              </article>
            ))}
            <article className="admin-mini-row">
              <strong>Wishlist saves</strong>
              <span>Live local session</span>
              <b>{favorites.size}</b>
            </article>
          </section>
        </div>
      </div>
    </section>
  );
}

function AdminPage({ cartItems, favorites, setPage }) {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("All categories");
  const [productMetal, setProductMetal] = useState("All metals");
  const [productKarat, setProductKarat] = useState("All karats");
  const [productStock, setProductStock] = useState("All stock levels");
  const [bulkCategory, setBulkCategory] = useState("All categories");
  const [bulkDirection, setBulkDirection] = useState("increase");
  const [bulkMode, setBulkMode] = useState("percent");
  const [bulkValue, setBulkValue] = useState("");
  const [bulkSearch, setBulkSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderDateFilter, setOrderDateFilter] = useState("thisMonth");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [customerSearch, setCustomerSearch] = useState("");
  const [productEditor, setProductEditor] = useState(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkUploadRows, setBulkUploadRows] = useState([]);
  const [bulkUploadFileName, setBulkUploadFileName] = useState("");
  const [homeProductPicker, setHomeProductPicker] = useState(null);
  const [homeProductSearch, setHomeProductSearch] = useState("");
  const [reelProductSearch, setReelProductSearch] = useState({});
  const [adminData, setAdminData] = useState(null);
  const [adminNotice, setAdminNotice] = useState("");
  const apiBase = "http://127.0.0.1:5175/api";
  const adminNav = [
    ["dashboard", "dashboard", "Dashboard"],
    ["inventory_2", "products", "Products"],
    ["currency_rupee", "pricing", "Bulk Pricing"],
    ["shopping_bag", "orders", "Orders"],
    ["home", "homepage", "Homepage"],
    ["smart_display", "reels", "Reels"],
    ["view_carousel", "banners", "Banners"],
    ["percent", "offers", "Offers & coupons"],
    ["reviews", "testimonials", "Testimonials"],
    ["edit_square", "reviews", "Product Reviews"],
    ["category", "collections", "Collections"],
    ["groups", "customers", "Customers"],
    ["settings", "settings", "Settings"],
  ];
  const layoutControls = [
    ["Hero full-screen banner", "1920 x 980 desktop", "1080 x 1440 mobile", "Image-only, auto slide"],
    ["Collection carousel", "520 x 620 card", "2 cards on mobile", "Infinite smooth loop"],
    ["Trending product cards", "4 cards desktop", "2 cards mobile", "Modern daily-wear cards"],
    ["Campaign banner carousel", "1680 x 610 wide", "86vw mobile", "No text overlay"],
    ["Manosi in Motion", "420 x 650 reel", "Single active reel", "Stacked video style"],
    ["Instagram grid", "Square/tall mix", "2 columns mobile", "Post preview cards"],
  ];
  const reviewRows = [
    ["Ananya Mehta", "Natural Diamond Daily Ring", "5.0", "Light, office-friendly, perfect finish"],
    ["Ritika Shah", "Lightweight Diamond Necklace", "4.8", "Looks premium with kurtas and shirts"],
    ["Kavya Iyer", "Slim Diamond Bracelet", "5.0", "Easy to layer with watch"],
  ];
  const adminOrders = [
    {
      id: "ORD-178419250789",
      status: "Pending payment",
      statusKey: "pending",
      customer: "ghghghgh",
      phone: "+91 21321",
      address: "nvcgcd, bh, j - 3244, India",
      item: "Rose Gold Diamond Earrings",
      quantity: 1,
      total: "₹18,003",
      date: "15 Jul 2026, 06:10 pm",
      dateISO: "2026-07-15",
    },
    {
      id: "ORD-1783862406916",
      status: "Pending payment",
      statusKey: "pending",
      customer: "Test",
      phone: "+91 81405 16517",
      address: "Bsj, near Jsjs, Jsjesjsj, Jej - Jsjs, India",
      item: "Rose Gold Diamond Earrings",
      quantity: 1,
      total: "₹17,803",
      date: "12 Jul 2026, 06:50 pm",
      dateISO: "2026-07-12",
    },
    {
      id: "ORD-1783029108842",
      status: "Paid",
      statusKey: "paid",
      customer: "Priya Sharma",
      phone: "+91 98765 43210",
      address: "Bandra West, Mumbai - 400050, India",
      item: "Yellow Gold Diamond Bracelet",
      quantity: 1,
      total: "₹34,819",
      date: "10 Jul 2026, 02:25 pm",
      dateISO: "2026-07-10",
    },
    {
      id: "ORD-1782965401288",
      status: "Pending payment",
      statusKey: "pending",
      customer: "Nisha Rao",
      phone: "+91 99887 77665",
      address: "Indiranagar, Bengaluru - 560038, India",
      item: "Rose Gold Diamond Bracelet",
      quantity: 1,
      total: "₹27,181",
      date: "09 Jul 2026, 11:40 am",
      dateISO: "2026-07-09",
    },
    {
      id: "ORD-1782119085120",
      status: "Paid",
      statusKey: "paid",
      customer: "Kavya Iyer",
      phone: "+91 90909 12345",
      address: "T Nagar, Chennai - 600017, India",
      item: "Natural Diamond Nosepin",
      quantity: 1,
      total: "₹28,500",
      date: "06 Jul 2026, 08:18 pm",
      dateISO: "2026-07-06",
    },
    {
      id: "ORD-1781849921124",
      status: "Pending payment",
      statusKey: "pending",
      customer: "Aarohi Shah",
      phone: "+91 98222 44110",
      address: "Satellite, Ahmedabad - 380015, India",
      item: "Everyday Diamond Pendant",
      quantity: 1,
      total: "₹82,000",
      date: "04 Jul 2026, 05:04 pm",
      dateISO: "2026-07-04",
    },
    {
      id: "ORD-1781023304501",
      status: "Pending payment",
      statusKey: "pending",
      customer: "Ritika Shah",
      phone: "+91 91234 56780",
      address: "Koregaon Park, Pune - 411001, India",
      item: "Lightweight Diamond Necklace",
      quantity: 1,
      total: "₹64,000",
      date: "01 Jul 2026, 01:12 pm",
      dateISO: "2026-07-01",
    },
  ];
  const adminProducts = (adminData?.products?.length ? adminData.products : products).map(withCloudinaryImages);
  const liveOrders = adminData?.orders || adminOrders;
  const liveCoupons = adminData?.coupons || [];
  const liveHomepageSections = adminData?.homepageSections || [];
  const liveHomepageProducts = adminData?.homepageProducts || { trending: [], arrivals: [], featured: [] };
  const liveReels = adminData?.reels || [];
  const liveTestimonials = adminData?.testimonials || [];
  const liveReviews = adminData?.reviews || [];
  const liveBanners = adminData?.banners || [];
  const liveCollections = adminData?.collections || [];
  const derivedCustomers = Object.values(liveOrders.reduce((acc, order) => {
    const key = order.phone || order.customer;
    const current = acc[key] || { name: order.customer, phone: order.phone, orders: 0, totalSpent: 0, lastOrder: order.date };
    current.orders += 1;
    current.totalSpent += priceToNumber(order.total);
    current.lastOrder = order.date;
    acc[key] = current;
    return acc;
  }, {})).map((customer) => ({ ...customer, totalSpent: `${String.fromCharCode(8377)}${customer.totalSpent.toLocaleString("en-IN")}` }));
  const liveCustomers = adminData?.customers?.length ? adminData.customers : derivedCustomers;
  const liveSettings = adminData?.settings || {};
  const totalInventory = adminProducts.length;
  const orderCount = liveOrders.length;
  const pendingOrders = liveOrders.filter((order) => order.statusKey === "pending").length;
  const revenue = liveOrders.filter((order) => order.statusKey === "paid").reduce((sum, order) => sum + priceToNumber(order.total), 0);
  const adminCategoryLabel = (category) => ({
    Bracelet: "Bracelets",
    Necklace: "Necklaces",
    Pendant: "Pendants",
    Nosepins: "Nose Pins",
  }[category] || category);
  const categoryOptions = ["All categories", ...new Set(adminProducts.map((product) => product.category).filter(Boolean))];
  const metalOptions = ["All metals", ...new Set(adminProducts.map((product) => product.goldColour).filter(Boolean))];
  const karatOptions = ["All karats", ...new Set(adminProducts.map((product) => product.goldKarat).filter(Boolean))];
  const filteredAdminProducts = adminProducts.filter((product) => {
    const query = productSearch.trim().toLowerCase();
    const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.sku?.toLowerCase().includes(query);
    const matchesCategory = productCategory === "All categories" || product.category === productCategory;
    const matchesMetal = productMetal === "All metals" || product.goldColour === productMetal;
    const matchesKarat = productKarat === "All karats" || product.goldKarat === productKarat;
    const matchesStock = productStock === "All stock levels" || (productStock === "In stock" ? product.inStock : !product.inStock);
    return matchesSearch && matchesCategory && matchesMetal && matchesKarat && matchesStock;
  });
  const filteredBulkProducts = adminProducts.filter((product) => {
    const query = bulkSearch.trim().toLowerCase();
    const matchesCategory = bulkCategory === "All categories" || adminCategoryLabel(product.category) === bulkCategory;
    const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.sku?.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  const bulkCategories = ["All categories", "Bracelets", "Earrings", "Necklaces", "Nose Pins", "Pendants", "Rings"];

  useEffect(() => {
    loadAdminData();
  }, []);

  async function adminRequest(path, options) {
    const response = await fetch(`${apiBase}${path}`, {
      headers: { "content-type": "application/json" },
      ...options,
    });
    if (!response.ok) throw new Error(`Admin API failed: ${response.status}`);
    const nextData = await response.json();
    setAdminData(nextData);
    return nextData;
  }

  async function loadAdminData() {
    try {
      await adminRequest("/admin");
      setAdminNotice("Backend connected");
    } catch {
      setAdminNotice("Backend offline: demo mode");
    }
  }

  async function saveAdmin(path, data, method = "PUT") {
    try {
      await adminRequest(path, { method, body: JSON.stringify(data) });
      setAdminNotice("Saved");
    } catch {
      setAdminNotice("Save failed: start backend API");
    }
  }

  function rupeePrice(value) {
    return `${String.fromCharCode(8377)}${Number(value || 0).toLocaleString("en-IN")}`;
  }

  function updateProduct(product, patch) {
    saveAdmin(`/products/${product.id}`, patch, "PATCH");
  }

  function openProductEditor(product = null) {
    const base = product || adminProducts[0] || sampleProducts[0];
    setProductEditor({
      mode: product ? "edit" : "add",
      id: product?.id || `manual-${Date.now()}`,
      name: product?.name || "",
      sku: product?.sku || `MANOSI-${Date.now().toString().slice(-5)}`,
      category: product?.category || "Rings",
      price: priceDigits(product?.price) || "",
      salePrice: priceDigits(product?.salePrice || product?.price) || "",
      stock: product?.stock ?? 10,
      goldColour: product?.goldColour || "Rose Gold",
      goldKarat: product?.goldKarat || "18K",
      diamondType: product?.diamondType || "Natural diamonds",
      occasion: product?.occasion || "Daily wear",
      image: product?.originalImages?.[0] || product?.image || categoryFallbackImages[product?.category] || "/src/assets/real-products/ring.webp",
      lifestyle: product?.lifestyle || "",
      detail: product?.detail || "",
      inStock: product?.inStock ?? true,
      featured: product?.featured || false,
      base,
    });
  }

  function closeProductEditor() {
    setProductEditor(null);
  }

  function changeProductDraft(field, value) {
    setProductEditor((current) => ({ ...current, [field]: value }));
  }

  function readImageFile(file, onReady) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAdminNotice("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onReady(reader.result);
    reader.readAsDataURL(file);
  }

  function readVideoFile(file, onReady) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setAdminNotice("Please upload a video file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onReady(reader.result);
    reader.readAsDataURL(file);
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let quoted = false;
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];
      if (char === '"' && quoted && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(value.trim());
        value = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(value.trim());
        if (row.some(Boolean)) rows.push(row);
        row = [];
        value = "";
      } else {
        value += char;
      }
    }
    row.push(value.trim());
    if (row.some(Boolean)) rows.push(row);
    if (rows.length < 2) return [];
    const headers = rows[0].map((header) => header.toLowerCase().replace(/[^a-z0-9]+/g, ""));
    return rows.slice(1).map((cells) => headers.reduce((record, header, index) => ({ ...record, [header]: cells[index] || "" }), {}));
  }

  function firstValue(record, keys) {
    return keys.map((key) => record[key]).find(Boolean) || "";
  }

  function normalizeImportProduct(record, index) {
    const name = firstValue(record, ["name", "title", "productname", "itemname"]);
    const sku = firstValue(record, ["sku", "code", "productcode", "itemcode"]) || `BULK-${Date.now()}-${index + 1}`;
    const category = firstValue(record, ["category", "type", "collection"]) || "Rings";
    const rawPrice = firstValue(record, ["price", "saleprice", "sellingprice", "mrp", "amount"]);
    const image = firstValue(record, ["image", "imageurl", "photo", "photourl", "cloudinaryurl"]) || categoryFallbackImages[category] || "/src/assets/real-products/ring.webp";
    const lifestyle = firstValue(record, ["lifestyle", "lifestyleimage", "videoimage", "poster"]) || image;
    const stock = Number(firstValue(record, ["stock", "quantity", "qty"]) || 50);
    return {
      id: sku.toLowerCase(),
      sku,
      name,
      category,
      price: rawPrice ? rupeePrice(String(rawPrice).replace(/[^0-9]/g, "")) : rupeePrice(0),
      salePrice: rawPrice ? rupeePrice(String(rawPrice).replace(/[^0-9]/g, "")) : rupeePrice(0),
      stock,
      inStock: stock > 0,
      goldColour: firstValue(record, ["goldcolour", "goldcolor", "metal"]) || "Rose Gold",
      goldKarat: firstValue(record, ["goldkarat", "karat", "kt"]) || "18K",
      diamondType: firstValue(record, ["diamondtype", "diamond"]) || "Natural diamonds",
      occasion: firstValue(record, ["occasion", "wear"]) || "Daily wear",
      detail: firstValue(record, ["detail", "description", "desc"]),
      image,
      lifestyle,
      originalImages: [image].filter(Boolean),
    };
  }

  function handleBulkUploadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseCsv(String(reader.result || ""))
        .map(normalizeImportProduct)
        .filter((product) => product.name);
      setBulkUploadRows(rows);
      setBulkUploadFileName(file.name);
      setAdminNotice(rows.length ? `${rows.length} products ready to import` : "No valid products found in CSV");
    };
    reader.readAsText(file);
  }

  function downloadSampleCsv() {
    const sample = [
      "name,sku,category,price,stock,image,description,gold colour,karat,diamond type,occasion",
      "Rose Gold Diamond Ring,MANOSI-R001,Rings,42500,50,https://res.cloudinary.com/demo/ring.webp,Lightweight natural diamond ring,Rose Gold,18K,Natural diamonds,Daily wear",
      "Yellow Gold Diamond Bracelet,MANOSI-B001,Bracelet,34819,50,https://res.cloudinary.com/demo/bracelet.webp,Slim daily wear bracelet,Yellow Gold,18K,Natural diamonds,Office wear",
    ].join("\n");
    const blob = new Blob([sample], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "manosi-product-bulk-upload-sample.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function importBulkProducts() {
    if (!bulkUploadRows.length) {
      setAdminNotice("Choose a CSV file first");
      return;
    }
    try {
      const nextData = await adminRequest("/products/bulk-upload", { method: "POST", body: JSON.stringify({ products: bulkUploadRows }) });
      const summary = nextData.importSummary;
      setAdminNotice(`Bulk upload complete: ${summary?.added || 0} added, ${summary?.updated || 0} updated`);
      setBulkUploadRows([]);
      setBulkUploadFileName("");
    } catch {
      setAdminNotice("Bulk upload failed: start backend API");
    }
  }

  async function applyBulkPrice() {
    const amount = Number(bulkValue);
    if (!amount || amount <= 0) {
      setAdminNotice("Enter a valid bulk price value");
      return;
    }
    if (!filteredBulkProducts.length) {
      setAdminNotice("No products match this bulk filter");
      return;
    }
    try {
      await adminRequest("/products/bulk-price", { method: "POST", body: JSON.stringify({ category: bulkCategory, direction: bulkDirection, mode: bulkMode, value: bulkValue }) });
      setAdminNotice("Bulk price updated successfully");
    } catch {
      setAdminNotice("Bulk price update failed: start backend API");
    }
  }

  function openHomeProductPicker(sectionKey) {
    const labels = {
      trending: "Trending Now",
      arrivals: "New Arrivals",
      featured: "Featured section",
    };
    setHomeProductSearch("");
    setHomeProductPicker({ key: sectionKey, label: labels[sectionKey] || "Home products" });
  }

  function updateHomeProductSelection(sectionKey, productId) {
    const defaultIds = sectionKey === "arrivals" ? adminProducts.slice(2, 6).map((product) => product.id) : adminProducts.slice(0, 4).map((product) => product.id);
    const currentIds = liveHomepageProducts[sectionKey]?.length ? liveHomepageProducts[sectionKey] : defaultIds;
    const nextIds = currentIds.includes(productId)
      ? currentIds.filter((id) => id !== productId)
      : [...currentIds, productId];
    saveAdmin("/homepage-products", { ...liveHomepageProducts, [sectionKey]: nextIds });
  }

  function closeHomeProductPicker() {
    setHomeProductPicker(null);
    setHomeProductSearch("");
  }

  function saveProductDraft(event) {
    event.preventDefault();
    if (!productEditor.name.trim()) {
      setAdminNotice("Product name required");
      return;
    }
    if (!productEditor.sku.trim()) {
      setAdminNotice("SKU required");
      return;
    }
    const savedProduct = {
      ...productEditor.base,
      ...productEditor,
      id: productEditor.id,
      name: productEditor.name.trim(),
      sku: productEditor.sku.trim(),
      price: rupeePrice(productEditor.price),
      salePrice: rupeePrice(productEditor.salePrice || productEditor.price),
      stock: Number(productEditor.stock || 0),
      originalImages: [productEditor.image].filter(Boolean),
      image: productEditor.image || categoryFallbackImages[productEditor.category],
      lifestyle: productEditor.lifestyle || productEditor.image,
      specs: [
        productEditor.diamondType,
        productEditor.goldKarat,
        productEditor.goldColour,
        productEditor.occasion,
      ].filter(Boolean),
    };
    delete savedProduct.mode;
    delete savedProduct.base;
    if (productEditor.mode === "edit") {
      saveAdmin(`/products/${productEditor.id}`, savedProduct, "PATCH");
    } else {
      saveAdmin("/products", savedProduct, "POST");
    }
    closeProductEditor();
  }

  function editProduct(product) {
    openProductEditor(product);
  }

  function deleteProduct(product) {
    if (window.confirm(`Delete ${product.name}?`)) saveAdmin(`/products/${product.id}`, undefined, "DELETE");
  }

  function ProductRows() {
    return adminProducts.map((product, index) => (
      <article key={`${product.id}-row-${product.sku || index}`}>
        <img src={imageUrl(product.image)} alt="" />
        <div><strong>{product.name}</strong><span>{product.category} · {product.price}</span></div>
        <button>Edit</button>
      </article>
    ));
  }

  function ControlCard({ title, children, action = "Save" }) {
    return (
      <section className="admin-control-card">
        <div className="admin-section-title">
          <h4>{title}</h4>
          <button>{action}</button>
        </div>
        {children}
      </section>
    );
  }

  function AdminProductEditorModal() {
    if (!productEditor) return null;
    const draftImage = productEditor.image || categoryFallbackImages[productEditor.category] || "/src/assets/real-products/ring.webp";
    return (
      <div className="admin-modal-backdrop">
        <form className="admin-product-editor" onSubmit={saveProductDraft}>
          <div className="admin-editor-header">
            <div>
              <p className="eyebrow">{productEditor.mode === "edit" ? "Edit product" : "New product"}</p>
              <h3>{productEditor.mode === "edit" ? productEditor.name : "Add jewellery product"}</h3>
            </div>
            <button type="button" onClick={closeProductEditor} aria-label="Close product editor">
              <span className="material-symbols-rounded">close</span>
            </button>
          </div>

          <div className="admin-editor-body">
            <section className="admin-editor-main">
              <article>
                <h4>Basic information</h4>
                <label>Product title<input required value={productEditor.name} onChange={(event) => changeProductDraft("name", event.target.value)} placeholder="Rose Gold Diamond Ring" /></label>
                <label>Description<textarea value={productEditor.detail} onChange={(event) => changeProductDraft("detail", event.target.value)} placeholder="Short product story, fit, daily-wear use, certification..." /></label>
              </article>

              <article>
                <h4>Pricing</h4>
                <div className="admin-editor-two">
                  <label>Price<input required inputMode="numeric" value={productEditor.price} onChange={(event) => changeProductDraft("price", event.target.value.replace(/[^0-9]/g, ""))} placeholder="42500" /></label>
                  <label>Compare / sale price<input inputMode="numeric" value={productEditor.salePrice} onChange={(event) => changeProductDraft("salePrice", event.target.value.replace(/[^0-9]/g, ""))} placeholder="42500" /></label>
                </div>
              </article>

              <article>
                <h4>Inventory</h4>
                <div className="admin-editor-two">
                  <label>SKU<input required value={productEditor.sku} onChange={(event) => changeProductDraft("sku", event.target.value.toUpperCase())} placeholder="MANOSI-00001" /></label>
                  <label>Stock quantity<input inputMode="numeric" value={productEditor.stock} onChange={(event) => changeProductDraft("stock", event.target.value.replace(/[^0-9]/g, ""))} /></label>
                </div>
                <button type="button" className="settings-line" onClick={() => changeProductDraft("inStock", !productEditor.inStock)}><span>Available for sale</span><TogglePill on={productEditor.inStock} /></button>
              </article>
            </section>

            <aside className="admin-editor-side">
              <article>
                <h4>Product image</h4>
                <div className="admin-editor-preview"><img src={imageUrl(draftImage)} alt="" /></div>
                <label className="admin-upload-control">Upload product image<input type="file" accept="image/*" onChange={(event) => readImageFile(event.target.files?.[0], (image) => changeProductDraft("image", image))} /></label>
                <label>Image path or Cloudinary URL<input value={productEditor.image} onChange={(event) => changeProductDraft("image", event.target.value)} placeholder="https://..." /></label>
                <label className="admin-upload-control">Upload lifestyle image<input type="file" accept="image/*" onChange={(event) => readImageFile(event.target.files?.[0], (image) => changeProductDraft("lifestyle", image))} /></label>
                <label>Lifestyle image URL<input value={productEditor.lifestyle} onChange={(event) => changeProductDraft("lifestyle", event.target.value)} placeholder="Optional" /></label>
              </article>

              <article>
                <h4>Organisation</h4>
                <label>Category<select value={productEditor.category} onChange={(event) => changeProductDraft("category", event.target.value)}>{menuCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
                <label>Gold colour<select value={productEditor.goldColour} onChange={(event) => changeProductDraft("goldColour", event.target.value)}><option>Rose Gold</option><option>Yellow Gold</option><option>White Gold</option><option>Platinum</option></select></label>
                <label>Gold karat<select value={productEditor.goldKarat} onChange={(event) => changeProductDraft("goldKarat", event.target.value)}><option>14K</option><option>18K</option><option>22K</option></select></label>
                <label>Diamond type<select value={productEditor.diamondType} onChange={(event) => changeProductDraft("diamondType", event.target.value)}><option>Natural diamonds</option><option>Certified natural diamonds</option><option>Solitaire natural diamond</option></select></label>
                <label>Occasion<select value={productEditor.occasion} onChange={(event) => changeProductDraft("occasion", event.target.value)}><option>Daily wear</option><option>Office wear</option><option>Festive</option><option>Gifting</option><option>Bridal</option></select></label>
                <button type="button" className="settings-line" onClick={() => changeProductDraft("featured", !productEditor.featured)}><span>Show in featured products</span><TogglePill on={productEditor.featured} /></button>
              </article>
            </aside>
          </div>

          <div className="admin-editor-footer">
            <button type="button" className="admin-secondary-action" onClick={closeProductEditor}>Cancel</button>
            <button type="submit" className="admin-primary-action">{productEditor.mode === "edit" ? "Save product" : "Create product"}</button>
          </div>
        </form>
      </div>
    );
  }

  function AdminHomeProductPickerModal() {
    if (!homeProductPicker) return null;
    const defaultSelection = homeProductPicker.key === "arrivals" ? adminProducts.slice(2, 6).map((product) => product.id) : adminProducts.slice(0, 4).map((product) => product.id);
    const selectedIds = liveHomepageProducts[homeProductPicker.key]?.length ? liveHomepageProducts[homeProductPicker.key] : defaultSelection;
    const query = homeProductSearch.trim().toLowerCase();
    const pickerProducts = adminProducts.filter((product) => {
      if (!query) return true;
      return product.name.toLowerCase().includes(query) || product.sku?.toLowerCase().includes(query) || product.category?.toLowerCase().includes(query);
    }).slice(0, 120);
    return (
      <div className="admin-modal-backdrop">
        <section className="admin-product-picker">
          <div className="admin-editor-header">
            <div>
              <p className="eyebrow">Homepage products</p>
              <h3>{homeProductPicker.label}</h3>
            </div>
            <button type="button" onClick={closeHomeProductPicker} aria-label="Close product picker">
              <span className="material-symbols-rounded">close</span>
            </button>
          </div>
          <div className="admin-picker-toolbar">
            <input value={homeProductSearch} onChange={(event) => setHomeProductSearch(event.target.value)} placeholder="Search product name, SKU, category..." />
            <span>{selectedIds.length} selected</span>
          </div>
          <div className="admin-picker-list">
            {pickerProducts.map((product, index) => {
              const selected = selectedIds.includes(product.id);
              return (
                <article className={selected ? "is-selected" : ""} key={`${product.id}-picker-${product.sku || "sku"}-${index}`}>
                  <img src={imageUrl(categoryFallbackImages[product.category] || product.image)} alt="" />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.sku} - {adminCategoryLabel(product.category)} - {product.price}</span>
                  </div>
                  <button type="button" onClick={() => updateHomeProductSelection(homeProductPicker.key, product.id)}>{selected ? "Remove" : "Add"}</button>
                </article>
              );
            })}
          </div>
          <div className="admin-editor-footer">
            <button type="button" className="admin-primary-action" onClick={closeHomeProductPicker}>Done</button>
          </div>
        </section>
      </div>
    );
  }

  function AdminProductsPanel() {
    return (
      <section className="admin-products-panel">
        <div className="admin-product-actions">
          <button className="admin-secondary-action" onClick={() => setBulkUploadOpen((current) => !current)}>Bulk upload</button>
          <button className="admin-primary-action" onClick={() => openProductEditor()}>+ Add product</button>
        </div>

        {bulkUploadOpen && (
          <div className="admin-bulk-upload-card">
            <div>
              <strong>Bulk product upload</strong>
              <span>{bulkUploadRows.length ? `${bulkUploadRows.length} products ready - ${bulkUploadFileName}` : "Upload CSV or download sample format"}</span>
            </div>
            <div className="admin-bulk-upload-options">
              <label className="admin-primary-action admin-file-action">
                Upload CSV
                <input type="file" accept=".csv,text/csv" onChange={(event) => handleBulkUploadFile(event.target.files?.[0])} />
              </label>
              <button className="admin-secondary-action" onClick={downloadSampleCsv}>Download sample file</button>
            </div>
            {bulkUploadRows.length > 0 && (
              <>
                <div className="admin-bulk-upload-preview">
                  {bulkUploadRows.slice(0, 5).map((product) => (
                    <article key={`${product.sku}-bulk-preview`}>
                      <img src={imageUrl(product.image)} alt="" />
                      <span>{product.name}</span>
                      <b>{product.sku}</b>
                      <small>{product.price}</small>
                    </article>
                  ))}
                </div>
                <div className="admin-bulk-upload-actions">
                  <button className="admin-secondary-action" onClick={() => { setBulkUploadRows([]); setBulkUploadFileName(""); }}>Clear file</button>
                  <button className="admin-primary-action" onClick={importBulkProducts}>Import products</button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="admin-product-filters">
          <input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Search by name or SKU..." />
          <select value={productCategory} onChange={(event) => setProductCategory(event.target.value)}>
            {categoryOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={productMetal} onChange={(event) => setProductMetal(event.target.value)}>
            {metalOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={productKarat} onChange={(event) => setProductKarat(event.target.value)}>
            {karatOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select defaultValue="All diamond types">
            <option>All diamond types</option>
            <option>Natural diamonds</option>
            <option>Certified diamonds</option>
          </select>
          <select defaultValue="All occasions">
            <option>All occasions</option>
            <option>Daily wear</option>
            <option>Office wear</option>
            <option>Festive</option>
          </select>
          <select value={productStock} onChange={(event) => setProductStock(event.target.value)}>
            <option>All stock levels</option>
            <option>In stock</option>
            <option>Out of stock</option>
          </select>
        </div>

        <p className="admin-product-count">{filteredAdminProducts.length} of {adminProducts.length} products</p>

        <div className="admin-product-table">
          <div className="admin-product-head">
            <span>Product ↕</span>
            <span>SKU</span>
            <span>Category</span>
            <span>Price ↕</span>
            <span>Stock ↕</span>
            <span></span>
          </div>
          {filteredAdminProducts.map((product, index) => (
            <article key={`${product.id}-admin-${product.sku || "sku"}-${index}`}>
              <div className="admin-product-name">
                <img src={imageUrl(categoryFallbackImages[product.category] || product.image)} alt="" />
                <strong>{product.name}</strong>
              </div>
              <span>{product.sku}</span>
              <span>{adminCategoryLabel(product.category)}</span>
              <span>{product.price}</span>
              <span>{product.stock || 0}</span>
              <div className="admin-row-actions">
                <button onClick={() => editProduct(product)}>Edit</button>
                <button onClick={() => deleteProduct(product)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function priceDigits(price) {
    return String(price || "").replace(/[^0-9]/g, "");
  }

  function AdminBulkPricingPanel() {
    return (
      <section className="admin-bulk-panel">
        <p className="admin-module-copy">Update prices for all or selected jewellery at once</p>

        <div className="bulk-adjust-card">
          <h4>Bulk Price Adjustment</h4>
          <p>Apply to category</p>
          <div className="bulk-chip-row">
            {bulkCategories.map((category) => (
              <button className={bulkCategory === category ? "is-active" : ""} key={category} onClick={() => setBulkCategory(category)}>
                {category}
              </button>
            ))}
          </div>

          <div className="bulk-direction-grid">
            <button className={bulkDirection === "increase" ? "is-active increase" : ""} onClick={() => setBulkDirection("increase")}>↑ Increase</button>
            <button className={bulkDirection === "decrease" ? "is-active decrease" : ""} onClick={() => setBulkDirection("decrease")}>↓ Decrease</button>
          </div>

          <div className="bulk-value-row">
            <div className="bulk-mode-toggle">
              <button className={bulkMode === "percent" ? "is-active" : ""} onClick={() => setBulkMode("percent")}>%</button>
              <button className={bulkMode === "rupee" ? "is-active" : ""} onClick={() => setBulkMode("rupee")}>₹</button>
            </div>
            <input value={bulkValue} onChange={(event) => setBulkValue(event.target.value)} placeholder={bulkMode === "percent" ? "e.g. 10 (for 10%)" : "e.g. 2500"} />
          </div>

          <button className={`bulk-apply ${Number(bulkValue) > 0 ? "is-ready" : ""}`} onClick={applyBulkPrice}>Apply to {filteredBulkProducts.length} products</button>
        </div>

        <div className="individual-price-card">
          <div className="individual-price-head">
            <h4>Individual Prices</h4>
            <input value={bulkSearch} onChange={(event) => setBulkSearch(event.target.value)} placeholder="Search product..." />
          </div>
          <div className="individual-price-list">
            {filteredBulkProducts.map((product, index) => (
              <article key={`${product.id}-bulk-${product.sku || "sku"}-${index}`}>
                <div className="individual-price-product">
                  <img src={imageUrl(categoryFallbackImages[product.category] || product.image)} alt="" />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{adminCategoryLabel(product.category)} <small>#{product.sku}</small></span>
                  </div>
                </div>
                <label>
                  <input defaultValue={priceDigits(product.price)} onBlur={(event) => updateProduct(product, { price: rupeePrice(event.target.value), salePrice: rupeePrice(event.target.value) })} />
                  <span>₹</span>
                </label>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function AdminOrdersPanel() {
    const today = new Date("2026-07-15T00:00:00");
    const dateFilters = [
      ["today", "Today"],
      ["7days", "7 days"],
      ["30days", "30 days"],
      ["thisMonth", "This month"],
      ["lastMonth", "Last month"],
    ];
    const isInDateFilter = (order) => {
      const orderDate = new Date(`${order.dateISO}T00:00:00`);
      if (orderDateFilter === "today") return order.dateISO === "2026-07-15";
      if (orderDateFilter === "7days") {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        return orderDate >= start && orderDate <= today;
      }
      if (orderDateFilter === "30days") {
        const start = new Date(today);
        start.setDate(start.getDate() - 29);
        return orderDate >= start && orderDate <= today;
      }
      if (orderDateFilter === "thisMonth") return order.dateISO.startsWith("2026-07");
      if (orderDateFilter === "lastMonth") return order.dateISO.startsWith("2026-06");
      return true;
    };
    const dateFilteredOrders = liveOrders.filter(isInDateFilter);
    const visibleOrders = dateFilteredOrders.filter((order) => orderStatusFilter === "all" || order.statusKey === orderStatusFilter);
    const orderTabs = [
      ["all", `All (${dateFilteredOrders.length})`],
      ["pending", `Pending (${dateFilteredOrders.filter((order) => order.statusKey === "pending").length})`],
      ["paid", `Paid (${dateFilteredOrders.filter((order) => order.statusKey === "paid").length})`],
      ["cancelled", `Cancelled (${dateFilteredOrders.filter((order) => order.statusKey === "cancelled").length})`],
    ];

    return (
      <section className="admin-orders-panel">
        <div className="admin-order-toolbar">
          <div className="admin-order-tabs">
            {orderTabs.map(([key, label]) => (
              <button className={orderStatusFilter === key ? "is-active" : ""} key={key} onClick={() => setOrderStatusFilter(key)}>{label}</button>
            ))}
          </div>
          <div className="admin-order-tools">
            <select value={orderDateFilter} onChange={(event) => setOrderDateFilter(event.target.value)}>
              {dateFilters.map(([key, label]) => <option value={key} key={key}>{label}</option>)}
            </select>
            <button className="admin-refresh" onClick={loadAdminData}>Refresh</button>
          </div>
        </div>

        <div className="admin-order-list">
          {visibleOrders.map((order) => (
            <article className="admin-order-card" key={order.id}>
              <div className="admin-order-main">
                <div>
                  <div className="admin-order-id-row">
                    <strong>{order.id}</strong>
                    <span className={`admin-order-status ${order.statusKey}`}>{order.status}</span>
                  </div>
                  <h4>{order.customer}</h4>
                  <p>{order.phone}</p>
                  <p>{order.address}</p>
                </div>
                <div className="admin-order-total">
                  <strong>{order.total}</strong>
                  <span>{order.date}</span>
                </div>
              </div>
              <div className="admin-order-items">
                <span>{order.item} × {order.quantity}</span>
              </div>
              <div className="admin-order-actions">
                <button className="mark-paid" onClick={() => saveAdmin(`/orders/${order.id}`, { status: "Paid", statusKey: "paid" }, "PATCH")}>✓ Mark as Paid</button>
                <button className="cancel-order" onClick={() => saveAdmin(`/orders/${order.id}`, { status: "Cancelled", statusKey: "cancelled" }, "PATCH")}>Cancel</button>
              </div>
            </article>
          ))}
          {visibleOrders.length === 0 && <p className="admin-order-empty">No orders match this filter.</p>}
        </div>
      </section>
    );
  }

  function TogglePill({ on = true }) {
    return <span className={`admin-toggle-pill ${on ? "is-on" : ""}`} />;
  }

  function AdminHomePanel() {
    const fallbackSections = [
      { id: "hero", title: "Hero Banner Carousel", note: "Full-screen image-only slider", action: "Manage banners >", visible: true },
      { id: "collections", title: "Collections Carousel", note: "Home collection cards - 1080 x 760 images", action: "Manage collections >", visible: true },
      { id: "bestsellers", title: "Trending Now Products", note: "Product carousel shown after collections", action: "Choose products >", visible: true },
      { id: "offer", title: "Campaign Banner Carousel", note: "Wide image-only promotional slider", action: "Manage banners >", visible: true },
      { id: "arrivals", title: "New Arrivals Products", note: "Fresh drops product carousel", action: "Choose products >", visible: true },
      { id: "reels", title: "Manosi in Motion Reels", note: "Video carousel with linked products", action: "Manage reels >", visible: true },
      { id: "badges", title: "Manosi Promises", note: "Trust and service promise icons", action: "Edit promises >", visible: true },
      { id: "testimonials", title: "Customer Testimonials", note: "Approved customer notes carousel", action: "Manage testimonials >", visible: true },
      { id: "instagram", title: "Instagram Feed", note: "Social media post preview grid", action: "Manage posts >", visible: true },
    ];
    const homeSections = liveHomepageSections.length ? liveHomepageSections : fallbackSections;
    const moveSection = (index, direction) => {
      const next = [...homeSections];
      const target = index + direction;
      if (target < 0 || target >= next.length) return;
      [next[index], next[target]] = [next[target], next[index]];
      saveAdmin("/homepage", next);
    };
    const addSection = () => {
      const title = window.prompt("Section name", "Instagram feed");
      if (!title) return;
      saveAdmin("/homepage", [...homeSections, { id: `section-${Date.now()}`, title, note: "New custom section", action: "Edit section >", visible: true }]);
    };
    const openSectionManager = (section) => {
      if (section.id === "bestsellers") {
        openHomeProductPicker("trending");
        return;
      }
      if (section.id === "arrivals") {
        openHomeProductPicker("arrivals");
        return;
      }
      const targetMap = {
        hero: "banners",
        categories: "collections",
        bestsellers: "products",
        offer: "banners",
        arrivals: "products",
        reels: "reels",
        collections: "collections",
        testimonials: "testimonials",
        badges: "settings",
        instagram: "homepage",
      };
      const target = targetMap[section.id] || "homepage";
      setActiveModule(target);
      setAdminNotice(`Opened ${section.title} manager`);
    };
    return (
      <section className="admin-home-panel">
        <button className="admin-primary-action" onClick={() => saveAdmin("/homepage", homeSections)}>Save & publish</button>
        <p className="admin-helper-copy">Use arrows to reorder - toggle to show/hide. Changes save to the local backend.</p>
        <div className="admin-home-list">
          {homeSections.map((section, index) => (
            <article key={section.id || section.title}>
              <div className="admin-reorder">
                <button aria-label={`Move ${section.title} up`} onClick={() => moveSection(index, -1)}><span className="material-symbols-rounded">keyboard_arrow_up</span></button>
                <button aria-label={`Move ${section.title} down`} onClick={() => moveSection(index, 1)}><span className="material-symbols-rounded">keyboard_arrow_down</span></button>
              </div>
              <div><strong>{section.title}</strong><span>{section.note}</span></div>
              <button onClick={() => openSectionManager(section)}>{section.action}</button>
              <button className="admin-toggle-button" onClick={() => saveAdmin("/homepage", homeSections.map((item) => item.id === section.id ? { ...item, visible: !item.visible } : item))}><TogglePill on={section.visible} /></button>
            </article>
          ))}
        </div>
        <button className="admin-add-link" onClick={addSection}>+ Add section (rich text, image strip, countdown, Instagram feed...)</button>
      </section>
    );
  }

  function AdminOffersPanel() {
    const fallbackCoupons = [
      { id: "JB50", code: "JB50", type: "% off", value: "8", minOrder: "No minimum", expires: "2026-12-31", active: true },
      { id: "DAZZLING20", code: "DAZZLING20", type: "% off", value: "5", minOrder: "No minimum", expires: "2026-12-31", active: true },
      { id: "WELCOME20", code: "WELCOME20", type: `Flat ${String.fromCharCode(8377)} off`, value: "200", minOrder: `${String.fromCharCode(8377)}5,000`, expires: "2026-09-30", active: false },
    ];
    const coupons = liveCoupons.length ? liveCoupons : fallbackCoupons;
    const updateCoupon = (coupon, patch) => {
      const id = coupon.id || coupon.code;
      saveAdmin("/coupons", coupons.map((item) => (item.id || item.code) === id ? { ...item, ...patch, id: patch.code || item.id || item.code } : item));
    };
    const addCoupon = () => {
      const code = `MANOSI${coupons.length + 1}`;
      saveAdmin("/coupons", [{ id: code, code, type: "% off", value: "5", minOrder: "No minimum", expires: "2026-12-31", active: true }, ...coupons]);
    };
    return (
      <section className="admin-coupon-panel">
        <button className="admin-primary-action" onClick={addCoupon}>+ Add coupon</button>
        <div className="admin-coupon-table">
          <div className="admin-coupon-head"><span>Code</span><span>Type</span><span>Value</span><span>Min order</span><span>Expires</span><span>Active</span><span /></div>
          {coupons.map((coupon) => (
            <article key={coupon.id || coupon.code}>
              <input defaultValue={coupon.code} onBlur={(event) => updateCoupon(coupon, { code: event.target.value })} />
              <select defaultValue={coupon.type} onChange={(event) => updateCoupon(coupon, { type: event.target.value })}><option>% off</option><option>{`Flat ${String.fromCharCode(8377)} off`}</option></select>
              <label><input defaultValue={coupon.value} onBlur={(event) => updateCoupon(coupon, { value: event.target.value })} /><span>{coupon.type === "% off" ? "%" : String.fromCharCode(8377)}</span></label>
              <input defaultValue={coupon.minOrder} onBlur={(event) => updateCoupon(coupon, { minOrder: event.target.value })} />
              <input type="date" defaultValue={coupon.expires} onBlur={(event) => updateCoupon(coupon, { expires: event.target.value })} />
              <button className="admin-toggle-button" onClick={() => updateCoupon(coupon, { active: !coupon.active })}><TogglePill on={coupon.active} /></button>
              <button onClick={() => saveAdmin("/coupons", coupons.filter((item) => (item.id || item.code) !== (coupon.id || coupon.code)))}>Delete</button>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function AdminTestimonialsPanel() {
    const rows = liveTestimonials.length ? liveTestimonials : [
      { id: "aarohi", name: "Aarohi Mehta", rating: 5, status: "Approved", featured: true, quote: "The ring exceeded my expectations - the craftsmanship is stunning and it arrived beautifully packaged. Customer service was wonderful throughout." },
      { id: "priya", name: "Priya Nair", rating: 4, status: "Approved", featured: false, quote: "Gorgeous earrings, exactly like the pictures. Delivery was quick and the return policy gave me peace of mind." },
      { id: "kavya", name: "Kavya Reddy", rating: 5, status: "Approved", featured: false, quote: "Bought this necklace for my anniversary and it is even more beautiful in person. The hallmark certification made me trust the purchase completely." },
    ];
    const addTestimonial = () => saveAdmin("/testimonials", [{ id: `testimonial-${Date.now()}`, name: "New Customer", rating: 5, status: "Pending", featured: false, quote: "Add customer testimonial here." }, ...rows]);
    const updateTestimonial = (row, patch) => saveAdmin("/testimonials", rows.map((item) => item.id === row.id ? { ...item, ...patch } : item));
    return (
      <section className="admin-review-panel">
        <button className="admin-primary-action" onClick={addTestimonial}>+ Add testimonial</button>
        <div className="admin-review-tabs"><button className="is-active">All</button><button>Pending</button><button>Approved</button><button>Rejected</button></div>
        <div className="admin-review-list">
          {rows.map((row, index) => {
            const stars = "?".repeat(row.rating || 5) + "?".repeat(Math.max(0, 5 - (row.rating || 5)));
            return (
            <article key={row.id || row.name}>
              <img src={imageUrl(row.avatar || `https://i.pravatar.cc/96?img=${index + 32}`)} alt="" />
              <div>
                <div className="admin-review-meta"><input defaultValue={row.name} onBlur={(event) => updateTestimonial(row, { name: event.target.value })} /><span>{stars}</span><b>{row.status}</b>{row.featured && <b className="soft">Featured</b>}</div>
                <textarea defaultValue={row.quote} onBlur={(event) => updateTestimonial(row, { quote: event.target.value })} />
                <div className="admin-text-actions">
                  <button onClick={() => updateTestimonial(row, { status: "Rejected" })}>Reject</button>
                  <button onClick={() => updateTestimonial(row, { featured: !row.featured })}>{row.featured ? "Unfeature" : "Feature"}</button>
                  <button onClick={() => saveAdmin("/testimonials", rows.filter((item) => item.id !== row.id))}>Delete</button>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </section>
    );
  }

  function AdminProductReviewsPanel() {
    const fallbackReviews = [
      { id: "review-1", customer: "Aarohi Mehta", product: "Natural Diamond Daily Ring", rating: 5, status: "pending", text: "Lightweight and beautifully finished." },
      { id: "review-2", customer: "Priya Nair", product: "Natural Diamond Earrings", rating: 4, status: "approved", text: "Looks premium and arrived safely." },
    ];
    const rows = liveReviews.length ? liveReviews : fallbackReviews;
    const visibleRows = rows.filter((row) => reviewFilter === "all" || row.status === reviewFilter);
    const updateReview = (row, patch) => saveAdmin("/reviews", rows.map((item) => item.id === row.id ? { ...item, ...patch } : item));
    const tabs = ["all", "pending", "approved", "rejected"];
    return (
      <section className="admin-review-panel">
        <div className="admin-review-tabs">{tabs.map((tabName) => <button key={tabName} className={reviewFilter === tabName ? "is-active" : ""} onClick={() => setReviewFilter(tabName)}>{tabName}</button>)}</div>
        {visibleRows.length ? <div className="admin-review-list">
          {visibleRows.map((row) => <article key={row.id}>
            <img src={imageUrl(row.avatar || "https://i.pravatar.cc/96?img=45")} alt="" />
            <div>
              <div className="admin-review-meta"><strong>{row.customer}</strong><span>{"?".repeat(row.rating || 5)}</span><b>{row.status}</b><b className="soft">{row.product}</b></div>
              <textarea defaultValue={row.text} onBlur={(event) => updateReview(row, { text: event.target.value })} />
              <div className="admin-text-actions"><button onClick={() => updateReview(row, { status: "rejected" })}>Reject</button><button onClick={() => updateReview(row, { status: "approved" })}>Approve</button><button onClick={() => saveAdmin("/reviews", rows.filter((item) => item.id !== row.id))}>Delete</button></div>
            </div>
          </article>)}
        </div> : <p className="admin-large-empty">No reviews in this filter.</p>}
      </section>
    );
  }

  function AdminCollectionsPanel() {
    const collectionRows = liveCollections.length ? liveCollections : [
      { id: "rings", name: "Love Forever", subtitle: "Rings Collection", category: "Rings", count: "8 products", image: "/src/assets/real-products/ring.webp", tone: "cocoa", visible: true },
      { id: "earrings", name: "Mini Me", subtitle: "Earrings Collection", category: "Earrings", count: "8 products", image: "/src/assets/real-products/earrings.webp", tone: "emerald", visible: true },
      { id: "necklace", name: "Everyday Line", subtitle: "Necklace Collection", category: "Necklace", count: "8 products", image: "/src/assets/real-products/necklace.webp", tone: "sand", visible: true },
      { id: "pendant", name: "Petals", subtitle: "Pendant Collection", category: "Pendant", count: "8 products", image: "/src/assets/real-products/pendant.webp", tone: "blush", visible: true },
    ];
    const addCollection = () => saveAdmin("/collections", [{ id: `collection-${Date.now()}`, name: "New Collection", subtitle: "Rings Collection", category: "Rings", count: "0 products", image: "/src/assets/real-products/ring.webp", tone: "cocoa", visible: true }, ...collectionRows]);
    const updateCollection = (collection, patch) => saveAdmin("/collections", collectionRows.map((item) => item.id === collection.id ? { ...item, ...patch } : item));
    return (
      <section className="admin-collections-panel">
        <button className="admin-primary-action" onClick={addCollection}>+ Add collection</button>
        <p className="admin-helper-copy">Collection card single image size: upload 1080 x 760 px. Display card image area: 460 x 345 px desktop, full-width crop on mobile.</p>
        <div className="admin-collection-grid">
          {collectionRows.map((collection) => (
            <article key={collection.id || collection.name}>
              <img src={imageUrl(collection.image)} alt="" />
              <label className="admin-upload-control">Upload 1080 x 760 image<input type="file" accept="image/*" onChange={(event) => readImageFile(event.target.files?.[0], (image) => updateCollection(collection, { image }))} /></label>
              <button onClick={() => { const image = window.prompt("Image path or URL", collection.image); if (image) updateCollection(collection, { image }); }}>Change image</button>
              <input defaultValue={collection.name} onBlur={(event) => updateCollection(collection, { name: event.target.value })} />
              <input defaultValue={collection.subtitle || ""} onBlur={(event) => updateCollection(collection, { subtitle: event.target.value })} placeholder="Rings Collection" />
              <select defaultValue={collection.category || "All"} onChange={(event) => updateCollection(collection, { category: event.target.value })}>
                <option>All</option>
                {menuCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
              <div><span>{collection.count}</span><button onClick={() => setAdminNotice("This collection card is linked to the home Collections carousel.")}>Home carousel linked</button></div>
              <div><button className="admin-toggle-button" onClick={() => updateCollection(collection, { visible: !collection.visible })}><TogglePill on={collection.visible} /></button><button onClick={() => saveAdmin("/collections", collectionRows.filter((item) => item.id !== collection.id))}>Delete</button></div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function AdminCustomersPanel() {
    const query = customerSearch.trim().toLowerCase();
    const customerRows = liveCustomers.filter((customer) => !query || customer.name?.toLowerCase().includes(query) || customer.phone?.toLowerCase().includes(query));
    return (
      <section className="admin-customers-panel">
        <input value={customerSearch} onChange={(event) => setCustomerSearch(event.target.value)} placeholder="Search by name or phone..." />
        <div className="admin-customer-table">
          <div><span>Name</span><span>Phone</span><span>Orders</span><span>Total spent</span><span>Last order</span></div>
          {customerRows.length ? customerRows.map((customer) => <article key={customer.phone || customer.name}><span>{customer.name}</span><span>{customer.phone}</span><span>{customer.orders}</span><span>{customer.totalSpent}</span><span>{customer.lastOrder}</span></article>) : <p>No customers found.</p>}
        </div>
        <p className="admin-helper-copy">Auto-built from order history now. Registered account data can replace this later.</p>
      </section>
    );
  }

  function AdminSettingsPanel() {
    const [draftSettings, setDraftSettings] = useState(liveSettings);
    useEffect(() => setDraftSettings(liveSettings), [adminData]);
    const paymentRows = [
      ["upi", "UPI"],
      ["card", "Credit / Debit card"],
      ["netbanking", "Net banking"],
      ["cod", "Cash on delivery"],
    ];
    const setSetting = (key, value) => setDraftSettings((current) => ({ ...current, [key]: value }));
    const setPayment = (key) => setDraftSettings((current) => ({ ...current, payments: { ...current.payments, [key]: !current.payments?.[key] } }));
    return (
      <section className="admin-settings-panel">
        <button className="admin-primary-action" onClick={() => saveAdmin("/settings", draftSettings)}>Save settings</button>
        <div className="admin-settings-grid">
          <article><h4>Gold rate</h4><div className="admin-review-tabs"><button className={draftSettings.goldMode !== "Manual" ? "is-active" : ""} onClick={() => setSetting("goldMode", "Auto (Live)")}>Auto (Live)</button><button className={draftSettings.goldMode === "Manual" ? "is-active" : ""} onClick={() => setSetting("goldMode", "Manual")}>Manual</button></div><label>Rate per gram (22kt)<span><b>₹</b><input value={draftSettings.goldRate || ""} onChange={(event) => setSetting("goldRate", event.target.value)} /><b>/ g</b></span></label><p>Live rate (auto-fetched): ₹0/g</p><button className="settings-line" onClick={() => setSetting("showGoldRate", !draftSettings.showGoldRate)}><span>Show gold rate in top bar</span><TogglePill on={draftSettings.showGoldRate} /></button></article>
          <article><h4>Announcement bar</h4><textarea value={draftSettings.announcement || ""} onChange={(event) => setSetting("announcement", event.target.value)} /><p>Shown in the dark strip at the very top of every page.</p></article>
          <article><h4>UPI Payment</h4><label>Your UPI ID<input value={draftSettings.upi || ""} onChange={(event) => setSetting("upi", event.target.value)} /></label><p>Customers will see a QR code + UPI link at checkout to pay directly to you.</p></article>
          <article><h4>Shipping</h4><label>Free shipping threshold<span><b>₹</b><input value={draftSettings.freeShippingThreshold || ""} onChange={(event) => setSetting("freeShippingThreshold", event.target.value)} /></span></label><p>Orders above this amount ship free; below it, a flat fee applies.</p></article>
          <article><h4>Payments & tax</h4>{paymentRows.map(([key, label]) => <button className="settings-line" key={key} onClick={() => setPayment(key)}><span>{label}</span><TogglePill on={draftSettings.payments?.[key]} /></button>)}<label>GST on gold<span><input value={draftSettings.gstGold || ""} onChange={(event) => setSetting("gstGold", event.target.value)} /><b>%</b></span></label></article>
        </div>
      </section>
    );
  }

  function AdminBannersPanel() {
    const fallbackBanners = layoutControls.slice(0, 4).map(([title, desktop, mobile, note], index) => ({ id: `banner-${index}`, title, desktop, mobile, note, image: ["/src/assets/real-products/ring-lifestyle.webp", "/src/assets/real-products/earrings-lifestyle.webp", "/src/assets/real-products/necklace-lifestyle.webp", "/src/assets/real-products/bracelet-lifestyle.webp"][index], active: true }));
    const banners = liveBanners.length ? liveBanners : fallbackBanners;
    const categoryBannerKeys = ["All", ...menuCategories];
    const categoryBanners = liveSettings.categoryBanners || {};
    const updateBanner = (banner, patch) => saveAdmin("/banners", banners.map((item) => item.id === banner.id ? { ...item, ...patch } : item));
    const updateCategoryBanner = (category, image) => saveAdmin("/settings", { ...liveSettings, categoryBanners: { ...categoryBanners, [category]: image } });
    const addBanner = () => saveAdmin("/banners", [{ id: `banner-${Date.now()}`, title: "New banner", desktop: "1920 x 980 desktop", mobile: "1080 x 1440 mobile", note: "Image-only", image: "/src/assets/real-products/ring-lifestyle.webp", active: true }, ...banners]);
    return (
      <section className="admin-banners-panel">
        <button className="admin-primary-action" onClick={addBanner}>+ Add banner</button>
        <p className="admin-helper-copy">
          Hero banner: 1920 x 980 px desktop, 1080 x 1440 px mobile. Collection card: 1080 x 760 px.
          <button onClick={() => setActiveModule("collections")}>Open collections</button>
        </p>
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">Shop page</p>
            <h4>Product category banners</h4>
            <p>Image only. Shown as a 200px banner on All Jewellery and category shop pages.</p>
          </div>
        </div>
        <div className="admin-image-board admin-category-banner-grid">
          {categoryBannerKeys.map((category) => {
            const image = shopBannerImage(category, categoryBanners);
            return (
              <article key={category}>
                <img src={imageUrl(image)} alt="" />
                <strong>{category === "All" ? "All Jewellery" : category}</strong>
                <label className="admin-upload-control">Upload banner image<input type="file" accept="image/*" onChange={(event) => readImageFile(event.target.files?.[0], (nextImage) => updateCategoryBanner(category, nextImage))} /></label>
                <button onClick={() => { const nextImage = window.prompt("Image path or URL", image); if (nextImage) updateCategoryBanner(category, nextImage); }}>Change image URL</button>
              </article>
            );
          })}
        </div>
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">Home banners</p>
            <h4>Homepage banner images</h4>
          </div>
        </div>
        <div className="admin-image-board admin-banner-grid">
          {banners.map((banner) => <article key={banner.id}>
            <img src={imageUrl(banner.image)} alt="" />
            <input defaultValue={banner.title} onBlur={(event) => updateBanner(banner, { title: event.target.value })} />
            <span>{banner.desktop}</span><span>{banner.mobile}</span>
            <textarea defaultValue={banner.note} onBlur={(event) => updateBanner(banner, { note: event.target.value })} />
            <label className="admin-upload-control">Upload banner image<input type="file" accept="image/*" onChange={(event) => readImageFile(event.target.files?.[0], (image) => updateBanner(banner, { image }))} /></label>
            <button onClick={() => { const image = window.prompt("Image path or URL", banner.image); if (image) updateBanner(banner, { image }); }}>Change image</button>
            <div><button className="admin-toggle-button" onClick={() => updateBanner(banner, { active: !banner.active })}><TogglePill on={banner.active} /></button><button onClick={() => saveAdmin("/banners", banners.filter((item) => item.id !== banner.id))}>Delete</button></div>
          </article>)}
        </div>
      </section>
    );
  }

  function AdminReelsPanel() {
    const fallbackReels = [
      { id: "daily-ring-story", productId: adminProducts[0]?.id, image: "/src/assets/real-products/ring-lifestyle.webp", videoUrl: "", active: true },
      { id: "office-sparkle", productId: adminProducts[1]?.id, image: "/src/assets/real-products/earrings-lifestyle.webp", videoUrl: "", active: true },
      { id: "necklace-edit", productId: adminProducts[2]?.id, image: "/src/assets/real-products/necklace-lifestyle.webp", videoUrl: "", active: true },
      { id: "pendant-glow", productId: adminProducts[3]?.id, image: "/src/assets/real-products/pendant-lifestyle.webp", videoUrl: "", active: true },
    ];
    const reels = liveReels.length ? liveReels : fallbackReels;
    const updateReel = (reel, patch) => saveAdmin("/reels", reels.map((item) => item.id === reel.id ? { ...item, ...patch } : item));
    const addReel = () => saveAdmin("/reels", [
      { id: `reel-${Date.now()}`, productId: adminProducts[0]?.id, image: "/src/assets/real-products/ring-lifestyle.webp", videoUrl: "", active: true },
      ...reels,
    ]);

    return (
      <section className="admin-reels-panel">
        <button className="admin-primary-action" onClick={addReel}>+ Add reel</button>
        <p className="admin-helper-copy">Only video and linked product are needed here. Video auto plays on the home page; users see only mute and fullscreen controls.</p>
        <div className="admin-reel-grid">
          {reels.map((reel) => {
            const selectedProduct = adminProducts.find((product) => product.id === reel.productId || product.sku === reel.productId);
            const productQuery = (reelProductSearch[reel.id] || "").trim().toLowerCase();
            const matchingProducts = adminProducts
              .filter((product) => !productQuery || product.name.toLowerCase().includes(productQuery) || product.sku?.toLowerCase().includes(productQuery) || product.category?.toLowerCase().includes(productQuery))
              .slice(0, 80);
            const selectProducts = selectedProduct && !matchingProducts.some((product) => product.id === selectedProduct.id)
              ? [selectedProduct, ...matchingProducts]
              : matchingProducts;
            return (
              <article key={reel.id}>
                {reel.videoUrl ? (
                  <video src={reel.videoUrl} poster={imageUrl(selectedProduct?.lifestyle || selectedProduct?.image)} muted loop playsInline />
                ) : (
                  <img src={imageUrl(selectedProduct?.lifestyle || selectedProduct?.image || "/src/assets/real-products/ring-lifestyle.webp")} alt="" />
                )}
                <label>Video URL<input defaultValue={reel.videoUrl || ""} onBlur={(event) => updateReel(reel, { videoUrl: event.target.value })} placeholder="https://...mp4 or Cloudinary video URL" /></label>
                <label className="admin-upload-control">Upload video file<input type="file" accept="video/*" onChange={(event) => readVideoFile(event.target.files?.[0], (videoUrl) => updateReel(reel, { videoUrl }))} /></label>
                <label>Search linked product<input value={reelProductSearch[reel.id] || ""} onChange={(event) => setReelProductSearch((current) => ({ ...current, [reel.id]: event.target.value }))} placeholder="Search by product name, SKU, category..." /></label>
                <label>Linked product<select value={selectedProduct?.id || reel.productId || ""} onChange={(event) => updateReel(reel, { productId: event.target.value })}>
                  {selectProducts.map((product, index) => <option value={product.id} key={`${product.id}-reel-product-${index}`}>{product.name} - {product.sku}</option>)}
                </select></label>
                {selectedProduct && <p className="admin-reel-linked">Linked: {selectedProduct.name} ({selectedProduct.sku})</p>}
                <div>
                  <button className="admin-toggle-button" onClick={() => updateReel(reel, { active: !reel.active })}><TogglePill on={reel.active} /></button>
                  <button onClick={() => saveAdmin("/reels", reels.filter((item) => item.id !== reel.id))}>Delete</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  const moduleTitles = {
    dashboard: "Dashboard",
    products: "Products",
    pricing: "Bulk Pricing",
    orders: "Orders",
    homepage: "Homepage",
    reels: "Reels",
    banners: "Banners",
    offers: "Offers & coupons",
    testimonials: "Testimonials",
    reviews: "Product Reviews",
    collections: "Collections",
    customers: "Customers",
    settings: "Settings",
  };

  return (
    <section className="admin-shell admin-v2">
      <aside className="admin-sidebar">
        <button className="admin-logo" onClick={() => setPage("home")}>
          <strong>Manosi</strong>
          <span>Diamonds</span>
        </button>
        <p>Admin panel</p>
        <nav>
          {adminNav.map(([icon, key, label]) => (
            <button className={activeModule === key ? "is-active" : ""} key={key} onClick={() => setActiveModule(key)}>
              <span className="material-symbols-rounded">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={() => setPage("home")}>Log out</button>
      </aside>

      <div className="admin-dashboard">
        {adminNotice && <p className="admin-save-notice">{adminNotice}</p>}
        <div className={`admin-topbar ${["dashboard", "products", "orders", "homepage", "reels", "offers", "testimonials", "reviews", "collections", "customers", "settings"].includes(activeModule) ? "is-dashboard" : ""}`}>
          <div>
            <p className="eyebrow">Manosi Control Center</p>
            <h3>{moduleTitles[activeModule]}</h3>
          </div>
          <button onClick={() => setPage("home")}>View store</button>
        </div>

        {activeModule === "dashboard" && (
          <div className="admin-stat-row">
            <article><p>Products</p><strong>{totalInventory}</strong></article>
            <article><p>Orders</p><strong>{orderCount}</strong></article>
            <article><p>Pending fulfillment</p><strong>{pendingOrders}</strong></article>
            <article><p>Revenue (demo)</p><strong>₹{revenue.toLocaleString("en-IN")}</strong></article>
          </div>
        )}

        {activeModule === "dashboard" && (
          <>
            <section className="admin-table-card">
              <div className="admin-section-title">
                <h4>Recent orders</h4>
                <button>Create manual order</button>
              </div>
              <div className="admin-table">
                <div className="admin-table-head">
                  <span>Order</span><span>Customer</span><span>Status</span><span>Total</span>
                </div>
                <p className="admin-empty-row">No orders yet.</p>
              </div>
            </section>
          </>
        )}

        {activeModule === "products" && (
          <AdminProductsPanel />
        )}

        {activeModule === "pricing" && (
          <AdminBulkPricingPanel />
        )}

        {activeModule === "orders" && (
          <AdminOrdersPanel />
        )}

        {activeModule === "homepage" && (
          <AdminHomePanel />
        )}

        {activeModule === "reels" && (
          <AdminReelsPanel />
        )}

        {activeModule === "banners" && (
          <AdminBannersPanel />
        )}

        {activeModule === "offers" && (
          <AdminOffersPanel />
        )}

        {activeModule === "testimonials" && (
          <AdminTestimonialsPanel />
        )}

        {activeModule === "reviews" && (
          <AdminProductReviewsPanel />
        )}

        {activeModule === "collections" && (
          <AdminCollectionsPanel />
        )}

        {activeModule === "customers" && (
          <AdminCustomersPanel />
        )}

        {activeModule === "settings" && (
          <AdminSettingsPanel />
        )}
      </div>
      <AdminProductEditorModal />
      <AdminHomeProductPickerModal />
    </section>
  );
}

function Footer({ setPage, openCategory }) {
  const quickLinks = [
    ["Home", () => setPage("home")],
    ["Products", () => setPage("collections")],
    ["New Arrivals", () => setPage("new-arrivals")],
    ["Diamond Guide", () => setPage("education")],
    ["Concierge", () => setPage("concierge")],
    ["Wishlist", () => setPage("wishlist")],
  ];
  const serviceLinks = ["FAQ", "Shipping", "Returns & Exchange", "Store Locator", "Contact Us", "Certifications"];
  const policyLinks = ["Privacy Policy", "Terms & Conditions", "Return Policy", "Shipping Policy", "Franchise"];

  return (
    <footer className="site-footer">
      <section className="footer-newsletter">
        <h3>Stay updated for newsletter.</h3>
        <p>Special offers and latest lightweight diamond collections</p>
        <form onSubmit={(event) => event.preventDefault()}>
          <input type="email" placeholder="Email" aria-label="Email for newsletter" />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <section className="footer-main">
        <div className="footer-brand">
          <button className="footer-logo" onClick={() => setPage("home")}>
            <strong>MANOSI</strong>
          </button>
          <p>Lightweight natural diamond jewellery for Indian women who wear real diamonds every day.</p>
          <div className="footer-social" aria-label="Social links">
            <a href="https://www.facebook.com/" aria-label="Manosi Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 8.4V6.6c0-.8.4-1.2 1.3-1.2h1.6V2.3c-.8-.1-1.6-.2-2.4-.2-2.7 0-4.5 1.6-4.5 4.3v2H7.4v3.4h2.8V22h3.5V11.8h2.9l.5-3.4h-3Z" /></svg>
            </a>
            <a href="https://www.instagram.com/" aria-label="Manosi Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 2.5h9.6A4.7 4.7 0 0 1 21.5 7.2v9.6a4.7 4.7 0 0 1-4.7 4.7H7.2a4.7 4.7 0 0 1-4.7-4.7V7.2A4.7 4.7 0 0 1 7.2 2.5Zm0 2A2.7 2.7 0 0 0 4.5 7.2v9.6a2.7 2.7 0 0 0 2.7 2.7h9.6a2.7 2.7 0 0 0 2.7-2.7V7.2a2.7 2.7 0 0 0-2.7-2.7H7.2Zm4.8 3.3a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Zm0 2a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm4.6-2.4a1 1 0 1 1 0 2.1 1 1 0 0 1 0-2.1Z" /></svg>
            </a>
            <a href="https://www.linkedin.com/" aria-label="Manosi LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 8.8h3.3V21H5.2V8.8Zm1.7-5.9a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8ZM10.8 8.8H14v1.7h.1c.5-.9 1.7-2 3.5-2 3.7 0 4.4 2.5 4.4 5.7V21h-3.3v-6c0-1.4 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21h-3.3V8.8Z" /></svg>
            </a>
            <a href="mailto:hello@manosidiamonds.com" aria-label="Email Manosi">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.8 5h16.4c1 0 1.8.8 1.8 1.8v10.4c0 1-.8 1.8-1.8 1.8H3.8c-1 0-1.8-.8-1.8-1.8V6.8C2 5.8 2.8 5 3.8 5Zm.7 3.2v8.3h15V8.2l-7.5 5-7.5-5Zm.8-1.2 6.7 4.5L18.7 7H5.3Z" /></svg>
            </a>
            <span>f</span>
            <span>◎</span>
            <span>in</span>
            <span>@</span>
          </div>
        </div>

        <div>
          <h5>Quick Links</h5>
          {quickLinks.map(([label, action]) => <button key={label} onClick={action}>{label}</button>)}
        </div>

        <div>
          <h5>Categories</h5>
          {menuCategories.map((category) => (
            <button key={category} onClick={() => openCategory(category)}>{category}</button>
          ))}
        </div>

        <div>
          <h5>Customer Service</h5>
          {serviceLinks.map((link) => <button key={link} onClick={() => setPage("concierge")}>{link}</button>)}
        </div>

        <div>
          <h5>Policies</h5>
          {policyLinks.map((link) => <button key={link} onClick={() => setPage("education")}>{link}</button>)}
        </div>
      </section>

      <section className="footer-bottom">
        <div>
          <button onClick={() => setPage("education")}>Privacy Policy</button>
          <span>|</span>
          <button onClick={() => setPage("education")}>Terms & Conditions</button>
        </div>
        <p>&copy; 2026 Manosi. All rights reserved. <em>Develop by Diiamond Guru Professiional Service</em></p>
      </section>
    </footer>
  );
}

export function App() {
  const [page, setPageState] = useState("home");
  const [selected, setSelected] = useState(products[0]);
  const [collectionCategory, setCollectionCategory] = useState("All");
  const [favorites, setFavorites] = useState(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [storeConfig, setStoreConfig] = useState(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
  }, [query]);

  const visibleProducts = filtered.length ? filtered : products;

  useEffect(() => {
    fetch("http://127.0.0.1:5175/api/admin")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setStoreConfig(data))
      .catch(() => {});
  }, [page]);

  useEffect(() => {
    const validPages = new Set(["home", "collections", "product", "new-arrivals", "education", "bespoke", "concierge", "cart", "checkout", "wishlist", "admin"]);
    const openHashPage = () => {
      const hashPage = window.location.hash.replace("#", "");
      if (validPages.has(hashPage)) setPageState(hashPage);
    };
    openHashPage();
    window.addEventListener("hashchange", openHashPage);
    return () => window.removeEventListener("hashchange", openHashPage);
  }, []);

  function setPage(nextPage) {
    setPageState(nextPage);
    setMenuOpen(false);
    if (window.location.hash !== `#${nextPage}`) {
      window.history.pushState(null, "", `#${nextPage}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCategory(category) {
    setCollectionCategory(category);
    setPage("collections");
  }

  function openProduct(product) {
    setSelected(product);
    setSearchOpen(false);
    setPage("product");
  }

  function toggleFavorite(id) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addToCart(product) {
    setCartItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { product, quantity: 1 }];
    });
    setPage("cart");
  }

  function updateCartQuantity(id, quantity) {
    setCartItems((current) => current
      .map((item) => item.product.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)
    );
  }

  function removeFromCart(id) {
    setCartItems((current) => current.filter((item) => item.product.id !== id));
  }

  return (
    <main>
      {page !== "admin" && <header className="site-header">
        <nav className={`nav-left ${menuOpen ? "is-open" : ""}`}>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className="material-symbols-rounded">menu</span>
          </button>
          <button className={page === "collections" && collectionCategory === "All" ? "active-nav" : ""} onClick={() => openCategory("All")}>ALL JEWELLERY</button>
          {menuCategories.slice(0, 3).map((category) => (
            <button className={page === "collections" && collectionCategory === category ? "active-nav" : ""} key={category} onClick={() => openCategory(category)}>{category.toUpperCase()}</button>
          ))}
        </nav>
        <button className="brand" onClick={() => setPage("home")}>Manosi</button>
        <nav className="nav-right">
          {menuCategories.slice(3).map((category) => (
            <button className={page === "collections" && collectionCategory === category ? "active-nav" : ""} key={category} onClick={() => openCategory(category)}>{category.toUpperCase()}</button>
          ))}
          <IconButton label="search" onClick={() => setSearchOpen(true)} />
          <IconButton label="favorite" active={favorites.size > 0} onClick={() => setPage("wishlist")} />
          <IconButton label="shopping_bag" active={cartItems.length > 0} onClick={() => setPage("cart")} />
        </nav>
      </header>}

      {page === "home" && <HomePage setPage={setPage} openProduct={openProduct} openCategory={openCategory} homepageProducts={storeConfig?.homepageProducts} homepageReels={storeConfig?.reels} homepageCollections={storeConfig?.collections} />}
      {page === "collections" && <CollectionsPage favorites={favorites} toggleFavorite={toggleFavorite} openProduct={openProduct} initialCategory={collectionCategory} categoryBanners={storeConfig?.settings?.categoryBanners} />}
      {page === "product" && <ProductPage product={selected} favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} openProduct={openProduct} />}
      {page === "new-arrivals" && <NewArrivalsPage openProduct={openProduct} />}
      {page === "education" && <EducationPage />}
      {page === "bespoke" && <BespokePage setCartOpen={() => setPage("cart")} />}
      {page === "concierge" && <ConciergePage notice={notice} setNotice={setNotice} />}
      {page === "cart" && <CartPage cartItems={cartItems} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} setPage={setPage} />}
      {page === "checkout" && <CheckoutPage cartItems={cartItems} setNotice={setNotice} setPage={setPage} />}
      {page === "wishlist" && <WishlistPage favorites={favorites} toggleFavorite={toggleFavorite} openProduct={openProduct} />}
      {page === "admin" && <AdminPage cartItems={cartItems} favorites={favorites} setPage={setPage} />}

      {page !== "admin" && <Footer setPage={setPage} openCategory={openCategory} />}

      {searchOpen && (
        <aside className="drawer">
          <button className="close" onClick={() => setSearchOpen(false)} aria-label="Close search">
            <span className="material-symbols-rounded">close</span>
          </button>
          <h3>Search Manosi</h3>
          <input autoFocus placeholder="Rings, earrings, necklaces..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <div className="drawer-list">
            {visibleProducts.map((product, index) => (
              <button key={`${product.id}-search-${product.sku || index}`} onClick={() => openProduct(product)}>
                <img src={imageUrl(product.image)} alt="" />
                <span>{product.name}</span>
              </button>
            ))}
          </div>
        </aside>
      )}

    </main>
  );
}
