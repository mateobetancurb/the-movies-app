import React from "react";
import { render, screen } from "@testing-library/react";
import { Movie } from "../../../interfaces";
import MovieCarousel from "../../../components/movies/MovieCarousel";

// Mock framer-motion
jest.mock("framer-motion", () => ({
	motion: {
		h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
}));

// Mock the carousel components
jest.mock("../../../components/core/Carousel", () => ({
	Carousel: ({ children, ...props }: any) => (
		<div data-testid="carousel" {...props}>
			{children}
		</div>
	),
	CarouselContent: ({ children, ...props }: any) => (
		<div data-testid="carousel-content" {...props}>
			{children}
		</div>
	),
	CarouselItem: ({ children, ...props }: any) => (
		<div data-testid="carousel-item" {...props}>
			{children}
		</div>
	),
	CarouselNext: (props: any) => (
		<button data-testid="carousel-next" {...props}>
			Next
		</button>
	),
	CarouselPrevious: (props: any) => (
		<button data-testid="carousel-previous" {...props}>
			Previous
		</button>
	),
}));

// Mock MovieCard component
jest.mock("../../../components/movies/MovieCard", () => {
	return function MockMovieCard({
		movie,
		index,
	}: {
		movie: Movie;
		index: number;
	}) {
		return (
			<div data-testid={`movie-card-${movie.id}`}>
				<h3>{movie.title}</h3>
				<span>Index: {index}</span>
			</div>
		);
	};
});

describe("MovieCarousel", () => {
	const mockMovies: Movie[] = [
		{
			id: 1,
			title: "Test Movie 1",
			poster_path: "/poster1.jpg",
			backdrop_path: "/backdrop1.jpg",
			overview: "A test movie",
			release_date: "2023-01-01",
			vote_average: 8.5,
			vote_count: 1000,
			genre_ids: [28, 12],
			genres: [
				{ id: 28, name: "Action" },
				{ id: 12, name: "Adventure" },
			],
			runtime: 120,
			adult: false,
			original_language: "en",
			original_title: "Test Movie 1",
			popularity: 100,
			video: false,
		},
		{
			id: 2,
			title: "Test Movie 2",
			poster_path: "/poster2.jpg",
			backdrop_path: "/backdrop2.jpg",
			overview: "Another test movie",
			release_date: "2023-02-01",
			vote_average: 7.8,
			vote_count: 800,
			genre_ids: [35, 18],
			genres: [
				{ id: 35, name: "Comedy" },
				{ id: 18, name: "Drama" },
			],
			runtime: 110,
			adult: false,
			original_language: "en",
			original_title: "Test Movie 2",
			popularity: 85,
			video: false,
		},
		{
			id: 3,
			title: "Test Movie 3",
			poster_path: "/poster3.jpg",
			backdrop_path: "/backdrop3.jpg",
			overview: "Third test movie",
			release_date: "2023-03-01",
			vote_average: 9.0,
			vote_count: 1200,
			genre_ids: [16, 10751],
			genres: [
				{ id: 16, name: "Animation" },
				{ id: 10751, name: "Family" },
			],
			runtime: 95,
			adult: false,
			original_language: "en",
			original_title: "Test Movie 3",
			popularity: 120,
			video: false,
		},
	];

	describe("Basic Rendering", () => {
		it("renders the carousel with movies", () => {
			render(<MovieCarousel movies={mockMovies} />);

			expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
			expect(screen.getByTestId("carousel")).toBeInTheDocument();
			expect(screen.getByTestId("carousel-content")).toBeInTheDocument();
		});

		it("renders all movies as carousel items", () => {
			render(<MovieCarousel movies={mockMovies} />);

			// Check that each movie is rendered with correct testid
			expect(screen.getByTestId("movie-1")).toBeInTheDocument();
			expect(screen.getByTestId("movie-2")).toBeInTheDocument();
			expect(screen.getByTestId("movie-3")).toBeInTheDocument();

			// Check that each movie card is rendered
			expect(screen.getByTestId("movie-card-1")).toBeInTheDocument();
			expect(screen.getByTestId("movie-card-2")).toBeInTheDocument();
			expect(screen.getByTestId("movie-card-3")).toBeInTheDocument();
		});

		it("renders carousel navigation buttons", () => {
			render(<MovieCarousel movies={mockMovies} />);

			expect(screen.getByTestId("carousel-previous")).toBeInTheDocument();
			expect(screen.getByTestId("carousel-next")).toBeInTheDocument();
		});

		it("applies correct CSS classes to carousel items", () => {
			render(<MovieCarousel movies={mockMovies} />);

			const movie1 = screen.getByTestId("movie-1");
			const movie2 = screen.getByTestId("movie-2");
			const movie3 = screen.getByTestId("movie-3");

			[movie1, movie2, movie3].forEach((item) => {
				expect(item).toHaveClass(
					"pl-2",
					"md:pl-4",
					"basis-1/2",
					"md:basis-1/3",
					"lg:basis-1/4",
					"xl:basis-1/5"
				);
			});
		});
	});

	describe("Title Rendering", () => {
		it("renders title when provided", () => {
			const title = "Popular Movies";
			render(<MovieCarousel movies={mockMovies} title={title} />);

			const titleElement = screen.getByTestId("grid-title");
			expect(titleElement).toBeInTheDocument();
			expect(titleElement).toHaveTextContent(title);
			expect(titleElement.tagName).toBe("H2");
		});

		it("does not render title when not provided", () => {
			render(<MovieCarousel movies={mockMovies} />);

			expect(screen.queryByTestId("grid-title")).not.toBeInTheDocument();
		});

		it("applies correct CSS classes to title", () => {
			render(<MovieCarousel movies={mockMovies} title="Test Title" />);

			const titleElement = screen.getByTestId("grid-title");
			expect(titleElement).toHaveClass("text-2xl", "font-bold", "mb-6");
		});
	});

	describe("Movies Count", () => {
		it("displays correct movies count", () => {
			render(<MovieCarousel movies={mockMovies} />);

			const countElement = screen.getByTestId("movies-count");
			expect(countElement).toHaveTextContent("3");
			expect(countElement).toHaveClass("sr-only");
		});

		it("displays zero count for empty movies array", () => {
			render(<MovieCarousel movies={[]} />);

			const countElement = screen.getByTestId("movies-count");
			expect(countElement).toHaveTextContent("0");
		});
	});

	describe("Empty State", () => {
		it("shows default empty message when no movies", () => {
			render(<MovieCarousel movies={[]} />);

			expect(screen.getByTestId("empty-message")).toBeInTheDocument();
			expect(screen.getByTestId("empty-message")).toHaveTextContent(
				"No movies found"
			);
			expect(screen.queryByTestId("carousel")).not.toBeInTheDocument();
		});

		it("shows custom empty message when provided", () => {
			const customMessage = "No favorites added yet";
			render(<MovieCarousel movies={[]} emptyMessage={customMessage} />);

			expect(screen.getByTestId("empty-message")).toHaveTextContent(
				customMessage
			);
		});

		it("applies correct CSS classes to empty message", () => {
			render(<MovieCarousel movies={[]} />);

			const emptyMessage = screen.getByTestId("empty-message");
			expect(emptyMessage).toHaveClass("text-gray-400");
			expect(emptyMessage.parentElement).toHaveClass("py-12", "text-center");
		});
	});

	describe("MovieCard Integration", () => {
		it("passes correct props to MovieCard components", () => {
			render(<MovieCarousel movies={mockMovies} />);

			// Check that movies are passed correctly
			expect(screen.getByText("Test Movie 1")).toBeInTheDocument();
			expect(screen.getByText("Test Movie 2")).toBeInTheDocument();
			expect(screen.getByText("Test Movie 3")).toBeInTheDocument();

			// Check that correct indices are passed
			expect(screen.getByText("Index: 0")).toBeInTheDocument();
			expect(screen.getByText("Index: 1")).toBeInTheDocument();
			expect(screen.getByText("Index: 2")).toBeInTheDocument();
		});

		it("applies correct data-testid to carousel items", () => {
			render(<MovieCarousel movies={mockMovies} />);

			expect(screen.getByTestId("movie-1")).toHaveAttribute(
				"data-testid",
				"movie-1"
			);
			expect(screen.getByTestId("movie-2")).toHaveAttribute(
				"data-testid",
				"movie-2"
			);
			expect(screen.getByTestId("movie-3")).toHaveAttribute(
				"data-testid",
				"movie-3"
			);
		});
	});

	describe("Carousel Configuration", () => {
		it("applies correct carousel options", () => {
			render(<MovieCarousel movies={mockMovies} />);

			const carousel = screen.getByTestId("carousel");
			expect(carousel).toHaveClass("w-full");
		});

		it("applies correct CSS classes to carousel content", () => {
			render(<MovieCarousel movies={mockMovies} />);

			const carouselContent = screen.getByTestId("carousel-content");
			expect(carouselContent).toHaveClass("-ml-2", "md:-ml-4");
		});

		it("positions navigation buttons correctly", () => {
			render(<MovieCarousel movies={mockMovies} />);

			const previousButton = screen.getByTestId("carousel-previous");
			const nextButton = screen.getByTestId("carousel-next");

			expect(previousButton).toHaveClass(
				"absolute",
				"-left-4",
				"top-1/2",
				"-translate-y-1/2"
			);
			expect(nextButton).toHaveClass(
				"absolute",
				"-right-4",
				"top-1/2",
				"-translate-y-1/2"
			);
		});
	});

	describe("Edge Cases", () => {
		it("handles single movie", () => {
			const singleMovie = [mockMovies[0]];
			render(<MovieCarousel movies={singleMovie} />);

			expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
			expect(screen.getByTestId("movie-1")).toBeInTheDocument();
			expect(screen.getByTestId("movie-card-1")).toBeInTheDocument();
		});

		it("handles large number of movies", () => {
			const manyMovies = Array.from({ length: 20 }, (_, index) => ({
				...mockMovies[0],
				id: index + 1,
				title: `Movie ${index + 1}`,
			}));

			render(<MovieCarousel movies={manyMovies} />);

			expect(screen.getByTestId("movies-count")).toHaveTextContent("20");

			// Check first and last movie items to verify all are rendered
			expect(screen.getByTestId("movie-1")).toBeInTheDocument();
			expect(screen.getByTestId("movie-20")).toBeInTheDocument();

			// Check movie cards
			expect(screen.getByTestId("movie-card-1")).toBeInTheDocument();
			expect(screen.getByTestId("movie-card-20")).toBeInTheDocument();
		});

		it("handles movies with special characters in titles", () => {
			const specialMovies = [
				{
					...mockMovies[0],
					id: 999,
					title: "Movie with émojis 🎬 & special chars!",
				},
			];

			render(<MovieCarousel movies={specialMovies} />);

			expect(
				screen.getByText("Movie with émojis 🎬 & special chars!")
			).toBeInTheDocument();
		});

		it("handles movies with minimal data", () => {
			const minimalMovies: Movie[] = [
				{
					id: 100,
					title: "Minimal Movie",
					poster_path: null,
					backdrop_path: null,
					overview: "",
					release_date: "",
					vote_average: 0,
					vote_count: 0,
					genre_ids: [],
					genres: [],
					runtime: undefined,
					adult: false,
					original_language: "en",
					original_title: "Minimal Movie",
					popularity: 0,
					video: false,
				},
			];

			render(<MovieCarousel movies={minimalMovies} />);

			expect(screen.getByText("Minimal Movie")).toBeInTheDocument();
			expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
		});
	});

	describe("Accessibility", () => {
		it("uses semantic HTML structure", () => {
			render(<MovieCarousel movies={mockMovies} title="Test Movies" />);

			const section = screen.getByTestId("movie-grid");
			expect(section.tagName).toBe("SECTION");

			const title = screen.getByTestId("grid-title");
			expect(title.tagName).toBe("H2");
		});

		it("provides proper labeling for screen readers", () => {
			render(<MovieCarousel movies={mockMovies} />);

			const moviesCount = screen.getByTestId("movies-count");
			expect(moviesCount).toHaveClass("sr-only");
		});

		it("maintains proper heading hierarchy", () => {
			render(<MovieCarousel movies={mockMovies} title="Featured Movies" />);

			const heading = screen.getByRole("heading", { level: 2 });
			expect(heading).toHaveTextContent("Featured Movies");
		});
	});

	describe("Component Props", () => {
		it("handles undefined title gracefully", () => {
			render(<MovieCarousel movies={mockMovies} title={undefined} />);

			expect(screen.queryByTestId("grid-title")).not.toBeInTheDocument();
		});

		it("handles empty string title", () => {
			render(<MovieCarousel movies={mockMovies} title="" />);

			expect(screen.queryByTestId("grid-title")).not.toBeInTheDocument();
		});

		it("handles undefined emptyMessage with default", () => {
			render(<MovieCarousel movies={[]} emptyMessage={undefined} />);

			expect(screen.getByTestId("empty-message")).toHaveTextContent(
				"No movies found"
			);
		});

		it("preserves movie object integrity", () => {
			render(<MovieCarousel movies={mockMovies} />);

			// Verify that all movie properties are preserved
			expect(screen.getByTestId("movie-card-1")).toBeInTheDocument();
			expect(screen.getByTestId("movie-card-2")).toBeInTheDocument();
			expect(screen.getByTestId("movie-card-3")).toBeInTheDocument();
		});
	});
});
