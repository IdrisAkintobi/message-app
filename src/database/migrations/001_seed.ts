import bcrypt from "bcrypt";
import { Db, ObjectId } from "mongodb";
import { random } from "../../utils/math";
const randomSentence = require("random-sentence");

const USER_COUNT = 10000;

export const up = async (db: Db) => {
    const plainPassword = "abcd1234";
    const password = await bcrypt.hash(plainPassword, 10);
    const users = Array.from(new Array(USER_COUNT)).map((_, i) => ({
        password,
        _id: new ObjectId(),
        email: `user+${i}@test.app.com`,
        name: `User ${i}`,
    }));
    await db.collection("users").insertMany(users);

    const messages = [] as any[];

    // create some test messages
    users.map((user, i) => {
        const friends = [
            users[random(i + 1, USER_COUNT - 1)],
            users[random(i + 1, USER_COUNT - 1)],
            users[random(i + 1, USER_COUNT - 1)],
            users[random(i + 1, USER_COUNT - 1)],
        ];

        if (i === 10) {
            console.log(friends);
        }

        friends.map(({ _id }) =>
            messages.push({
                from: _id,
                to: user._id,
                contents: randomSentence({ words: random(5, 10) }),
                read: false,
                createdAt: new Date(),
            }),
        );
    });
    await db.collection("messages").insertMany(messages);
};

export const down = async (db: Db) => {
    await db.collection("users").deleteMany({});
    await db.collection("messages").deleteMany({});
};
