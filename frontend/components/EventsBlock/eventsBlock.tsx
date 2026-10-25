"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./eventsBlock.module.css";

interface IEvent {
    id: number;
    title: string;
    description?: string;
    date?: string;
    main_photo?: string | null;
}

const EventsBlock = () => {

    const [events, setEvents] = useState<IEvent[]>([]);

    const router = useRouter();

    useEffect(() => {

        const fetchEvents = async () => {

            try {

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/event`
                );

                if (!response.ok) return;

                const data = await response.json();

                if (Array.isArray(data)) {
                    setEvents(data.slice(0,2));
                }

            } catch (e) {
                console.log(e);
            }

        };

        fetchEvents();

    }, []);

    const getImageUrl = (path?: string | null) => {

        if (!path) return null;

        if (path.startsWith("http")) return path;

        const base =
            process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/,"") || "";

        return `${base}${path.startsWith("/") ? path : "/" + path}`;

    };

    const formatDate = (date?: string) => {

        if (!date) return "";

        return new Date(date).toLocaleDateString("uk-UA",{

            day:"numeric",
            month:"long",
            year:"numeric"

        });

    };

    return (

        <section className={styles.section}>

            <div className={styles.header}>

                <div className={styles.titleWrapper}>

                    <Image
                        src="/star-24.png"
                        alt=""
                        width={46}
                        height={46}
                        className={styles.star}
                    />

                </div>

                <Link
                    href="/event"
                    className={styles.allEvents}
                >
                    Усі події →
                </Link>

            </div>

            <div className={styles.list}>

                {events.map(event=>{

                    const image =
                        getImageUrl(event.main_photo);

                    return(

                        <article
                            key={event.id}
                            className={styles.card}
                            onClick={() => router.push(`/event`)}
                        >

                            <div className={styles.image}>

                                {image && (

                                    <img
                                        src={image}
                                        alt={event.title}
                                    />

                                )}

                            </div>

                            <div className={styles.content}>

                                <h3>
                                    {event.title}
                                </h3>

                                <span>
                                    {formatDate(event.date)}
                                </span>

                                <p>
                                    {event.description}
                                </p>

                            </div>

                        </article>

                    );

                })}

            </div>

        </section>

    );

};

export default EventsBlock;