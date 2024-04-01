<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# GraphQL API with Nest.js, Prisma, SDL First Approach

This GraphQL API is built with Nest.js, Prisma, and follows an SDL (Schema Definition Language) first approach. It incorporates access and refresh tokens for authentication, allowing secure access to user data. Custom decorators are utilized to access tokens and user data efficiently.

## Technologies Used

- [Nest.js](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [GraphQL](https://graphql.org/)
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js/)
- [Passport](http://www.passportjs.org/)
- [Express](https://expressjs.com/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)

## Features

- Utilizes GraphQL scalars for enhanced data handling.
- Implements token-based authentication for secure access.
- Custom decorators allow easy access to tokens and user data.
- Integrates Apollo with playground enabled for interactive API exploration.

## To-Do

- Implement follower/following resolvers to enhance social interaction features.

## Acknowledgements

This project draws inspiration from the tutorial by [@CodingIsLove](https://youtube.com/playlist?list=PLl6yY6TinjfJLm3fh796ReTcsOEt0p-5t&si=H81wcpqMySHEAQa1), although it has been adapted to follow a schema-first approach.

## License

Nest is [MIT licensed](LICENSE).
