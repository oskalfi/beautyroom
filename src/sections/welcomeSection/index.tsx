import styles from "./styles.module.css";
import gsap from "gsap";
import SplitText from "gsap/src/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { UnderlineSVG } from "@/shared/assets/svg/Underline";

export const WelcomeSection = () => {
  const welcomeSection = useRef(null);

  useGSAP(() => {}, { scope: welcomeSection });

  return (
    <div ref={welcomeSection} className={styles.welcomeSection}>
      <img
        src="/main_bg.avif"
        alt="pretty female face"
        className={styles.backgroundImage}
      />
      <div className={styles.flowHeight}>
        <div className={styles.welcomeText}>
          <div className={styles.h1}>
            Beautiful skin is not a dream — it's a result
          </div>
          <div className={styles.address}>
            Facial skin care and treatment studio based
            <span className={styles.underlinedText}>
              in Tel Aviv - Yafo.
              <UnderlineSVG
                svgClassName={styles.underline}
                clipClassName={styles.clip}
              ></UnderlineSVG>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
