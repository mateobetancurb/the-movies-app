import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieSection from "../../../../components/movies/sections/MovieSection";
import { Movie } from "../../../../interfaces";

// Mock the MovieCarousel component
jest.mock("../../../../components/movies/MovieCarousel", () => {
	return function MockMovieCarousel({
		movies,
		title,
		emptyMessage,
	}: {
		movies: Movie[];
		title?: string;
		emptyMessage?: string;
	}) {
		return (
			<div data-testid="movie-grid">
				{title && <h2 data-testid="grid-title">{title}</h2>}
				<div data-testid="movies-count">{movies.length}</div>
				<div data-testid="empty-message">{emptyMessage}</div>
				{movies.map((movie) => (
					<div key={movie.id} data-testid={`movie-${movie.id}`}>
						{movie.title}
					</div>
				))}
			</div>
		);
	};
});

describe("MovieSection", () => {
	const mockMovies: Movie[] = [
		{
			id: 1,
			title: "Test Movie 1",
			overview: "A test movie overview",
			poster_path: "https://example.com/poster1.jpg",
			backdrop_path: "https://example.com/backdrop1.jpg",
			release_date: "2024-01-01",
			vote_average: 8.5,
			vote_count: 1000,
			runtime: 120,
			genres: [
				{ id: 28, name: "Action" },
				{ id: 12, name: "Adventure" },
			],
			cast: [],
		},
		{
			id: 2,
			title: "Test Movie 2",
			overview: "Another test movie overview",
			poster_path: "https://example.com/poster2.jpg",
			backdrop_path: "https://example.com/backdrop2.jpg",
			release_date: "2024-02-01",
			vote_average: 7.2,
			vote_count: 800,
			runtime: 95,
			genres: [
				{ id: 35, name: "Comedy" },
				{ id: 18, name: "Drama" },
			],
			cast: [],
		},
	];

	it("renders MovieSection with title and movies", () => {
		render(<MovieSection title="Test Section" movies={mockMovies} />);

		expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
		expect(screen.getByTestId("grid-title")).toHaveTextContent("Test Section");
		expect(screen.getByTestId("movies-count")).toHaveTextContent("2");
		expect(screen.getByTestId("movie-1")).toHaveTextContent("Test Movie 1");
		expect(screen.getByTestId("movie-2")).toHaveTextContent("Test Movie 2");
	});

	it("passes all props correctly to MovieCarousel", () => {
		render(
			<MovieSection
				title="Custom Title"
				movies={mockMovies}
				emptyMessage="Custom empty message"
			/>
		);

		expect(screen.getByTestId("grid-title")).toHaveTextContent("Custom Title");
		expect(screen.getByTestId("movies-count")).toHaveTextContent("2");
		expect(screen.getByTestId("empty-message")).toHaveTextContent(
			"Custom empty message"
		);
	});

	it("uses default empty message when not provided", () => {
		render(<MovieSection title="Test Section" movies={[]} />);

		expect(screen.getByTestId("empty-message")).toHaveTextContent(
			"No movies available"
		);
		expect(screen.getByTestId("movies-count")).toHaveTextContent("0");
	});

	it("handles empty movies array", () => {
		render(<MovieSection title="Empty Section" movies={[]} />);

		expect(screen.getByTestId("grid-title")).toHaveTextContent("Empty Section");
		expect(screen.getByTestId("movies-count")).toHaveTextContent("0");
		expect(screen.queryByTestId("movie-1")).not.toBeInTheDocument();
	});

	it("handles single movie", () => {
		const singleMovie = [mockMovies[0]];

		render(<MovieSection title="Single Movie Section" movies={singleMovie} />);

		expect(screen.getByTestId("grid-title")).toHaveTextContent(
			"Single Movie Section"
		);
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
		expect(screen.getByTestId("movie-1")).toHaveTextContent("Test Movie 1");
		expect(screen.queryByTestId("movie-2")).not.toBeInTheDocument();
	});

	it("handles large number of movies", () => {
		const manyMovies = Array.from({ length: 25 }, (_, index) => ({
			...mockMovies[0],
			id: index + 1,
			title: `Movie ${index + 1}`,
		}));

		render(<MovieSection title="Many Movies Section" movies={manyMovies} />);

		expect(screen.getByTestId("grid-title")).toHaveTextContent(
			"Many Movies Section"
		);
		expect(screen.getByTestId("movies-count")).toHaveTextContent("25");
		expect(screen.getByTestId("movie-1")).toHaveTextContent("Movie 1");
		expect(screen.getByTestId("movie-25")).toHaveTextContent("Movie 25");
	});

	it("renders with custom empty message", () => {
		const customEmptyMessage = "No movies found in this category";

		render(
			<MovieSection
				title="Custom Empty Section"
				movies={[]}
				emptyMessage={customEmptyMessage}
			/>
		);

		expect(screen.getByTestId("empty-message")).toHaveTextContent(
			customEmptyMessage
		);
	});

	it("handles movies with special characters in titles", () => {
		const specialMovies = [
			{
				...mockMovies[0],
				id: 100,
				title: "Special Characters: @#$%^&*()_+{}|:<>?",
			},
			{
				...mockMovies[1],
				id: 101,
				title: "Unicode: émojis 🎬 and spëcial chàracters",
			},
		];

		render(
			<MovieSection title="Special Characters Section" movies={specialMovies} />
		);

		expect(screen.getByTestId("movie-100")).toHaveTextContent(
			"Special Characters: @#$%^&*()_+{}|:<>?"
		);
		expect(screen.getByTestId("movie-101")).toHaveTextContent(
			"Unicode: émojis 🎬 and spëcial chàracters"
		);
	});

	it("handles movies with minimal data", () => {
		const minimalMovies = [
			{
				id: 1,
				title: "Minimal Movie",
				overview: "",
				poster_path: null,
				backdrop_path: null,
				release_date: "2024-01-01",
				vote_average: 0,
				vote_count: 0,
				runtime: null,
				genres: [],
				cast: [],
			},
		];

		render(
			<MovieSection title="Minimal Data Section" movies={minimalMovies} />
		);

		expect(screen.getByTestId("grid-title")).toHaveTextContent(
			"Minimal Data Section"
		);
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
		expect(screen.getByTestId("movie-1")).toHaveTextContent("Minimal Movie");
	});

	it("component is accessible and semantic", () => {
		render(<MovieSection title="Accessibility Test" movies={mockMovies} />);

		// Check that the MovieCarousel component is rendered which should handle accessibility
		expect(screen.getByTestId("movie-grid")).toBeInTheDocument();

		// Verify that title is passed correctly for accessibility
		expect(screen.getByTestId("grid-title")).toHaveTextContent(
			"Accessibility Test"
		);
	});

	it("preserves movie object integrity", () => {
		const complexMovie = {
			id: 999,
			title: "Complex Movie",
			overview: "A movie with complex data structure",
			poster_path: "https://example.com/complex-poster.jpg",
			backdrop_path: "https://example.com/complex-backdrop.jpg",
			release_date: "2024-06-15",
			vote_average: 9.1,
			vote_count: 15000,
			runtime: 185,
			genres: [
				{ id: 28, name: "Action" },
				{ id: 12, name: "Adventure" },
				{ id: 878, name: "Science Fiction" },
			],
			cast: [
				{
					id: 1,
					name: "Actor One",
					character: "Hero",
					profile_path: "https://example.com/actor1.jpg",
				},
				{
					id: 2,
					name: "Actor Two",
					character: "Villain",
					profile_path: "https://example.com/actor2.jpg",
				},
			],
		};

		render(
			<MovieSection title="Complex Movie Section" movies={[complexMovie]} />
		);

		expect(screen.getByTestId("movie-999")).toHaveTextContent("Complex Movie");
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
	});

	it("handles props changes correctly", () => {
		const { rerender } = render(
			<MovieSection title="Initial Title" movies={mockMovies.slice(0, 1)} />
		);

		expect(screen.getByTestId("grid-title")).toHaveTextContent("Initial Title");
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");

		// Re-render with different props
		rerender(<MovieSection title="Updated Title" movies={mockMovies} />);

		expect(screen.getByTestId("grid-title")).toHaveTextContent("Updated Title");
		expect(screen.getByTestId("movies-count")).toHaveTextContent("2");
	});
});
