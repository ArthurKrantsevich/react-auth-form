import type { CSSProperties, ReactNode } from "react";

/** Плавно раскрывает блок до его настоящей высоты: grid-template-rows 0fr → 1fr.
 *  delay — задержка появления, из неё складывается «лесенка» полей. */
export function Collapse({ open, delay = 0, children }: { open: boolean; delay?: number; children: ReactNode }) {
  return (
    <div className="collapse" data-open={open} style={{ "--delay": `${delay}ms` } as CSSProperties} aria-hidden={!open} inert={!open}>
      <div className="collapse-inner">{children}</div>
    </div>
  );
}
