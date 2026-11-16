import Image from "next/image";
import { Compass, House, Key } from "./icons";
import { site } from "@/lib/site";

const HIGHLIGHTS = [
  { icon: Compass, label: "Market Knowledge", text: "Greater San Antonio & Surrounding Markets" },
  { icon: House, label: "Real Estate Services", text: "Buying, Selling & Investing" },
  { icon: Key, label: "Personal Approach", text: "Strategy Built Around Your Goals" },
] as const;

export function Highlights() {
  return (
    <section aria-labelledby="highlights-heading" className="relative bg-white">
      <h2 id="highlights-heading" className="sr-only">
        What Ashley brings to your move
      </h2>
      <div className="mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-10 xl:px-12">
        <ul className="grid divide-y divide-navy/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {HIGHLIGHTS.map(({ icon: Icon, label, text }) => (
            <li
              key={label}
              className="group relative flex items-start gap-5 py-9 md:flex-col md:gap-0 md:px-8 md:py-14 md:first:pl-0 md:last:pr-0 lg:px-12"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 hidden h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 ease-luxe group-hover:scale-x-100 md:block"
              />
              <Icon className="mt-1 shrink-0 text-gold transition-transform duration-500 ease-luxe group-hover:-translate-y-1 md:mt-0" />
              <div>
                <h3 className="label text-gold-deep md:mt-6">{label}</h3>
                <p className="mt-2.5 font-serif text-[1.5rem] font-medium leading-[1.2] text-navy lg:text-[1.75rem]">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Affiliation lockup */}
      <div className="border-t border-navy/10 bg-ivory">
        <div className="mx-auto flex w-full max-w-[86rem] flex-col items-center justify-center gap-5 px-5 py-8 sm:flex-row sm:gap-8 sm:px-8">
          <Image
            src="/brand/ab-monogram-gold.png"
            alt=""
            width={273}
            height={222}
            sizes="60px"
            className="h-11 w-auto"
          />
          <p className="label whitespace-nowrap text-center text-[0.625rem] !tracking-[0.14em] text-navy sm:text-[0.6875rem] sm:!tracking-[0.2em]">
            {site.agentName} <span className="mx-1 text-gold sm:mx-1.5">|</span> {site.designation}{" "}
            <span className="mx-1 text-gold sm:mx-1.5">|</span> {site.brokerage}
          </p>
          <Image
            src="/brand/jpar-real-estate-logo.png"
            alt="JPAR Real Estate logo"
            width={750}
            height={472}
            sizes="76px"
            className="h-11 w-auto"
          />
        </div>
      </div>
    </section>
  );
}
