import Link from "next/link";

import styles from "./PsychologyCard.module.css";

import { PsychologyPost } from "../PsychologySection/PsychologySection";

interface Props {

    post: PsychologyPost;

}

export default function PsychologyCard({
                                           post,
                                       }: Props) {

    const formatDate = (date: string) => {

        return new Date(date).toLocaleDateString(
            "uk-UA",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );

    };

    return (

        <article className={styles.card}>

            <div className={styles.imageWrapper}>

                <img
                    src={post.main_photo}
                    alt={post.title}
                    className={styles.image}
                />

                <span className={styles.date}>

                    📅 {formatDate(post.date)}

                </span>

            </div>

            <div className={styles.content}>

                <h2 className={styles.title}>

                    {post.title}

                </h2>

                <p className={styles.description}>

                    {post.description}

                </p>

                <Link
                    href={`/psychology/${post.id}`}
                    className={styles.button}
                >

                    Читати матеріал

                    <span>
                        →
                    </span>

                </Link>

            </div>

        </article>

    );

}