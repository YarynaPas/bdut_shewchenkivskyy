"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./NewsAdmin.module.css";

import {
    AdminNews,
    deleteNews,
    getAdminNews,
    NewsResponse,
} from "@/services/newsApi";


const ITEMS_PER_PAGE = 8;


export default function AdminNewsPage() {

    const router = useRouter();

    const [news, setNews] =
        useState<AdminNews[]>([]);

    const [page, setPage] =
        useState(1);

    const [pages, setPages] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [deletingId, setDeletingId] =
        useState<number | null>(null);


    /* ========================================= */
    /* LOAD */
    /* ========================================= */

    const loadNews =
        useCallback(async () => {

            try {

                setLoading(true);

                setError(null);

                const result:
                    NewsResponse =
                    await getAdminNews(
                        page,
                        ITEMS_PER_PAGE
                    );

                setNews(
                    result.data
                );

                setPages(
                    Math.max(
                        result.pages,
                        1
                    )
                );

            } catch (error) {

                console.error(
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Помилка завантаження"
                );

            } finally {

                setLoading(false);

            }

        }, [page]);


    useEffect(() => {

        loadNews();

    }, [loadNews]);


    /* ========================================= */
    /* DELETE */
    /* ========================================= */

    const handleDelete =
        async (id: number) => {

            const confirmed =
                window.confirm(
                    "Ви точно хочете видалити цю новину?"
                );

            if (!confirmed) {
                return;
            }

            try {

                setDeletingId(id);

                await deleteNews(id);

                /*
                 * Якщо на сторінці була
                 * одна новина — повертаємося
                 * на попередню сторінку.
                 */

                if (
                    news.length === 1 &&
                    page > 1
                ) {

                    setPage(
                        previous =>
                            previous - 1
                    );

                } else {

                    await loadNews();

                }

            } catch (error) {

                alert(
                    error instanceof Error
                        ? error.message
                        : "Помилка видалення"
                );

            } finally {

                setDeletingId(null);

            }
        };


    /* ========================================= */
    /* IMAGE URL */
    /* ========================================= */

    const getImageUrl =
        (
            url: string | null
        ): string => {

            if (!url) {

                return "/placeholder.png";

            }

            if (
                url.startsWith("http://") ||
                url.startsWith("https://")
            ) {

                return url;

            }

            const base =
                process.env
                    .NEXT_PUBLIC_API_URL
                    ?.replace(/\/$/, "") ||
                "";

            return `${base}${
                url.startsWith("/")
                    ? url
                    : `/${url}`
            }`;

        };


    /* ========================================= */
    /* DATE */
    /* ========================================= */

    const formatDate =
        (date: string) => {

            if (!date) {
                return "";
            }

            return new Date(
                date
            ).toLocaleDateString(
                "uk-UA",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            );
        };


    /* ========================================= */
    /* LOADING */
    /* ========================================= */

    if (loading) {

        return (

            <main className={styles.page}>

                <div className={styles.loading}>

                    <div
                        className={
                            styles.spinner
                        }
                    />

                    <p>
                        Завантаження новин...
                    </p>

                </div>

            </main>

        );
    }


    /* ========================================= */
    /* PAGE */
    /* ========================================= */

    return (

        <main className={styles.page}>

            <div className={styles.container}>

                {/* HEADER */}

                <header
                    className={styles.header}
                >

                    <div>

                        <Link
                            href="/admin_cabinet"
                            className={
                                styles.back
                            }
                        >

                            ← Кабінет адміністратора

                        </Link>

                        <span
                            className={
                                styles.subtitle
                            }
                        >
                            КЕРУВАННЯ КОНТЕНТОМ
                        </span>

                        <h1>
                            Новини
                        </h1>

                        <p>
                            Додавайте, редагуйте
                            та видаляйте новини
                            закладу.
                        </p>

                    </div>

                    <Link
                        href="/admin_cabinet/news/create"
                        className={
                            styles.addButton
                        }
                    >

                        <span>
                            +
                        </span>

                        Додати новину

                    </Link>

                </header>


                {/* ERROR */}

                {error && (

                    <div
                        className={
                            styles.error
                        }
                    >

                        <span>
                            !
                        </span>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={
                                loadNews
                            }
                        >
                            Повторити
                        </button>

                    </div>

                )}


                {/* EMPTY */}

                {!error &&
                    news.length === 0 && (

                        <div
                            className={
                                styles.empty
                            }
                        >

                            <div
                                className={
                                    styles.emptyIcon
                                }
                            >
                                📰
                            </div>

                            <h2>
                                Новин поки немає
                            </h2>

                            <p>
                                Створіть першу
                                новину для сайту.
                            </p>

                            <Link
                                href={
                                    "/admin_cabinet/news/create"
                                }
                                className={
                                    styles.emptyButton
                                }
                            >
                                + Додати новину
                            </Link>

                        </div>

                    )}


                {/* LIST */}

                {news.length > 0 && (

                    <section
                        className={
                            styles.list
                        }
                    >

                        {news.map(
                            (item) => (

                                <article
                                    key={item.id}
                                    className={
                                        styles.card
                                    }
                                >

                                    {/* IMAGE */}

                                    <div
                                        className={
                                            styles.imageWrapper
                                        }
                                    >

                                        <img
                                            src={getImageUrl(
                                                item.main_photo
                                            )}
                                            alt={
                                                item.title
                                            }
                                            className={
                                                styles.image
                                            }
                                        />

                                    </div>


                                    {/* INFO */}

                                    <div
                                        className={
                                            styles.info
                                        }
                                    >

                                        <div
                                            className={
                                                styles.date
                                            }
                                        >

                                            {formatDate(
                                                item.date
                                            )}

                                        </div>

                                        <h2>
                                            {item.title}
                                        </h2>

                                        {item.short_description && (

                                            <p>
                                                {
                                                    item.short_description
                                                }
                                            </p>

                                        )}

                                    </div>


                                    {/* ACTIONS */}

                                    <div
                                        className={
                                            styles.actions
                                        }
                                    >

                                        <Link
                                            href={
                                                `/news/${item.id}`
                                            }
                                            target="_blank"
                                            className={
                                                styles.viewButton
                                            }
                                        >

                                            Переглянути

                                        </Link>


                                        <Link
                                            href={
                                                `/admin_cabinet/news/${item.id}/edit`
                                            }
                                            className={
                                                styles.editButton
                                            }
                                        >

                                            ✎

                                            <span>
                                                Редагувати
                                            </span>

                                        </Link>


                                        <button
                                            className={
                                                styles.deleteButton
                                            }
                                            disabled={
                                                deletingId ===
                                                item.id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    item.id
                                                )
                                            }
                                        >

                                            {deletingId ===
                                            item.id
                                                ? "..."
                                                : "🗑"}

                                            {deletingId !==
                                                item.id && (

                                                    <span>
                                                    Видалити
                                                </span>

                                                )}

                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </section>

                )}


                {/* PAGINATION */}

                {pages > 1 && (

                    <div
                        className={
                            styles.pagination
                        }
                    >

                        <button
                            disabled={
                                page === 1
                            }
                            onClick={() =>
                                setPage(
                                    previous =>
                                        previous - 1
                                )
                            }
                        >
                            ←
                        </button>


                        {Array.from(
                            {
                                length: pages,
                            },
                            (_, index) =>
                                index + 1
                        ).map(
                            (pageNumber) => (

                                <button
                                    key={
                                        pageNumber
                                    }
                                    className={
                                        pageNumber === page
                                            ? styles.activePage
                                            : ""
                                    }
                                    onClick={() =>
                                        setPage(
                                            pageNumber
                                        )
                                    }
                                >

                                    {pageNumber}

                                </button>

                            )
                        )}


                        <button
                            disabled={
                                page === pages
                            }
                            onClick={() =>
                                setPage(
                                    previous =>
                                        previous + 1
                                )
                            }
                        >
                            →
                        </button>

                    </div>

                )}

            </div>

        </main>
    );
}