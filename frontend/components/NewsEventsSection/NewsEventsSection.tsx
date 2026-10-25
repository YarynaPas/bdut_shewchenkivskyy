import Image from "next/image";
import styles from "./NewsEventsSection.module.css";

import NewsBlock from "../NewsBlock/NewsBlock";
import EventsBlock from "@/components/EventsBlock/eventsBlock";

const NewsEventsSection = () => {
    return (
        <section className={styles.section}>

            <Image
                src="/2nd Bunner.svg"
                alt=""
                fill
                priority
                className={styles.background}
            />

            <div className={styles.container}>

                <div className={styles.left}>

                    <div className={styles.title}>

                        <h2>Наші новини</h2>

                        <Image
                            src="/icons8-paintbrush-64.png"
                            alt=""
                            width={46}
                            height={46}
                            className={styles.paintbrush}
                        />

                    </div>

                    <NewsBlock/>

                </div>

                <div className={styles.right}>

                    <div className={styles.title}>

                        <h2>Наші події</h2>

                        <Image
                            src="/icons8-stars-80.png"
                            alt=""
                            width={46}
                            height={46}
                            className={styles.star}
                        />

                    </div>

                    <EventsBlock/>

                </div>

            </div>

        </section>
    );
};

export default NewsEventsSection;