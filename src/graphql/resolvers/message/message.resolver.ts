import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AuthorizationError, BadRequestError, ServerError } from "../../../utils/app.error";
import Context from "../../context";
import Message, { MessageIn, MessageOut } from "./message.type";

@Resolver(Message)
export default class MessageResolver {
    /**
     * View all messages in the inbox with pagination
     */
    @Query(returns => [MessageIn])
    async inbox(
        @Ctx() { database, userId }: Context,
        @Arg("page", { defaultValue: 1 }) page: number,
        @Arg("limit", { defaultValue: 20 }) limit: number,
    ): Promise<MessageIn[]> {
        if (!userId) {
            throw new AuthorizationError(`Not authenticated`);
        }

        // Get current user
        const user = await database.UserModel.findById(userId);
        if (!user) {
            throw new ServerError();
        }

        // find all messages where the user is the recipient and populate the sender
        const messages = await database.MessageModel.find({
            to: userId,
        })
            .populate("from", "name email")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        return messages as MessageIn[];
    }

    /**
     * View all messages in the outbox with pagination
     */

    @Query(returns => [MessageOut])
    async outbox(
        @Arg("page", { defaultValue: 1 }) page: number,
        @Arg("limit", { defaultValue: 20 }) limit: number,
        @Ctx() { database, userId }: Context,
    ): Promise<MessageOut[]> {
        if (!userId) {
            throw new AuthorizationError(`Not authenticated`);
        }

        // Get current user
        const user = await database.UserModel.findById(userId);
        if (!user) {
            throw new ServerError();
        }

        // find all messages where the user is the sender and populate the recipient
        const messages = await database.MessageModel.find({
            from: userId,
        })
            .populate("to", "name email")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        return messages as MessageOut[];
    }

    /**
     * Sends message to a user
     */
    @Mutation(returns => MessageOut)
    async sendMessage(
        @Arg("to") to: string,
        @Arg("contents") contents: string,
        @Ctx() { database, userId }: Context,
    ): Promise<MessageOut> {
        if (!userId) {
            throw new AuthorizationError(`Not authenticated`);
        }

        // Fetch current user and recipient
        const [sender, recipient] = await Promise.all([
            database.UserModel.findById(userId),
            database.UserModel.findOne({ email: to }),
        ]);

        if (!sender) throw new ServerError();
        if (!recipient) throw new BadRequestError(`Recipient does not exist`);
        if (sender.id === recipient.id) throw new BadRequestError(`You cannot send a message to yourself`);

        // Create message
        try {
            const message = await database.MessageModel.create({
                from: sender.id,
                to: recipient.id,
                contents,
            });

            return { ...message.toJSON(), to: recipient.toJSON() } as MessageOut;
        } catch (error) {
            throw new ServerError();
        }
    }

    /**
     * Mark a message as read
     */
    @Mutation(returns => Message)
    async markMessageAsRead(@Arg("id") id: string, @Ctx() { database, userId }: Context): Promise<Message> {
        if (!userId) {
            throw new AuthorizationError(`Not authenticated`);
        }

        const message = await database.MessageModel.findOneAndUpdate(
            { _id: id, to: userId, read: false },
            { read: true },
            { new: true },
        );

        if (!message) {
            throw new BadRequestError(`Message does not exist`);
        }

        return message.toJSON() as Message;
    }

    /**
     * Mark a message as unread
     */
    @Mutation(returns => Message)
    async markMessageAsUnread(@Arg("id") id: string, @Ctx() { database, userId }: Context): Promise<Message> {
        if (!userId) {
            throw new AuthorizationError(`Not authenticated`);
        }

        const message = await database.MessageModel.findOneAndUpdate(
            { _id: id, to: userId, read: true },
            { read: false },
            { new: true },
        );

        if (!message) {
            throw new BadRequestError(`Message does not exist`);
        }

        return message.toJSON() as Message;
    }

    /**
     * Delete a message
     */
    @Mutation(returns => Message)
    async deleteMessage(@Arg("id") id: string, @Ctx() { database, userId }: Context): Promise<Message> {
        if (!userId) {
            throw new AuthorizationError(`Not authenticated`);
        }

        const message = await database.MessageModel.findOneAndDelete({ _id: id, from: userId });

        if (!message) {
            throw new BadRequestError(`Message does not exist`);
        }

        return message.toJSON() as Message;
    }
}
