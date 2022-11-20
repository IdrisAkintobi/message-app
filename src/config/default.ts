import { Config } from "./types";
const { DATABASE_URI, AUTH_SECRET, PORT } = process.env;

const config: Config = {
    database: {
        uri: DATABASE_URI as string,
    },
    auth: {
        secret: AUTH_SECRET as string,
    },
    frontend: {
        selfUrl: "http://localhost:5000/app",
    },
    port: PORT as string,
};

export default config;
