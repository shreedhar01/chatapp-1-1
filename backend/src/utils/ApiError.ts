class ApiError extends Error {
    statusCode: number;
    error: any[];
    success: boolean;
    data: any | null;

    constructor(
        statusCode: number,
        message = "Something went wrong",
        error: any[] = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.error = error
        this.success = false
        this.data = null

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }