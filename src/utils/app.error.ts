import { ApolloError } from "apollo-server-errors";

export class BadRequestError extends ApolloError {
    constructor(message: string) {
        super(message, "BAD_REQUEST", { statusCode: 400 });

        Object.defineProperty(this, "name", { value: "BadRequestError" });
    }
}

export class AuthorizationError extends ApolloError {
    constructor(message: string) {
        super(message, "UNAUTHORIZED", { statusCode: 401 });

        Object.defineProperty(this, "name", { value: "AuthorizationError" });
    }
}

export class ForbiddenError extends ApolloError {
    constructor(message: string) {
        super(message, "FORBIDDEN", { statusCode: 403 });

        Object.defineProperty(this, "name", { value: "ForbiddenError" });
    }
}

export class ServerError extends ApolloError {
    constructor() {
        super("Something went wrong", "INTERNAL_SERVER_ERROR", { statusCode: 500 });

        Object.defineProperty(this, "name", { value: "ServerError" });
    }
}
