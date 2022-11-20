import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Database } from "../database";
import Context from "./context";
import { resolvers } from "./resolvers";

export default async (db: Database) => {
    const schema = await buildSchema({ resolvers });

    const server = new ApolloServer({
        schema,
        context: req => new Context(db, req),
        cache: "bounded",
        introspection: process.env.NODE_ENV !== "production",
    });

    return server;
};
