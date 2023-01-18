# Messaging App

A simple messaging app which allows users to register with an email, login, and post messages to one another.

## User story:

    - A user should be able to register and login with their email and password
    - A user can view all messages [inbox and outbox] (paginated)
    - A user can send message to another user on the platform
    - A user should be able to mark messages as read and unread
    - A user should be able to delete message

## Tech stack

-   Typescript
-   NodeJS
-   Express
-   Graphql
-   MongoDB
-   Pm2
-   Docker

## How to run

-   You will need a local version of MongoDB running on port `27017`
-   You can run the app in development live reload mode using `yarn develop`
-   To run the application in production mode, you should use `yarn build` followed by `yarn start`
-   To insert dummy production data, run mongo migration script (`yarn migrate:up`) which will create 10,000 users and 40,000 messages
-   Use artillery (`yarn artillery:run -o result.json`) to run a load test and save the output of results to `result.json`.
