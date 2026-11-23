# Ashley Barnes | REALTOR® | JPAR Real Estate

Real estate landing page built with Next.js (App Router), TypeScript and Tailwind CSS v4.

```bash
npm run dev     # http://localhost:3000
npm run lint
npm run build && npm start
```

## Configuration still required

| What | Where | Until it is set |
|---|---|---|
| Lead / CRM endpoint | `LEAD_WEBHOOK_URL` (+ optional `LEAD_WEBHOOK_SECRET`) in `.env.local` — see `.env.example` | The form validates, then tells the visitor the request was **not** sent. It never shows a false success. |
| Verified business phone | `site.phone` in `src/lib/site.ts` (E.164) | "Call Ashley" opens the form with "Phone Call" selected. |
| Full property search / Buy page | `site.routes.propertySearch` in `src/lib/site.ts` | "Explore Homes" scrolls to the featured properties below the hero. |
| Buy / Sell / Invest / About pages | `navigation` in `src/lib/site.ts` (add `href`) | Links open the form with the matching interest pre-selected. |
| Production URL | `NEXT_PUBLIC_SITE_URL` | No canonical / Open Graph URL is emitted. |
| SABOR IDX search activation | `site.idxSearch` in `src/lib/site.ts` — see [IDX property search](#idx-property-search) | "Find Your Next Home" shows a "Coming soon" state whose button opens the form as a buyer enquiry. |
| Active listing confirmation | `src/lib/active-listing.ts` — see [My Active Listing](#my-active-listing) | The section shows the supplied facts, no photo and no "Listed by" credit. |

The lead endpoint receives a JSON `POST`:

```json
{
  "source": "website-hero-consultation",
  "submittedAt": "ISO-8601",
  "fullName": "…",
  "phone": "+12105551234 | null",
  "email": "… | null",
  "interest": "Buying a Home | … | null",
  "priceRange": "$250,000 – $400,000 | … | null",
  "preferredContactMethod": "Phone Call | Text Message | Email | null"
}
```

## Brand assets

`public/brand/` holds the supplied portrait and JPAR logo (unaltered) plus transparent
Ashley Barnes logos extracted from the supplied variation sheet with
`scripts/extract-brand-assets.mjs`. Replace them with original vector/high-resolution
files when available — the portrait in particular is only 512 × 512 px.

## Featured properties

The five cards directly below the hero are maintained in `src/lib/properties.ts`.
Images are stored locally in `public/properties/` and optimized by Next.js.
Each card links to its original Zillow listing. This is a static selection, not
a live MLS feed; recheck prices and details before updating the data. See
[`docs/properties.md`](docs/properties.md) for source links and photo provenance.

## My Active Listing

`src/components/active-listing.tsx` renders the listing in `src/lib/active-listing.ts`
(601 Lonesome Trl, Lot 44, Driftwood, TX 78619 — Land, 5.44 acres, $380,000, MLS# 2008671).
Only attributes stated on the listing are stored; land has no beds, baths or floor area.

Before publishing:

1. **Confirm the facts** on the [Zillow listing](https://www.zillow.com/homedetails/601-Lonesome-Trl-44-Driftwood-TX-78619/464570153_zpid/).
   They are the values the team observed there; Zillow blocks automated access, so they
   could not be re-checked independently.
2. **Confirm representation.** The heading "My Active Listing" (requested by the client)
   implies Ashley represents the seller. Once the listing agreement confirms it, set
   `listedByAgent: true` to show "Listed by Ashley Barnes, REALTOR® · JPAR Real Estate".
   If Ashley is *not* the listing agent, retitle the section and get the listing broker's
   written permission to advertise it.
3. **Photo (optional).** Add one only with written permission from the rights holder
   (listing photographer/broker): save it under `public/properties/` and set `photo`
   (`src`, `alt`, optional `credit`). Never hotlink or copy Zillow images. Until then a
   decorative brand panel is shown.

## IDX property search

`src/components/idx-property-search.tsx` ("Find Your Next Home") links to the client-supplied
SABOR MLS IDX search. It is a provider-hosted page — not an API — and the site never fetches
or displays MLS data itself.

**Status (checked 2026-11-24): blocked pending SABOR activation.** The supplied URL
`https://sabor-idx.connectmls.com/idx/spr/60F98AE5A0D0D516E063AA01110ABFC1/search` returns
`HTTP 403 — "This site has not been configured"` from the provider, with or without a
referring site. Embedding could not be tested, because only the error page is served.
`site.idxSearch.verified` is therefore `false`, and the section shows "Coming soon" without
linking to the error page.

What the client (Ashley, with her designated broker) needs to do, per
[SABOR's IDX page](https://sabor.com/?p=2494) and SABOR's IDX activation steps:

1. Sign SABOR's **IDX agreement** — signed by the **designated broker** (JPAR) and by Ashley
   as the requesting agent — and return it to SABOR (idx@sabor.com).
2. In the MLS: **Settings → Manage IDX Configuration → Add New Configuration**, entering this
   website's **production URL** (the same origin as `NEXT_PUBLIC_SITE_URL`; include both
   `www` and non-`www` if both will be used).
3. Ask SABOR IDX support (idx@sabor.com, 210-593-1206) to **review the site for compliance
   and activate the configuration**. Ask them to confirm:
   - the final **search URL or embed code** for this site (it may differ from the URL above);
   - whether the search may be **framed** (SABOR calls it a "frameable link") and from which
     domains, including any `X-Frame-Options` / `frame-ancestors` restrictions;
   - any **attribution or disclaimer** text required on the page that links to or frames it.

When SABOR confirms activation:

1. Open the search URL in a browser and check that the live search loads (not the 403 page).
2. Update `site.idxSearch.url` if SABOR issued a new one, set `verified: true`, and redeploy.
   The section then shows "Search Available Properties", opening the search in a new tab.
3. Framing the search in the page is a separate, later change: do it only if SABOR confirms
   framing is allowed for this domain, and test it on the production domain. The link stays
   as a fallback either way.
