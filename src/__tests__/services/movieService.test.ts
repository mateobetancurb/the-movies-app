/**
 * @jest-environment node
 */

import {
	Movie,
	Genre,
	GenresResponse,
	PaginatedResponse,
	MovieDetails,
	TMDBConfiguration,
	CastMember,
} from "../../interfaces";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Import the service functions after setting up mocks
import * as movieService from "../../services/movieService";

describe("MovieService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockFetch.mockClear();
	});

	const mockGenresResponse: GenresResponse = {
		genres: [
			{ id: 28, name: "Action" },
			{ id: 35, name: "Comedy" },
			{ id: 18, name: "Drama" },
		],
	};

	const mockMovie: Movie = {
		id: 1,
		title: "Test Movie",
		overview: "A test movie overview",
		poster_path: "https://image.tmdb.org/t/p/w500/test-poster.jpg",
		backdrop_path: "https://image.tmdb.org/t/p/w1280/test-backdrop.jpg",
		vote_average: 8.5,
		vote_count: 1000,
		release_date: "2023-01-01",
		genres: [{ id: 28, name: "Action" }],
		cast: [],
	};

	const mockPaginatedResponse: PaginatedResponse<Movie> = {
		page: 1,
		results: [mockMovie],
		total_pages: 10,
		total_results: 200,
	};

	const mockMovieDetails: MovieDetails = {
		id: 1,
		title: "Test Movie",
		overview: "A test movie overview",
		poster_path: "https://image.tmdb.org/t/p/w500/test-poster.jpg",
		backdrop_path: "https://image.tmdb.org/t/p/w1280/test-backdrop.jpg",
		vote_average: 8.5,
		vote_count: 1000,
		release_date: "2023-01-01",
		genres: [{ id: 28, name: "Action" }],
		cast: [
			{
				id: 1,
				name: "Test Actor",
				character: "Test Character",
				profile_path: "https://image.tmdb.org/t/p/w185/actor.jpg",
			},
		],
		budget: 50000000,
		revenue: 200000000,
		runtime: 120,
		tagline: "An epic adventure",
	};

	const mockTMDBConfiguration: TMDBConfiguration = {
		images: {
			base_url: "https://image.tmdb.org/t/p/",
			secure_base_url: "https://image.tmdb.org/t/p/",
			backdrop_sizes: ["w300", "w780", "w1280", "original"],
			logo_sizes: ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
			poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
			profile_sizes: ["w45", "w185", "h632", "original"],
			still_sizes: ["w92", "w185", "w300", "original"],
		},
		change_keys: ["adult", "air_date", "also_known_as"],
	};

	const createMockResponse = (data: any, status = 200) =>
		Promise.resolve({
			ok: status >= 200 && status < 300,
			status,
			statusText: status === 200 ? "OK" : "Error",
			json: () => Promise.resolve(data),
		} as Response);

	describe("getGenres", () => {
		it("should return genres successfully", async () => {
			mockFetch.mockResolvedValueOnce(createMockResponse(mockGenresResponse));

			const result = await movieService.getGenres();

			expect(result).toEqual(mockGenresResponse.genres);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("genre/movie/list"),
				expect.objectContaining({ next: { revalidate: 86400 } })
			);
		});

		it("should handle API errors", async () => {
			const errorResponse = {
				status_message: "Invalid API key",
				status_code: 7,
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(errorResponse, 401));

			await expect(movieService.getGenres()).rejects.toThrow(
				"Failed to fetch data from TMDB"
			);
		});
	});

	describe("getTrendingMovies", () => {
		it("should return trending movies with default page", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						overview: "Overview",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						vote_average: 8.5,
						vote_count: 1000,
						release_date: "2023-01-01",
						genre_ids: [28, 35],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.getTrendingMovies();

			expect(result.results[0]).toMatchObject({
				id: 1,
				title: "Test Movie",
				poster_path: "https://image.tmdb.org/t/p/w500/test-poster.jpg",
				backdrop_path: "https://image.tmdb.org/t/p/w1280/test-backdrop.jpg",
			});
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("trending/movie/week"),
				expect.any(Object)
			);
		});

		it("should handle specific page parameter", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			await movieService.getTrendingMovies(3);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("page=3"),
				expect.any(Object)
			);
		});

		it("should handle null poster and backdrop paths", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: null,
						backdrop_path: null,
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.getTrendingMovies();

			expect(result.results[0].poster_path).toBeNull();
			expect(result.results[0].backdrop_path).toBeNull();
		});
	});

	describe("getTopRatedMovies", () => {
		it("should return top rated movies", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.getTopRatedMovies(2);

			expect(result.page).toBe(1);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("movie/top_rated"),
				expect.any(Object)
			);
		});
	});

	describe("getUpcomingMovies", () => {
		it("should return upcoming movies", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.getUpcomingMovies();

			expect(result.page).toBe(1);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("movie/upcoming"),
				expect.any(Object)
			);
		});
	});

	describe("getNowPlayingMovies", () => {
		it("should return now playing movies", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.getNowPlayingMovies();

			expect(result.page).toBe(1);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("movie/now_playing"),
				expect.any(Object)
			);
		});
	});

	describe("getMoviesByGenre", () => {
		it("should return movies by genre", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.getMoviesByGenre(28);

			expect(result.page).toBe(1);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("discover/movie"),
				expect.any(Object)
			);
		});

		it("should include sort_by parameter", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			await movieService.getMoviesByGenre(28, 2);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("sort_by=popularity.desc"),
				expect.any(Object)
			);
		});
	});

	describe("searchMovies", () => {
		it("should return search results", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.searchMovies("test query");

			expect(result.page).toBe(1);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("search/movie"),
				expect.any(Object)
			);
		});

		it("should return empty results for empty query", async () => {
			const result = await movieService.searchMovies("");

			expect(result).toEqual({
				page: 1,
				results: [],
				total_pages: 0,
				total_results: 0,
			});
			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("should return empty results for whitespace-only query", async () => {
			const result = await movieService.searchMovies("   ");

			expect(result).toEqual({
				page: 1,
				results: [],
				total_pages: 0,
				total_results: 0,
			});
			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("should handle special characters in query", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			await movieService.searchMovies("Lord of the Rings: Fellowship");

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("Lord+of+the+Rings%3A+Fellowship"),
				expect.any(Object)
			);
		});
	});

	describe("getMovieDetails", () => {
		it("should return movie details with cast", async () => {
			const movieData = {
				id: 1,
				title: "Test Movie",
				overview: "A test movie overview",
				poster_path: "/test-poster.jpg",
				backdrop_path: "/test-backdrop.jpg",
				vote_average: 8.5,
				vote_count: 1000,
				release_date: "2023-01-01",
				genres: [{ id: 28, name: "Action" }],
				budget: 50000000,
				revenue: 200000000,
				runtime: 120,
				tagline: "An epic adventure",
			};

			const creditsData = {
				cast: [
					{
						id: 1,
						name: "Test Actor",
						character: "Test Character",
						profile_path: "/actor.jpg",
					},
				],
				crew: [],
			};

			mockFetch
				.mockResolvedValueOnce(createMockResponse(movieData))
				.mockResolvedValueOnce(createMockResponse(creditsData));

			const result = await movieService.getMovieDetails(1);

			expect(result).toMatchObject({
				id: 1,
				title: "Test Movie",
				poster_path: "https://image.tmdb.org/t/p/w500/test-poster.jpg",
				backdrop_path: "https://image.tmdb.org/t/p/w1280/test-backdrop.jpg",
				cast: [
					{
						id: 1,
						name: "Test Actor",
						character: "Test Character",
						profile_path: "https://image.tmdb.org/t/p/w185/actor.jpg",
					},
				],
			});
		});

		it("should handle cast members with null profile_path", async () => {
			const movieData = {
				id: 1,
				title: "Test Movie",
				poster_path: "/test-poster.jpg",
				backdrop_path: "/test-backdrop.jpg",
				genres: [],
			};

			const creditsData = {
				cast: [
					{
						id: 1,
						name: "Test Actor",
						character: "Test Character",
						profile_path: null,
					},
				],
				crew: [],
			};

			mockFetch
				.mockResolvedValueOnce(createMockResponse(movieData))
				.mockResolvedValueOnce(createMockResponse(creditsData));

			const result = await movieService.getMovieDetails(1);

			expect(result?.cast[0].profile_path).toBeNull();
		});

		it("should return null when movie data is not found", async () => {
			mockFetch.mockResolvedValueOnce(createMockResponse(null));

			const result = await movieService.getMovieDetails(999);

			expect(result).toBeNull();
		});

		it("should return null when API call fails", async () => {
			const errorResponse = {
				status_message: "Movie not found",
				status_code: 34,
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(errorResponse, 404));

			const result = await movieService.getMovieDetails(999);

			expect(result).toBeNull();
		});

		it("should make parallel requests for movie data and credits", async () => {
			const movieData = { id: 1, title: "Test Movie", genres: [] };
			const creditsData = { cast: [], crew: [] };

			mockFetch
				.mockResolvedValueOnce(createMockResponse(movieData))
				.mockResolvedValueOnce(createMockResponse(creditsData));

			await movieService.getMovieDetails(1);

			expect(mockFetch).toHaveBeenCalledTimes(2);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("movie/1?"),
				expect.any(Object)
			);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("movie/1/credits"),
				expect.any(Object)
			);
		});

		it("should limit cast to 15 members", async () => {
			const movieData = { id: 1, title: "Test Movie", genres: [] };
			const creditsData = {
				cast: Array.from({ length: 20 }, (_, i) => ({
					id: i + 1,
					name: `Actor ${i + 1}`,
					character: `Character ${i + 1}`,
					profile_path: `/actor${i + 1}.jpg`,
				})),
				crew: [],
			};

			mockFetch
				.mockResolvedValueOnce(createMockResponse(movieData))
				.mockResolvedValueOnce(createMockResponse(creditsData));

			const result = await movieService.getMovieDetails(1);

			expect(result?.cast).toHaveLength(15);
		});
	});

	describe("getRecommendedMovies", () => {
		it("should return recommended movies", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.getRecommendedMovies(1);

			expect(result.page).toBe(1);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("movie/1/recommendations"),
				expect.any(Object)
			);
		});
	});

	describe("getSimilarMovies", () => {
		it("should return similar movies", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.getSimilarMovies(1);

			expect(result.page).toBe(1);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("movie/1/similar"),
				expect.any(Object)
			);
		});
	});

	describe("getTMDBConfiguration", () => {
		it("should return TMDB configuration", async () => {
			mockFetch.mockResolvedValueOnce(
				createMockResponse(mockTMDBConfiguration)
			);

			const result = await movieService.getTMDBConfiguration();

			expect(result).toEqual(mockTMDBConfiguration);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("configuration"),
				expect.any(Object)
			);
		});

		it("should use longer cache time for configuration", async () => {
			mockFetch.mockResolvedValueOnce(
				createMockResponse(mockTMDBConfiguration)
			);

			await movieService.getTMDBConfiguration();

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({ next: { revalidate: 604800 } }) // 7 days
			);
		});
	});

	describe("getFeaturedMovie", () => {
		it("should return a featured movie from trending movies", async () => {
			const trendingResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			const movieData = {
				id: 1,
				title: "Test Movie",
				overview: "A test movie overview",
				poster_path: "/test-poster.jpg",
				backdrop_path: "/test-backdrop.jpg",
				vote_average: 8.5,
				vote_count: 1000,
				release_date: "2023-01-01",
				genres: [{ id: 28, name: "Action" }],
				budget: 50000000,
				revenue: 200000000,
				runtime: 120,
				tagline: "An epic adventure",
			};

			const creditsData = {
				cast: [
					{
						id: 1,
						name: "Test Actor",
						character: "Test Character",
						profile_path: "/actor.jpg",
					},
				],
				crew: [],
			};

			mockFetch
				.mockResolvedValueOnce(createMockResponse(trendingResponse))
				.mockResolvedValueOnce(createMockResponse(movieData))
				.mockResolvedValueOnce(createMockResponse(creditsData));

			const result = await movieService.getFeaturedMovie();

			expect(result).toMatchObject({
				id: 1,
				title: "Test Movie",
			});
		});

		it("should limit selection to first 10 movies", async () => {
			const trendingResponse = {
				...mockPaginatedResponse,
				results: Array.from({ length: 20 }, (_, i) => ({
					id: i + 1,
					title: `Movie ${i + 1}`,
					poster_path: "/test-poster.jpg",
					backdrop_path: "/test-backdrop.jpg",
					genre_ids: [],
				})),
			};

			const movieData = { id: 10, title: "Movie 10", genres: [] };
			const creditsData = { cast: [], crew: [] };

			// Mock Math.random to return 0.9 (which should select index 9 -> movie id 10)
			const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.9);

			mockFetch
				.mockResolvedValueOnce(createMockResponse(trendingResponse))
				.mockResolvedValueOnce(createMockResponse(movieData))
				.mockResolvedValueOnce(createMockResponse(creditsData));

			await movieService.getFeaturedMovie();

			// Should select movie at index 9 (Math.floor(0.9 * 10))
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("movie/10?"), // Movie with id 10 (index 9)
				expect.any(Object)
			);

			mockRandom.mockRestore();
		});

		it("should return null when no trending movies available", async () => {
			const emptyResponse = {
				page: 1,
				results: [],
				total_pages: 0,
				total_results: 0,
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(emptyResponse));

			const result = await movieService.getFeaturedMovie();

			expect(result).toBeNull();
		});

		it("should return null when getTrendingMovies fails", async () => {
			const errorResponse = {
				status_message: "Service unavailable",
				status_code: 503,
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(errorResponse, 503));

			const result = await movieService.getFeaturedMovie();

			expect(result).toBeNull();
		});
	});

	describe("Error Handling", () => {
		it("should handle network errors gracefully", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			await expect(movieService.getGenres()).rejects.toThrow("Network error");
		});

		it("should handle malformed JSON responses", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.reject(new Error("Malformed JSON")),
			} as Response);

			await expect(movieService.getGenres()).rejects.toThrow("Malformed JSON");
		});

		it("should include error details in thrown errors", async () => {
			const errorResponse = {
				status_message: "The resource you requested could not be found.",
				status_code: 34,
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(errorResponse, 404));

			await expect(movieService.getTrendingMovies()).rejects.toThrow(
				"Failed to fetch data from TMDB"
			);
		});
	});

	describe("URL Construction", () => {
		it("should construct correct API URLs with parameters", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			await movieService.getMoviesByGenre(28, 2);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("with_genres=28"),
				expect.any(Object)
			);
		});

		it("should handle boolean parameters correctly", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			await movieService.getTrendingMovies(1);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("api_key=test-api-key"),
				expect.any(Object)
			);
		});
	});

	describe("Image URL Construction", () => {
		it("should construct correct image URLs", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						overview: "Overview",
						poster_path: "/test-poster.jpg",
						backdrop_path: "/test-backdrop.jpg",
						vote_average: 8.5,
						vote_count: 1000,
						release_date: "2023-01-01",
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.getTrendingMovies();

			expect(result.results[0].poster_path).toBe(
				"https://image.tmdb.org/t/p/w500/test-poster.jpg"
			);
			expect(result.results[0].backdrop_path).toBe(
				"https://image.tmdb.org/t/p/w1280/test-backdrop.jpg"
			);
		});

		it("should handle null image paths", async () => {
			const rawResponse = {
				...mockPaginatedResponse,
				results: [
					{
						id: 1,
						title: "Test Movie",
						poster_path: null,
						backdrop_path: null,
						genre_ids: [],
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(rawResponse));

			const result = await movieService.getTrendingMovies();

			expect(result.results[0].poster_path).toBeNull();
			expect(result.results[0].backdrop_path).toBeNull();
		});
	});
});
