"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import styles from "./EventsAdmin.module.css";

import {
    AdminEvent,
    deleteEvent,
    getAdminEvents,
} from "@/services/eventsApi";


export default function EventsAdminPage() {

    const [events, setEvents] =
        useState<AdminEvent[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deletingId, setDeletingId] =
        useState<number | null>(null);

    const [success, setSuccess] =
        useState("");


    /* ========================================= */
    /* IMAGE URL */
    /* ========================================= */

    const getImageUrl = (
        path: string | null | undefined
    ): string => {

        if (!path) {

            return "/placeholder.png";

        }

        if (
            path.startsWith("http://") ||
            path.startsWith("https://")
        ) {

            return path;

        }

        const api =
            process.env.NEXT_PUBLIC_API_URL
                ?.replace(/\/$/, "");

        if (!api) {

            return path;

        }

        return `${api}${
            path.startsWith("/")
                ? path
                : `/${path}`
        }`;

    };


    /* ========================================= */
    /* DATE */
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
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );

    };


    /* ========================================= */
    /* LOAD */
    /* ========================================= */

    const loadEvents =
        useCallback(async () => {

            try {

                setLoading(true);

                setError("");

                const data =
                    await getAdminEvents();

                setEvents(data);

            } catch (err) {

                console.error(
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Помилка завантаження подій"
                );

            } finally {

                setLoading(false);

            }

        }, []);


    useEffect(() => {

        loadEvents();

    }, [loadEvents]);


    /* ========================================= */
    /* DELETE */
    /* ========================================= */

    const handleDelete = async (
        event: AdminEvent
    ) => {

        const confirmed =
            window.confirm(
                `Ви точно хочете видалити подію "${event.title}"?\n\nЦю дію неможливо скасувати.`
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(
                event.id
            );

            setError("");

            setSuccess("");


            await deleteEvent(
                event.id
            );


            /*
             * Видаляємо подію
             * локально, щоб не робити
             * зайвий GET запит.
             */

            setEvents(
                previous =>
                    previous.filter(
                        item =>
                            item.id !== event.id
                    )
            );


            setSuccess(
                `Подію "${event.title}" успішно видалено.`
            );


            /*
             * Прибираємо повідомлення
             * через 3 секунди.
             */

            setTimeout(() => {

                setSuccess("");

            }, 3000);


        } catch (err) {

            console.error(
                "Delete event error:",
                err
            );


            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося видалити подію."
            );

        } finally {

            setDeletingId(
                null
            );

        }

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

                    <span>
                        Завантаження подій...
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
                    className={styles.header}
                >

                    <div>

                        <Link
                            href="/admin_cabinet"
                            className={styles.back}
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
                            Події
                        </h1>

                        <p>
                            Створюйте та керуйте
                            подіями закладу.
                        </p>

                    </div>


                    <Link
                        href={
                            "/admin_cabinet/events/create"
                        }
                        className={
                            styles.addButton
                        }
                    >

                        <span>
                            +
                        </span>

                        Додати подію

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
                            onClick={() => {

                                setError("");

                                loadEvents();

                            }}
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

                {events.length === 0 ? (

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
                            📅
                        </div>

                        <h2>
                            Подій поки немає
                        </h2>

                        <p>
                            Додайте першу подію
                            для сайту.
                        </p>

                        <Link
                            href={
                                "/admin_cabinet/events/create"
                            }
                            className={
                                styles.emptyButton
                            }
                        >
                            + Додати подію
                        </Link>

                    </div>

                ) : (

                    /* ================================= */
                    /* EVENTS */
                    /* ================================= */

                    <section
                        className={
                            styles.list
                        }
                    >

                        {events.map(
                            event => (

                                <article
                                    key={
                                        event.id
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

                                        <img
                                            src={
                                                getImageUrl(
                                                    event.main_photo
                                                )
                                            }
                                            alt={
                                                event.title
                                            }
                                        />

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

                                            📅{" "}
                                            {formatDate(
                                                event.date
                                            )}

                                        </span>


                                        <h2>
                                            {event.title}
                                        </h2>


                                        {event.description && (

                                            <p>
                                                {
                                                    event.description
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
                                                `/events/${event.id}`
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
                                                `/admin_cabinet/events/${event.id}/edit`
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
                                                event.id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    event
                                                )
                                            }
                                        >

                                            {deletingId ===
                                            event.id ? (

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

            </div>

        </main>

    );

}