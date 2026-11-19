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
