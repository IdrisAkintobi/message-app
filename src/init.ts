import "dotenv/config";
import express from "express";
import { expressjwt } from "express-jwt";
import expressPlayground from "graphql-playground-middleware-express";
import "reflect-metadata"; // this ensures type graphql works properly
import config from "./config";
import getDatabase from "./database";
import createGraphqlServer from "./graphql";

const init = async () => {
    const app = express();
    const db = await getDatabase(config.database);
    console.log("DB connected!");
    const server = await createGraphqlServer(db);

    const PORT = config.port;
    const path = "/graphql";

    app.use(
        path,
        expressjwt({
            secret: config.auth.secret,
            credentialsRequired: false,
            algorithms: ["HS256"],
        }),
    );

    // for debugging
    app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

    await server.start();
    server.applyMiddleware({ app, path });

    app.listen(PORT, () => console.log(`Server is ready at http://localhost:${PORT}${server.graphqlPath}`));
};

init();
