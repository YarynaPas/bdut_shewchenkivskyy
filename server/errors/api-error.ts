export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
        console.error(`Error [${statusCode}]: ${message}`);
    }

    static badRequest(message: string): ApiError {
        return new ApiError(400, message);
    }

    static unauthorized(message: string): ApiError {
        return new ApiError(401, message);
    }

    static forbidden(message: string): ApiError {
        return new ApiError(403, message);
    }

    static notFound(message: string): ApiError {
        return new ApiError(404, message);
    }

    static internal(message: string): ApiError {
        return new ApiError(500, message);
    }
}
