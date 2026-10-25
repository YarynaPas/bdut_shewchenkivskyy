import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>

            <Image
                src="/footer.svg"
                alt=""
                fill
                priority
                className={styles.background}
            />

            <div className={styles.container}>

                <div className={styles.top}>

                    <div className={styles.left}>

                        <Image
                            src="/logo.png"
                            alt="БДЮТ"
                            width={140}
                            height={140}
                            className={styles.logo}
                        />

                        <div>

                            <h2>БДЮТ</h2>

                            <p>
                                Шевченківського району
                                <br />
                                м. Львова
                            </p>

                        </div>

                    </div>

                    <div className={styles.right}>

                        <div className={styles.item}>

                            <Image
                                src="/pin.png"
                                alt=""
                                width={34}
                                height={34}
                            />

                            <span>
                                вул. Грінченка, 4-А,
                                м. Львів
                            </span>

                        </div>

                        <div className={styles.item}>

                            <Image
                                src="/phone.png"
                                alt=""
                                width={34}
                                height={34}
                            />

                            <a href="tel:+380966194472">
                                +380 (96) 619 44 72
                            </a>

                        </div>

                        <div className={styles.item}>

                            <Image
                                src="/mail.png"
                                alt=""
                                width={34}
                                height={34}
                            />

                            <a href="mailto:bdut_sh_rn@ukr.net">
                                bdut_sh_rn@ukr.net
                            </a>

                        </div>

                        <div className={styles.item}>

                            <Image
                                src="/clock.png"
                                alt=""
                                width={34}
                                height={34}
                            />

                            <div>

                                <p>Пн-Пт: 08:00-20:00</p>

                                <p>Сб: 09:00-15:00</p>

                            </div>

                        </div>

                    </div>

                </div>

                <div className={styles.bottom}>

                    <span>
                        © 2026 БДЮТ Шевченківського району м. Львова
                    </span>

                </div>

            </div>

        </footer>
    );
};

export default Footer;