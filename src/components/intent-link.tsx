"use client";

import type { ComponentPropsWithoutRef } from "react";
import { FORM_ANCHOR, type LeadIntent } from "@/lib/site";

export const INTENT_EVENT = "ab:lead-intent";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & { intent?: LeadIntent };

/**
 * Anchor to the consultation form. Works as a plain in-page link without
 * JavaScript; with it, the form is pre-filled with the visitor's intent and
 * the first field receives focus.
 */
export function IntentLink({ intent, onClick, children, ...rest }: Props) {
  return (
    <a
      {...rest}
      href={`/#${FORM_ANCHOR}`}
      onClick={(event) => {
        onClick?.(event);
        window.dispatchEvent(new CustomEvent<LeadIntent>(INTENT_EVENT, { detail: intent ?? {} }));
      }}
    >
      {children}
    </a>
  );
}
