import { z } from "zod";

//Signup validator
const registerValidator = z
    .object({
        name: z.string().min(3),
        email: z.string().email({ message: "Enter valid email" }),
        password: z.string().min(6),
    })
    .strict();

//Sign in Validator
const loginValidator = z
    .object({
        email: z.string().email({ message: "Enter valid email" }),
        password: z.string(),
    })
    .strict();

export { registerValidator, loginValidator };
