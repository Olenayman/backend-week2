# Backend Week 2: Movie Management API

A RESTful CRUD API for managing movies, built with Node.js and Express.

## Features
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation
- ✅ Proper HTTP status codes
- ✅ Request logging with Morgan
- ✅ Error handling

## Installation

```bash
npm install
```

## Running the Server

```bash
node server.js
```

Server will run on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/movies` | Get all movies |
| GET | `/movies/:id` | Get movie by ID |
| POST | `/movies` | Create new movie |
| PUT | `/movies/:id` | Update movie |
| DELETE | `/movies/:id` | Delete movie |

## Testing

Use the `test.http` file with REST Client extension in VSCode.

## Technologies
- Node.js
- Express.js
- Morgan (logging)