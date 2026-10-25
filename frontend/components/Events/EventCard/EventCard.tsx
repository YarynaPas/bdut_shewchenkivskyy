"use client";
import Image from "next/image";
import Link from "next/link";

import styles from "./EventCard.module.css";

import { Event } from "../EventsSection/EventsSection";

interface Props {

    event: Event;

}

export default function EventCard({

                                      event,

                                  }: Props) {

    const getImage = (path: string) => {

        if (!path) {

            return "/placeholder.png";

        }

        if (path.startsWith("http")) {

            return path;

        }

        const base =
            process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

        return `${base}${path.startsWith("/") ? path : `/${path}`}`;

    };

    const formattedDate = new Date(event.date).toLocaleDateString("uk-UA", {

        day: "2-digit",

        month: "long",

        year: "numeric",

    });

    return (

        <article className={styles.card}>

            <div className={styles.poster}>

                <img
                    src={getImage(event.main_photo)}
                    alt={event.title}
                    className={styles.image}
                />

            </div>

            <div className={styles.content}>

                <span className={styles.date}>

                    📅 {formattedDate}

                </span>

                <h3>

                    {event.title}

                </h3>

                <p>

                    {event.description}

                </p>

                <a
                    href="tel:+380966194472"
                    className={styles.button}
                >

                    <Image
                        src="/phone-call.png"
                        alt="Телефон"
                        width={22}
                        height={22}
                        className={styles.phoneIcon}
                    />

                    <span>

        Дізнатись детальніше

    </span>

                </a>

            </div>

        </article>

    );

}