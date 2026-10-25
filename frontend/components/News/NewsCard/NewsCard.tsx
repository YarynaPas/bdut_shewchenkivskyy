"use client";

import Image from "next/image";
import Link from "next/link";

import styles from "./NewsCard.module.css";

import { News } from "../NewsSection/NewsSection";

interface Props {

    news: News;

}

export default function NewsCard({

                                     news,

                                 }: Props) {

    const getImage = (path: string) => {

        if (!path) {

            return "/placeholder.png";

        }

        if (path.startsWith("http")) {

            return path;

        }

        const base =
            process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

        return `${base}${path.startsWith("/") ? path : `/${path}`}`;

    };

    const formattedDate = new Date(news.date).toLocaleDateString("uk-UA", {

        day: "2-digit",
        month: "long",
        year: "numeric",

    });

    return (

        <article className={styles.card}>

            <Link
                href={`/news/${news.id}`}
                className={styles.imageWrapper}
            >

                <img
                    src={getImage(news.main_photo)}
                    alt={news.title}
                    className={styles.image}
                />

                <div className={styles.overlay}></div>

                <div className={styles.date}>

                    📅 {formattedDate}

                </div>

            </Link>

            <div className={styles.content}>

                <h3>

                    {news.title}

                </h3>

                <p>

                    {news.short_description}

                </p>

                <Link
                    href={`/news/${news.id}`}
                    className={styles.button}
                >

                    Читати новину

                    <span className={styles.arrow}>

                        →

                    </span>

                </Link>

            </div>

        </article>

    );

}