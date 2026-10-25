"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./TeamSection.module.css";

interface Employee {
    id: number;
    full_name: string;
    position: string;
    main_photo: string;
}

const TeamSection = () => {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee`)
            .then(res => res.json())
            .then(data => {

                if (Array.isArray(data)) {
                    setEmployees(data);
                } else {
                    setEmployees([]);
                }

            })
            .catch(() => setEmployees([]))
            .finally(() => setLoading(false));

    }, []);

    const getImage = (path: string) => {

        if (!path) return "/teacher-placeholder.png";

        if (path.startsWith("http")) {
            return path;
        }

        return `${process.env.NEXT_PUBLIC_API_URL}${path}`;

    };

    if (loading) {

        return (
            <section className={styles.section}>
                <div className={styles.loading}>
                    Завантаження...
                </div>
            </section>
        );

    }

    return (

        <section className={styles.section}>

            <Image
                src="/2nd Bunner.svg"
                alt=""
                fill
                priority
                className={styles.background}
            />

            <div className={styles.container}>

                <div className={styles.heading}>

                    <Image
                        src="/music.png"
                        alt=""
                        width={42}
                        height={42}
                    />

                    <h2>Наша команда</h2>

                    <Image
                        src="/star-24.png"
                        alt=""
                        width={54}
                        height={54}
                        className={styles.star}
                    />

                </div>

                <p className={styles.subtitle}>
                    Професійні педагоги які надихають,
                    підтримують та допомагають
                    кожній дитині розкрити свої таланти
                </p>

                <div className={styles.grid}>

                    {employees.map(employee => (

                        <div
                            key={employee.id}
                            className={styles.card}
                        >

                            <div className={styles.photoWrapper}>

                                <img
                                    src={getImage(employee.main_photo)}
                                    alt={employee.full_name}
                                    className={styles.photo}
                                />

                            </div>

                            <h3>
                                {employee.full_name}
                            </h3>

                            <span>
                                {employee.position}
                            </span>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

};

export default TeamSection;