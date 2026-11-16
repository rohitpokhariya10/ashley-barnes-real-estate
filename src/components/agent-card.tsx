import Image from "next/image";
import { IntentLink } from "./intent-link";
import { Phone } from "./icons";
import { site } from "@/lib/site";

/**
 * Ashley's portrait + identity. Stacks vertically in narrow columns and turns
 * into a horizontal card when its container is wide enough.
 */
export function AgentCard() {
  const callClass = "btn btn-gold-outline !min-h-12 w-full !px-4";
  const callLabel = (
    <>
      <Phone /> Call Ashley
    </>
  );

  return (
    <div className="@container relative h-full">
      {/* Offset gold frame */}
      <span
        aria-hidden
        className="reveal-fade pointer-events-none absolute -bottom-3 -left-3 right-3 top-3 border border-gold/55"
        style={{ "--d": 8 } as React.CSSProperties}
      />
      <article
        id="about"
        aria-labelledby="agent-name"
        className="reveal-unveil relative grid h-full grid-rows-[1fr_auto] bg-navy text-ivory shadow-card @md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] @md:grid-rows-1"
        style={{ "--d": 3 } as React.CSSProperties}
      >
        <div className="relative aspect-[8/9] w-full self-stretch overflow-hidden bg-navy-deep @md:aspect-auto @md:min-h-[17rem]">
          <Image
            src="/brand/ashley-barnes-portrait.jpg"
            alt="Portrait of Ashley Barnes, REALTOR® with JPAR Real Estate"
            fill
            preload
            sizes="(min-width: 87.5rem) 288px, (min-width: 80rem) 256px, (min-width: 64rem) 240px, (min-width: 48rem) 240px, 100vw"
            className="reveal-settle object-cover object-[50%_18%]"
            style={{ "--d": 3 } as React.CSSProperties}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-navy to-transparent @md:inset-y-0 @md:left-auto @md:right-0 @md:h-auto @md:w-1/4 @md:bg-gradient-to-l"
          />
        </div>

        <div className="flex flex-col justify-center px-5 pb-6 pt-5 @xs:px-6 @md:py-7 @md:pl-5 @md:pr-7">
          <h2 id="agent-name" className="font-serif text-[1.75rem] font-medium leading-none tracking-[0.01em]">
            {site.agentName}
          </h2>
          <p className="label mt-2.5 whitespace-nowrap text-[0.625rem] !tracking-[0.13em] text-gold-light @xs:!tracking-[0.2em]">
            {site.designation} <span className="mx-0.5 text-ivory/40">|</span> {site.brokerage}
          </p>
          <span aria-hidden className="mt-4 block h-px w-10 bg-gold-light/70" />
          <p className="mt-4 text-[0.875rem] leading-relaxed text-ivory/80">
            Here to help you make your next real estate move with confidence.
          </p>
          <div className="mt-5">
            {site.phone ? (
              <a href={`tel:${site.phone}`} className={callClass}>
                {callLabel}
              </a>
            ) : (
              /* No verified number on file yet → request a call through the form. */
              <IntentLink
                intent={{ contactMethod: "phone" }}
                className={callClass}
                aria-label="Call Ashley — request a phone call"
              >
                {callLabel}
              </IntentLink>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
