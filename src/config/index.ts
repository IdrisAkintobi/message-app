import defaultConfig from "./default";
import productionConfig from "./production";
import { Config } from "./types";

const getConfig = (): Config => {
    switch (process.env.NODE_ENV) {
        case "production":
            return productionConfig;
        default:
            return defaultConfig;
    }
};

export default getConfig();
