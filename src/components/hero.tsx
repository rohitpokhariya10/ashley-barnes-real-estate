import Link from "next/link";
import type { CSSProperties } from "react";
import { AgentCard } from "./agent-card";
import { IntentLink } from "./intent-link";
import { LeadForm } from "./lead-form";
import { ArrowRight, Check } from "./icons";
import { site } from "@/lib/site";

const TRUST = [
  "Personalized Real Estate Guidance",
  "Professional Negotiation",
  "Clear & Consistent Communication",
] as const;

const delay = (step: number) => ({ "--d": step }) as CSSProperties;

export function Hero() {
  const explore = (
    <>
      Explore Homes <ArrowRight className="btn-arrow text-gold-light" />
    </>
  );

  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      {/* Navy architectural panel behind the consultation form */}
      <div
        aria-hidden
        className="reveal-fade absolute inset-y-0 right-0 -z-10 hidden w-[max(17.5rem,calc(50vw-24rem))] bg-navy lg:block"
      >
        <span className="absolute inset-y-0 left-3 w-px bg-gold-light/30" />
      </div>

      <div className="hero-grid mx-auto w-full max-w-[86rem] px-5 pb-16 pt-10 sm:px-8 md:pt-14 lg:px-10 lg:pb-20 lg:pt-16 xl:px-12">
        {/* 1 — Eyebrow + headline */}
        <header className="hero-head">
          <p className="reveal flex items-center gap-4" style={delay(0)}>
            <span aria-hidden className="reveal-draw block h-px w-10 bg-gold sm:w-14" style={delay(1)} />
            <span className="label text-gold-deep">Your Next Move Starts Here</span>
          </p>
          <h1
            id="hero-heading"
            className="mt-6 font-serif text-[clamp(2.625rem,10.5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.012em] text-navy md:text-[clamp(3.25rem,6.6vw,4rem)] lg:text-[clamp(3rem,5vw,3.75rem)] xl:text-[clamp(3.5rem,4.5vw,4.375rem)]"
          >
            <span className="reveal block" style={delay(1)}>
              Real Estate Decisions
            </span>
            <span className="reveal block" style={delay(2)}>
              Deserve a <em className="font-medium text-gold">Smarter Strategy.</em>
            </span>
          </h1>
        </header>

        {/* 2 — Supporting copy */}
        <div className="hero-copy mt-8 md:mt-10 xl:mt-12">
          <p
            className="reveal font-serif text-[1.5rem] italic leading-[1.3] text-navy sm:text-[1.625rem]"
            style={delay(3)}
          >
            Find Your Place. Maximize Your Opportunity. Move With Confidence.
          </p>
          <p className="reveal mt-5 text-[1.0625rem] leading-[1.75] text-navy/80" style={delay(4)}>
            Whether you&rsquo;re buying your first home, selling your current property, or exploring real estate
            investments, I&rsquo;ll help you navigate the process with thoughtful guidance, local market insight, and
            a strategy built around your goals.
          </p>
          <p
            className="reveal mt-6 border-l border-gold pl-4 text-[0.9375rem] font-medium leading-relaxed text-navy"
            style={delay(5)}
          >
            Serving San Antonio, Schertz, Cibolo, New Braunfels, and surrounding Texas communities.
          </p>
        </div>

        {/* 3 — Portrait + agent identity */}
        <div className="hero-portrait mt-10 self-start pl-3 md:mt-10 lg:mt-12 xl:mt-12">
          <AgentCard />
        </div>

        {/* 4 — Primary actions */}
        <div className="hero-actions reveal mt-10 flex flex-wrap gap-3 self-end md:mt-8 lg:mt-9 lg:self-start xl:self-end" style={delay(6)}>
          {site.routes.propertySearch ? (
            <Link href={site.routes.propertySearch} className="btn btn-navy grow">
              {explore}
            </Link>
          ) : (
            /* No property search / Buy page exists yet → open the form as a buyer enquiry. */
            <IntentLink intent={{ interest: "buying" }} className="btn btn-navy grow">
              {explore}
            </IntentLink>
          )}
          <IntentLink className="btn btn-outline grow">Let&rsquo;s Discuss Your Goals</IntentLink>
        </div>

        {/* 5 — Lead capture */}
        <div className="hero-form reveal mt-14 self-start lg:mt-0" style={delay(4)}>
          <LeadForm />
        </div>

        {/* 6 — Trust indicators */}
        <ul
          aria-label="What you can expect"
          className="hero-trust reveal mt-12 flex flex-col divide-y divide-gold/30 border-y border-gold/30 sm:flex-row sm:divide-x sm:divide-y-0 lg:mt-14 xl:mt-12"
          style={delay(7)}
        >
          {TRUST.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 py-4 text-[0.8125rem] sm:flex-auto font-semibold leading-snug tracking-[0.02em] text-navy sm:justify-center sm:px-4 sm:first:pl-0 sm:last:pr-0"
            >
              <Check className="shrink-0 text-gold" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
