# NC News

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)

This project is a RESTful API built with Node.js and Express, designed to interact with a PostgreSQL database. It provides a backend service for managing articles, topics, comments, and users. The API supports full CRUD operations for comments and articles, with advanced features such as query-based filtering, sorting, and comment counting.

#### Features

- Retrieve and manage articles and their associated comments
- Fetch available topics and users
- Add, update, and delete comments
- Filter and sort articles using query parameters

The database can be seeded locally or deployed using Supabase for remote access. This makes it ideal for use in full-stack applications or as a learning tool for building scalable REST APIs with relational databases.

### Check out my [live API](https://nc-news-782p.onrender.com/api)

# Getting Started

## Prerequisites

- [PostgreSQL](https://www.postgresql.org/) 14.17
- [Node.js](https://nodejs.org/en) v20
- [npm](https://www.npmjs.com/) 9.6.4

## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Marc9K/northcoders-news-BE.git
   ```
1. Install dependencies
   ```sh
   npm install
   ```

### Contributing

3. Rename [.env.development.example](.env.development.example) to [.env.development](./.env.development) and fill in the environment variables

4. Rename [.env.test.example](.env.test.example) to [.env.test](./.env.test) and fill in the environment variables
5. Start up you local PostgreSQL
6. Setup your local databse
   ```sh
   npm run setup-dbs
   ```
7. Seed your local development database
   ```sh
   npm run seed-dev
   ```

#### Testing

8. Test
   ```sh
   npm test
   ```

### Deploying

3. Set up a database instance using [Supabase](https://supabase.com/)
4. Rename [.env.production.example](.env.production.example) to [.env.production](./.env.production) and fill in the environment variables
5. Seed your Supabase with [data](./db//data/development-data/)
   ```sh
   npm run seed-prod
   ```

### Usage

Once deployed it can be accessed on host_adress/api/\*
