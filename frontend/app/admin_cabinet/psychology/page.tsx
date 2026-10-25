"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import styles from "./PsychologyAdmin.module.css";

import {
    AdminPsychology,
    deletePsychology,
    getAdminPsychology,
} from "@/services/psychologyApi";


const ITEMS_PER_PAGE = 8;


export default function PsychologyAdminPage() {

    const [items, setItems] =
        useState<AdminPsychology[]>([]);

    const [page, setPage] =
        useState(1);

    const [pages, setPages] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [deletingId, setDeletingId] =
        useState<number | null>(null);


    /* ========================================= */
    /* LOAD */
    /* ========================================= */

    const loadItems =
        useCallback(async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await getAdminPsychology(
                        page,
                        ITEMS_PER_PAGE
                    );

                setItems(
                    response.data
                );

                setPages(
                    Math.max(
                        response.pages,
                        1
                    )
                );

            } catch (err) {

                console.error(
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Помилка завантаження матеріалів."
                );

            } finally {

                setLoading(false);

            }

        }, [page]);


    useEffect(() => {

        loadItems();

    }, [loadItems]);


    /* ========================================= */
    /* DELETE */
    /* ========================================= */

    const handleDelete = async (
        item: AdminPsychology
    ) => {

        const confirmed =
            window.confirm(
                `Ви точно хочете видалити матеріал "${item.title}"?\n\nЦю дію неможливо скасувати.`
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(
                item.id
            );

            setError("");

            setSuccess("");


            await deletePsychology(
                item.id
            );


            /*
             * Видаляємо елемент
             * локально.
             */

            setItems(
                previous =>
                    previous.filter(
                        current =>
                            current.id !== item.id
                    )
            );


            setSuccess(
                "Матеріал успішно видалено."
            );


            setTimeout(() => {

                setSuccess("");

            }, 3000);


            /*
             * Якщо після видалення
             * сторінка стала порожньою,
             * повертаємося назад.
             */

            if (
                items.length === 1 &&
                page > 1
            ) {

                setPage(
                    previous =>
                        previous - 1
                );

            }

        } catch (err) {

            console.error(
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося видалити матеріал."
            );

        } finally {

            setDeletingId(
                null
            );

        }

    };


    /* ========================================= */
    /* FORMAT DATE */
    /* ========================================= */

    const formatDate = (
        date: string
    ): string => {

        if (!date) {

            return "";

        }


        return new Date(date)
            .toLocaleDateString(
                "uk-UA",
                {
                    day: "2-digit",
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

                <div
                    className={
                        styles.loading
                    }
                >

                    <div
                        className={
                            styles.spinner
                        }
                    />

                    <span>
                        Завантаження матеріалів...
                    </span>

                </div>

            </main>

        );

    }


    return (

        <main className={styles.page}>

            <div className={styles.container}>

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <header
                    className={
                        styles.header
                    }
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
                                styles.overline
                            }
                        >
                            КЕРУВАННЯ КОНТЕНТОМ
                        </span>


                        <h1>
                            Психолог
                        </h1>


                        <p>
                            Публікації та матеріали
                            психолога.
                        </p>

                    </div>


                    <Link
                        href={
                            "/admin_cabinet/psychology/create"
                        }
                        className={
                            styles.addButton
                        }
                    >

                        <span>
                            +
                        </span>

                        Додати матеріал

                    </Link>

                </header>


                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

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
                            type="button"
                            onClick={
                                loadItems
                            }
                        >
                            Повторити
                        </button>

                    </div>

                )}


                {/* ================================= */}
                {/* SUCCESS */}
                {/* ================================= */}

                {success && (

                    <div
                        className={
                            styles.success
                        }
                    >

                        <span>
                            ✓
                        </span>

                        <p>
                            {success}
                        </p>

                    </div>

                )}


                {/* ================================= */}
                {/* EMPTY */}
                {/* ================================= */}

                {!error &&
                items.length === 0 ? (

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
                            🧠
                        </div>

                        <h2>
                            Матеріалів поки немає
                        </h2>

                        <p>
                            Створіть першу
                            публікацію психолога.
                        </p>

                        <Link
                            href={
                                "/admin_cabinet/psychology/create"
                            }
                            className={
                                styles.emptyButton
                            }
                        >
                            + Додати матеріал
                        </Link>

                    </div>

                ) : (

                    <section
                        className={
                            styles.list
                        }
                    >

                        {items.map(
                            item => (

                                <article
                                    key={
                                        item.id
                                    }
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

                                        {item.main_photo ? (

                                            <img
                                                src={
                                                    item.main_photo
                                                }
                                                alt={
                                                    item.title
                                                }
                                            />

                                        ) : (

                                            <div
                                                className={
                                                    styles.noImage
                                                }
                                            >
                                                🧠
                                            </div>

                                        )}

                                    </div>


                                    {/* INFO */}

                                    <div
                                        className={
                                            styles.info
                                        }
                                    >

                                        <span
                                            className={
                                                styles.date
                                            }
                                        >

                                            {formatDate(
                                                item.date
                                            )}

                                        </span>


                                        <h2>
                                            {item.title}
                                        </h2>


                                        <p>
                                            {
                                                item.description
                                            }
                                        </p>


                                        {item.long_description && (

                                            <span
                                                className={
                                                    styles.articleBadge
                                                }
                                            >
                                                Повна стаття
                                            </span>

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
                                                `/psychology/${item.id}`
                                            }
                                            target="_blank"
                                            className={
                                                styles.view
                                            }
                                        >
                                            Переглянути
                                        </Link>


                                        <Link
                                            href={
                                                `/admin_cabinet/psychology/${item.id}/edit`
                                            }
                                            className={
                                                styles.edit
                                            }
                                        >
                                            ✎ Редагувати
                                        </Link>


                                        <button
                                            type="button"
                                            className={
                                                styles.delete
                                            }
                                            disabled={
                                                deletingId ===
                                                item.id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    item
                                                )
                                            }
                                        >

                                            {deletingId ===
                                            item.id ? (

                                                <>
                                                    <span
                                                        className={
                                                            styles.deleteSpinner
                                                        }
                                                    />

                                                    Видалення...
                                                </>

                                            ) : (

                                                <>
                                                    🗑 Видалити
                                                </>

                                            )}

                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </section>

                )}


                {/* ================================= */}
                {/* PAGINATION */}
                {/* ================================= */}

                {pages > 1 && (

                    <div
                        className={
                            styles.pagination
                        }
                    >

                        <button
                            type="button"
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
                            pageNumber => (

                                <button
                                    key={
                                        pageNumber
                                    }
                                    type="button"
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
                            type="button"
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