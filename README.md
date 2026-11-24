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
| SABOR IDX search activation | `src/lib/idx.ts` (`mode: "auto"`) — see [IDX property search](#idx-property-search) | "Find Your Next Home" shows a disabled preview of the search filters, labelled "Search available after MLS activation"; its button opens the form as a buyer enquiry. It switches to the live search by itself within about five minutes of SABOR activating the URL. |
| Active listing confirmation | `src/lib/active-listing.ts` — see [My Active Listing](#my-active-listing) | The section shows the Zillow facts and the listing photo, with no "Listed by" credit. |

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
(601 Lonesome Trl, Lot 44, Driftwood, TX 78619 — Land, 5.44 acres, $355,000, MLS# 2008671).
The Zillow listing is the only source of truth. Only attributes stated on it are stored; land
has no beds, baths or floor area.

Checked against the team's Zillow screenshot of 2026-11-25: price (cut by $25K to $355,000 on
10/18), address, 5.44 acres and type ("Lot/land", "Unimproved Land"). Zillow blocks automated
access, so these cannot be re-checked from code.

Before publishing:

1. **Confirm the MLS number** (2008671) on the [Zillow listing](https://www.zillow.com/homedetails/601-Lonesome-Trl-44-Driftwood-TX-78619/464570153_zpid/)
   (Facts & features). It was supplied earlier and is not visible in that screenshot. Recheck the
   price there whenever the listing changes.
2. **Confirm representation.** The heading "My Active Listing" (requested by the client)
   implies Ashley represents the seller. Once the listing agreement confirms it, set
   `listedByAgent: true` to show "Listed by Ashley Barnes, REALTOR® · JPAR Real Estate".
   If Ashley is *not* the listing agent, retitle the section and get the listing broker's
   written permission to advertise it.
3. **Photo.** `public/properties/601-lonesome-trl-lot-44.jpg` is the listing's main aerial photo,
   cropped from the Zillow listing with the Zillow interface removed and published with the rights
   holder's permission (confirmed 2026-11-25). It is 869 × 556 px; if the listing broker or
   photographer supplies the original, higher-resolution file, replace it at the same path. Add
   `photo.credit` if they require a credit. The caption repeats the boundary notice printed on the
   original photo. Never hotlink Zillow images.

## IDX property search

`src/components/idx-property-search.tsx` ("Find Your Next Home") is driven entirely by
`src/lib/idx.ts`. The client-supplied SABOR MLS IDX URL is a search page hosted by the MLS's
provider (connectMLS), not an API: the site links to it or frames it, and never fetches, stores
or displays MLS data itself. No backend is needed for either.

**Status (checked 2026-11-25): blocked pending SABOR activation.** The supplied URL
`https://sabor-idx.connectmls.com/idx/spr/60F98AE5A0D0D516E063AA01110ABFC1/search` returns
`HTTP 403 — "This site has not been configured"`. `mode` is `"auto"`, so the section shows the
preview now and switches to the live search by itself once SABOR activates the URL.

### Modes

| `mode` | What visitors see | Use when |
|---|---|---|
| `"auto"` (current) | `"inactive"` until the supplied URL serves the live search, then `"hosted"` — see [Automatic activation](#automatic-activation-auto). Never switches on embedding. | Waiting for SABOR, and after activation. |
| `"inactive"` | A preview of the location, price, bedroom and bathroom filters and a Search Properties button, all disabled and labelled "Search available after MLS activation", plus "Start Your Home Search" (opens the form as a buyer enquiry). | Forcing the preview, e.g. if the automatic check misbehaves. |
| `"hosted"` | "Search Available Properties", opening the official search in a new tab. The preview is removed. | Forcing the live search link without the automatic check. |
| `"embed"` | The official search framed in the page (`src/components/idx-search-frame.tsx`): loaded as it nears the viewport, with a loading state, an "Open in a new tab" link that is always visible, a fallback message if the frame has not loaded after 15 seconds, and a skip link for keyboard users. The preview is removed. | SABOR has confirmed in writing that the search may be framed on this domain. |

An incomplete setup never reaches visitors. `"embed"` without an `https` `embedUrl` shows
`"hosted"`, and a `searchUrl` that is not `https` shows `"inactive"`. Both print a warning
during the build.

### Automatic activation (`auto`)

`src/lib/idx-availability.ts` checks the supplied URL from the server, at most about once every
five minutes, using `src/lib/idx-probe.ts`: one plain `GET` of the search page, as a visitor's
browser would first load it. It reads only the status and the page shell (which holds no listing
data). It calls no provider API and adds no query parameters.

| Provider response | Result |
|---|---|
| The "This site has not been configured" page (HTTP 403 today) | Preview (approval pending). |
| HTTP 200, HTML, same address, serving the connectMLS IDX search app | Live search ("hosted"). |
| Any other page, including an HTTP 200 that is not the search app, a 404, or a redirect to another address | Preview. A 200 alone is not proof. |
| Network error, timeout (8 s), HTTP 5xx, 408 or 429 | No change: the page keeps its last state and the check is retried about one interval later. |

The result is cached with Next.js `use cache` (`cacheLife`, revalidating every 300 seconds), so
the homepage stays prerendered and is regenerated in the background on the deployed site. No new
build or deployment is needed when SABOR activates the URL, and visitors never wait on the
provider. One check runs during each build. If the provider cannot be reached during a build, that
build shows the preview until the next successful check.

Limitations:

- **Signature-based.** "Live" means the provider serves its search app (`ng-app="app"` and
  `assets/js/listing/criteria.js`) at the configured address. If connectMLS changes its app, the
  check stops matching and the section stays on the preview (it never shows a broken link). If
  SABOR confirms activation but the preview is still showing after about ten minutes, open the URL
  in a browser and, if the search works, set `mode: "hosted"`.
- **Same URL only.** If SABOR issues a different search URL, update `searchUrl` and redeploy.
- **Embedding stays manual.** `auto` only ever shows the hosted search link. Framing still needs
  SABOR's written approval and `mode: "embed"`.
- **Provider permission.** SABOR publishes no `robots.txt` and nothing that addresses automated
  checks. The consumer terms of use forbid scraping to obtain information; this check reads no
  listing or user data, but confirm with SABOR that it is acceptable (see below). To stop the
  checks, set `mode` to `"inactive"` or `"hosted"`.

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
   - any **attribution or disclaimer** text required beside the search;
   - that an automated **availability check** of the search URL from this site's server (one
     request about every five minutes) is acceptable.

### Activation steps

If SABOR activates the supplied URL, the section switches to the live search by itself within
about five minutes. Nothing needs to be changed or redeployed. Then:

1. Open the site and the search URL in a browser. Check that "Search Available Properties" appears
   and that the live search loads and its filters return results.
2. If SABOR requires attribution or disclaimer text, paste it verbatim into `disclaimer` in
   `src/lib/idx.ts` and redeploy.
3. If SABOR issued a **different** search URL, set `searchUrl` to it and redeploy; `auto` then
   checks the new URL.
4. Only if SABOR approved framing: set `embedUrl` to the `src` of the `<iframe>` in their
   embed code, and `mode: "embed"`. If their embed code is a script rather than an `<iframe>`, it
   cannot go in `embedUrl`; it needs a small component change instead.
   Run `npm run lint && npm run build`, open a pull request, and check the section on the Vercel
   preview at desktop and mobile widths. After deploying, the frame must show the working search
   on the production domain, not a 403, refusal or blank page; if it does not, set `mode` back to
   `"auto"` or `"hosted"`.

To try a mode on a preview deployment without editing the file, set `IDX_MODE` (and
`IDX_EMBED_URL` / `IDX_SEARCH_URL` as needed) as environment variables for that environment and
redeploy. They override `src/lib/idx.ts`. `IDX_CHECK_INTERVAL_SECONDS` (default 300, allowed
30–3600) changes how often `auto` checks.
