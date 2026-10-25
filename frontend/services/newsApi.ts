import {
    adminFetch
} from "./adminApi";


/* ========================================= */
/* NEWS */
/* ========================================= */

export interface AdminNews {

    id: number;

    title: string;

    description: string;

    short_description: string;

    main_photo: string | null;

    photos: string[];

    video: string | null;

    date: string;

}


/* ========================================= */
/* RESPONSE */
/* ========================================= */

export interface NewsResponse {

    data: AdminNews[];

    total: number;

    page: number;

    pages: number;

}


/* ========================================= */
/* GET ALL */
/* ========================================= */

export async function getAdminNews(
    page: number = 1,
    limit: number = 10
): Promise<NewsResponse> {

    const response =
        await adminFetch(
            `/news?page=${page}&limit=${limit}`
        );


    if (!response.ok) {

        const data =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            data?.message ||
            "Не вдалося завантажити новини"
        );

    }


    return response.json();

}


/* ========================================= */
/* GET BY ID */
/* ========================================= */

export async function getAdminNewsById(
    id: number
): Promise<AdminNews> {

    const response =
        await adminFetch(
            `/news/${id}`
        );


    if (!response.ok) {

        const data =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            data?.message ||
            "Новину не знайдено"
        );

    }


    return response.json();

}


/* ========================================= */
/* CREATE DATA */
/* ========================================= */

export interface CreateNewsData {

    title: string;

    description: string;

    short_description: string;

    main_photo: File;

    photos: File[];

    video?: File | null;

}


/* ========================================= */
/* CREATE */
/* ========================================= */

export async function createNews(
    data: CreateNewsData
): Promise<AdminNews> {

    const formData =
        new FormData();


    /* TITLE */

    formData.append(
        "title",
        data.title
    );


    /* DESCRIPTION */

    formData.append(
        "description",
        data.description
    );


    /* SHORT DESCRIPTION */

    formData.append(
        "short_description",
        data.short_description
    );


    /* MAIN PHOTO */

    formData.append(
        "main_photo",
        data.main_photo
    );


    /* ADDITIONAL PHOTOS */

    data.photos.forEach(
        (photo) => {

            formData.append(
                "photos",
                photo
            );

        }
    );


    /* VIDEO */

    if (data.video) {

        formData.append(
            "video",
            data.video
        );

    }


    /* REQUEST */

    const response =
        await adminFetch(
            "/news",
            {
                method: "POST",

                body: formData,
            }
        );


    /* ERROR */

    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося створити новину"
        );

    }


    return response.json();

}


/* ========================================= */
/* UPDATE DATA */
/* ========================================= */

export interface UpdateNewsData {

    title: string;

    short_description: string;

    description: string;

    main_photo?: File | null;

}


/* ========================================= */
/* UPDATE */
/* ========================================= */

export async function updateNews(
    id: number,
    data: UpdateNewsData
): Promise<AdminNews> {

    const formData =
        new FormData();


    /* TITLE */

    formData.append(
        "title",
        data.title
    );


    /* SHORT DESCRIPTION */

    formData.append(
        "short_description",
        data.short_description
    );


    /* DESCRIPTION */

    formData.append(
        "description",
        data.description
    );


    /* MAIN PHOTO */

    if (
        data.main_photo
    ) {

        formData.append(
            "main_photo",
            data.main_photo
        );

    }


    /* REQUEST */

    const response =
        await adminFetch(
            `/news/${id}`,
            {
                method: "PUT",

                body: formData,
            }
        );


    /* ERROR */

    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося оновити новину"
        );

    }


    return response.json();

}


/* ========================================= */
/* DELETE */
/* ========================================= */

export async function deleteNews(
    id: number
): Promise<void> {

    const response =
        await adminFetch(
            `/news/${id}`,
            {
                method: "DELETE",
            }
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося видалити новину"
        );

    }

}