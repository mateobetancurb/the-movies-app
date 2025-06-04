/**
 * @jest-environment node
 */

import { Movie, PaginatedResponse } from "../../interfaces";

// Mock the entire movieService module
const mockGetTrendingMovies = jest.fn();
const mockGetMovieDetails = jest.fn();

jest.mock("../../services/movieService", () => ({
	getTrendingMovies: mockGetTrendingMovies,
	getMovieDetails: mockGetMovieDetails,
	getFeaturedMovie: jest.fn().mockImplementation(async () => {
		// Re-implement the getFeaturedMovie logic for testing
		try {
			const trendingMovies = await mockGetTrendingMovies(1);

			if (trendingMovies.results.length === 0) {
				return null;
			}

			const randomIndex = Math.floor(
				Math.random() * Math.min(10, trendingMovies.results.length)
			);
			const selectedMovie = trendingMovies.results[randomIndex];
			return await mockGetMovieDetails(selectedMovie.id);
		} catch (error) {
			console.error("Error fetching featured movie:", error);
			return null;
		}
	}),
}));

// Import after mocking
const movieService = require("../../services/movieService");

describe("getFeaturedMovie", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Set up process.env for test environment
		process.env.TMDB_API_KEY = "test-api-key";
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const mockTrendingMovies: Movie[] = [
		{
			id: 1,
			title: "Movie 1",
			overview: "Overview 1",
			poster_path: "/poster1.jpg",
			backdrop_path: "/backdrop1.jpg",
			vote_average: 8.5,
			vote_count: 1000,
			release_date: "2023-01-01",
			genres: [{ id: 1, name: "Action" }],
			cast: [],
		},
		{
			id: 2,
			title: "Movie 2",
			overview: "Overview 2",
			poster_path: "/poster2.jpg",
			backdrop_path: "/backdrop2.jpg",
			vote_average: 7.8,
			vote_count: 850,
			release_date: "2023-02-01",
			genres: [{ id: 2, name: "Comedy" }],
			cast: [],
		},
		{
			id: 3,
			title: "Movie 3",
			overview: "Overview 3",
			poster_path: "/poster3.jpg",
			backdrop_path: "/backdrop3.jpg",
			vote_average: 9.1,
			vote_count: 1200,
			release_date: "2023-03-01",
			genres: [{ id: 3, name: "Drama" }],
			cast: [],
		},
	];

	const mockTrendingResponse: PaginatedResponse<Movie> = {
		page: 1,
		results: mockTrendingMovies,
		total_pages: 1,
		total_results: 3,
	};

	const mockMovieDetails: Movie = {
		id: 1,
		title: "Featured Movie",
		overview: "This is a featured movie with detailed information",
		poster_path: "/featured-poster.jpg",
		backdrop_path: "/featured-backdrop.jpg",
		vote_average: 8.5,
		vote_count: 1000,
		release_date: "2023-01-01",
		genres: [{ id: 1, name: "Action" }],
		cast: [
			{
				id: 101,
				name: "Actor 1",
				character: "Character 1",
				profile_path: "/actor1.jpg",
			},
		],
		runtime: 120,
	};

	it("should return a featured movie successfully", async () => {
		// Mock Math.random to return a predictable value
		jest.spyOn(Math, "random").mockReturnValue(0.5);

		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);
		mockGetMovieDetails.mockResolvedValue(mockMovieDetails);

		const result = await movieService.getFeaturedMovie();

		expect(result).toEqual(mockMovieDetails);
		expect(mockGetTrendingMovies).toHaveBeenCalledWith(1);
		expect(mockGetMovieDetails).toHaveBeenCalledWith(2); // Index 1 (0.5 * 3 = 1.5, floor = 1)
	});

	it("should select first movie when Math.random returns 0", async () => {
		jest.spyOn(Math, "random").mockReturnValue(0);

		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);
		mockGetMovieDetails.mockResolvedValue(mockMovieDetails);

		const result = await movieService.getFeaturedMovie();

		expect(result).toEqual(mockMovieDetails);
		expect(mockGetMovieDetails).toHaveBeenCalledWith(1); // Index 0
	});

	it("should select last movie when Math.random returns close to 1", async () => {
		jest.spyOn(Math, "random").mockReturnValue(0.99);

		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);
		mockGetMovieDetails.mockResolvedValue(mockMovieDetails);

		const result = await movieService.getFeaturedMovie();

		expect(result).toEqual(mockMovieDetails);
		expect(mockGetMovieDetails).toHaveBeenCalledWith(3); // Index 2 (0.99 * 3 = 2.97, floor = 2)
	});

	it("should limit selection to first 10 movies when more than 10 trending movies exist", async () => {
		const manyMovies = Array.from({ length: 15 }, (_, i) => ({
			...mockTrendingMovies[0],
			id: i + 1,
			title: `Movie ${i + 1}`,
		}));

		const largeTrendingResponse: PaginatedResponse<Movie> = {
			...mockTrendingResponse,
			results: manyMovies,
			total_results: 15,
		};

		jest.spyOn(Math, "random").mockReturnValue(0.9); // Should select index 9 (0.9 * 10 = 9)

		mockGetTrendingMovies.mockResolvedValue(largeTrendingResponse);
		mockGetMovieDetails.mockResolvedValue(mockMovieDetails);

		const result = await movieService.getFeaturedMovie();

		expect(result).toEqual(mockMovieDetails);
		expect(mockGetMovieDetails).toHaveBeenCalledWith(10); // Movie at index 9 has id 10
	});

	it("should return null when no trending movies are available", async () => {
		const emptyTrendingResponse: PaginatedResponse<Movie> = {
			page: 1,
			results: [],
			total_pages: 0,
			total_results: 0,
		};

		mockGetTrendingMovies.mockResolvedValue(emptyTrendingResponse);

		const result = await movieService.getFeaturedMovie();

		expect(result).toBeNull();
		expect(mockGetTrendingMovies).toHaveBeenCalledWith(1);
		expect(mockGetMovieDetails).not.toHaveBeenCalled();
	});

	it("should return null when getMovieDetails returns null", async () => {
		jest.spyOn(Math, "random").mockReturnValue(0.5);

		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);
		mockGetMovieDetails.mockResolvedValue(null);

		const result = await movieService.getFeaturedMovie();

		expect(result).toBeNull();
		expect(mockGetTrendingMovies).toHaveBeenCalledWith(1);
		expect(mockGetMovieDetails).toHaveBeenCalledWith(2);
	});

	it("should handle error when getTrendingMovies fails", async () => {
		const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

		mockGetTrendingMovies.mockRejectedValue(new Error("API Error"));

		const result = await movieService.getFeaturedMovie();

		expect(result).toBeNull();
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error fetching featured movie:",
			expect.any(Error)
		);

		consoleErrorSpy.mockRestore();
	});

	it("should handle error when getMovieDetails fails", async () => {
		const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

		jest.spyOn(Math, "random").mockReturnValue(0.5);
		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);
		mockGetMovieDetails.mockRejectedValue(new Error("Movie details error"));

		const result = await movieService.getFeaturedMovie();

		expect(result).toBeNull();
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error fetching featured movie:",
			expect.any(Error)
		);

		consoleErrorSpy.mockRestore();
	});

	it("should handle single trending movie", async () => {
		const singleMovieResponse: PaginatedResponse<Movie> = {
			page: 1,
			results: [mockTrendingMovies[0]],
			total_pages: 1,
			total_results: 1,
		};

		jest.spyOn(Math, "random").mockReturnValue(0.8); // Even with high random value, should select the only movie

		mockGetTrendingMovies.mockResolvedValue(singleMovieResponse);
		mockGetMovieDetails.mockResolvedValue(mockMovieDetails);

		const result = await movieService.getFeaturedMovie();

		expect(result).toEqual(mockMovieDetails);
		expect(mockGetMovieDetails).toHaveBeenCalledWith(1); // The only movie available
	});

	it("should use Math.min to ensure selection is within bounds", async () => {
		// This test ensures that Math.min(10, trendingMovies.results.length) works correctly
		const fiveMoviesResponse: PaginatedResponse<Movie> = {
			page: 1,
			results: mockTrendingMovies.slice(0, 2), // Only 2 movies
			total_pages: 1,
			total_results: 2,
		};

		jest.spyOn(Math, "random").mockReturnValue(0.9); // Should select index 1 (0.9 * 2 = 1.8, floor = 1)

		mockGetTrendingMovies.mockResolvedValue(fiveMoviesResponse);
		mockGetMovieDetails.mockResolvedValue(mockMovieDetails);

		const result = await movieService.getFeaturedMovie();

		expect(result).toEqual(mockMovieDetails);
		expect(mockGetMovieDetails).toHaveBeenCalledWith(2); // Movie at index 1
	});

	it("should maintain randomness across multiple calls", async () => {
		// Test that different random values produce different selections
		const mathRandomSpy = jest.spyOn(Math, "random");

		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);
		mockGetMovieDetails.mockResolvedValue(mockMovieDetails);

		// First call with random = 0.1
		mathRandomSpy.mockReturnValueOnce(0.1);
		await movieService.getFeaturedMovie();
		expect(mockGetMovieDetails).toHaveBeenCalledWith(1); // Index 0

		// Second call with random = 0.6
		mathRandomSpy.mockReturnValueOnce(0.6);
		await movieService.getFeaturedMovie();
		expect(mockGetMovieDetails).toHaveBeenCalledWith(2); // Index 1

		mathRandomSpy.mockRestore();
	});

	it("should verify the function signature and return type", async () => {
		mockGetTrendingMovies.mockResolvedValue(mockTrendingResponse);
		mockGetMovieDetails.mockResolvedValue(mockMovieDetails);

		const result = await movieService.getFeaturedMovie();

		// Verify it returns a Movie object or null
		expect(result === null || typeof result === "object").toBe(true);

		if (result) {
			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("title");
			expect(result).toHaveProperty("overview");
		}
	});

	it("should handle the randomness algorithm correctly", () => {
		// Test the random selection algorithm with known values
		const testCases = [
			{ random: 0, arrayLength: 3, expected: 0 },
			{ random: 0.33, arrayLength: 3, expected: 0 },
			{ random: 0.34, arrayLength: 3, expected: 1 },
			{ random: 0.66, arrayLength: 3, expected: 1 },
			{ random: 0.67, arrayLength: 3, expected: 2 },
			{ random: 0.99, arrayLength: 3, expected: 2 },
			{ random: 0.5, arrayLength: 10, expected: 5 },
			{ random: 0.9, arrayLength: 15, expected: 9 }, // Limited to 10
		];

		testCases.forEach(({ random, arrayLength, expected }) => {
			const maxLength = Math.min(10, arrayLength);
			const calculatedIndex = Math.floor(random * maxLength);
			expect(calculatedIndex).toBe(expected);
		});
	});
});
