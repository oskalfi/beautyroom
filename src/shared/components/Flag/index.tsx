import { useId, type SVGProps } from "react";
import { LogoSVG } from "@/shared/components/Logo";
import styles from "./Flag.module.css";

type FlagProps = Omit<
  SVGProps<SVGSVGElement>,
  "children" | "dangerouslySetInnerHTML"
>;

const logoWidth = 180;
const logoHeight = (logoWidth * 119) / 254;

export function Flag({ className, ...props }: FlagProps) {
  const gradientId = `${useId()}-flag-gradient`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="212"
      height="295"
      viewBox="0 0 212 295"
      fill="none"
      role="img"
      aria-label="Beauty Room by Yael Kanter"
      className={[styles.flag, className].filter(Boolean).join(" ")}
      {...props}
    >
      <g transform={`scale(${212 / 1342} ${295 / 1886})`}>
        <path
          d="M0 940.267C0 1860.93 0.133333 1880.53 2.53333 1876.67C3.86667 1874.4 32.8 1824 66.6667 1764.67C100.533 1705.2 129.333 1654.93 130.667 1652.8L132.933 1649.07L199.333 1765.2L265.733 1881.33L331.467 1766.27C367.733 1703.07 397.867 1651.2 398.533 1650.93C399.067 1650.8 429.733 1703.47 466.667 1768C503.467 1832.53 534.133 1885.33 534.667 1885.33C535.2 1885.33 565.867 1832.53 602.667 1768C639.467 1703.47 670.133 1650.67 670.667 1650.67C671.2 1650.67 701.867 1703.47 738.667 1768C775.467 1832.53 806.133 1885.33 806.667 1885.33C807.2 1885.33 837.867 1832.53 874.667 1768C911.467 1703.47 942.133 1650.67 942.667 1650.67C943.2 1650.67 973.867 1703.47 1010.67 1768C1047.6 1832.53 1078.27 1885.2 1078.8 1885.07C1079.47 1884.8 1108.8 1834.27 1144 1772.67C1179.33 1711.07 1209.73 1658 1211.6 1654.93L1214.93 1649.07L1276.93 1757.6C1310.93 1817.2 1339.47 1866.93 1340.13 1868C1340.8 1869.2 1341.33 1480.8 1341.33 934.934V0.000552714H670.667H0V940.267Z"
          fill={`url(#${gradientId})`}
        />
        <defs>
          <linearGradient
            id={gradientId}
            x1="1.19896e-05"
            y1="845.5"
            x2="1341"
            y2="845.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F897A5" />
            <stop offset="1" stopColor="#F9CFB6" />
          </linearGradient>
        </defs>
      </g>
      <LogoSVG
        className={styles.logo}
        x={(212 - logoWidth) / 2}
        y={(295 - logoHeight - 30) / 2}
        width={logoWidth}
        height={logoHeight}
      />
    </svg>
  );
}
