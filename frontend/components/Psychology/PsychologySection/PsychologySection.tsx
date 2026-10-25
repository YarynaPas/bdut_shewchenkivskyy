"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./PsychologySection.module.css";

import PsychologyGrid from "../PsychologyGrid/PsychologyGrid";
import Pagination from "@/components/News/Pagination/Pagination";


export interface PsychologyPost {

    id: number;

    title: string;

    description: string;

    date: string;

    main_photo: string;

    photos: string[];

}

interface PsychologyResponse {

    data: PsychologyPost[];

    total: number;

    page: number;

    pages: number;

}

const ITEMS_PER_PAGE = 9;

export default function PsychologySection() {

    const [posts, setPosts] =
        useState<PsychologyPost[]>([]);

    const [page, setPage] =
        useState(1);

    const [pages, setPages] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {

        const loadPosts = async () => {

            try {

                setLoading(true);

                setError(null);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/psychology?page=${page}&limit=${ITEMS_PER_PAGE}`
                );

                if (!response.ok) {

                    throw new Error(
                        `Помилка завантаження: ${response.status}`
                    );

                }

                const data: PsychologyResponse =
                    await response.json();

                setPosts(
                    Array.isArray(data.data)
                        ? data.data
                        : []
                );

                setPages(
                    data.pages || 1
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Не вдалося завантажити матеріали психолога."
                );

            } finally {

                setLoading(false);

            }

        };

        loadPosts();

    }, [page]);

    if (loading) {

        return (
            <section className={styles.loading}>
                <div className={styles.loader}></div>
                <span>Завантаження...</span>
            </section>
        );

    }

    return (

        <section className={styles.section}>

            <div className={styles.backgroundDecor}>

                <Image
                    src="/star.png"
                    alt=""
                    width={42}
                    height={42}
                    className={`${styles.star} ${styles.star1}`}
                />

                <Image
                    src="/star.png"
                    alt=""
                    width={30}
                    height={30}
                    className={`${styles.star} ${styles.star2}`}
                />

                <Image
                    src="/star.png"
                    alt=""
                    width={48}
                    height={48}
                    className={`${styles.star} ${styles.star3}`}
                />

                <Image
                    src="/star.png"
                    alt=""
                    width={34}
                    height={34}
                    className={`${styles.star} ${styles.star4}`}
                />

            </div>

            <div className={styles.container}>

                <div className={styles.heading}>

                    <Image
                        src="/star.png"
                        alt=""
                        width={38}
                        height={38}
                        className={styles.headingStar}
                    />

                    <h1 className={styles.title}>
                        Кабінет психолога
                    </h1>

                    <Image
                        src="/star.png"
                        alt=""
                        width={46}
                        height={46}
                        className={styles.headingStar}
                    />

                </div>

                {error ? (

                    <div className={styles.error}>
                        {error}
                    </div>

                ) : (

                    <>
                        <PsychologyGrid
                            posts={posts}
                        />

                        <Pagination
                            currentPage={page}
                            totalPages={pages}
                            onPageChange={setPage}
                        />
                    </>

                )}

            </div>

        </section>

    );

}