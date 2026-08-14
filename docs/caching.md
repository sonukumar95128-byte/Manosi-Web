# Caching

`vercel.json` is strict JSON — it has no comment syntax, and Vercel rejects the
whole config (failing the deploy silently) if it contains an unrecognised key.
So the reasoning lives here instead.

## `/assets/*.js` and `*.css` — one year, immutable

Vite writes a content hash into these filenames, so a new build produces a new
URL. The old URL can never need to change, which is exactly what `immutable`
promises. Without this Vercel serves them as `max-age=0, must-revalidate` and
every visitor re-validates the bundle on every page load.

## `/assets/*` images — one day

Files in `public/` keep their filenames across builds, so a year of caching
would strand anyone who replaced a placeholder image. A day plus
`stale-while-revalidate` gets most of the benefit without that trap.

## `/api/storefront` — 60 seconds at the CDN

Set in `api/_router.mjs`, not here, because it is per-route.

Every page view hit this route for a 241 KB payload that is identical for all
visitors, costing one function invocation and two Neon queries each time (about
a second, warm). `s-maxage=60` lets Vercel's CDN answer instead, so the database
is queried roughly once a minute no matter how much traffic arrives;
`stale-while-revalidate=300` keeps the response instant while it refreshes in
the background.

**Trade-off:** an admin edit takes up to a minute to show on the storefront.

## Everything else — never cached

`api/index.mjs` defaults to `private, no-store, max-age=0` and a route has to
opt in by returning `cacheControl`. Admin responses carry orders, invoices and
customer details, so the default has to be "do not store" rather than something
a shared cache might hold and hand to the next visitor.
