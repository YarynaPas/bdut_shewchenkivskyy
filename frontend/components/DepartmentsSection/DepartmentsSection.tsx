import Image from "next/image";
import Link from "next/link";
import styles from "./DepartmentsSection.module.css";
import {HiArrowRight} from "react-icons/hi";

const departments = [
    {
        id: 1,
        title: "Художньо-\nестетичний відділ",
        description:
            "Розвиваємо творчість, уяву та художній смак через мистецтво й декоративну творчість.",
        banner: "/1stPic.png",
        icon: "/icons8-paint-palette-100.png",
        color: "#e2a9f1",
    },
    {
        id: 2,
        title: "Гуманітарний\nвідділ",
        description:
            "Допомагаємо дітям розвивати мовлення, логіку, комунікацію та пізнавальні здібності.",
        banner: "/2ndPic.png",
        icon: "/icons8-book-100.png",
        color: "#aeddf4",
    },
    {
        id: 3,
        title: "Вокально-\nхореографічний\nвідділ",
        description:
            "Розкриваємо таланти через спів, танець, сценічне мистецтво та творчі виступи.",
        banner: "/3rdPic.png",
        icon: "/icons8-ballet-dancer-100.png",
        color: "#f4efa2",
    },
];

const DepartmentsSection = () => {
    return (
        <div className={styles.cards}>
            {departments.map((item) => (
                <article
                    key={item.id}
                    className={styles.card}
                >
                    <div className={styles.banner}>
                        <Image
                            src={item.banner}
                            alt={item.title}
                            width={500}
                            height={280}
                            className={styles.bannerImage}
                        />
                    </div>

                    <div className={styles.content}>
                        <div
                            className={styles.iconCircle}
                            style={{
                                borderColor: item.color,
                            }}
                        >
                            <Image
                                src={item.icon}
                                alt=""
                                width={58}
                                height={58}
                            />
                        </div>

                        <h3>
                            {item.title
                                .split("\n")
                                .map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                        </h3>

                        <div
                            className={styles.line}
                            style={{
                                background: item.color,
                            }}
                        />

                        <p>{item.description}</p>

                        <Link
                            href="/gurtky"
                            className={styles.button}
                        >
                            <span>
                                Переглянути гуртки
                            </span>

                            <div className={styles.arrow}>
                                <HiArrowRight/>
                            </div>
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default DepartmentsSection;