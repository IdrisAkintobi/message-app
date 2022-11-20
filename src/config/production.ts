import { Config } from "./types";

const config: Config = {
    database: {
        uri: "mongodb://localhost/yulife-performance",
    },
    auth: {
        secret: "sfdgr8rqw734r734je!ejw47dwer£",
    },
    frontend: {
        selfUrl: "https://someapp.yulife.com/app",
    },
    port: 80,
};

export default config;
