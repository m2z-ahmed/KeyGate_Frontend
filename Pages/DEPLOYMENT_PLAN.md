# Lethem deployment plan for Razorpay verification

Current constraint: we are using the free Vercel subdomain `https://lethem.vercel.app` and are not buying a custom domain yet.

## Recommended URL structure now

- Marketing homepage: `https://lethem.vercel.app/`
- Terms and Conditions: `https://lethem.vercel.app/terms-and-conditions`
- Privacy Policy: `https://lethem.vercel.app/privacy-policy`
- Refund and Cancellation Policy: `https://lethem.vercel.app/refund-and-cancellation-policy`
- Shipping / Delivery Policy: `https://lethem.vercel.app/shipping-delivery-policy`
- Authenticated React console: `https://lethem.vercel.app/console`
- Project pages: `https://lethem.vercel.app/console/:projectSlug/:page`

This keeps public Razorpay verification pages on the root website while moving the SPA product experience under `/console` on the same free Vercel subdomain.

## Later, if we want stricter separation without buying a domain

Create a second free Vercel project for the console, for example:

- Public website: `https://lethem.vercel.app/`
- Console app: `https://lethem-console.vercel.app/`

That requires updating Auth0 allowed callback/logout URLs and CORS origins for both Vercel URLs.

## Vercel routing note

Because this is a Vite single-page app, Vercel should rewrite all routes to `index.html`. The client router now renders public pages for the URLs above and renders the authenticated app under `/console`.
