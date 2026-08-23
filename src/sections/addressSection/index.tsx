import Image from "next/image";
import styles from "./AddressSection.module.css";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const PLACE = "YOUR_SALON_ADDRESS";

export const AddressSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Расположение</h2>

      <div className={styles.contentWrapper}>
        <Image
          className={styles.logo}
          src="/logoKY.svg"
          alt="Logo"
          width={230}
          height={230}
        />
        <address className={styles.address}>
          <a href="moovit://directions?dest_line1=Jerusalem%20Blvd%2033%2C%20Tel%20Aviv-Yafo">
            Jerusalem Blvd 33, Tel Aviv-Yafo
          </a>
        </address>
      </div>
      <img className={styles.map} src="/map.png" alt="Map" />
    </section>
  );
};
