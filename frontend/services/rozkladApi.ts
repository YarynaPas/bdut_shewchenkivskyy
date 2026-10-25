import { adminFetch } from "./adminApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Rozklad {
    id: number;
    photo: string;
}

export interface CreateRozkladData {
    photo: File;
}

/**
 * Отримати всі розклади
 */
export const getAdminRozklad = async (): Promise<Rozklad[]> => {
    const response = await adminFetch("/rozklad", {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Не вдалося завантажити розклад");
    }

    return response.json();
};

/**
 * Отримати розклад за ID
 */
export const getAdminRozkladById = async (
    id: number
): Promise<Rozklad> => {
    const response = await adminFetch(`/rozklad/${id}`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Не вдалося завантажити розклад");
    }

    return response.json();
};

/**
 * Додати розклад
 */
export const createRozklad = async (
    data: CreateRozkladData
): Promise<Rozklad> => {
    const formData = new FormData();

    formData.append("photo", data.photo);

    const response = await adminFetch("/rozklad", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        let message = "Не вдалося додати розклад";

        try {
            const error = await response.json();

            if (error?.message) {
                message = error.message;
            }
        } catch {
            // залишаємо стандартне повідомлення
        }

        throw new Error(message);
    }

    return response.json();
};

/**
 * Видалити розклад
 */
export const deleteRozklad = async (
    id: number
): Promise<void> => {
    const response = await adminFetch(`/rozklad/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        let message = "Не вдалося видалити розклад";

        try {
            const error = await response.json();

            if (error?.message) {
                message = error.message;
            }
        } catch {
            // залишаємо стандартне повідомлення
        }

        throw new Error(message);
    }
};