import Image from "next/image";
import styles from "./AboutBannerComponent.module.css";

const AboutBannerComponent = () => {
    return (
        <section className={styles.banner}>

            <Image
                src="/about_us.svg"
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

                <div className={styles.left}>

                    <h1>
                        <span>Про</span> нас
                    </h1>

                    <p>
                        Будинок дитячої та юнацької творчості Шевченківського
                        району м. Львова — заклад позашкільної освіти, де кожна
                        дитина може відкрити свої здібності, знайти нові
                        захоплення, навчитися працювати в команді та
                        реалізувати власний потенціал.
                    </p>

                    <div className={styles.mission}>

                        <div className={styles.iconCircle}>

                            <Image
                                src="/charity.png"
                                alt=""
                                width={50}
                                height={50}
                            />

                        </div>

                        <div className={styles.missionText}>
                            Наша місія — розкривати таланти дітей та надихати
                            їх на розвиток і досягати вершин разом.
                        </div>

                    </div>

                    <Image
                        src="/paper-plane.png"
                        alt=""
                        width={95}
                        height={95}
                        className={styles.plane}
                    />

                </div>

            </div>

        </section>
    );
};

export default AboutBannerComponent;