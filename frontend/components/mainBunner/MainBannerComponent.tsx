import Image from "next/image";
import styles from "./MainBannerComponent.module.css";
import Link from "next/link";

const MainBannerComponent = () => {
    return (
        <section className={styles.banner}>

            <Image
                src="/mainBunner.svg"
                alt="Background"
                fill
                priority
                className={styles.backgroundMAIN}
            />

            <Image
                src="/star-24.png"
                alt=""
                width={25}
                height={25}
                className={`${styles.star} ${styles.star1}`}
            />

            <Image
                src="/star-24.png"
                alt=""
                width={31}
                height={31}
                className={`${styles.star} ${styles.star2}`}
            />

            <Image
                src="/star-24.png"
                alt=""
                width={22}
                height={22}
                className={`${styles.star} ${styles.star3}`}
            />

            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>
                        Будинок дитячої та
                        <br />
                        юнацької творчості
                        <br />
                        Шевченківського
                        <br />
                        району
                    </h1>

                    <p>
                        простір творчості, розвитку та натхнення
                    </p>
                    <Link
                        href="/gurtky"
                        className={styles.button}
                    >
                        Записатись на гурток
                    </Link>
                </div>
            </div>
            {/*
            <Image
                src="/brushes.png"
                alt=""
                width={1200}
                height={220}
                className={styles.brushes}
            />
            */}

        </section>
    );
};

export default MainBannerComponent;