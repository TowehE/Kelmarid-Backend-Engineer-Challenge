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
- PostgreSQL 14 (or SQLite as fallback)

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

4. Generate application key
```bash
node ace generate:key
```
Update the .env file with the generated key.

5. Setup database
   - For SQLite:
     ```bash
     mkdir -p database
     touch database/database.sqlite
     ```
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

The API will be available at http://localhost:3333

### Option 2: Using Docker

1. Clone the repository

2. Build and start the containers
```bash
docker-compose up -d
```

3. Setup the database
```bash
docker-compose exec api sh -c "chmod +x ./setup-db.sh && ./setup-db.sh"
```

The API will be available at http://localhost:3333

## API Documentation

### Authentication

#### Register a new user
```
POST /api/auth/register
Body: { "username": "your_username", "password": "your_password" }
```

#### Login
```
POST /api/auth/login
Body: { "username": "your_username", "password": "your_password" }
```

#### Logout
```
POST /api/logout
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### Authors

#### List authors
```
GET /api/authors
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Query params: page, per_page, search
```

#### Get author by ID
```
GET /api/authors/:id
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

#### Create author
```
POST /api/authors
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: { "name": "Author Name" }
```

#### Update author
```
PUT /api/authors/:id
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: { "name": "New Author Name" }
```

#### Delete author
```
DELETE /api/authors/:id
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### Books

#### List books
```
GET /api/books
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Query params: page, per_page, book_name, author_name
```

#### Get book by ID
```
GET /api/books/:id
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

#### Create book
```
POST /api/books
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: { 
  "name": "Book Name", 
  "pageNumbers": 250, 
  "authorIds": [1, 2] 
}
```

#### Update book
```
PUT /api/books/:id
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: { 
  "name": "New Book Name",
  "pageNumbers": 300,
  "authorIds": [1, 3]
}
```

#### Delete book
```
DELETE /api/books/:id
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

## Demo User

For testing purposes, you can use the following credentials:

- Username: admin
- Password: password123

## Running Tests

Run the test suite with:

```bash
node ace test
```

## Project Structure

- `app/Controllers` - API controllers
- `app/Models` - Database models
- `app/Validators` - Request validation schemas
- `database/migrations` - Database migrations
- `database/seeders` - Database seeders
- `start/routes.ts` - API routes definition
- `tests` - Test files