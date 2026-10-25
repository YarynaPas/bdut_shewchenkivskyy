import { adminFetch } from "./adminApi";


/* ========================================= */
/* SCHEDULE */
/* ========================================= */

export interface ScheduleItem {

    day: string;

    time: string;

}


/* ========================================= */
/* GURTOK */
/* ========================================= */

export interface AdminGurtok {

    id: number;

    name: string;

    teacher: string;

    napryam: string;

    vikova_grupa: string;

    description: string | null;

    long_description: string | null;

    classrom: string | null;

    pictograma: string;

    photos: string[];

    schedule: ScheduleItem[] | null;

    createdAt?: string;

    updatedAt?: string;

}


/* ========================================= */
/* GET ALL */
/* ========================================= */

export async function getAdminGurtky(): Promise<AdminGurtok[]> {

    const response =
        await adminFetch(
            "/gurtky"
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося завантажити гуртки"
        );

    }


    return response.json();

}


/* ========================================= */
/* GET BY ID */
/* ========================================= */

export async function getAdminGurtokById(
    id: number
): Promise<AdminGurtok> {

    const response =
        await adminFetch(
            `/gurtky/${id}`
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Гурток не знайдено"
        );

    }


    return response.json();

}


/* ========================================= */
/* CREATE DATA */
/* ========================================= */

export interface CreateGurtokData {

    name: string;

    teacher: string;

    napryam: string;

    vikova_grupa: string;

    description?: string;

    long_description?: string;

    classrom?: string;

    schedule?: ScheduleItem[];

    pictograma: File;

    photos?: File[];

}


/* ========================================= */
/* CREATE */
/* ========================================= */

export async function createGurtok(
    data: CreateGurtokData
): Promise<AdminGurtok> {

    const formData =
        new FormData();


    formData.append(
        "name",
        data.name
    );


    formData.append(
        "teacher",
        data.teacher
    );


    formData.append(
        "napryam",
        data.napryam
    );


    formData.append(
        "vikova_grupa",
        data.vikova_grupa
    );


    if (data.description) {

        formData.append(
            "description",
            data.description
        );

    }


    if (data.long_description) {

        formData.append(
            "long_description",
            data.long_description
        );

    }


    if (data.classrom) {

        formData.append(
            "classrom",
            data.classrom
        );

    }


    if (
        data.schedule &&
        data.schedule.length > 0
    ) {

        formData.append(
            "schedule",
            JSON.stringify(
                data.schedule
            )
        );

    }


    /* PICTOGRAMA — REQUIRED */

    formData.append(
        "pictograma",
        data.pictograma
    );


    /* ADDITIONAL PHOTOS */

    if (data.photos) {

        data.photos.forEach(
            (photo) => {

                formData.append(
                    "photos",
                    photo
                );

            }
        );

    }


    const response =
        await adminFetch(
            "/gurtky",
            {
                method: "POST",
                body: formData,
            }
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося створити гурток"
        );

    }


    return response.json();

}


/* ========================================= */
/* DELETE */
/* ========================================= */

export async function deleteGurtok(
    id: number
): Promise<void> {

    const response =
        await adminFetch(
            `/gurtky/${id}`,
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
            "Не вдалося видалити гурток"
        );

    }

}
export interface UpdateGurtokData {

    name: string;

    teacher: string;

    napryam: string;

    vikova_grupa: string;

    description?: string;

    long_description?: string;

    classrom?: string;

    schedule?: ScheduleItem[];

    pictograma?: File | null;

    existing_photos: string[];

    photos?: File[];

}


export async function updateGurtok(
    id: number,
    data: UpdateGurtokData
): Promise<AdminGurtok> {

    const formData =
        new FormData();


    formData.append(
        "name",
        data.name
    );


    formData.append(
        "teacher",
        data.teacher
    );


    formData.append(
        "napryam",
        data.napryam
    );


    formData.append(
        "vikova_grupa",
        data.vikova_grupa
    );


    formData.append(
        "description",
        data.description || ""
    );


    formData.append(
        "long_description",
        data.long_description || ""
    );


    formData.append(
        "classrom",
        data.classrom || ""
    );


    formData.append(
        "schedule",
        JSON.stringify(
            data.schedule || []
        )
    );


    formData.append(
        "existing_photos",
        JSON.stringify(
            data.existing_photos
        )
    );


    if (data.pictograma) {

        formData.append(
            "pictograma",
            data.pictograma
        );

    }


    if (data.photos) {

        data.photos.forEach(
            photo => {

                formData.append(
                    "photos",
                    photo
                );

            }
        );

    }


    const response =
        await adminFetch(
            `/gurtky/${id}`,
            {
                method: "PUT",
                body: formData,
            }
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося оновити гурток"
        );

    }


    return response.json();

}