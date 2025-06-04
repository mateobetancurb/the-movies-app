# Testing Documentation

This document provides information about the testing setup and how to run tests for the Movies App.

## Overview

The project uses Jest and React Testing Library for unit testing and component testing.

## Test Structure

```
src/__tests__/
├── components/
│   └── movies/
│       ├── MovieHero.test.tsx      # Tests for MovieHero component
│       ├── MovieCard.test.tsx      # Tests for MovieCard component
│       └── MovieGrid.test.tsx      # Tests for MovieGrid component
└── services/
    └── getFeaturedMovie.test.ts    # Tests for getFeaturedMovie function
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Specific Test Files

```bash
# Run MovieHero tests only
npm test -- --testPathPattern="MovieHero"

# Run MovieCard tests only
npm test -- --testPathPattern="MovieCard"

# Run MovieGrid tests only
npm test -- --testPathPattern="MovieGrid"

# Run getFeaturedMovie tests only
npm test -- --testPathPattern="getFeaturedMovie"

# Run all movie component tests
npm test -- --testPathPattern="MovieHero|MovieCard|MovieGrid"

# Run specific combination of tests
npm test -- --testPathPattern="MovieCard|MovieGrid"
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Tests with Verbose Output

```bash
npm test -- --verbose
```

## Test Coverage

The tests currently cover:

### MovieHero Component (`src/components/movies/MovieHero.tsx`)

- ✅ Renders movie information correctly
- ✅ Handles backdrop image display and fallback
- ✅ Displays runtime conditionally
- ✅ Handles movies without genres
- ✅ Renders action buttons correctly
- ✅ Formats vote averages properly
- ✅ Displays icons (star, clock, play)
- ✅ Applies correct CSS classes
- ✅ Handles genre separation
- ✅ Extracts release year correctly
- ✅ Maintains responsive layout classes

### MovieCard Component (`src/components/movies/MovieCard.tsx`)

- ✅ Renders movie information correctly (title, year, rating, runtime)
- ✅ Displays movie poster with proper alt text and fallback
- ✅ Shows only first two genres to maintain layout
- ✅ Handles movies without runtime, genres, or release date
- ✅ Formats vote averages with proper decimal places
- ✅ Navigates to movie detail page when clicked
- ✅ Adds/removes movies from favorites with proper state management
- ✅ Prevents event bubbling on favorite button clicks
- ✅ Displays correct favorite button states (filled/unfilled heart)
- ✅ Provides proper accessibility labels and keyboard navigation
- ✅ Handles intersection observer for animations
- ✅ Applies correct CSS classes and hover effects
- ✅ Handles edge cases (zero ratings, long titles, null values)

### MovieGrid Component (`src/components/movies/MovieGrid.tsx`)

- ✅ Renders movies in responsive grid layout
- ✅ Displays optional section title as heading level 2
- ✅ Passes correct index to each MovieCard for animations
- ✅ Applies proper grid CSS classes for responsiveness
- ✅ Shows default and custom empty state messages
- ✅ Handles various movie counts (single, multiple, large numbers)
- ✅ Processes movies with missing or incomplete data
- ✅ Handles special characters in movie titles
- ✅ Maintains proper semantic HTML structure
- ✅ Provides accessible section labeling
- ✅ Integrates correctly with Framer Motion animations
- ✅ Validates props gracefully (undefined/empty values)

### getFeaturedMovie Function (`src/services/movieService.ts`)

- ✅ Returns a featured movie successfully
- ✅ Handles random selection correctly
- ✅ Limits selection to first 10 movies
- ✅ Returns null when no movies available
- ✅ Handles API errors gracefully
- ✅ Manages single movie scenarios
- ✅ Tests randomness algorithm
- ✅ Verifies function signature and return types

## Test Configuration

### Jest Configuration (`jest.config.js`)

- Uses Next.js Jest configuration
- Sets up jsdom test environment
- Configures module path mapping
- Enables coverage collection

### Test Setup (`jest.setup.js`)

- Imports `@testing-library/jest-dom` for custom matchers

## Mocking Strategy

### MovieHero Component Tests

- Mocks `FavoritesContext` hooks
- Mocks `next/navigation` router
- Mocks `next/image` component

### MovieCard Component Tests

- Mocks `FavoritesContext` hooks for favorite management
- Mocks `next/navigation` router for navigation
- Mocks `next/image` component for poster display
- Mocks `framer-motion` for animation testing
- Mocks `react-intersection-observer` for performance testing
- Uses `@testing-library/user-event` for realistic user interactions

### MovieGrid Component Tests

- Mocks `framer-motion` for animation components
- Mocks `MovieCard` component to isolate grid functionality
- Tests component composition and data flow
- Validates responsive grid layout behavior

### getFeaturedMovie Function Tests

- Mocks dependent service functions (`getTrendingMovies`, `getMovieDetails`)
- Mocks `Math.random` for predictable testing
- Uses Node.js test environment to avoid DOM dependencies

## Test Data

Tests use comprehensive mock data including:

- Movie objects with all required properties
- Paginated API responses
- Edge cases (missing data, empty results)
- Error scenarios

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on external state
2. **Mocking**: External dependencies are properly mocked
3. **Edge Cases**: Tests cover both happy path and error scenarios
4. **Assertions**: Clear and specific assertions for expected behavior
5. **Cleanup**: Proper cleanup using `beforeEach` and `afterEach` hooks

## Running Tests in CI/CD

For continuous integration, use:

```bash
npm test -- --ci --coverage --watchAll=false
```

This ensures tests run once without watch mode and generate coverage reports.

## Adding New Tests

When adding new tests:

1. Follow the existing directory structure
2. Use descriptive test names
3. Mock external dependencies
4. Test both success and error scenarios
5. Maintain good test coverage
6. Group related tests using `describe` blocks
7. Use `beforeEach` for common setup
8. Test edge cases and error conditions
9. Ensure proper cleanup with `afterEach` when needed
10. Use realistic user interactions with `@testing-library/user-event`

## Recent Additions

### MovieCard and MovieGrid Components (Recently Added)

These components now have comprehensive test coverage including:

- **User Interactions**: Navigation, favorites management, click handling
- **Edge Cases**: Missing data, null values, empty states
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Animation integration, intersection observers
- **Visual States**: Hover effects, CSS classes, responsive layout

## Troubleshooting

### Common Issues

1. **Module resolution errors**: Check `moduleNameMapper` in `jest.config.js`
2. **Mock not working**: Ensure mocks are defined before imports
3. **Async test failures**: Use `async/await` properly with `Promise` assertions
4. **DOM-related errors**: Use appropriate test environment (`jsdom` vs `node`)

### Environment Variables

Some tests may require environment variables. Set them in test setup:

```javascript
process.env.TMDB_API_KEY = "test-api-key";
```
