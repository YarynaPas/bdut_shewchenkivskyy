import Image from "next/image";
import styles from "./gurtkyBanner.module.css";

const GurtkyBannerComponent = () => {
    return (
        <section className={styles.banner}>

            <Image
                src="/gurtkyBanner.svg"
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
                        <span>Наші гуртки</span>
                    </h1>

                    <p>
                        Оберіть напрям, який цікавить вашу дитину, і розкрийте її таланти разом з нами!
                        У БЮДТ кожна дитина знайде заняття до душі.
                    </p>


                </div>

            </div>

        </section>
    );
};

export default GurtkyBannerComponent;