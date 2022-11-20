import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import config from "../../../config";
import Context from "../../context";
import User from "./user.type";

@Resolver(User)
export default class UserResolver {
    /**
     * Me Query
     */
    @Query(returns => User)
    async me(@Ctx() { database, userId }: Context): Promise<User> {
        if (!userId) {
            throw new Error(`Not authenticated`);
        }

        const user = await database.UserModel.findById(userId);

        if (!user) {
            throw new Error(`User does not exist`);
        }

        return {
            id: user._id,
            name: user.name,
            unreadMessageCount: undefined,
        };
    }

    /**
     * Unread message count for a user
     */
    @FieldResolver()
    async unreadMessageCount(
        @Root() user: User,
        @Ctx() { database, userId }: Context,
    ): Promise<User["unreadMessageCount"]> {
        // do a count on the DB for messages count
        const count = await database.MessageModel.find({ to: userId });
        return count.length;
    }

    /**
     * Login mutation
     */
    @Mutation(returns => String)
    async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { database }: Context) {
        const record = await database.UserModel.findOne({ email });

        if (!record) {
            throw new Error(`Incorrect password`);
        }

        const correct = await bcrypt.compare(password, record.password);

        if (!correct) {
            throw new Error(`Invalid credentials`);
        }

        return jwt.sign({ userId: record._id }, config.auth.secret, { expiresIn: "1y" });
    }

    /**
     * Register new user
     */
    @Mutation(returns => String)
    async register(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { database }: Context) {
        const existing = await database.UserModel.findOne({ email });

        if (existing) {
            throw new Error(`User exists!`);
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await database.UserModel.create({
            email,
            password: hash,
        });

        return jwt.sign({ userId: user._id }, config.auth.secret, { expiresIn: "1y" });
    }
}
