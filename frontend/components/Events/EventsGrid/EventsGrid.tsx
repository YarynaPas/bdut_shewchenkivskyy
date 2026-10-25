"use client";

import styles from "./EventsGrid.module.css";

import { Event } from "../EventsSection/EventsSection";
import EventCard from "../EventCard/EventCard";

interface Props {

    events: Event[];

}

export default function EventsGrid({

                                       events,

                                   }: Props) {

    if (!events.length) {

        return (

            <div className={styles.empty}>

                Найближчих заходів поки що немає.

            </div>

        );

    }

    return (

        <div className={styles.grid}>

            {events.map(event => (

                <EventCard
                    key={event.id}
                    event={event}
                />

            ))}

        </div>

    );

}