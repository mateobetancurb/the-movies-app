import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TopRatedSection from "../../../../components/movies/sections/TopRatedSection";
import { getTopRatedMovies } from "../../../../services/movieService";

// Mock the movieService module
jest.mock("../../../../services/movieService", () => ({
	getTopRatedMovies: jest.fn(),
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

const mockGetTopRatedMovies = getTopRatedMovies as jest.MockedFunction<
	typeof getTopRatedMovies
>;

describe("TopRatedSection", () => {
	const mockTopRatedResponse = {
		page: 1,
		results: [
			{
				id: 101,
				title: "The Godfather",
				overview: "The aging patriarch of an organized crime dynasty...",
				poster_path: "https://image.tmdb.org/t/p/w500/godfather.jpg",
				backdrop_path:
					"https://image.tmdb.org/t/p/w1280/godfather-backdrop.jpg",
				release_date: "1972-03-24",
				vote_average: 9.2,
				vote_count: 15000,
				runtime: 175,
				genres: [
					{ id: 80, name: "Crime" },
					{ id: 18, name: "Drama" },
				],
				cast: [],
			},
			{
				id: 102,
				title: "The Shawshank Redemption",
				overview: "Two imprisoned men bond over a number of years...",
				poster_path: "https://image.tmdb.org/t/p/w500/shawshank.jpg",
				backdrop_path:
					"https://image.tmdb.org/t/p/w1280/shawshank-backdrop.jpg",
				release_date: "1994-09-23",
				vote_average: 9.3,
				vote_count: 20000,
				runtime: 142,
				genres: [
					{ id: 18, name: "Drama" },
					{ id: 80, name: "Crime" },
				],
				cast: [],
			},
		],
		total_pages: 5,
		total_results: 100,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the Top Rated section with correct title", async () => {
		mockGetTopRatedMovies.mockResolvedValue(mockTopRatedResponse);

		render(await TopRatedSection());

		expect(screen.getByText("Top Rated")).toBeInTheDocument();
		expect(screen.getByTestId("movie-section")).toBeInTheDocument();
	});

	it("calls getTopRatedMovies service function", async () => {
		mockGetTopRatedMovies.mockResolvedValue(mockTopRatedResponse);

		await TopRatedSection();

		expect(mockGetTopRatedMovies).toHaveBeenCalledWith();
		expect(mockGetTopRatedMovies).toHaveBeenCalledTimes(1);
	});

	it("renders movies from API response results", async () => {
		mockGetTopRatedMovies.mockResolvedValue(mockTopRatedResponse);

		render(await TopRatedSection());

		expect(screen.getByText("The Godfather")).toBeInTheDocument();
		expect(screen.getByText("The Shawshank Redemption")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("2");
	});

	it("passes movies.results to MovieSection component", async () => {
		mockGetTopRatedMovies.mockResolvedValue(mockTopRatedResponse);

		render(await TopRatedSection());

		expect(screen.getByTestId("movie-101")).toBeInTheDocument();
		expect(screen.getByTestId("movie-102")).toBeInTheDocument();
	});

	it("handles empty API response gracefully", async () => {
		const emptyResponse = {
			page: 1,
			results: [],
			total_pages: 0,
			total_results: 0,
		};
		mockGetTopRatedMovies.mockResolvedValue(emptyResponse);

		render(await TopRatedSection());

		expect(screen.getByText("Top Rated")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("0");
	});

	it("handles single movie in response", async () => {
		const singleMovieResponse = {
			...mockTopRatedResponse,
			results: [mockTopRatedResponse.results[0]],
			total_results: 1,
		};
		mockGetTopRatedMovies.mockResolvedValue(singleMovieResponse);

		render(await TopRatedSection());

		expect(screen.getByText("Top Rated")).toBeInTheDocument();
		expect(screen.getByText("The Godfather")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
		expect(
			screen.queryByText("The Shawshank Redemption")
		).not.toBeInTheDocument();
	});

	it("handles large number of movies in response", async () => {
		const manyMoviesResponse = {
			...mockTopRatedResponse,
			results: Array.from({ length: 20 }, (_, index) => ({
				...mockTopRatedResponse.results[0],
				id: index + 200,
				title: `Top Movie ${index + 1}`,
			})),
			total_results: 20,
		};
		mockGetTopRatedMovies.mockResolvedValue(manyMoviesResponse);

		render(await TopRatedSection());

		expect(screen.getByText("Top Rated")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("20");
		expect(screen.getByText("Top Movie 1")).toBeInTheDocument();
		expect(screen.getByText("Top Movie 20")).toBeInTheDocument();
	});

	it("handles API service error gracefully", async () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		mockGetTopRatedMovies.mockRejectedValue(new Error("API request failed"));

		await expect(TopRatedSection()).rejects.toThrow("API request failed");

		consoleSpy.mockRestore();
	});

	it("handles API network timeout error", async () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		mockGetTopRatedMovies.mockRejectedValue(new Error("Network timeout"));

		await expect(TopRatedSection()).rejects.toThrow("Network timeout");

		consoleSpy.mockRestore();
	});

	it("handles malformed API response structure", async () => {
		const malformedResponse = {
			page: 1,
			results: [
				{
					id: 103,
					title: null, // Invalid title
					overview: undefined,
					poster_path: "",
					backdrop_path: null,
					release_date: "invalid-date",
					vote_average: "not-a-number",
					vote_count: null,
					runtime: undefined,
					genres: null,
					cast: undefined,
				},
			],
			total_pages: 1,
			total_results: 1,
		};
		mockGetTopRatedMovies.mockResolvedValue(malformedResponse as any);

		render(await TopRatedSection());

		expect(screen.getByText("Top Rated")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
	});

	it("renders movies with processed image URLs", async () => {
		const responseWithImagePaths = {
			...mockTopRatedResponse,
			results: [
				{
					...mockTopRatedResponse.results[0],
					poster_path: "https://image.tmdb.org/t/p/w500/processed-poster.jpg",
					backdrop_path:
						"https://image.tmdb.org/t/p/w1280/processed-backdrop.jpg",
				},
			],
		};
		mockGetTopRatedMovies.mockResolvedValue(responseWithImagePaths);

		render(await TopRatedSection());

		expect(screen.getByText("The Godfather")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
	});

	it("handles movies with special characters and unicode", async () => {
		const specialMoviesResponse = {
			...mockTopRatedResponse,
			results: [
				{
					id: 104,
					title: "Amélie: The Extraordinary Story 🎬",
					overview: "A shy waitress decides to help those around her... café",
					poster_path: "https://image.tmdb.org/t/p/w500/amelie.jpg",
					backdrop_path: "https://image.tmdb.org/t/p/w1280/amelie-backdrop.jpg",
					release_date: "2001-04-25",
					vote_average: 8.3,
					vote_count: 5000,
					runtime: 122,
					genres: [
						{ id: 35, name: "Comedy" },
						{ id: 10749, name: "Romance" },
					],
					cast: [],
				},
			],
		};
		mockGetTopRatedMovies.mockResolvedValue(specialMoviesResponse);

		render(await TopRatedSection());

		expect(
			screen.getByText("Amélie: The Extraordinary Story 🎬")
		).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
	});

	it("handles API response with missing optional fields", async () => {
		const minimalResponse = {
			page: 1,
			results: [
				{
					id: 105,
					title: "Minimal Movie Data",
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
			],
			total_pages: 1,
			total_results: 1,
		};
		mockGetTopRatedMovies.mockResolvedValue(minimalResponse);

		render(await TopRatedSection());

		expect(screen.getByText("Top Rated")).toBeInTheDocument();
		expect(screen.getByText("Minimal Movie Data")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
	});

	it("validates component is async and waits for data", async () => {
		// Test that the component properly handles async data loading
		let resolvePromise: (value: any) => void;
		const asyncPromise = new Promise((resolve) => {
			resolvePromise = resolve;
		});

		mockGetTopRatedMovies.mockReturnValue(asyncPromise as any);

		// Start rendering the component
		const componentPromise = TopRatedSection();

		// Resolve the API call
		resolvePromise!(mockTopRatedResponse);

		// Wait for component to complete
		const component = await componentPromise;
		render(component);

		expect(screen.getByText("Top Rated")).toBeInTheDocument();
		expect(screen.getByText("The Godfather")).toBeInTheDocument();
	});
});
