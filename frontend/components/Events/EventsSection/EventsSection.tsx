"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./EventsSection.module.css";

import EventsGrid from "../EventsGrid/EventsGrid";

export interface Event {

    id: number;

    title: string;

    description: string;

    date: string;

    main_photo: string;

}

export default function EventsSection() {

    const [loading, setLoading] =
        useState(true);

    const [events, setEvents] =
        useState<Event[]>([]);

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`)
            .then(res => res.json())
            .then(data => {

                if (Array.isArray(data)) {

                    setEvents(data);

                }

            })
            .finally(() => setLoading(false));

    }, []);

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

                        Наші заходи

                    </h1>

                    <Image
                        src="/icons8-stars-96.png"
                        alt=""
                        width={46}
                        height={46}
                        className={styles.starTitle}
                    />

                </div>

                <EventsGrid
                    events={events}
                />

            </div>

        </section>

    );

}