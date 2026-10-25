"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import styles from "./NewsSection.module.css";

import NewsGrid from "../NewsGrid/NewsGrid";
import Pagination from "../Pagination/Pagination";

export interface News {

    id: number;

    title: string;

    description: string;

    short_description: string;

    main_photo: string;

    photos: string[];

    video: string | null;

    date: string;

}

interface NewsResponse {

    data: News[];

    total: number;

    page: number;

    pages: number;

}

const ITEMS_PER_PAGE = 9;

export default function NewsSection() {

    const [loading, setLoading] =
        useState(true);

    const [news, setNews] =
        useState<News[]>([]);

    const [page, setPage] =
        useState(1);

    const [pages, setPages] =
        useState(1);

    useEffect(() => {

        setLoading(true);

        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/news?page=${page}&limit=${ITEMS_PER_PAGE}`
        )
            .then(res => res.json())
            .then((data: NewsResponse) => {

                setNews(data.data);

                setPages(data.pages);

            })
            .finally(() => setLoading(false));

    }, [page]);

    if (loading) {

        return (

            <section className={styles.loading}>

                Завантаження...

            </section>

        );

    }

    return (

        <section className={styles.section}>
            <Image
                src="/icons8-stars-96.png"
                alt=""
                width={42}
                height={42}
                className={`${styles.floatingStar} ${styles.star1}`}
            />

            <Image
                src="/icons8-stars-96.png"
                alt=""
                width={34}
                height={34}
                className={`${styles.floatingStar} ${styles.star2}`}
            />

            <Image
                src="/icons8-stars-96.png"
                alt=""
                width={30}
                height={30}
                className={`${styles.floatingStar} ${styles.star3}`}
            />

            <Image
                src="/icons8-stars-96.png"
                alt=""
                width={50}
                height={50}
                className={`${styles.floatingStar} ${styles.star4}`}
            />

            <div className={styles.container}>

                <div className={styles.heading}>

                    <Image
                        src="/icons8-stars-96.png"
                        alt=""
                        width={34}
                        height={34}
                    />

                    <h1 className={styles.title}>

                        Новини

                    </h1>

                    <Image
                        src="/icons8-stars-96.png"
                        alt=""
                        width={46}
                        height={46}
                        className={styles.starTitle}
                    />

                </div>

                <NewsGrid
                    news={news}
                />
                <Pagination
                    currentPage={page}
                    totalPages={pages}
                    onPageChange={setPage}
                />

            </div>

        </section>

    );

}