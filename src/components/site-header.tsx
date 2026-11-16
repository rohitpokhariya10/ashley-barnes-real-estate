"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IntentLink } from "./intent-link";
import { ArrowRight } from "./icons";
import { navigation, site, type NavItem } from "@/lib/site";

const MENU_ID = "site-menu";

function NavLink({
  item,
  className,
  onNavigate,
}: {
  item: NavItem;
  className: string;
  onNavigate?: () => void;
}) {
  if (item.href) {
    return (
      <Link
        href={item.href}
        className={className}
        onClick={onNavigate}
        aria-current={item.href === "/" ? "page" : undefined}
      >
        {item.label}
      </Link>
    );
  }
  return (
    <IntentLink intent={item.intent} className={className} onClick={onNavigate}>
      {item.label}
    </IntentLink>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main");
    const desktop = window.matchMedia("(min-width: 64rem)");
    const close = () => setOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        document.getElementById("menu-toggle")?.focus();
      }
    };
    document.body.style.overflow = "hidden";
    main?.setAttribute("inert", "");
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", close);
    return () => {
      document.body.style.overflow = "";
      main?.removeAttribute("inert");
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", close);
    };
  }, [open]);

  const brandLabel = `${site.agentName}, ${site.designation} — ${site.brokerage}, home`;

  return (
    <header
      className={`sticky top-0 z-50 bg-ivory transition-shadow duration-500 ${
        scrolled || open ? "shadow-[0_1px_0_rgb(20_43_70/0.08),0_14px_30px_-22px_rgb(14_32_54/0.5)]" : ""
      }`}
    >
      <a
        href="#main"
        className="label sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-navy focus:px-4 focus:py-3 focus:text-ivory"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-[4.5rem] w-full max-w-[86rem] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[5.5rem] lg:px-10 xl:px-12">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-5">
          <Link href="/" aria-label={brandLabel} className="flex shrink-0 items-center gap-3">
            {/* Compact: gold monogram + live wordmark */}
            <Image
              src="/brand/ab-monogram-gold.png"
              alt=""
              width={273}
              height={222}
              sizes="52px"
              className="h-10 w-auto sm:hidden"
            />
            <span className="flex flex-col sm:hidden" aria-hidden>
              <span className="font-serif text-[1.3rem] font-medium uppercase leading-none tracking-[0.12em] text-navy">
                Ashley Barnes
              </span>
              <span className="mt-1.5 text-[0.5625rem] font-bold uppercase leading-none tracking-[0.3em] text-gold-deep">
                Realtor<sup className="text-[0.6em]">®</sup> · JPAR San Antonio
              </span>
            </span>
            {/* Full horizontal logo */}
            <Image
              src="/brand/ashley-barnes-logo-horizontal.png"
              alt=""
              width={668}
              height={125}
              sizes="(min-width: 80rem) 256px, 224px"
              preload
              className="hidden h-[2.625rem] w-auto sm:block xl:h-12"
            />
          </Link>
          <span aria-hidden className="hidden h-9 w-px bg-navy/15 min-[87.5rem]:block" />
          <Image
            src="/brand/jpar-real-estate-logo.png"
            alt="JPAR Real Estate"
            width={750}
            height={472}
            sizes="64px"
            className="hidden h-9 w-auto min-[87.5rem]:block"
          />
        </div>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-9">
            {navigation.map((item) => (
              <li key={item.label}>
                <NavLink
                  item={item}
                  className="relative block py-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-navy/85 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 after:ease-luxe hover:text-navy hover:after:scale-x-100 aria-[current=page]:text-navy aria-[current=page]:after:scale-x-100"
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <IntentLink className="btn btn-navy hidden !min-h-12 !px-6 lg:inline-flex">
            Let&rsquo;s Connect
          </IntentLink>

          <button
            id="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={() => setOpen((value) => !value)}
            className="relative -mr-2 flex size-12 items-center justify-center lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="relative block h-3.5 w-7">
              <span
                className={`absolute left-0 h-px w-7 bg-navy transition-all duration-300 ease-luxe ${
                  open ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-px w-7 bg-gold transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-px bg-navy transition-all duration-300 ease-luxe ${
                  open ? "top-1/2 w-7 -rotate-45" : "top-full w-7"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-gold/45 to-transparent" />

      {/* Mobile menu */}
      <div
        id={MENU_ID}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[calc(4.5rem+1px)] z-40 overflow-y-auto bg-navy text-ivory lg:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto flex min-h-full max-w-xl flex-col px-6 pb-10 pt-6 sm:px-8">
          <ul>
            {navigation.map((item, index) => (
              <li
                key={item.label}
                className="reveal border-b border-ivory/10"
                style={{ "--d": index * 0.5 } as React.CSSProperties}
              >
                <NavLink
                  item={item}
                  onNavigate={() => setOpen(false)}
                  className="flex min-h-16 items-center justify-between font-serif text-[1.75rem] leading-none text-ivory transition-colors hover:text-gold-light aria-[current=page]:text-gold-light"
                />
              </li>
            ))}
          </ul>
          <IntentLink
            onClick={() => setOpen(false)}
            className="btn btn-gold-outline reveal mt-10 w-full"
            style={{ "--d": 4 } as React.CSSProperties}
          >
            Let&rsquo;s Connect <ArrowRight className="btn-arrow" />
          </IntentLink>
          <p className="label mt-auto pt-10 text-center text-ivory/60">
            {site.agentName} <span className="text-gold-light">|</span> {site.designation}{" "}
            <span className="text-gold-light">|</span> {site.brokerage}
          </p>
        </nav>
      </div>
    </header>
  );
}
