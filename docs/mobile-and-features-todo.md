# Mobile optimisation and new features — work list

Measured on the live site at 375 × 812 (iPhone-class viewport) on 2026-09-08.
Numbers here are from the running page, not estimates.

## Confirmed problems

### 1. Hero banner is 70% cropped on mobile
The hero box is 375 × 740 (ratio 0.507) but the artwork is 1600 × 960
(ratio 1.667), so `object-fit: cover` throws away 70% of the image. On the
"Beauty in Every Moment" banner only "IN" and "ENT" of the wording survive and
the Explore Collection button is cut in half.

- 740px is also 91% of the viewport height, so nothing else is visible on load.
- The admin already supports a separate mobile image per hero slide
  (1080 × 1440); none are uploaded yet.

**Fix:** shorten the mobile hero, and upload 1080 × 1440 mobile artwork.

### 2. Shop page: filters occupy the whole first screen
On the shop page the first product sits at y = 1374 — nearly two full screens
of scrolling past the banner and the filter panel (339 × 768) before a single
piece of jewellery appears.

**Fix:** collapse filters behind a "Filters" button on mobile.

### 3. Shop page is 36,418px tall
All 196 products render at once, two per row, 98 rows. That is roughly 45
screens of continuous scroll and a large amount of image loading.

**Fix:** show a page at a time with a "Load more" control.

### 4. Touch targets below 32px
235 buttons, links and inputs on the shop page are under 32px in one dimension;
31 on every other page (mostly footer links). The usual minimum is 44px.

**Fix:** raise the minimum size on mobile.

## Checked and NOT broken

- **No horizontal scrolling** on any page: document width is exactly 375
  everywhere (home, shop, product, cart, checkout, wishlist, education,
  concierge).
- **Testimonial name/date "overlap"** is a false positive. The cards carry
  `transform: rotate(-3deg)`, which inflates their axis-aligned bounding boxes;
  the layout underneath is correct.
- **Shop category banner** is not broken, just an unset placeholder: a
  2000 × 2000 lifestyle photo cropped into a 375 × 200 strip.
- **The `<picture>` element** added for mobile hero art does not affect layout
  (measures 0 × 0) and only one slide is opaque at a time.

## Requested features

### 5. Hover shows the model photo
On a product card, hovering should swap the packshot for the lifestyle image.
Every product already carries a `lifestyle` reference. Needs a touch-friendly
equivalent, since hover does not exist on a phone.

### 6. Compare
Let a customer pick several pieces and see them side by side — price, metal,
karat, diamond details, certificate. Needs selection state, a compare tray, and
a comparison view that works on a narrow screen.

## Order of work

1. Mobile hero height and crop
2. Shop filters behind a button on mobile
3. Shop pagination
4. Touch target sizes
5. Hover / tap for the model photo
6. Compare
