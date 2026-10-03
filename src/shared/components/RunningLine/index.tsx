"use client";
import { useRef } from "react";
import { useNearViewport } from "@/shared/hooks/useNearViewport";
import styles from "./RunningLine.module.css";

type RunningLineProps = {
  facts: string[];
};

export const RunningLine = ({ facts }: RunningLineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref);
  return (
    <div ref={ref} className={styles.runningLine} data-media-ready={near}>
      <div className={styles.factsWrapper}>
        {[0, 1].map((copy) => (
          <div className={styles.factGroup} key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {facts.map((fact, index) => (
              <span className={styles.fact} key={index}>{fact}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
