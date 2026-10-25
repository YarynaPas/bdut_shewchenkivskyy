"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./login.module.css";

export default function LoginPage() {

    const router = useRouter();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError("");

        if (!login.trim() || !password) {

            setError(
                "Введіть логін та пароль."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        login: login.trim(),
                        password,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Невірний логін або пароль."
                );

            }

            if (!data.token) {

                throw new Error(
                    "Сервер не повернув токен авторизації."
                );

            }

            /*
             * Поки що зберігаємо токен.
             * Наступним кроком можемо перенести
             * авторизацію в httpOnly cookie.
             */

            localStorage.setItem(
                "token",
                data.token
            );

            /*
             * Перевіряємо користувача
             * та його роль.
             */

            const userResponse =
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/user`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${data.token}`,

                            "Content-Type":
                                "application/json",
                        },
                    }
                );

            if (!userResponse.ok) {

                localStorage.removeItem("token");

                throw new Error(
                    "Не вдалося перевірити користувача."
                );

            }

            const user =
                await userResponse.json();

            if (user.role !== "admin") {

                localStorage.removeItem("token");

                throw new Error(
                    "У вас немає доступу до адміністративної панелі."
                );

            }

            /*
             * Успішний вхід
             */

            router.push("/admin_cabinet");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Не вдалося виконати вхід."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <main className={styles.page}>

            {/* декоративний фон */}

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

            <section className={styles.loginCard}>

                {/* логотип / іконка */}

                <div className={styles.logo}>

                    <span>
                        Б
                    </span>

                </div>

                <div className={styles.heading}>

                    <h1>
                        Вхід
                    </h1>

                    <p>
                        Адміністративна панель
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                >

                    {/* LOGIN */}

                    <div className={styles.field}>

                        <label htmlFor="login">
                            Логін
                        </label>

                        <div className={styles.inputWrapper}>

                            <span className={styles.inputIcon}>
                                @
                            </span>

                            <input
                                id="login"
                                type="text"
                                value={login}
                                placeholder="Введіть логін"
                                autoComplete="username"
                                disabled={loading}
                                onChange={(event) =>
                                    setLogin(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                    {/* PASSWORD */}

                    <div className={styles.field}>

                        <label htmlFor="password">
                            Пароль
                        </label>

                        <div className={styles.inputWrapper}>

                            <span className={styles.inputIcon}>
                                ●
                            </span>

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                placeholder="Введіть пароль"
                                autoComplete="current-password"
                                disabled={loading}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                className={
                                    styles.passwordButton
                                }
                                onClick={() =>
                                    setShowPassword(
                                        previous =>
                                            !previous
                                    )
                                }
                                tabIndex={-1}
                            >

                                {showPassword
                                    ? "◉"
                                    : "◌"}

                            </button>

                        </div>

                    </div>

                    {/* ERROR */}

                    {error && (

                        <div className={styles.error}>

                            <span>
                                !
                            </span>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}

                    {/* BUTTON */}

                    <button
                        type="submit"
                        className={styles.submit}
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <span
                                    className={
                                        styles.spinner
                                    }
                                />

                                Виконується вхід...

                            </>

                        ) : (

                            <>
                                Увійти

                                <span>
                                    →
                                </span>
                            </>

                        )}

                    </button>

                </form>

            </section>

        </main>
    );
}