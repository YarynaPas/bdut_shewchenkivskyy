"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./NewsBlock.module.css";

interface INews {
    id: number;
    title: string;
    short_description: string;
    date: string;
    main_photo: string | null;
    photos: string |null;
}

const NewsBlock = () => {

    const [news, setNews] = useState<INews[]>([]);

    const router = useRouter();

    useEffect(() => {

        const fetchNews = async () => {

            try {

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/news`
                );

                const result = await res.json();

                if (Array.isArray(result.data)) {
                    setNews(result.data.slice(0,2));
                }
                else if (Array.isArray(result)) {
                    setNews(result.slice(0,2));
                }

            }
            catch (e) {
                console.log(e);
            }

        };

        fetchNews();

    }, []);

    const getImageUrl = (path?: string |null) => {

        if (!path) return null;

        if (path.startsWith("http")) return path;

        const base =
            process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/,"") || "";

        return `${base}${path.startsWith("/") ? path : "/" + path}`;

    };

    const formatDate = (date:string) => {

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
                    href="/news"
                    className={styles.allNews}
                >
                    Усі новини →
                </Link>

            </div>

            <div className={styles.list}>

                {news.map(item=>{

                    const image =
                        getImageUrl(item.main_photo) ||
                        getImageUrl(item.photos?.split(",")[0]);

                    return(

                        <article

                            key={item.id}

                            className={styles.card}

                            onClick={()=>router.push(`/news/${item.id}`)}

                        >

                            <div className={styles.image}>

                                {image &&

                                    <img
                                        src={image}
                                        alt={item.title}
                                    />

                                }

                            </div>

                            <div className={styles.content}>

                                <h3>{item.title}</h3>

                                <span>
                                    {formatDate(item.date)}
                                </span>

                                <p>

                                    {item.short_description}

                                </p>

                            </div>

                        </article>

                    );

                })}

            </div>

        </section>

    );

};

export default NewsBlock;