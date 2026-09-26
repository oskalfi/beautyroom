"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ContactLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pending.current !== null) clearTimeout(pending.current);
    },
    [],
  );

  return (
    <a
      href={href}
      className={className}
      data-press-feedback
      target={href.startsWith("tel:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        if (pending.current !== null) return;
        pending.current = setTimeout(() => {
          pending.current = null;
          if (href.startsWith("tel:")) {
            window.location.assign(href);
            return;
          }
          // Open only after the press animation. If popups are blocked,
          // follow the link in the current tab instead.
          const tab = window.open("about:blank", "_blank");
          if (tab) {
            tab.opener = null;
            tab.location.replace(href);
          } else {
            window.location.assign(href);
          }
        }, 150);
      }}
    >
      {children}
    </a>
  );
}
