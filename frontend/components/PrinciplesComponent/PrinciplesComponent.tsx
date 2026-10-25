import Image from "next/image";
import styles from "./PrinciplesComponent.module.css";

const principles = [
    {
        icon: "/care.png",
        title: "Довіра",
        text: "Будуємо відкриті та доброзичливі відносини між педагогами, вихованцями та батьками.",
        color: "#dfabed",
    },
    {
        icon: "/education.png",
        title: "Індивідуальність",
        text: "Підтримуємо здібності та інтереси кожної дитини, допомагаючи розкрити її потенціал.",
        color: "#aeddf4",
    },
    {
        icon: "/light-bulb.png",
        title: "Творчість",
        text: "Заохочуємо ініціативність, нестандартне мислення та прагнення до самовираження.",
        color: "#f4efa2",
    },
];

const PrinciplesComponent = () => {
    return (
        <section className={styles.section}>

            <div className={styles.container}>

                <div className={styles.left}>

                    <div className={styles.titleWrapper}>

                        <Image
                            src="/icons8-stars-80.png"
                            alt=""
                            width={54}
                            height={54}
                            className={styles.star}
                        />

                        <h2>
                            Наші
                            <br />
                            принципи
                        </h2>

                    </div>

                    <p>
                        У своїй роботі ми керуємось цінностями,
                        що допомагають створювати натхненне та
                        комфортне середовище для кожного.
                    </p>

                </div>

                <div className={styles.cards}>

                    {principles.map((item, index) => (

                        <div
                            key={index}
                            className={styles.card}
                            style={{
                                backgroundColor: `${item.color}4D`,
                                borderColor: item.color,
                            }}
                        >

                            <Image
                                src={item.icon}
                                alt={item.title}
                                width={74}
                                height={74}
                            />

                            <h3>{item.title}</h3>

                            <p>{item.text}</p>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
};

export default PrinciplesComponent;