import Image from "next/image";
import styles from "./AdvantagesComponent.module.css";

const AdvantagesComponent = () => {
    return (
        <section className={styles.section}>

            <Image
                src="/3rdBunner.svg"
                alt=""
                fill
                priority
                className={styles.background}
            />

            <Image
                src="/2nd%20Bunner.svg"
                alt=""
                fill
                priority
                className={`${styles.background} ${styles.mobileBackground}`}
            />

            <div className={styles.container}>

                <div className={styles.titleBlock}>

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
                            width={48}
                            height={48}
                            className={`${styles.star} ${styles.star2}`}
                        />

                        <Image
                            src="/star-24.png"
                            alt=""
                            width={42}
                            height={42}
                            className={`${styles.star} ${styles.star3}`}
                        />

                    </div>

                    <h2>
                        Чому батьки
                        <br />
                        обирають БДЮТ?
                    </h2>

                </div>

                <div className={styles.stats}>

                    <div className={styles.item}>
                        <Image
                            src="/trophy.png"
                            alt=""
                            width={85}
                            height={85}
                        />

                        <div>
                            <h3>50+</h3>
                            <p>перемог щороку</p>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <Image
                            src="/persons.png"
                            alt=""
                            width={85}
                            height={85}
                        />

                        <div>
                            <h3 className={styles.blue}>1000+</h3>
                            <p>вихованців</p>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <Image
                            src="/icons8-painting-64.png"
                            alt=""
                            width={85}
                            height={85}
                        />

                        <div>
                            <h3 className={styles.pink}>20+</h3>
                            <p>гуртків</p>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <Image
                            src="/icons8-study-66.png"
                            alt=""
                            width={85}
                            height={85}
                        />

                        <div>
                            <h3 className={styles.purple}>20+</h3>
                            <p>педагогів</p>
                        </div>
                    </div>

                </div>

            </div>

        </section>
    );
};

export default AdvantagesComponent;