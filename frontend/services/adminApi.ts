const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "";


/* ========================================= */
/* OPTIONS */
/* ========================================= */

type AdminFetchOptions = {

    method?: string;

    headers?: Record<string, string>;

    body?: any;

};


/* ========================================= */
/* TOKEN */
/* ========================================= */

const getToken = (): string | null => {

    if (typeof window === "undefined") {

        return null;

    }

    return localStorage.getItem("token");

};


/* ========================================= */
/* ADMIN FETCH */
/* ========================================= */

export const adminFetch = async (
    endpoint: string,
    options: AdminFetchOptions = {}
): Promise<Response> => {

    const token =
        getToken();


    /* ========================================= */
    /* HEADERS */
    /* ========================================= */

    const headers: Record<string, string> = {
        ...(options.headers || {}),
    };


    /* ========================================= */
    /* AUTHORIZATION */
    /* ========================================= */

    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;

    }


    /* ========================================= */
    /* CONTENT TYPE */
    /* ========================================= */

    /*
     * Якщо body не FormData —
     * відправляємо JSON.
     *
     * Для FormData Content-Type
     * НЕ встановлюємо.
     */

    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {

        if (
            !headers["Content-Type"]
        ) {

            headers["Content-Type"] =
                "application/json";

        }

    }


    /* ========================================= */
    /* REQUEST */
    /* ========================================= */

    const fetchOptions: any = {

        method:
            options.method || "GET",

        headers,

    };


    /*
     * Додаємо body тільки якщо він є.
     */

    if (
        options.body !== undefined &&
        options.body !== null
    ) {

        fetchOptions.body =
            options.body;

    }


    const response =
        await fetch(
            `${API_URL}${endpoint}`,
            fetchOptions
        );


    /* ========================================= */
    /* 401 */
    /* ========================================= */

    if (
        response.status === 401
    ) {

        if (
            typeof window !== "undefined"
        ) {

            localStorage.removeItem(
                "token"
            );


            window.location.href =
                "/login";

        }

    }


    return response;

};