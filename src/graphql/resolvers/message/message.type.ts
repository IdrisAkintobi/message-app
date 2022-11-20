import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class Message {
    @Field(type => ID)
    id!: string;

    @Field()
    contents!: string;

    @Field()
    from?: string;

    @Field()
    to?: string;
}

export default Message;
