import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class User {
    @Field(type => ID)
    id!: string;

    @Field({ nullable: true })
    name?: string;

    @Field()
    email!: string;
}

@ObjectType()
export class UserWithCount extends User {
    @Field()
    unreadMessageCount?: number;
}

export default User;
