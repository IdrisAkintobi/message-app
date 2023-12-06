export type Config = {
    database: {
        uri: string;
    };
    auth: {
        secret: string;
    };
    port?: number | string;
};
