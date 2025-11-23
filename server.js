const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
// Parse JSON bodies
app.use(express.json());

// Log HTTP requests
app.use(morgan('dev'));

// ===== IN-MEMORY DATA STORE =====
let movies = [
  { id: 1, title: "The Shawshank Redemption", director: "Frank Darabont", year: 1994 },
  { id: 2, title: "The Godfather", director: "Francis Ford Coppola", year: 1972 },
  { id: 3, title: "Inception", director: "Christopher Nolan", year: 2010 }
];

let nextId = 4;

// ===== HELPER FUNCTIONS =====
// Validate movie data
function validateMovie(movie) {
  const errors = [];
  
  if (!movie.title || movie.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!movie.director || movie.director.trim() === '') {
    errors.push('Director is required');
  }
  
  if (!movie.year) {
    errors.push('Year is required');
  } else if (typeof movie.year !== 'number' || movie.year < 1888 || movie.year > new Date().getFullYear()) {
    errors.push(`Year must be a number between 1888 and ${new Date().getFullYear()}`);
  }
  
  return errors;
}

// Find movie by ID
function findMovieById(id) {
  return movies.find(m => m.id === parseInt(id));
}

// ===== ROUTES =====

// GET /movies - Get all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// GET /movies/:id - Get a specific movie by ID
app.get('/movies/:id', (req, res) => {
  const movie = findMovieById(req.params.id);
  
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  
  res.status(200).json(movie);
});

// POST /movies - Create a new movie
app.post('/movies', (req, res) => {
  const { title, director, year } = req.body;
  
  // Validate input
  const errors = validateMovie(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  // Create new movie
  const newMovie = {
    id: nextId++,
    title: title.trim(),
    director: director.trim(),
    year
  };
  
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// PUT /movies/:id - Update an existing movie
app.put('/movies/:id', (req, res) => {
  const movie = findMovieById(req.params.id);
  
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  
  // Validate input
  const errors = validateMovie(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  // Update movie
  movie.title = req.body.title.trim();
  movie.director = req.body.director.trim();
  movie.year = req.body.year;
  
  res.status(200).json(movie);
});

// DELETE /movies/:id - Delete a movie by ID
app.delete('/movies/:id', (req, res) => {
  const movieIndex = movies.findIndex(m => m.id === parseInt(req.params.id));
  
  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  
  movies.splice(movieIndex, 1);
  res.status(204).send(); // No content
});

// ===== CATCH-ALL ROUTE FOR UNDEFINED ENDPOINTS =====
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🎬 Movie API server running on http://localhost:${PORT}`);
});