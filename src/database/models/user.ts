import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
                delete ret.__v;
                delete ret.password;
            },
        },
    },
})
export class User {
    @prop()
    public name!: string;

    @prop()
    public email!: string;

    @prop()
    public password!: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
