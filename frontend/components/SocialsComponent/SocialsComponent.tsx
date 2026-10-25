import Image from "next/image";
import Link from "next/link";
import styles from "./SocialsComponent.module.css";

const SocialsComponent = () => {
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

                <div className={styles.left}>

                    <div className={styles.titleWrapper}>

                        <h2>Наші соцмережі</h2>

                        <Image
                            src="/icons8-stars-80.png"
                            alt=""
                            width={54}
                            height={54}
                            className={styles.star}
                        />

                    </div>

                    <p>
                        Підписуйтеся та будьте в курсі всіх
                        <br />
                        новин та подій БДЮТ!
                    </p>

                    <Image
                        src="/sun.png"
                        alt=""
                        width={72}
                        height={72}
                        className={styles.sun}
                    />

                </div>

                <div className={styles.socials}>

                    <Link
                        href="https://www.facebook.com/groups/1011120795913357/"
                        target="_blank"
                        className={styles.social}
                    >

                        <Image
                            src="/icons8-facebook-69.png"
                            alt="Facebook"
                            width={110}
                            height={110}
                        />

                        <span>Facebook</span>

                    </Link>

                    <Link
                        href="https://www.instagram.com/b_d_u_t/"
                        target="_blank"
                        className={styles.social}
                    >

                        <Image
                            src="/icons8-instagram-69.png"
                            alt="Instagram"
                            width={110}
                            height={110}
                        />

                        <span>Instagram</span>

                    </Link>

                </div>

            </div>

        </section>
    );
};

export default SocialsComponent;