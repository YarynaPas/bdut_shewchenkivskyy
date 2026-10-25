import Image from "next/image";
import styles from "./MapSectionComponent.module.css";
import MapComponent from "../MapComponent/MapComponent";

const MapSectionComponent = () => {
    return (
        <section className={styles.section}>
            <Image
                src="/3rdBunner.svg"
                alt=""
                fill
                priority
                className={styles.background}
            />

            <div className={styles.container}>
                <div className={styles.info}>
                    <div className={styles.titleWrapper}>
                        <h2>Де нас знайти?</h2>
                        <div className={styles.stars}>
                            <Image
                                src="/star-24.png"
                                alt=""
                                width={38}
                                height={38}
                                className={`${styles.star} ${styles.star1}`}
                            />
                            <Image
                                src="/star-24.png"
                                alt=""
                                width={28}
                                height={28}
                                className={`${styles.star} ${styles.star2}`}
                            />
                        </div>
                    </div>

                    <div className={styles.contacts}>
                        <div className={styles.contactItem}>
                            <Image
                                src="/pin.png"
                                alt=""
                                width={36}
                                height={36}
                            />
                            <span>
                                вул. Грінченка, 4-А,
                                <br />
                                м. Львів
                            </span>
                        </div>

                        <div className={styles.contactItem}>
                            <Image
                                src="/phone.png"
                                alt=""
                                width={36}
                                height={36}
                            />
                            <a href="tel:+380966194472">
                                +380 (96) 619 44 72
                            </a>
                        </div>

                        <div className={styles.contactItem}>
                            <Image
                                src="/mail.png"
                                alt=""
                                width={36}
                                height={36}
                            />
                            <a href="mailto:bdut_sh_rn@ukr.net">
                                bdut_sh_rn@ukr.net
                            </a>
                        </div>

                        <div className={styles.contactItem}>
                            <Image
                                src="/clock.png"
                                alt=""
                                width={36}
                                height={36}
                            />
                            <div>
                                <p>Пн-Пт: 08:00-20:00</p>
                                <p>Сб: 09:00-18:00</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.mapWrapper}>
                    <MapComponent />
                </div>
            </div>
        </section>
    );
};

export default MapSectionComponent;