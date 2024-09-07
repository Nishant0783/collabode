class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        if (data && typeof data === 'object') {
            Object.assign(this, data);  // Spread data properties directly to the ApiResponse instance
        }
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
