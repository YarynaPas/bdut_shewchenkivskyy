"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import styles from "./EditGurtok.module.css";

import {
    getAdminGurtokById,
} from "@/services/gurtkyApi";


export default function UpdateGurtokPage() {

    const params = useParams();

    const id =
        Number(params.id);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [gurtokName, setGurtokName] =
        useState("");


    useEffect(() => {

        if (
            !id ||
            Number.isNaN(id)
        ) {

            setError(
                "Некоректний ID гуртка."
            );

            setLoading(false);

            return;

        }


        const load =
            async () => {

                try {

                    const data =
                        await getAdminGurtokById(
                            id
                        );

                    setGurtokName(
                        data.name
                    );

                } catch (err) {

                    console.error(
                        err
                    );

                    setError(
                        err instanceof Error
                            ? err.message
                            : "Не вдалося завантажити гурток."
                    );

                } finally {

                    setLoading(false);

                }

            };


        load();

    }, [id]);


    if (loading) {

        return (

            <main className={styles.page}>

                <div className={styles.status}>

                    <div
                        className={
                            styles.spinner
                        }
                    />

                    <h1>
                        Оновлення гуртка
                    </h1>

                    <p>
                        Завантаження...
                    </p>

                </div>

            </main>

        );

    }


    if (error) {

        return (

            <main className={styles.page}>

                <div className={styles.status}>

                    <div
                        className={
                            styles.errorIcon
                        }
                    >
                        !
                    </div>

                    <h1>
                        Помилка
                    </h1>

                    <p>
                        {error}
                    </p>

                    <Link
                        href="/admin_cabinet/gurtky"
                        className={
                            styles.button
                        }
                    >
                        ← До гуртків
                    </Link>

                </div>

            </main>

        );

    }


    return (

        <main className={styles.page}>

            <div className={styles.status}>

                <div
                    className={
                        styles.successIcon
                    }
                >
                    ✓
                </div>

                <span className={styles.overline}>
                    КЕРУВАННЯ ГУРТКАМИ
                </span>

                <h1>
                    Гурток готовий до оновлення
                </h1>

                <p>
                    {gurtokName}
                </p>

                <Link
                    href={
                        `/admin_cabinet/gurtky/${id}/edit`
                    }
                    className={
                        styles.button
                    }
                >
                    Перейти до редагування →
                </Link>

            </div>

        </main>

    );

}