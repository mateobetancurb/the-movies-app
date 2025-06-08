import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SimilarMoviesYouMightLike from "../../../../components/movies/sections/SimilarMoviesYouMightLike";
import { getSimilarMovies } from "../../../../services/movieService";

// Mock the movieService module
jest.mock("../../../../services/movieService", () => ({
	getSimilarMovies: jest.fn(),
}));

// Mock the MovieSection component
jest.mock("../../../../components/movies/sections/MovieSection", () => {
	return function MockMovieSection({
		title,
		movies,
		emptyMessage,
	}: {
		title: string;
		movies: any[];
		emptyMessage: string;
	}) {
		return (
			<div data-testid="movie-section">
				<h2>{title}</h2>
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

const mockGetSimilarMovies = getSimilarMovies as jest.MockedFunction<
	typeof getSimilarMovies
>;

describe("SimilarMoviesYouMightLike", () => {
	const mockSimilarMoviesResponse = {
		page: 1,
		results: [
			{
				id: 501,
				title: "Inception",
				overview:
					"A thief who steals corporate secrets through dream-sharing technology...",
				poster_path: "https://image.tmdb.org/t/p/w500/inception.jpg",
				backdrop_path:
					"https://image.tmdb.org/t/p/w1280/inception-backdrop.jpg",
				release_date: "2010-07-16",
				vote_average: 8.8,
				vote_count: 30000,
				runtime: 148,
				genres: [
					{ id: 28, name: "Action" },
					{ id: 878, name: "Science Fiction" },
				],
				cast: [],
			},
			{
				id: 502,
				title: "Interstellar",
				overview: "A team of explorers travel through a wormhole in space...",
				poster_path: "https://image.tmdb.org/t/p/w500/interstellar.jpg",
				backdrop_path:
					"https://image.tmdb.org/t/p/w1280/interstellar-backdrop.jpg",
				release_date: "2014-11-07",
				vote_average: 8.6,
				vote_count: 25000,
				runtime: 169,
				genres: [
					{ id: 18, name: "Drama" },
					{ id: 878, name: "Science Fiction" },
				],
				cast: [],
			},
		],
		total_pages: 3,
		total_results: 50,
	};

	const testMovieId = 155;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the Similar Movies section with correct title", async () => {
		mockGetSimilarMovies.mockResolvedValue(mockSimilarMoviesResponse);

		render(await SimilarMoviesYouMightLike({ movieId: testMovieId }));

		expect(
			screen.getByText("Similar Movies You Might Like")
		).toBeInTheDocument();
		expect(screen.getByTestId("movie-section")).toBeInTheDocument();
	});

	it("calls getSimilarMovies with correct movieId", async () => {
		mockGetSimilarMovies.mockResolvedValue(mockSimilarMoviesResponse);

		await SimilarMoviesYouMightLike({ movieId: testMovieId });

		expect(mockGetSimilarMovies).toHaveBeenCalledWith(testMovieId);
		expect(mockGetSimilarMovies).toHaveBeenCalledTimes(1);
	});

	it("renders movies from API response results", async () => {
		mockGetSimilarMovies.mockResolvedValue(mockSimilarMoviesResponse);

		render(await SimilarMoviesYouMightLike({ movieId: testMovieId }));

		expect(screen.getByText("Inception")).toBeInTheDocument();
		expect(screen.getByText("Interstellar")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("2");
	});

	it("passes movies.results to MovieSection component", async () => {
		mockGetSimilarMovies.mockResolvedValue(mockSimilarMoviesResponse);

		render(await SimilarMoviesYouMightLike({ movieId: testMovieId }));

		expect(screen.getByTestId("movie-501")).toBeInTheDocument();
		expect(screen.getByTestId("movie-502")).toBeInTheDocument();
	});

	it("passes correct empty message to MovieSection", async () => {
		mockGetSimilarMovies.mockResolvedValue(mockSimilarMoviesResponse);

		render(await SimilarMoviesYouMightLike({ movieId: testMovieId }));

		expect(screen.getByTestId("empty-message")).toHaveTextContent(
			"No similar movies found"
		);
	});

	it("handles empty API response gracefully", async () => {
		const emptyResponse = {
			page: 1,
			results: [],
			total_pages: 0,
			total_results: 0,
		};
		mockGetSimilarMovies.mockResolvedValue(emptyResponse);

		render(await SimilarMoviesYouMightLike({ movieId: testMovieId }));

		expect(
			screen.getByText("Similar Movies You Might Like")
		).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("0");
		expect(screen.getByTestId("empty-message")).toHaveTextContent(
			"No similar movies found"
		);
	});

	it("handles single similar movie in response", async () => {
		const singleMovieResponse = {
			...mockSimilarMoviesResponse,
			results: [mockSimilarMoviesResponse.results[0]],
			total_results: 1,
		};
		mockGetSimilarMovies.mockResolvedValue(singleMovieResponse);

		render(await SimilarMoviesYouMightLike({ movieId: testMovieId }));

		expect(
			screen.getByText("Similar Movies You Might Like")
		).toBeInTheDocument();
		expect(screen.getByText("Inception")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
		expect(screen.queryByText("Interstellar")).not.toBeInTheDocument();
	});

	it("handles large number of similar movies in response", async () => {
		const manyMoviesResponse = {
			...mockSimilarMoviesResponse,
			results: Array.from({ length: 20 }, (_, index) => ({
				...mockSimilarMoviesResponse.results[0],
				id: index + 600,
				title: `Similar Movie ${index + 1}`,
			})),
			total_results: 20,
		};
		mockGetSimilarMovies.mockResolvedValue(manyMoviesResponse);

		render(await SimilarMoviesYouMightLike({ movieId: testMovieId }));

		expect(
			screen.getByText("Similar Movies You Might Like")
		).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("20");
		expect(screen.getByText("Similar Movie 1")).toBeInTheDocument();
		expect(screen.getByText("Similar Movie 20")).toBeInTheDocument();
	});

	it("handles different movieId parameters correctly", async () => {
		const differentMovieId = 999;
		mockGetSimilarMovies.mockResolvedValue(mockSimilarMoviesResponse);

		await SimilarMoviesYouMightLike({ movieId: differentMovieId });

		expect(mockGetSimilarMovies).toHaveBeenCalledWith(differentMovieId);
		expect(mockGetSimilarMovies).toHaveBeenCalledTimes(1);
	});

	it("handles API service error gracefully", async () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		mockGetSimilarMovies.mockRejectedValue(new Error("API request failed"));

		await expect(
			SimilarMoviesYouMightLike({ movieId: testMovieId })
		).rejects.toThrow("API request failed");

		consoleSpy.mockRestore();
	});

	it("handles network timeout error", async () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		mockGetSimilarMovies.mockRejectedValue(new Error("Network timeout"));

		await expect(
			SimilarMoviesYouMightLike({ movieId: testMovieId })
		).rejects.toThrow("Network timeout");

		consoleSpy.mockRestore();
	});

	it("handles malformed API response structure", async () => {
		const malformedResponse = {
			page: 1,
			results: [
				{
					id: 503,
					title: null, // Invalid title
					overview: undefined,
					poster_path: null,
					backdrop_path: "",
					release_date: "",
					vote_average: null,
					vote_count: 0,
					runtime: undefined,
					genres: [],
					cast: null,
				},
			],
			total_pages: 1,
			total_results: 1,
		};
		mockGetSimilarMovies.mockResolvedValue(malformedResponse);

		render(await SimilarMoviesYouMightLike({ movieId: testMovieId }));

		expect(
			screen.getByText("Similar Movies You Might Like")
		).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
		expect(screen.getByTestId("movie-503")).toBeInTheDocument();
	});

	it("processes movies with special characters and unicode", async () => {
		const unicodeMoviesResponse = {
			...mockSimilarMoviesResponse,
			results: [
				{
					...mockSimilarMoviesResponse.results[0],
					id: 504,
					title: "Les Misérables 🎭",
				},
				{
					...mockSimilarMoviesResponse.results[1],
					id: 505,
					title: "Amélie & The 東京 Story",
				},
			],
		};
		mockGetSimilarMovies.mockResolvedValue(unicodeMoviesResponse);

		render(await SimilarMoviesYouMightLike({ movieId: testMovieId }));

		expect(screen.getByText("Les Misérables 🎭")).toBeInTheDocument();
		expect(screen.getByText("Amélie & The 東京 Story")).toBeInTheDocument();
	});

	it("handles movies with minimal required fields only", async () => {
		const minimalMoviesResponse = {
			page: 1,
			results: [
				{
					id: 506,
					title: "Minimal Movie",
				},
			],
			total_pages: 1,
			total_results: 1,
		};
		mockGetSimilarMovies.mockResolvedValue(minimalMoviesResponse);

		render(await SimilarMoviesYouMightLike({ movieId: testMovieId }));

		expect(
			screen.getByText("Similar Movies You Might Like")
		).toBeInTheDocument();
		expect(screen.getByText("Minimal Movie")).toBeInTheDocument();
		expect(screen.getByTestId("movie-506")).toBeInTheDocument();
	});

	it("validates async component behavior with delayed responses", async () => {
		const delayedResponse = new Promise((resolve) => {
			setTimeout(() => resolve(mockSimilarMoviesResponse), 100);
		});
		mockGetSimilarMovies.mockReturnValue(delayedResponse);

		const componentPromise = SimilarMoviesYouMightLike({
			movieId: testMovieId,
		});

		// Component should still resolve with the delayed response
		const result = await componentPromise;
		render(result);

		expect(
			screen.getByText("Similar Movies You Might Like")
		).toBeInTheDocument();
		expect(screen.getByText("Inception")).toBeInTheDocument();
	});

	it("tests concurrent API calls and component state preservation", async () => {
		const firstMovieId = 100;
		const secondMovieId = 200;

		const firstResponse = {
			...mockSimilarMoviesResponse,
			results: [
				{
					...mockSimilarMoviesResponse.results[0],
					id: 510,
					title: "First Similar Movie",
				},
			],
		};

		const secondResponse = {
			...mockSimilarMoviesResponse,
			results: [
				{
					...mockSimilarMoviesResponse.results[1],
					id: 511,
					title: "Second Similar Movie",
				},
			],
		};

		mockGetSimilarMovies
			.mockResolvedValueOnce(firstResponse)
			.mockResolvedValueOnce(secondResponse);

		// Render multiple components concurrently
		const [firstComponent, secondComponent] = await Promise.all([
			SimilarMoviesYouMightLike({ movieId: firstMovieId }),
			SimilarMoviesYouMightLike({ movieId: secondMovieId }),
		]);

		render(firstComponent);
		expect(screen.getByText("First Similar Movie")).toBeInTheDocument();

		// Clear and render second component
		screen.getByTestId("movie-section").innerHTML = "";
		render(secondComponent);
		expect(screen.getByText("Second Similar Movie")).toBeInTheDocument();

		expect(mockGetSimilarMovies).toHaveBeenCalledTimes(2);
		expect(mockGetSimilarMovies).toHaveBeenNthCalledWith(1, firstMovieId);
		expect(mockGetSimilarMovies).toHaveBeenNthCalledWith(2, secondMovieId);
	});

	it("handles API rate limit error", async () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		mockGetSimilarMovies.mockRejectedValue(
			new Error("API rate limit exceeded")
		);

		await expect(
			SimilarMoviesYouMightLike({ movieId: testMovieId })
		).rejects.toThrow("API rate limit exceeded");

		consoleSpy.mockRestore();
	});

	it("handles zero movieId parameter", async () => {
		mockGetSimilarMovies.mockResolvedValue(mockSimilarMoviesResponse);

		await SimilarMoviesYouMightLike({ movieId: 0 });

		expect(mockGetSimilarMovies).toHaveBeenCalledWith(0);
		expect(mockGetSimilarMovies).toHaveBeenCalledTimes(1);
	});

	it("handles negative movieId parameter", async () => {
		mockGetSimilarMovies.mockResolvedValue(mockSimilarMoviesResponse);

		await SimilarMoviesYouMightLike({ movieId: -1 });

		expect(mockGetSimilarMovies).toHaveBeenCalledWith(-1);
		expect(mockGetSimilarMovies).toHaveBeenCalledTimes(1);
	});

	it("handles very large movieId parameter", async () => {
		const largeMovieId = 999999999;
		mockGetSimilarMovies.mockResolvedValue(mockSimilarMoviesResponse);

		await SimilarMoviesYouMightLike({ movieId: largeMovieId });

		expect(mockGetSimilarMovies).toHaveBeenCalledWith(largeMovieId);
		expect(mockGetSimilarMovies).toHaveBeenCalledTimes(1);
	});
});
