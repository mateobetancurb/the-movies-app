# Testing Documentation

This document provides information about the testing setup and how to run tests for the Movies App.

## Overview

The project uses Jest and React Testing Library for unit testing and component testing.

## Test Structure

```
src/__tests__/
├── components/
│   └── movies/
│       └── MovieHero.test.tsx      # Tests for MovieHero component
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

# Run getFeaturedMovie tests only
npm test -- --testPathPattern="getFeaturedMovie"

# Run both MovieHero and getFeaturedMovie tests
npm test -- --testPathPattern="MovieHero|getFeaturedMovie"
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
