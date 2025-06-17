# 🎬 The Movies App

A modern, full-featured movie discovery application built with Next.js 15, TypeScript, and Tailwind CSS. This app leverages The Movie Database (TMDB) API to provide users with comprehensive movie information, search capabilities, and personalized favorites management.

## ✨ Features

- **Movie Discovery**: Browse trending, top-rated, and upcoming movies
- **Advanced Search**: Real-time movie search with pagination
- **Genre Exploration**: Filter movies by categories/genres
- **Movie Details**: Comprehensive movie information including cast, ratings, and recommendations
- **Favorites System**: Personal movie favorites with local storage persistence
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Server-Side Rendering**: Optimized performance with Next.js App Router
- **Type Safety**: Full TypeScript implementation for reliable development
- **Performance Optimized**: Lazy loading, code splitting, and modern image formats
- **Accessibility First**: WCAG 2.1 compliant with semantic HTML and ARIA attributes

## 🏗️ Architecture & Project Structure

This application follows a clean, scalable architecture with clear separation of concerns:

```
src/
├── app/                          # Next.js App Router (Pages & API Routes)
│   ├── api/                      # Server-side API endpoints
│   │   └── search/              # Search API route
│   ├── categories/              # Genre/category pages
│   ├── favorites/               # User favorites page
│   ├── movies/                  # Individual movie pages
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Homepage with SSR data fetching
├── components/                   # Reusable UI Components
│   ├── categories/              # Category-specific components
│   ├── core/                    # Core/shared components
│   ├── layout/                  # Layout components (Navbar, Footer)
│   ├── movies/                  # Movie-related components
│   │   └── sections/           # Movie section containers
│   └── ui/                      # Base UI components
├── context/                      # React Context for state management
├── helpers/                      # Utility functions
├── interfaces/                   # TypeScript type definitions
├── services/                     # API service layer
└── styles/                       # Global styles and Tailwind CSS
```

### 🔧 Component Architecture

The application follows a **Container/Presentational** component pattern:

#### Container Components (Data Fetching)

- **Server Components**: Handle data fetching and business logic
- **Section Components**: Fetch specific data sets (trending, top-rated, etc.)
- **Page Components**: Orchestrate multiple sections and handle routing

Example:

```typescript
// Container: Data fetching logic
const TrendingNowSection = async () => {
	const trendingMoviesResponse = await getTrendingMovies();

	return (
		<MovieSection
			title="Trending Now"
			movies={trendingMoviesResponse.results}
		/>
	);
};
```

#### Presentational Components (UI Rendering)

- **Pure Components**: Focus solely on UI rendering
- **Reusable**: Accept props and render consistent UI
- **Testable**: Easy to test in isolation

Example:

```typescript
// Presentational: Pure UI component
interface MovieHeroProps {
	movie: Movie;
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
	return <div className="relative">{/* UI rendering logic */}</div>;
};
```

## 🌐 Rendering Strategy

### Server-Side Rendering (SSR)

- **Pages**: All main pages use SSR for optimal SEO and performance
- **Data Fetching**: Server components fetch data at build/request time
- **Caching**: Implements Next.js caching strategies for API responses

### Client-Side Rendering (CSR)

- **Interactive Components**: User interactions, favorites management
- **State Management**: React Context for client-side state
- **Dynamic Updates**: Real-time UI updates without page refreshes

### Hybrid Approach

```typescript
// SSR: Initial data fetching
export default async function Home({ searchParams }) {
	const featuredMovie = await getFeaturedMovie();

	return (
		<div>
			{/* SSR: Pre-rendered content */}
			<MovieHero movie={featuredMovie} />

			{/* CSR: Interactive components */}
			<SearchBar />
			<TrendingNowSection />
		</div>
	);
}
```

## 🔧 Services Layer

Centralized API management through a dedicated service layer:

### Key Features:

- **Type Safety**: Full TypeScript integration with interface definitions
- **Error Handling**: Comprehensive error management and logging
- **Data Processing**: Consistent data transformation and image URL construction
- **Caching**: Next.js caching strategies for performance optimization
- **Environment Configuration**: Secure API key management

### Service Structure:

```typescript
// Centralized API service
export const movieService = {
	getTrendingMovies,
	getTopRatedMovies,
	getMovieDetails,
	searchMovies,
	getMoviesByGenre,
	// ... more methods
};
```

## 🎨 Styling with Tailwind CSS

### Custom Design System

- **Color Palette**: Extended color scheme with primary, secondary, and accent colors
- **Custom Animations**: Slide-up, fade-in, and pulse animations
- **Responsive Design**: Mobile-first approach with breakpoint-specific styling
- **Component Patterns**: Consistent styling patterns across components

### Key Tailwind Customizations:

```typescript
// tailwind.config.ts
export default {
	theme: {
		extend: {
			colors: {
				primary: {
					/* Custom primary color scale */
				},
				secondary: {
					/* Custom secondary color scale */
				},
				accent: {
					/* Custom accent color scale */
				},
			},
			animation: {
				"slide-up": "slideUp 0.3s ease-out forwards",
				"fade-in": "fadeIn 0.4s ease-in forwards",
			},
		},
	},
};
```

## ⚡ Performance Optimization

This application implements comprehensive performance optimizations for fast loading and smooth user experience:

### Code Splitting & Lazy Loading

- **Automatic Code Splitting**: Next.js App Router automatically splits code at the route level
- **Dynamic Imports**: Heavy components are loaded on-demand using `React.lazy()`
- **Route-based Splitting**: Each page loads only its required JavaScript bundle
- **Component-level Splitting**: Large components split into smaller, cacheable chunks

```typescript
// Example: Lazy loading heavy components
const MovieCarousel = lazy(() => import("./MovieCarousel"));
const MovieCast = lazy(() => import("./MovieCast"));

// Suspense boundary for loading states
<Suspense fallback={<LoadingSpinner />}>
	<MovieCarousel movies={movies} />
</Suspense>;
```

### Image Optimization

- **Next.js Image Component**: Automatic optimization with `next/image`
- **Modern Formats**: WebP and AVIF support with fallbacks
- **Responsive Images**: Multiple sizes generated for different screen resolutions
- **Lazy Loading**: Images load only when entering the viewport
- **Priority Loading**: Above-the-fold images marked with `priority` prop

```typescript
// Optimized image implementation
<Image
	src={movie.poster_path}
	alt={`${movie.title} poster`}
	width={300}
	height={450}
	priority={isAboveFold}
	className="rounded-lg object-cover"
	sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Caching Strategy

- **API Response Caching**: Next.js `revalidate` for optimal data freshness
- **Static Generation**: Pre-rendered pages for instant loading
- **Browser Caching**: Optimized cache headers for static assets
- **Service Worker**: Future implementation for offline capabilities

```typescript
// API caching example
const data = await fetchTMDB<PaginatedResponse<any>>(
	"trending/movie/week",
	{ page },
	{ revalidate: 3600 * 24 } // Cache for 24 hours
);
```

### Bundle Optimization

- **Tree Shaking**: Unused code automatically removed
- **Minification**: Production builds are minified and compressed
- **Gzip Compression**: Server-side compression enabled
- **Critical CSS**: Above-the-fold styles inlined for faster rendering

## ♿ Accessibility Features

This application prioritizes accessibility to ensure an inclusive experience for all users:

### Semantic HTML Structure

- **Proper Document Outline**: Logical heading hierarchy (h1 → h2 → h3)
- **Semantic Elements**: `<main>`, `<nav>`, `<section>`, `<article>` for structure
- **Form Labels**: Explicit labeling for all form controls
- **Button vs Link**: Proper element choice based on functionality

```html
<!-- Example: Semantic structure -->
<main role="main">
	<section aria-label="Featured Movie">
		<h1>Movie Title</h1>
		<nav aria-label="Movie actions">
			<button type="button" aria-label="Add to favorites">
				<Star aria-hidden="true" />
				Add to Favorites
			</button>
		</nav>
	</section>
</main>
```

### ARIA Labels & Attributes

- **Screen Reader Support**: Comprehensive ARIA labeling for complex UI
- **Live Regions**: Dynamic content updates announced to screen readers
- **Focus Management**: Proper focus handling for modals and navigation
- **State Communication**: Button states and loading indicators properly announced

```typescript
// Example: ARIA implementation
<button
	type="button"
	aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
	aria-pressed={isFavorite}
	className="btn btn-secondary"
>
	<Star aria-hidden="true" className={isFavorite ? "fill-current" : ""} />
	<span className="sr-only">
		{isFavorite ? "Remove from" : "Add to"} favorites
	</span>
</button>
```

### Color Contrast & Visual Design

- **WCAG AA Compliance**: Minimum 4.5:1 contrast ratio for normal text
- **AAA Standards**: 7:1 contrast ratio for enhanced readability
- **Color Independence**: Information not conveyed through color alone
- **Dark Mode Support**: High contrast theme options available

```css
/* Example: High contrast color scheme */
:root {
	--text-primary: #ffffff; /* 21:1 contrast on dark background */
	--text-secondary: #e5e7eb; /* 15.8:1 contrast ratio */
	--accent-color: #fbbf24; /* 8.2:1 contrast ratio */
	--error-color: #f87171; /* 5.9:1 contrast ratio */
}
```

### Keyboard Navigation

- **Full Keyboard Support**: All interactive elements accessible via keyboard
- **Logical Tab Order**: Sequential navigation through page elements
- **Focus Indicators**: Clear visual focus states for all interactive elements
- **Skip Links**: Navigation shortcuts for screen reader users
- **Escape Key Support**: Modal dismissal and navigation shortcuts

### Screen Reader Optimization

- **Alternative Text**: Descriptive alt text for all images
- **Loading States**: Screen reader announcements for dynamic content
- **Error Messages**: Clear, actionable error descriptions
- **Form Validation**: Real-time feedback with proper ARIA associations

```typescript
// Example: Screen reader optimized search
<form role="search" aria-label="Search movies">
	<label htmlFor="search-input" className="sr-only">
		Search for movies
	</label>
	<input
		id="search-input"
		type="search"
		placeholder="Search movies..."
		aria-describedby="search-help"
		aria-invalid={hasError}
	/>
	<div id="search-help" className="sr-only">
		Enter a movie title to search our database
	</div>
	{hasError && (
		<div role="alert" aria-live="polite" className="error-message">
			Please enter a valid search term
		</div>
	)}
</form>
```

### Testing & Validation

- **Automated Testing**: Accessibility tests integrated into CI/CD pipeline
- **Manual Testing**: Regular keyboard and screen reader testing
- **Lighthouse Audits**: Performance and accessibility scoring
- **WAVE Tool**: Web accessibility evaluation during development

## 🚀 Getting Started

### Prerequisites

1. **TMDB API Key**: Get your API key from [TMDB](https://www.themoviedb.org/settings/api)
2. **Node.js**: Version 18 or higher
3. **Package Manager**: npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd the-movies-app
```

2. **Install dependencies**:

```bash
pnpm install
# or npm install / yarn install / bun install
```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

4. **Run the development server**:

```bash
pnpm dev
# or npm run dev / yarn dev / bun dev
```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Comprehensive testing setup with Jest and React Testing Library:

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Test Structure

- **Component Tests**: Located in `src/__tests__/components/`
- **Context Tests**: Located in `src/__tests__/context/`
- **Service Tests**: Located in `src/__tests__/services/`
- **Integration Tests**: Page-level tests in `src/__tests__/app/`

### Testing Guidelines

1. **Component Rendering**: Test component output and props handling
2. **User Interactions**: Test clicks, inputs, and user flows
3. **Context Integration**: Test state management and context providers
4. **API Integration**: Mock external dependencies for reliable testing

## 🔧 Configuration Files

- **`next.config.ts`**: Next.js configuration
- **`tailwind.config.ts`**: Tailwind CSS customization
- **`tsconfig.json`**: TypeScript configuration
- **`jest.config.js`**: Testing configuration
- **`components.json`**: shadcn/ui component configuration

## 📦 Key Dependencies

### Core Framework

- **Next.js 14**: React framework with App Router
- **React 18**: UI library with latest features
- **TypeScript**: Type safety and developer experience

### Styling & UI

- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **tailwindcss-animate**: Animation utilities

### Development & Testing

- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **ESLint**: Code linting and formatting

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add your `TMDB_API_KEY` environment variable
3. Deploy automatically on push

### Other Platforms

This Next.js application can be deployed on any platform supporting Node.js:

- Netlify
- AWS Amplify
- Railway
- Docker containers

## 📄 Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - comprehensive Next.js guide
- [Next.js App Router](https://nextjs.org/docs/app) - modern routing and rendering
- [Next.js Learn](https://nextjs.org/learn) - interactive Next.js tutorial

### Additional Resources

- [TMDB API Documentation](https://developers.themoviedb.org/3) - API reference
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - styling framework guide
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
