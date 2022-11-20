import { mongoose } from "@typegoose/typegoose";
import { Config } from "../config/types";
import { Unpacked } from "../utils/types";
import { MessageModel, UserModel } from "./models";

const init = async (config: Config["database"]) => {
    const connection = await mongoose.connect(config.uri);

    return {
        connection,
        UserModel,
        MessageModel,
    };
};

export type Database = Unpacked<ReturnType<typeof init>>;

export default init;
