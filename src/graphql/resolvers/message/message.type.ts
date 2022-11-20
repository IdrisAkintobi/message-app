import { Field, ID, ObjectType } from "type-graphql";
import User from "../user/user.type";

// Type of user not including unreadMessageCount
@ObjectType()
class Message {
    @Field(type => ID)
    id!: string;

    @Field()
    contents!: string;

    @Field()
    read!: boolean;

    @Field()
    createdAt!: Date;
}

@ObjectType()
export class MessageOut extends Message {
    @Field()
    to!: User;
}

@ObjectType()
export class MessageIn extends Message {
    @Field()
    from!: User;
}

export default Message;
