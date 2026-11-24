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
| SABOR IDX search activation | `src/lib/idx.ts` — see [IDX property search](#idx-property-search) | "Find Your Next Home" shows a disabled preview of the search filters, labelled "Search available after MLS activation"; its button opens the form as a buyer enquiry. |
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

`src/components/idx-property-search.tsx` ("Find Your Next Home") is driven entirely by
`src/lib/idx.ts`. The client-supplied SABOR MLS IDX URL is a search page hosted by the MLS's
provider (connectMLS), not an API: the site links to it or frames it, and never fetches, stores
or displays MLS data itself. No backend is needed for either.

**Status (checked 2026-11-25): blocked pending SABOR activation.** The supplied URL
`https://sabor-idx.connectmls.com/idx/spr/60F98AE5A0D0D516E063AA01110ABFC1/search` returns
`HTTP 403 — "This site has not been configured"`, so `mode` is `"inactive"`.

### Modes

| `mode` | What visitors see | Use when |
|---|---|---|
| `"inactive"` (current) | A preview of the location, price, bedroom and bathroom filters and a Search Properties button, all disabled and labelled "Search available after MLS activation", plus "Start Your Home Search" (opens the form as a buyer enquiry). | SABOR has not activated the search. |
| `"hosted"` | "Search Available Properties", opening the official search in a new tab. The preview is removed. | The search URL loads in a browser. |
| `"embed"` | The official search framed in the page (`src/components/idx-search-frame.tsx`): loaded as it nears the viewport, with a loading state, an "Open in a new tab" link that is always visible, a fallback message if the frame has not loaded after 15 seconds, and a skip link for keyboard users. The preview is removed. | SABOR has confirmed in writing that the search may be framed on this domain. |

An incomplete setup never reaches visitors. `"embed"` without an `https` `embedUrl` shows
`"hosted"`, and a `searchUrl` that is not `https` shows `"inactive"`. Both print a warning
during the build.

### Why the filters are only a preview

The connectMLS search has its own location, price, bedroom and bathroom filters and takes no
search criteria from another page. SABOR's published IDX options (a frameable link from the MLS
set-up tab, a site built by a SABOR-approved vendor, or a link to SABOR.com) document no URL
parameters, widget or API for passing criteria in. Filter fields on this page could therefore
not search anything, so they stay disabled and disappear once the provider's own search is
switched on.

Filters that show results directly on this site would need a licensed IDX data feed through a
SABOR-approved vendor (SABOR links the LERA IDX Data Feed Agreement for that route) and a
server-side integration that keeps feed credentials off the browser. That is a separate project
and is not needed for the hosted or framed search.

### What the team needs from SABOR

1. The **IDX agreement**, signed by the **designated broker** (JPAR) and by Ashley as the
   requesting agent, returned to SABOR (idx@sabor.com).
2. In the MLS: **Settings → Manage IDX Configuration → Add New Configuration**, entering this
   website's **production URL** (the same origin as `NEXT_PUBLIC_SITE_URL`; include both `www`
   and non-`www` if both will be used).
3. From SABOR IDX support (idx@sabor.com, 210-593-1206), written confirmation of:
   - **activation**, after their compliance review of the site;
   - the final **search URL** (it may differ from the one above);
   - whether the search may be **framed** on this domain (and on preview domains, if it will be
     tested there first) and, if so, the **embed code or frame URL**;
   - any **attribution or disclaimer** text required beside the search.

### Activation steps

1. Open the search URL in a browser. Check that the live search loads (not the 403 page) and that
   its filters return results.
2. In `src/lib/idx.ts`, edit `idxConfig`:
   - `searchUrl`: replace it only if SABOR issued a new URL;
   - `disclaimer`: paste any text SABOR requires, verbatim (otherwise leave `null`);
   - `mode: "hosted"`.
3. Only if SABOR approved framing: also set `embedUrl` to the `src` of the `<iframe>` in their
   embed code, and `mode: "embed"`. If their embed code is a script rather than an `<iframe>`, it
   cannot go in `embedUrl`; it needs a small component change instead.
4. Run `npm run lint && npm run build`, open a pull request, and check the section on the Vercel
   preview at desktop and mobile widths.
5. After merging and deploying, check the section on the production domain. In `"embed"` mode the
   frame must show the working search, not a 403, refusal or blank page; if it does not, set
   `mode` back to `"hosted"`.

To try a mode on a preview deployment without editing the file, set `IDX_MODE` (and
`IDX_EMBED_URL` / `IDX_SEARCH_URL` as needed) as environment variables for that environment and
redeploy. They are read at build time and override `src/lib/idx.ts`.
