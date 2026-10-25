import Image from "next/image";
import Link from "next/link";
import styles from "./HeaderComponent.module.css";

const menu = [
    {
        href: "/",
        title: "Головна",
    },
    {
        href: "/about",
        title: "Про нас",
    },
    {
        href: "/gurtky",
        title: "Гуртки",
    },
    {
        href: "/reports",
        title: "Інформаційна відкритість",
    },
    {
        href: "/psychology",
        title: "Кабінет психолога",
    },
];

const HeaderComponent = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logoBlock}>
                    <Image
                        src="/logo.png"
                        alt="БДЮТ"
                        width={90}
                        height={90}
                        priority
                    />

                    <div className={styles.titleBlock}>
                        <h1>БДЮТ</h1>

                        <span>
                            Шевченківського району
                            <br />
                            м. Львова
                        </span>
                    </div>
                </Link>

                <nav>
                    <ul className={styles.menu}>
                        {menu.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href}>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default HeaderComponent;