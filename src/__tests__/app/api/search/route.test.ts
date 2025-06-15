/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "../../../../app/api/search/route";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock environment variables
const originalEnv = process.env;

describe("Search API Route", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockFetch.mockClear();

		// Reset environment variables
		process.env = {
			...originalEnv,
			TMDB_API_KEY: "test-api-key",
			TMDB_BASE_URL: "https://api.themoviedb.org/3",
			TMDB_IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
		};
	});

	afterAll(() => {
		process.env = originalEnv;
	});

	const createMockRequest = (searchParams: URLSearchParams) => {
		const url = `http://localhost:3000/api/search?${searchParams.toString()}`;
		return new NextRequest(url);
	};

	const createMockResponse = (data: any, status = 200) =>
		Promise.resolve({
			ok: status >= 200 && status < 300,
			status,
			statusText: status === 200 ? "OK" : "Error",
			json: () => Promise.resolve(data),
		} as Response);

	const mockTMDBResponse = {
		total_results: 2,
		results: [
			{
				id: 1,
				title: "Test Movie 1",
				overview: "A test movie overview",
				poster_path: "/test-poster-1.jpg",
				backdrop_path: "/test-backdrop-1.jpg",
				release_date: "2023-01-01",
				vote_average: 8.5,
				vote_count: 1000,
				genre_ids: [28, 35],
				adult: false,
				original_language: "en",
				original_title: "Test Movie 1",
				popularity: 100.5,
				video: false,
			},
			{
				id: 2,
				title: "Test Movie 2",
				overview: "Another test movie",
				poster_path: null,
				backdrop_path: null,
				release_date: "2023-02-01",
				vote_average: 7.2,
				vote_count: 500,
				genre_ids: [18],
				adult: false,
				original_language: "es",
				original_title: "Película de Prueba 2",
				popularity: 85.3,
				video: false,
			},
		],
	};

	describe("GET /api/search", () => {
		it("should return search results successfully", async () => {
			mockFetch.mockResolvedValueOnce(createMockResponse(mockTMDBResponse));

			const searchParams = new URLSearchParams({ q: "test movie" });
			const request = createMockRequest(searchParams);

			const response = await GET(request);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual({
				total_results: 2,
				results: [
					{
						id: 1,
						title: "Test Movie 1",
						overview: "A test movie overview",
						poster_path: "https://image.tmdb.org/t/p/w500/test-poster-1.jpg",
						backdrop_path:
							"https://image.tmdb.org/t/p/w1280/test-backdrop-1.jpg",
						release_date: "2023-01-01",
						vote_average: 8.5,
						vote_count: 1000,
						genre_ids: [28, 35],
						genres: [],
						cast: [],
						adult: false,
						original_language: "en",
						original_title: "Test Movie 1",
						popularity: 100.5,
						video: false,
					},
					{
						id: 2,
						title: "Test Movie 2",
						overview: "Another test movie",
						poster_path: null,
						backdrop_path: null,
						release_date: "2023-02-01",
						vote_average: 7.2,
						vote_count: 500,
						genre_ids: [18],
						genres: [],
						cast: [],
						adult: false,
						original_language: "es",
						original_title: "Película de Prueba 2",
						popularity: 85.3,
						video: false,
					},
				],
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.themoviedb.org/3/search/movie?api_key=test-api-key&query=test%20movie&page=1"
			);
		});

		it("should handle search with pagination", async () => {
			mockFetch.mockResolvedValueOnce(createMockResponse(mockTMDBResponse));

			const searchParams = new URLSearchParams({ q: "batman", page: "2" });
			const request = createMockRequest(searchParams);

			const response = await GET(request);

			expect(response.status).toBe(200);
			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.themoviedb.org/3/search/movie?api_key=test-api-key&query=batman&page=2"
			);
		});

		it("should return 400 error when query parameter is missing", async () => {
			const searchParams = new URLSearchParams();
			const request = createMockRequest(searchParams);

			const response = await GET(request);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data).toEqual({
				error: "Missing query parameter",
			});
		});

		it("should return 500 error when API key is missing", async () => {
			delete process.env.TMDB_API_KEY;

			const searchParams = new URLSearchParams({ q: "test" });
			const request = createMockRequest(searchParams);

			const response = await GET(request);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data).toEqual({
				error: "API configuration error",
			});
		});

		it("should handle TMDB API errors", async () => {
			mockFetch.mockResolvedValueOnce(createMockResponse({}, 401));

			const searchParams = new URLSearchParams({ q: "test" });
			const request = createMockRequest(searchParams);

			const response = await GET(request);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.error).toContain("HTTP error! status: 401");
		});

		it("should handle network errors", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			const searchParams = new URLSearchParams({ q: "test" });
			const request = createMockRequest(searchParams);

			const response = await GET(request);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.error).toBe("Network error");
		});

		it("should handle fetch exceptions", async () => {
			mockFetch.mockRejectedValueOnce("Unexpected error");

			const searchParams = new URLSearchParams({ q: "test" });
			const request = createMockRequest(searchParams);

			const response = await GET(request);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.error).toBe("Failed to search movies");
		});

		it("should use default values for missing optional fields", async () => {
			const minimalTMDBResponse = {
				total_results: 1,
				results: [
					{
						id: 1,
						title: "Minimal Movie",
						poster_path: "/poster.jpg",
						backdrop_path: "/backdrop.jpg",
					},
				],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(minimalTMDBResponse));

			const searchParams = new URLSearchParams({ q: "minimal" });
			const request = createMockRequest(searchParams);

			const response = await GET(request);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.results[0]).toMatchObject({
				id: 1,
				title: "Minimal Movie",
				poster_path: "https://image.tmdb.org/t/p/w500/poster.jpg",
				backdrop_path: "https://image.tmdb.org/t/p/w1280/backdrop.jpg",
				genre_ids: [],
				genres: [],
				cast: [],
				video: false,
			});
		});

		it("should handle empty search results", async () => {
			const emptyResponse = {
				total_results: 0,
				results: [],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(emptyResponse));

			const searchParams = new URLSearchParams({ q: "nonexistent" });
			const request = createMockRequest(searchParams);

			const response = await GET(request);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual({
				total_results: 0,
				results: [],
			});
		});

		it("should handle missing total_results in TMDB response", async () => {
			const responseWithoutTotal = {
				results: [],
			};

			mockFetch.mockResolvedValueOnce(createMockResponse(responseWithoutTotal));

			const searchParams = new URLSearchParams({ q: "test" });
			const request = createMockRequest(searchParams);

			const response = await GET(request);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.total_results).toBe(0);
		});

		it("should use default base URLs when environment variables are not set", async () => {
			delete process.env.TMDB_BASE_URL;
			delete process.env.TMDB_IMAGE_BASE_URL;

			mockFetch.mockResolvedValueOnce(createMockResponse(mockTMDBResponse));

			const searchParams = new URLSearchParams({ q: "test" });
			const request = createMockRequest(searchParams);

			const response = await GET(request);

			expect(response.status).toBe(200);
			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.themoviedb.org/3/search/movie?api_key=test-api-key&query=test&page=1"
			);
		});

		it("should properly encode query parameters", async () => {
			mockFetch.mockResolvedValueOnce(createMockResponse(mockTMDBResponse));

			const searchParams = new URLSearchParams({
				q: "spider-man: no way home",
			});
			const request = createMockRequest(searchParams);

			await GET(request);

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.themoviedb.org/3/search/movie?api_key=test-api-key&query=spider-man%3A%20no%20way%20home&page=1"
			);
		});
	});
});
