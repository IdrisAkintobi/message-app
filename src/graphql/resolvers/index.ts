import { BuildSchemaOptions } from "type-graphql";

import MessageResolver from "./message/message.resolver";
import UserResolver from "./user/user.resolver";

export const resolvers: BuildSchemaOptions["resolvers"] = [MessageResolver, UserResolver];
