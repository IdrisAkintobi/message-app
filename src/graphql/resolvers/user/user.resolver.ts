import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import config from "../../../config";
import { AuthorizationError, ForbiddenError, ServerError } from "../../../utils/app.error";
import Context from "../../context";
import { UserWithCount } from "./user.type";

@Resolver(UserWithCount)
export default class UserResolver {
    /**
     * Me Query
     */
    @Query(returns => UserWithCount)
    async me(@Ctx() { database, userId }: Context): Promise<UserWithCount> {
        // Ensure user is logged in
        if (!userId) {
            throw new AuthorizationError(`Not authenticated`);
        }

        // lookup user from DB
        const user = await database.UserModel.findById(userId);
        if (!user) {
            throw new ServerError();
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }

    /**
     * Unread message count for a user
     */
    @FieldResolver()
    async unreadMessageCount(
        @Root() user: UserWithCount,
        @Ctx() { database, userId }: Context,
    ): Promise<UserWithCount["unreadMessageCount"]> {
        // do a count on the DB for user unread messages
        const count = await database.MessageModel.countDocuments({ to: userId, read: false });
        return count;
    }

    /**
     * Login mutation
     */
    @Mutation(returns => String)
    async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { database }: Context) {
        // find user by email
        const record = await database.UserModel.findOne({ email });
        if (!record) {
            throw new AuthorizationError(`Invalid credentials`);
        }

        // compare password
        const correct = await bcrypt.compare(password, record.password);
        if (!correct) {
            throw new AuthorizationError(`Invalid credentials`);
        }

        // return JWT
        return jwt.sign({ userId: record._id }, config.auth.secret, { expiresIn: "7d" });
    }

    /**
     * Register new user
     */
    @Mutation(returns => String)
    async register(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { database }: Context) {
        // check if user already exists
        const existing = await database.UserModel.findOne({ email });
        if (existing) {
            throw new ForbiddenError(`User exists!`);
        }

        // hash password and create user
        const hash = await bcrypt.hash(password, 10);
        const user = await database.UserModel.create({
            email,
            password: hash,
        });

        // return JWT
        return jwt.sign({ userId: user._id }, config.auth.secret, { expiresIn: "7d" });
    }
}
