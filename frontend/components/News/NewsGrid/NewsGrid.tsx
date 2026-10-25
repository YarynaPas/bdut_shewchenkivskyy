"use client";

import styles from "./NewsGrid.module.css";

import { News } from "../NewsSection/NewsSection";
import NewsCard from "../NewsCard/NewsCard";

interface Props {

    news: News[];

}

export default function NewsGrid({

                                     news,

                                 }: Props) {

    if (!news.length) {

        return (

            <div className={styles.empty}>

                Новин поки що немає.

            </div>

        );

    }

    return (

        <div className={styles.grid}>

            {news.map(item => (

                <NewsCard
                    key={item.id}
                    news={item}
                />

            ))}

        </div>

    );

}