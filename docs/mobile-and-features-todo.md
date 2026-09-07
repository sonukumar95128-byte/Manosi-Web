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

## Still needs you

**Mobile hero artwork.** The hero still crops 55% because it is showing the
desktop landscape banner. Admin → Banners → each hero slide has
"Upload mobile 1080 × 1440". With that in place nothing is cropped at all.
