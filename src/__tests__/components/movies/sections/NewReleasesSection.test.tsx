import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewReleasesSection from "../../../../components/movies/sections/NewReleasesSection";
import { getMoviesByCategory } from "../../../../data/movies";

// Mock the data/movies module
jest.mock("../../../../data/movies", () => ({
	getMoviesByCategory: jest.fn(),
}));

// Mock the MovieSection component
jest.mock("../../../../components/movies/sections/MovieSection", () => {
	return function MockMovieSection({
		title,
		movies,
	}: {
		title: string;
		movies: any[];
	}) {
		return (
			<div data-testid="movie-section">
				<h2>{title}</h2>
				<div data-testid="movies-count">{movies.length}</div>
				{movies.map((movie) => (
					<div key={movie.id} data-testid={`movie-${movie.id}`}>
						{movie.title}
					</div>
				))}
			</div>
		);
	};
});

const mockGetMoviesByCategory = getMoviesByCategory as jest.MockedFunction<
	typeof getMoviesByCategory
>;

describe("NewReleasesSection", () => {
	const mockNewReleaseMovies = [
		{
			id: 1,
			title: "Dune: Part Two",
			overview: "Follow the mythic journey of Paul Atreides...",
			poster_path: "https://example.com/dune2.jpg",
			backdrop_path: "https://example.com/dune2-backdrop.jpg",
			release_date: "2024-03-01",
			vote_average: 8.5,
			vote_count: 3245,
			runtime: 166,
			genres: [
				{ id: 878, name: "Science Fiction" },
				{ id: 12, name: "Adventure" },
				{ id: 18, name: "Drama" },
			],
			cast: [],
		},
		{
			id: 2,
			title: "Poor Things",
			overview: "The incredible tale about the fantastical evolution...",
			poster_path: "https://example.com/poor-things.jpg",
			backdrop_path: "https://example.com/poor-things-backdrop.jpg",
			release_date: "2023-12-08",
			vote_average: 8.4,
			vote_count: 2156,
			runtime: 141,
			genres: [
				{ id: 18, name: "Drama" },
				{ id: 14, name: "Fantasy" },
				{ id: 10749, name: "Romance" },
			],
			cast: [],
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the New Releases section with correct title", () => {
		mockGetMoviesByCategory.mockReturnValue(mockNewReleaseMovies);

		render(<NewReleasesSection />);

		expect(screen.getByText("New Releases")).toBeInTheDocument();
		expect(screen.getByTestId("movie-section")).toBeInTheDocument();
	});

	it("calls getMoviesByCategory with category ID 3 for new releases", () => {
		mockGetMoviesByCategory.mockReturnValue(mockNewReleaseMovies);

		render(<NewReleasesSection />);

		expect(mockGetMoviesByCategory).toHaveBeenCalledWith(3);
		expect(mockGetMoviesByCategory).toHaveBeenCalledTimes(1);
	});

	it("renders movies returned by getMoviesByCategory", () => {
		mockGetMoviesByCategory.mockReturnValue(mockNewReleaseMovies);

		render(<NewReleasesSection />);

		expect(screen.getByText("Dune: Part Two")).toBeInTheDocument();
		expect(screen.getByText("Poor Things")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("2");
	});

	it("passes movies data to MovieSection component", () => {
		mockGetMoviesByCategory.mockReturnValue(mockNewReleaseMovies);

		render(<NewReleasesSection />);

		expect(screen.getByTestId("movie-1")).toBeInTheDocument();
		expect(screen.getByTestId("movie-2")).toBeInTheDocument();
	});

	it("handles empty movies array gracefully", () => {
		mockGetMoviesByCategory.mockReturnValue([]);

		render(<NewReleasesSection />);

		expect(screen.getByText("New Releases")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("0");
	});

	it("renders with single movie", () => {
		const singleMovie = [mockNewReleaseMovies[0]];
		mockGetMoviesByCategory.mockReturnValue(singleMovie);

		render(<NewReleasesSection />);

		expect(screen.getByText("New Releases")).toBeInTheDocument();
		expect(screen.getByText("Dune: Part Two")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
		expect(screen.queryByText("Poor Things")).not.toBeInTheDocument();
	});

	it("renders with large number of movies", () => {
		const manyMovies = Array.from({ length: 20 }, (_, index) => ({
			...mockNewReleaseMovies[0],
			id: index + 1,
			title: `Movie ${index + 1}`,
		}));
		mockGetMoviesByCategory.mockReturnValue(manyMovies);

		render(<NewReleasesSection />);

		expect(screen.getByText("New Releases")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("20");
		expect(screen.getByText("Movie 1")).toBeInTheDocument();
		expect(screen.getByText("Movie 20")).toBeInTheDocument();
	});

	it("handles function throwing error gracefully", () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		mockGetMoviesByCategory.mockImplementation(() => {
			throw new Error("Data fetching failed");
		});

		expect(() => render(<NewReleasesSection />)).toThrow(
			"Data fetching failed"
		);

		consoleSpy.mockRestore();
	});

	it("renders movies with different data structures", () => {
		const moviesWithMissingData = [
			{
				id: 1,
				title: "Movie with minimal data",
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
			{
				id: 2,
				title: "Movie with special characters: @#$%",
				overview: "Overview with émojis 🎬 and spëcial chàracters",
				poster_path: "https://example.com/special.jpg",
				backdrop_path: "https://example.com/special-backdrop.jpg",
				release_date: "2024-02-01",
				vote_average: 7.5,
				vote_count: 100,
				runtime: 120,
				genres: [{ id: 1, name: "Action & Adventure" }],
				cast: [],
			},
		];

		mockGetMoviesByCategory.mockReturnValue(moviesWithMissingData);

		render(<NewReleasesSection />);

		expect(screen.getByText("Movie with minimal data")).toBeInTheDocument();
		expect(
			screen.getByText("Movie with special characters: @#$%")
		).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("2");
	});
});
