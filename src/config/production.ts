import { Config } from "./types";

const config: Config = {
    database: {
        uri: process.env.DATABASE_URI as string,
    },
    auth: {
        secret: process.env.AUTH_SECRET as string,
    },
    frontend: {
        selfUrl: "http://localhost:5000/app",
    },
    port: process.env.PORT as string,
};

export default config;
