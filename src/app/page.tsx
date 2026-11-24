import { Hero } from "@/components/hero";
import { FeaturedProperties } from "@/components/featured-properties";
import { ActiveListingSection } from "@/components/active-listing";
import { IdxPropertySearch } from "@/components/idx-property-search";
import { Highlights } from "@/components/highlights";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

// Only facts supplied by the business are described here — no address, phone, reviews or licence data.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: `${site.agentName}, ${site.designation}`,
  description:
    "Real estate guidance for buying, selling, and investing in San Antonio and surrounding Texas communities.",
  image: site.url ? `${site.url}/brand/ashley-barnes-portrait.jpg` : undefined,
  url: site.url ?? undefined,
  telephone: site.phone ?? undefined,
  parentOrganization: { "@type": "Organization", name: site.brokerage },
  areaServed: site.serviceAreas.map((name) => ({
    "@type": "City",
    name,
    containedInPlace: { "@type": "State", name: "Texas" },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeader />
      <main id="main">
        <Hero />
        <FeaturedProperties />
        <ActiveListingSection />
        <IdxPropertySearch />
        <Highlights />
      </main>
    </>
  );
}
