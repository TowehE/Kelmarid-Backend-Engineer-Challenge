# AdonisJS API Backend Challenge

This project is an AdonisJS API with authentication for managing authors and books.

## Features

- User authentication with JWT tokens
- CRUD operations for authors and books
- Many-to-many relationship between authors and books
- Search functionality for both authors and books
- Pagination for list endpoints
- Complete test suite

## Requirements

- Node.js 14+ or Docker
- PostgreSQL 14 

## Getting Started

### Option 1: Local Setup

1. Clone the repository

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

4. Setup database
   - For PostgreSQL:
     Make sure your PostgreSQL server is running and update the database credentials in the .env file.

6. Run migrations and seed the database
```bash
node ace migration:run
node ace db:seed
```

7. Start the development server
```bash
node ace serve --watch
```

The API will be available at http://localhost:3333/api

### Option 2: Using Docker

1. Clone the repository

2. Build and start the containers
```bash
docker-compose -p kelmarid-backend up --build

```

The API will be available at http://localhost:3333

## Demo User

For testing purposes, you can use the following credentials:

- Username: Shyali
- Password: Testing123@!


## Running Tests

Run the test suite with:

```bash
node ace test
```
