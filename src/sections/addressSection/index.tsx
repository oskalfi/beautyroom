import Image from "next/image";
import styles from "./AddressSection.module.css";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const PLACE = "YOUR_SALON_ADDRESS";

export const AddressSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Расположение</h2>

      <a
        href="https://waze.com/ul?q=Jerusalem%20Blvd%2033%2C%20Tel%20Aviv-Yafo&navigate=yes"
        className={styles.contentWrapper}
      >
        <div className={styles.plateWrapper}>
          <div className={styles.plate}>
            <div className={styles.plateContent}>
              <Image
                className={styles.logo}
                src="/logoKY.svg"
                alt="Logo"
                width={230}
                height={230}
              />
            </div>
            <div className={styles.stickerBack}></div>
          </div>
        </div>

        <address className={styles.address}>
          <img src="/waze.svg" alt="Waze icon" className={styles.wazeIcon} />
          Jerusalem Blvd 33, Tel Aviv-Yafo
        </address>
      </a>
      <img className={styles.map} src="/map.png" alt="Map" />
    </section>
  );
};
