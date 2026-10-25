"use client";

import Link from "next/link";

import styles from "./AdminCabinet.module.css";

interface AdminSection {
    title: string;
    description: string;
    href: string;
    icon: string;
    color: string;
}

const sections: AdminSection[] = [

    {
        title: "Новини",
        description: "Додавання та редагування новин",
        href: "/admin_cabinet/news",
        icon: "📰",
        color: "purple",
    },

    {
        title: "Події",
        description: "Керування подіями та заходами",
        href: "/admin_cabinet/events",
        icon: "📅",
        color: "pink",
    },

    {
        title: "Гуртки",
        description: "Додавання та редагування гуртків",
        href: "/admin_cabinet/gurtky",
        icon: "🎨",
        color: "violet",
    },

    {
        title: "Психолог",
        description: "Матеріали та публікації психолога",
        href: "/admin_cabinet/psychology",
        icon: "🧠",
        color: "blue",
    },

    {
        title: "Працівники",
        description: "Інформація про працівників закладу",
        href: "/admin_cabinet/employees",
        icon: "👥",
        color: "green",
    },

    {
        title: "Звітність",
        description: "Документи та звітні матеріали",
        href: "/admin_cabinet/accounting",
        icon: "📄",
        color: "orange",
    },

    {
        title: "Набір",
        description: "Інформація про набір дітей",
        href: "/admin_cabinet/nabir",
        icon: "📋",
        color: "yellow",
    },

    {
        title: "Розклад",
        description: "Керування розкладом занять",
        href: "/admin_cabinet/rozklad",
        icon: "🕐",
        color: "cyan",
    },

];

export default function AdminCabinetPage() {

    return (

        <main className={styles.page}>

            {/* BACKGROUND */}

            <div className={styles.background}>

                <span
                    className={`${styles.star} ${styles.star1}`}
                >
                    ✦
                </span>

                <span
                    className={`${styles.star} ${styles.star2}`}
                >
                    ✦
                </span>

                <span
                    className={`${styles.star} ${styles.star3}`}
                >
                    ✦
                </span>

                <span
                    className={`${styles.star} ${styles.star4}`}
                >
                    ✦
                </span>

            </div>

            <div className={styles.container}>

                {/* HEADER */}

                <header className={styles.header}>

                    <div>

                        <span className={styles.subtitle}>
                            АДМІНІСТРАТИВНА ПАНЕЛЬ
                        </span>

                        <h1>
                            Кабінет адміністратора
                        </h1>

                        <p>
                            Оберіть розділ, яким хочете керувати
                        </p>

                    </div>

                    <button
                        className={styles.logout}
                        onClick={() => {

                            localStorage.removeItem(
                                "token"
                            );

                            window.location.href =
                                "/login";

                        }}
                    >

                        <span>
                            ↪
                        </span>

                        Вийти

                    </button>

                </header>

                {/* CARDS */}

                <section className={styles.grid}>

                    {sections.map((section) => (

                        <Link
                            key={section.href}
                            href={section.href}
                            className={styles.card}
                        >

                            <div
                                className={`${styles.icon} ${styles[section.color]}`}
                            >

                                {section.icon}

                            </div>

                            <div className={styles.cardContent}>

                                <h2>
                                    {section.title}
                                </h2>

                                <p>
                                    {section.description}
                                </p>

                            </div>

                            <div className={styles.arrow}>
                                →
                            </div>

                        </Link>

                    ))}

                </section>

            </div>

        </main>
    );
}