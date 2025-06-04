import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TrendingNowSection from "../../../../components/movies/sections/TrendingNowSection";
import { getTrendingMovies } from "../../../../services/movieService";

// Mock the movieService module
jest.mock("../../../../services/movieService", () => ({
	getTrendingMovies: jest.fn(),
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

const mockGetTrendingMovies = getTrendingMovies as jest.MockedFunction<
	typeof getTrendingMovies
>;

describe("TrendingNowSection", () => {
	const mockTrendingResponse = {
		page: 1,
		results: [
			{
				id: 201,
				title: "Barbie",
				overview: "Barbie and Ken are having the time of their lives...",
				poster_path: "https://image.tmdb.org/t/p/w500/barbie.jpg",
				backdrop_path: "https://image.tmdb.org/t/p/w1280/barbie-backdrop.jpg",
				release_date: "2023-07-21",
				vote_average: 7.2,
				vote_count: 8500,
				runtime: 114,
				genres: [
					{ id: 35, name: "Comedy" },
					{ id: 12, name: "Adventure" },
					{ id: 14, name: "Fantasy" },
				],
				cast: [],
			},
			{
				id: 202,
				title: "Spider-Man: Across the Spider-Verse",
				overview: "After reuniting with Gwen Stacy, Brooklyn's full-time...",
				poster_path: "https://image.tmdb.org/t/p/w500/spiderverse.jpg",
				backdrop_path:
					"https://image.tmdb.org/t/p/w1280/spiderverse-backdrop.jpg",
				release_date: "2023-06-02",
				vote_average: 8.6,
				vote_count: 7200,
				runtime: 140,
				genres: [
					{ id: 16, name: "Animation" },
					{ id: 28, name: "Action" },
					{ id: 12, name: "Adventure" },
				],
				cast: [],
			},
			{
				id: 203,
				title: "Fast X",
				overview: "Over many missions and against impossible odds...",
				poster_path: "https://image.tmdb.org/t/p/w500/fastx.jpg",
				backdrop_path: "https://image.tmdb.org/t/p/w1280/fastx-backdrop.jpg",
				release_date: "2023-05-19",
				vote_average: 7.1,
				vote_count: 4800,
				runtime: 141,
				genres: [
					{ id: 28, name: "Action" },
					{ id: 80, name: "Crime" },
					{ id: 53, name: "Thriller" },
				],
				cast: [],
			},
		],
		total_pages: 10,
		total_results: 200,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the Trending Now section with correct title", async () => {
		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);

		render(await TrendingNowSection());

		expect(screen.getByText("Trending Now")).toBeInTheDocument();
		expect(screen.getByTestId("movie-section")).toBeInTheDocument();
	});

	it("calls getTrendingMovies service function", async () => {
		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);

		await TrendingNowSection();

		expect(mockGetTrendingMovies).toHaveBeenCalledWith();
		expect(mockGetTrendingMovies).toHaveBeenCalledTimes(1);
	});

	it("renders movies from API response results", async () => {
		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);

		render(await TrendingNowSection());

		expect(screen.getByText("Barbie")).toBeInTheDocument();
		expect(
			screen.getByText("Spider-Man: Across the Spider-Verse")
		).toBeInTheDocument();
		expect(screen.getByText("Fast X")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("3");
	});

	it("passes movies.results to MovieSection component", async () => {
		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);

		render(await TrendingNowSection());

		expect(screen.getByTestId("movie-201")).toBeInTheDocument();
		expect(screen.getByTestId("movie-202")).toBeInTheDocument();
		expect(screen.getByTestId("movie-203")).toBeInTheDocument();
	});

	it("handles empty API response gracefully", async () => {
		const emptyResponse = {
			page: 1,
			results: [],
			total_pages: 0,
			total_results: 0,
		};
		mockGetTrendingMovies.mockResolvedValue(emptyResponse);

		render(await TrendingNowSection());

		expect(screen.getByText("Trending Now")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("0");
	});

	it("handles single trending movie in response", async () => {
		const singleMovieResponse = {
			...mockTrendingResponse,
			results: [mockTrendingResponse.results[0]],
			total_results: 1,
		};
		mockGetTrendingMovies.mockResolvedValue(singleMovieResponse);

		render(await TrendingNowSection());

		expect(screen.getByText("Trending Now")).toBeInTheDocument();
		expect(screen.getByText("Barbie")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
		expect(
			screen.queryByText("Spider-Man: Across the Spider-Verse")
		).not.toBeInTheDocument();
	});

	it("handles large number of trending movies in response", async () => {
		const manyMoviesResponse = {
			...mockTrendingResponse,
			results: Array.from({ length: 20 }, (_, index) => ({
				...mockTrendingResponse.results[0],
				id: index + 300,
				title: `Trending Movie ${index + 1}`,
			})),
			total_results: 20,
		};
		mockGetTrendingMovies.mockResolvedValue(manyMoviesResponse);

		render(await TrendingNowSection());

		expect(screen.getByText("Trending Now")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("20");
		expect(screen.getByText("Trending Movie 1")).toBeInTheDocument();
		expect(screen.getByText("Trending Movie 20")).toBeInTheDocument();
	});

	it("handles API service error gracefully", async () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		mockGetTrendingMovies.mockRejectedValue(new Error("Trending API failed"));

		await expect(TrendingNowSection()).rejects.toThrow("Trending API failed");

		consoleSpy.mockRestore();
	});

	it("handles network connection errors", async () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		mockGetTrendingMovies.mockRejectedValue(
			new Error("Network Error: Connection refused")
		);

		await expect(TrendingNowSection()).rejects.toThrow(
			"Network Error: Connection refused"
		);

		consoleSpy.mockRestore();
	});

	it("handles API rate limit errors", async () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		mockGetTrendingMovies.mockRejectedValue(
			new Error("API Rate Limit Exceeded")
		);

		await expect(TrendingNowSection()).rejects.toThrow(
			"API Rate Limit Exceeded"
		);

		consoleSpy.mockRestore();
	});

	it("handles malformed trending API response structure", async () => {
		const malformedResponse = {
			page: 1,
			results: [
				{
					id: 204,
					title: "", // Empty title
					overview: null,
					poster_path: undefined,
					backdrop_path: "",
					release_date: "",
					vote_average: null,
					vote_count: undefined,
					runtime: "invalid",
					genres: undefined,
					cast: null,
				},
				{
					id: null, // Invalid ID
					title: "Valid Movie",
					overview: "Valid overview",
					poster_path: "https://image.tmdb.org/t/p/w500/valid.jpg",
					backdrop_path: "https://image.tmdb.org/t/p/w1280/valid-backdrop.jpg",
					release_date: "2023-01-01",
					vote_average: 7.5,
					vote_count: 1000,
					runtime: 120,
					genres: [{ id: 28, name: "Action" }],
					cast: [],
				},
			],
			total_pages: 1,
			total_results: 2,
		};
		mockGetTrendingMovies.mockResolvedValue(malformedResponse as any);

		render(await TrendingNowSection());

		expect(screen.getByText("Trending Now")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("2");
	});

	it("renders trending movies with processed image URLs", async () => {
		const responseWithImagePaths = {
			...mockTrendingResponse,
			results: [
				{
					...mockTrendingResponse.results[0],
					poster_path:
						"https://image.tmdb.org/t/p/w500/processed-trending-poster.jpg",
					backdrop_path:
						"https://image.tmdb.org/t/p/w1280/processed-trending-backdrop.jpg",
				},
			],
		};
		mockGetTrendingMovies.mockResolvedValue(responseWithImagePaths);

		render(await TrendingNowSection());

		expect(screen.getByText("Barbie")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
	});

	it("handles trending movies with international titles and special characters", async () => {
		const internationalMoviesResponse = {
			...mockTrendingResponse,
			results: [
				{
					id: 205,
					title: "영화 제목 (Movie Title) - 映画タイトル",
					overview: "Una película con caracteres especiales: àáâãäåæçèéêë",
					poster_path: "https://image.tmdb.org/t/p/w500/international.jpg",
					backdrop_path:
						"https://image.tmdb.org/t/p/w1280/international-backdrop.jpg",
					release_date: "2023-08-15",
					vote_average: 8.1,
					vote_count: 3000,
					runtime: 135,
					genres: [
						{ id: 18, name: "Drama" },
						{ id: 10751, name: "Family" },
					],
					cast: [],
				},
				{
					id: 206,
					title: "🎬 Emoji Movie Title 🍿",
					overview: "A movie with emojis and symbols: ±×÷=≠≤≥∞",
					poster_path: "https://image.tmdb.org/t/p/w500/emoji.jpg",
					backdrop_path: "https://image.tmdb.org/t/p/w1280/emoji-backdrop.jpg",
					release_date: "2023-09-01",
					vote_average: 6.8,
					vote_count: 2500,
					runtime: 90,
					genres: [
						{ id: 35, name: "Comedy" },
						{ id: 16, name: "Animation" },
					],
					cast: [],
				},
			],
		};
		mockGetTrendingMovies.mockResolvedValue(internationalMoviesResponse);

		render(await TrendingNowSection());

		expect(
			screen.getByText("영화 제목 (Movie Title) - 映画タイトル")
		).toBeInTheDocument();
		expect(screen.getByText("🎬 Emoji Movie Title 🍿")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("2");
	});

	it("handles trending API response with minimal required fields only", async () => {
		const minimalResponse = {
			page: 1,
			results: [
				{
					id: 207,
					title: "Minimal Trending Movie",
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
		mockGetTrendingMovies.mockResolvedValue(minimalResponse);

		render(await TrendingNowSection());

		expect(screen.getByText("Trending Now")).toBeInTheDocument();
		expect(screen.getByText("Minimal Trending Movie")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
	});

	it("validates async component behavior with delayed API response", async () => {
		let resolvePromise: (value: any) => void;
		const delayedPromise = new Promise((resolve) => {
			resolvePromise = resolve;
		});

		mockGetTrendingMovies.mockReturnValue(delayedPromise as any);

		// Start rendering the component
		const componentPromise = TrendingNowSection();

		// Simulate delayed API response
		setTimeout(() => {
			resolvePromise!(mockTrendingResponse);
		}, 100);

		// Wait for component to complete
		const component = await componentPromise;
		render(component);

		expect(screen.getByText("Trending Now")).toBeInTheDocument();
		expect(screen.getByText("Barbie")).toBeInTheDocument();
		expect(
			screen.getByText("Spider-Man: Across the Spider-Verse")
		).toBeInTheDocument();
	});

	it("handles concurrent API calls correctly", async () => {
		// Simulate multiple concurrent calls to getTrendingMovies
		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);

		const [component1, component2] = await Promise.all([
			TrendingNowSection(),
			TrendingNowSection(),
		]);

		render(component1);
		expect(screen.getByText("Trending Now")).toBeInTheDocument();
		expect(mockGetTrendingMovies).toHaveBeenCalledTimes(2);
	});

	it("preserves component state during re-renders", async () => {
		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);

		const { rerender } = render(await TrendingNowSection());

		expect(screen.getByText("Trending Now")).toBeInTheDocument();
		expect(screen.getByText("Barbie")).toBeInTheDocument();

		// Re-render the component
		rerender(await TrendingNowSection());

		expect(screen.getByText("Trending Now")).toBeInTheDocument();
		expect(screen.getByText("Barbie")).toBeInTheDocument();
		expect(mockGetTrendingMovies).toHaveBeenCalledTimes(2);
	});
});
