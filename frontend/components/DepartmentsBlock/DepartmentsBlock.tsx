import Image from "next/image";
import styles from "./DepartmentsBlock.module.css";
import DepartmentsSection from "../DepartmentsSection/DepartmentsSection";

const DepartmentsBlock = () => {
    return (
        <section className={styles.section}>
            {/* Фонова картинка на всю ширину та висоту */}
            <Image
                src="/BunnerBG.svg"
                alt=""
                fill
                priority
                className={styles.background1}
            />

            {/* Декоративні зірочки поверх фону */}
            <Image
                src="/star-24.png"
                alt=""
                width={50}
                height={50}
                className={`${styles.star} ${styles.star1}`}
            />

            <Image
                src="/star-24.png"
                alt=""
                width={40}
                height={40}
                className={`${styles.star} ${styles.star2}`}
            />

            {/* Основний контент */}
            <div className={styles.container}>
                <div className={styles.titleBlock}>
                    <h2>Наші гуртки</h2>
                    <Image
                        src="/star-24.png"
                        alt=""
                        width={55}
                        height={55}
                    />
                </div>

                <p className={styles.subtitle}>
                    Оберіть напрям, який найбільше
                    захоплює вашу дитину, та відкрийте
                    світ творчості, натхнення й розвитку
                    разом із нами.
                </p>

                {/* Рендеримо сам список гуртків/департаментів */}
                <DepartmentsSection />

            </div>
        </section>
    );
};

export default DepartmentsBlock;