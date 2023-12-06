// In this file you can configure migrate-mongo

const config = {
    mongodb: {
        //mongoDB URL
        url: "mongodb://localhost:27017/messaging-app",

        //database name:
        databaseName: "messaging-app",

        options: {
            useNewUrlParser: true, // removes a deprecation warning when connecting
            useUnifiedTopology: true, // removes a deprecating warning when connecting
            //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
            //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
        },
    },

    // The migrations dir, can be an relative or absolute path.
    migrationsDir: "build/database/migrations",

    // The mongodb collection where the applied changes are stored.
    changelogCollectionName: "changelog",

    // The file extension to create migrations and search for in migration dir
    migrationFileExtension: ".js",
};

// Return the config as a promise
module.exports = config;
