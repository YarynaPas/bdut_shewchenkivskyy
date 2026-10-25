"use client";

import {
    useEffect,
    useState
} from "react";

import Link from "next/link";

import styles from "./GurtkyAdmin.module.css";

import {
    AdminGurtok,
    deleteGurtok,
    getAdminGurtky
} from "@/services/gurtkyApi";


export default function GurtkyAdminPage() {

    const [gurtky, setGurtky] =
        useState<AdminGurtok[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const getImageUrl = (
        path: string | null | undefined
    ) => {

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


    const loadGurtky = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getAdminGurtky();

            setGurtky(data);

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Помилка завантаження"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadGurtky();

    }, []);


    const handleDelete = async (
        id: number
    ) => {

        const confirmed =
            window.confirm(
                "Ви дійсно хочете видалити цей гурток?"
            );

        if (!confirmed) {

            return;

        }


        try {

            await deleteGurtok(id);

            setGurtky(
                previous =>
                    previous.filter(
                        item =>
                            item.id !== id
                    )
            );

        } catch (err) {

            alert(
                err instanceof Error
                    ? err.message
                    : "Помилка видалення"
            );

        }

    };


    if (loading) {

        return (

            <main className={styles.page}>

                <div className={styles.loading}>

                    Завантаження гуртків...

                </div>

            </main>

        );

    }


    return (

        <main className={styles.page}>

            <div className={styles.container}>

                <header className={styles.header}>

                    <div>

                        <span className={styles.overline}>
                            АДМІНІСТРАТИВНА ПАНЕЛЬ
                        </span>

                        <h1>
                            Гуртки
                        </h1>

                        <p>
                            Керування гуртками будинку
                            дитячої та юнацької творчості.
                        </p>

                    </div>


                    <Link
                        href="/admin_cabinet/gurtky/create"
                        className={styles.addButton}
                    >

                        <span>
                            +
                        </span>

                        Додати гурток

                    </Link>

                </header>


                {error && (

                    <div className={styles.error}>

                        {error}

                    </div>

                )}


                {gurtky.length === 0 ? (

                    <div className={styles.empty}>

                        <div className={styles.emptyIcon}>
                            +
                        </div>

                        <h2>
                            Гуртків поки немає
                        </h2>

                        <p>
                            Додайте перший гурток.
                        </p>

                        <Link
                            href="/admin_cabinet/gurtky/create"
                            className={styles.emptyButton}
                        >
                            Додати гурток
                        </Link>

                    </div>

                ) : (

                    <div className={styles.list}>

                        {gurtky.map(
                            (gurtok) => (

                                <article
                                    key={gurtok.id}
                                    className={styles.card}
                                >

                                    <div
                                        className={
                                            styles.imageWrapper
                                        }
                                    >

                                        <img
                                            src={
                                                getImageUrl(
                                                    gurtok.pictograma
                                                )
                                            }
                                            alt={
                                                gurtok.name
                                            }
                                        />

                                    </div>


                                    <div
                                        className={
                                            styles.info
                                        }
                                    >

                                        <div
                                            className={
                                                styles.topRow
                                            }
                                        >

                                            <span
                                                className={
                                                    styles.id
                                                }
                                            >
                                                #{gurtok.id}
                                            </span>

                                            <span
                                                className={
                                                    styles.direction
                                                }
                                            >
                                                {gurtok.napryam}
                                            </span>

                                        </div>


                                        <h2>
                                            {gurtok.name}
                                        </h2>


                                        <div
                                            className={
                                                styles.details
                                            }
                                        >

                                            <div>

                                                <span>
                                                    Керівник
                                                </span>

                                                <strong>
                                                    {gurtok.teacher}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Вікова група
                                                </span>

                                                <strong>
                                                    {
                                                        gurtok.vikova_grupa
                                                    }
                                                </strong>

                                            </div>


                                            {gurtok.classrom && (

                                                <div>

                                                    <span>
                                                        Кабінет
                                                    </span>

                                                    <strong>
                                                        {
                                                            gurtok.classrom
                                                        }
                                                    </strong>

                                                </div>

                                            )}

                                        </div>

                                    </div>


                                    <div
                                        className={
                                            styles.actions
                                        }
                                    >

                                        <Link
                                            href={`/admin_cabinet/gurtky/${gurtok.id}/edit`}
                                            className={
                                                styles.editButton
                                            }
                                        >
                                            Редагувати
                                        </Link>


                                        <button
                                            type="button"
                                            className={
                                                styles.deleteButton
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    gurtok.id
                                                )
                                            }
                                        >
                                            Видалити
                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}

            </div>

        </main>

    );

}