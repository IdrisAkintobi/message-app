import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import User from "../../graphql/resolvers/user/user.type";

@modelOptions({
    schemaOptions: {
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
                delete ret.__v;
            },
        },
    },
})
export class Message {
    @prop({ ref: User, index: true })
    public from!: Ref<User>;

    @prop({ ref: User, index: true })
    public to!: Ref<User>;

    @prop()
    public contents!: string;

    @prop({ default: false })
    public read?: boolean;

    @prop({ default: Date.now })
    public createdAt?: Date;
}

const MessageModel = getModelForClass(Message);

export default MessageModel;
