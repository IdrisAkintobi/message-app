import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class User {
    @Field(type => ID)
    id!: string;

    @Field({ nullable: true })
    name?: string;

    @Field()
    unreadMessageCount?: number;
}

export default User;
