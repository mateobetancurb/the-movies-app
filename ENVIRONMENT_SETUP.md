# Environment Variables Setup

This application requires environment variables to be configured for secure API access.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# The Movie Database (TMDB) API Configuration
TMDB_API_KEY=your_actual_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## How to Get Your TMDB API Key

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create an account or sign in
3. Navigate to your account settings
4. Go to the "API" section
5. Request an API key
6. Copy your API key and paste it in the `.env.local` file

## Security Notes

- The `.env.local` file is already included in `.gitignore` and will not be committed to version control
- Never expose your API key in your code or commit it to the repository
- The API key in the logs will be masked with `***` for security

## Verification

After setting up your environment variables, restart your development server:

```bash
pnpm dev
```

The application will now use your environment variables for API requests.
