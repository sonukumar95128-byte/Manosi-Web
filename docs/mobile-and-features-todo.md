# Mobile audit and features — status

Everything below was measured or clicked on the running site at 375 × 812,
not estimated.

## Fixed

| Problem | Before | After |
|---|---|---|
| Shop: first product position | y = 1374 (two screens down) | y = 656 |
| Shop: page height | 36,418px (196 products at once) | 6,975px (24 + Load more) |
| Hero: how much of the banner is visible | 30% | 45%, and 100% once mobile art is uploaded |
| Hero: height | 740px (91% of the viewport) | 500px, locked to 3:4 |
| Home: controls under 40px | 100 | 19, and those are background reels and text links |
| Cart total vs checkout total | ₹69,397 vs ₹67,376 | identical |
| Carousels on a phone | arrows only | swipe, arrows kept |

### The cart was charging GST twice over
The cart added 3% on top of prices that already include GST, while the checkout
and the invoice back-calculate it out. The same basket read ₹69,397 in the cart
and ₹67,376 at checkout. The cart now uses `computeInvoiceTotals`, the same
function as the checkout and the invoice, so all three agree.

## Verified working

Clicked, not assumed:

- **Header** — menu opens and closes, search drawer opens, filters as you type
  (98 results for "ring"), closes.
- **Carousels** — hero, collections, trending, campaign, arrivals, reels,
  testimonials. All advance by arrow and by swipe; a vertical swipe is ignored
  so the page still scrolls.
- **Shop** — category 196 → 45, metal → 73, karat → 185, price → 166, sort low
  (₹6,554) and high (₹67,376), clear filters → 196, Load more 24 → 48.
- **Product** — 4 gallery thumbnails, image switches, counter tracks it,
  gold colour and purity select.
- **Cart** — add navigates to the cart, quantity up and down, totals recalculate.
- **Checkout** — 7 fields including State and GSTIN, 4 payment options.
- **Wishlist** — saves persist across pages.
- **Compare** — tray follows browsing, 12 attribute rows, clear works.
- **Layout** — no horizontal scrolling and no broken images on any of the
  eleven pages.

## Checked and deliberately left alone

- The testimonial name/date "overlap" a bounding-box scan reports is a false
  positive: the cards carry `rotate(-3deg)`, which inflates their axis-aligned
  boxes. The layout underneath is correct.
- Carousel dots measure 12px but their tap area is extended to 44px with a
  pseudo-element, which `getBoundingClientRect` does not count.

## Deferred

**Mobile hero artwork — parked on 2026-09-08 at Sonu's call.** The hero still
crops 55% because it shows the desktop landscape banner. The slot is ready
whenever the artwork is: Admin → Banners → each hero slide has
"Upload mobile 1080 × 1440". No code change will be needed.

## Banner status (2026-09-10)

**Campaign carousel (3 slides)** — the existing desktop artwork stayed
unchanged; only the mobile CSS box was fixed to match the artwork's own
~2.75:1 ratio (`aspect-ratio: 11 / 4` instead of a fixed height), so the full
desktop design shows on mobile too, just scaled down. Verified live:
323 × 117 box against a 2.749 art ratio - 100% visible.

**Shop category banners (8: All + 7 categories)** — replaced with the
photography Sonu supplied (from `Manosi banner/category/`), each cropped to
6:1 and titled in Playfair. No AI extension used - a straight `c_fill`
center-crop, since the source art already composes the product on the right
with calm space on the left. Live and verified for both "All" and "Rings".

Note for next time: a same-origin hash-only `navigate` in this environment can
reuse an already-loaded page without re-running its mount effect, so a
React app's one-time data fetch can go stale across a whole browsing session.
Force a real navigation (change the URL, not just the hash) when the data
should be fresh.

## Category banner re-crop + footer content + collections carousel (2026-09-10)

**Category banners re-cropped 6:1 → 3:1.** Sonu reported the Nosepins banner
cropping the jewellery out on mobile. Re-generated all 8 Cloudinary banners
(`c_fill,ar_3:1,g_center` + Playfair text overlay) at 1600×533. Fixing the
ratio alone wasn't enough - `.shop-banner` had no explicit `width`, so with
`aspect-ratio: 3/1` and `min-height: 160px` the browser derived width from
the height floor (480px) instead of filling a 375px viewport, causing real
overflow on every phone. Adding `width: 100%` fixed the overflow, but then
every real phone width (375-430px) was still hitting the 160px floor and
getting cropped against the 3:1 art - the exact bug being fixed. Reduced
`min-height` to 90px (only guards screens under 270px, which don't occur).
Verified live: 375×125 box vs 3.002 art ratio, 100% visible, no overflow,
across all 8 categories on both desktop and mobile.

**Footer content.** Every "Customer Service" link (FAQ, Shipping, Returns,
Store Locator, Certifications) opened the Concierge form, and every
"Policies" link (Privacy Policy, Terms, Return/Shipping Policy, Franchise)
opened the diamond 4Cs education page - clicking any of them showed the same
wrong content. Added `src/footerContent.js` (a content dictionary) and one
`InfoPage` component that renders real, site-grounded copy per slug (GST-
inclusive pricing, IGI certification, 30-day return/lifetime exchange, etc.
all matching what the rest of the site already states). Privacy Policy and
Terms use `[bracketed placeholders]` for legal facts that weren't supplied
(registered business name/address, grievance officer) rather than inventing
them - Sonu needs to fill those in before those two pages are legally
complete. Verified live: all 11 footer links now produce distinct
hash/title/content.

**Collections carousel - 2 cards on mobile.** Was 1 full-width card per
screen at ≤560px; changed to `--collection-visible: 2` with a 12px gap so it
reads as a row to swipe rather than one slide per screen. Verified live on a
375px viewport - two cards ("Love Forever", "Mini Me") sit side by side with
no overflow.
