const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
// Parse JSON bodies
app.use(express.json());

// HTTP request logging with Morgan (dev format - colored output)
app.use(morgan('dev'));

// ===== IN-MEMORY DATA STORE =====
let movies = [
  { id: 1, title: "The Shawshank Redemption", director: "Frank Darabont", year: 1994 },
  { id: 2, title: "The Godfather", director: "Francis Ford Coppola", year: 1972 },
  { id: 3, title: "Inception", director: "Christopher Nolan", year: 2010 }
];

let nextId = 4;

// ===== HELPER FUNCTIONS =====

/**
 * Validate movie data
 * @param {Object} movie - Movie object to validate
 * @returns {Array} - Array of error messages (empty if valid)
 */
function validateMovie(movie) {
  const errors = [];
  
  // Validate title
  if (!movie.title || movie.title.trim() === '') {
    errors.push('Title is required');
  }
  
  // Validate director
  if (!movie.director || movie.director.trim() === '') {
    errors.push('Director is required');
  }
  
  // Validate year
  if (!movie.year) {
    errors.push('Year is required');
  } else if (typeof movie.year !== 'number' || movie.year < 1888 || movie.year > new Date().getFullYear()) {
    errors.push(`Year must be a number between 1888 and ${new Date().getFullYear()}`);
  }
  
  return errors;
}

/**
 * Find movie by ID
 * @param {string|number} id - Movie ID to find
 * @returns {Object|undefined} - Movie object or undefined
 */
function findMovieById(id) {
  return movies.find(m => m.id === parseInt(id));
}

// ===== ROUTES =====

/**
 * GET /movies - Get all movies with optional filtering
 * Query parameters:
 * - title: Filter by title (partial match, case-insensitive)
 * - year: Filter by exact year
 * - director: Filter by director (partial match, case-insensitive)
 * - minYear: Filter movies from this year onwards
 * - maxYear: Filter movies up to this year
 */
app.get('/movies', (req, res) => {
  const { title, year, director, minYear, maxYear } = req.query;
  
  let filteredMovies = movies;
  
  // Filter by title (case-insensitive, partial match)
  if (title) {
    filteredMovies = filteredMovies.filter(movie => 
      movie.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  
  // Filter by exact year
  if (year) {
    const yearNum = parseInt(year);
    if (!isNaN(yearNum)) {
      filteredMovies = filteredMovies.filter(movie => movie.year === yearNum);
    }
  }
  
  // Filter by director (case-insensitive, partial match)
  if (director) {
    filteredMovies = filteredMovies.filter(movie => 
      movie.director.toLowerCase().includes(director.toLowerCase())
    );
  }
  
  // Filter by minimum year
  if (minYear) {
    const minYearNum = parseInt(minYear);
    if (!isNaN(minYearNum)) {
      filteredMovies = filteredMovies.filter(movie => movie.year >= minYearNum);
    }
  }
  
  // Filter by maximum year
  if (maxYear) {
    const maxYearNum = parseInt(maxYear);
    if (!isNaN(maxYearNum)) {
      filteredMovies = filteredMovies.filter(movie => movie.year <= maxYearNum);
    }
  }
  
  res.status(200).json(filteredMovies);
});

/**
 * GET /movies/:id - Get a specific movie by ID
 */
app.get('/movies/:id', (req, res) => {
  const movie = findMovieById(req.params.id);
  
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  
  res.status(200).json(movie);
});

/**
 * POST /movies - Create a new movie
 * Required fields: title, director, year
 */
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

/**
 * PUT /movies/:id - Update an existing movie
 * Required fields: title, director, year
 */
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

/**
 * DELETE /movies/:id - Delete a movie by ID
 */
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
  console.log(`📋 Available endpoints:`);
  console.log(`   GET    /movies - Get all movies (supports query params)`);
  console.log(`   GET    /movies/:id - Get movie by ID`);
  console.log(`   POST   /movies - Create new movie`);
  console.log(`   PUT    /movies/:id - Update movie`);
  console.log(`   DELETE /movies/:id - Delete movie`);
  console.log(`\n🔍 Query parameters:`);
  console.log(`   ?title=<name> - Filter by title`);
  console.log(`   ?year=<year> - Filter by year`);
  console.log(`   ?director=<name> - Filter by director`);
  console.log(`   ?minYear=<year> - Filter from year`);
  console.log(`   ?maxYear=<year> - Filter up to year`);
  console.log(`\n📊 Morgan logging active (dev format)`);
});