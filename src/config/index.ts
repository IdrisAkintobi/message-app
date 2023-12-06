import { Config } from "./types";

const config: Config = {
    database: {
        uri: process.env.DATABASE_URI as string,
    },
    auth: {
        secret: process.env.AUTH_SECRET as string,
    },
    port: process.env.PORT as string,
};

export default config;
