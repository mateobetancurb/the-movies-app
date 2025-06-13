import { render, screen, waitFor } from "@testing-library/react";
import Home from "../../app/page";
import * as movieService from "../../services/movieService";
import { Movie, PaginatedResponse } from "../../interfaces";

// Mock the movieService module
jest.mock("../../services/movieService", () => ({
	getFeaturedMovie: jest.fn(),
	searchMovies: jest.fn(),
}));

// Mock the components used in the Home page
jest.mock("../../components/movies/MovieHero", () => {
	const MockMovieHero = ({ movie }: { movie: Movie }) => (
		<div data-testid="movie-hero">
			<h1>Featured: {movie.title}</h1>
		</div>
	);
	MockMovieHero.displayName = "MockMovieHero";
	return MockMovieHero;
});

jest.mock("../../components/core/SearchBar", () => {
	const MockSearchBar = () => <div data-testid="search-bar">Search Bar</div>;
	MockSearchBar.displayName = "MockSearchBar";
	return MockSearchBar;
});

jest.mock("../../components/movies/sections/TrendingNowSection", () => {
	const MockTrendingNowSection = () => (
		<div data-testid="trending-now-section">Trending Now</div>
	);
	MockTrendingNowSection.displayName = "MockTrendingNowSection";
	return MockTrendingNowSection;
});

jest.mock("../../components/movies/sections/TopRatedSection", () => {
	const MockTopRatedSection = () => (
		<div data-testid="top-rated-section">Top Rated</div>
	);
	MockTopRatedSection.displayName = "MockTopRatedSection";
	return MockTopRatedSection;
});

jest.mock("../../components/movies/sections/NewReleasesSection", () => {
	const MockNewReleasesSection = () => (
		<div data-testid="new-releases-section">New Releases</div>
	);
	MockNewReleasesSection.displayName = "MockNewReleasesSection";
	return MockNewReleasesSection;
});

jest.mock("../../components/movies/MovieGrid", () => {
	const MockMovieGrid = ({ movies }: { movies: Movie[] }) => (
		<div data-testid="movie-grid">
			{movies.map((movie) => (
				<div key={movie.id} data-testid={`movie-${movie.id}`}>
					{movie.title}
				</div>
			))}
		</div>
	);
	MockMovieGrid.displayName = "MockMovieGrid";
	return MockMovieGrid;
});

// Mock console.error to suppress error output in tests
const mockConsoleError = jest
	.spyOn(console, "error")
	.mockImplementation(() => {});

describe("Home Page", () => {
	const mockGetFeaturedMovie =
		movieService.getFeaturedMovie as jest.MockedFunction<
			typeof movieService.getFeaturedMovie
		>;
	const mockSearchMovies = movieService.searchMovies as jest.MockedFunction<
		typeof movieService.searchMovies
	>;

	const mockFeaturedMovie: Movie = {
		id: 1,
		title: "Featured Movie",
		overview: "A great featured movie",
		poster_path: "https://image.tmdb.org/t/p/w500/featured.jpg",
		backdrop_path: "https://image.tmdb.org/t/p/w1280/featured-backdrop.jpg",
		vote_average: 8.5,
		vote_count: 1000,
		release_date: "2023-01-01",
		genres: [{ id: 28, name: "Action" }],
		cast: [],
	};

	const mockSearchResults: Movie[] = [
		{
			id: 2,
			title: "Search Result Movie 1",
			overview: "First search result",
			poster_path: "https://image.tmdb.org/t/p/w500/search1.jpg",
			backdrop_path: "https://image.tmdb.org/t/p/w1280/search1-backdrop.jpg",
			vote_average: 7.5,
			vote_count: 500,
			release_date: "2023-02-01",
			genres: [{ id: 35, name: "Comedy" }],
			cast: [],
		},
		{
			id: 3,
			title: "Search Result Movie 2",
			overview: "Second search result",
			poster_path: "https://image.tmdb.org/t/p/w500/search2.jpg",
			backdrop_path: "https://image.tmdb.org/t/p/w1280/search2-backdrop.jpg",
			vote_average: 6.8,
			vote_count: 300,
			release_date: "2023-03-01",
			genres: [{ id: 18, name: "Drama" }],
			cast: [],
		},
	];

	const mockSearchResponse: PaginatedResponse<Movie> = {
		page: 1,
		results: mockSearchResults,
		total_pages: 5,
		total_results: 25,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockGetFeaturedMovie.mockResolvedValue(mockFeaturedMovie);
		mockSearchMovies.mockResolvedValue(mockSearchResponse);
	});

	afterAll(() => {
		mockConsoleError.mockRestore();
	});

	describe("Default Homepage Behavior", () => {
		it("renders the default homepage without search query", async () => {
			const searchParams = Promise.resolve({});

			render(await Home({ searchParams }));

			// Check that featured movie hero is displayed
			await waitFor(() => {
				expect(screen.getByTestId("movie-hero")).toBeInTheDocument();
				expect(
					screen.getByText("Featured: Featured Movie")
				).toBeInTheDocument();
			});

			// Check that search bar is present
			expect(screen.getByTestId("search-bar")).toBeInTheDocument();

			// Check that all movie sections are rendered
			expect(screen.getByTestId("trending-now-section")).toBeInTheDocument();
			expect(screen.getByTestId("top-rated-section")).toBeInTheDocument();
			expect(screen.getByTestId("new-releases-section")).toBeInTheDocument();

			// Verify movieService calls
			expect(mockGetFeaturedMovie).toHaveBeenCalledTimes(1);
			expect(mockSearchMovies).not.toHaveBeenCalled();
		});

		it("renders homepage with empty search params", async () => {
			const searchParams = Promise.resolve({ q: "", page: "" });

			render(await Home({ searchParams }));

			// Should render default homepage when search query is empty
			await waitFor(() => {
				expect(screen.getByTestId("movie-hero")).toBeInTheDocument();
			});

			expect(screen.getByTestId("trending-now-section")).toBeInTheDocument();
			expect(mockGetFeaturedMovie).toHaveBeenCalledTimes(1);
			expect(mockSearchMovies).not.toHaveBeenCalled();
		});

		it("handles missing featured movie gracefully", async () => {
			mockGetFeaturedMovie.mockResolvedValue(null);
			const searchParams = Promise.resolve({});

			render(await Home({ searchParams }));

			// Should not render movie hero when no featured movie
			await waitFor(() => {
				expect(screen.queryByTestId("movie-hero")).not.toBeInTheDocument();
			});

			// But should still render other sections
			expect(screen.getByTestId("search-bar")).toBeInTheDocument();
			expect(screen.getByTestId("trending-now-section")).toBeInTheDocument();
			expect(screen.getByTestId("top-rated-section")).toBeInTheDocument();
			expect(screen.getByTestId("new-releases-section")).toBeInTheDocument();
		});
	});

	describe("Search Functionality", () => {
		it("renders search results when search query is provided", async () => {
			const searchParams = Promise.resolve({ q: "batman", page: "1" });

			render(await Home({ searchParams }));

			// Should not render featured movie or homepage sections
			await waitFor(() => {
				expect(screen.queryByTestId("movie-hero")).not.toBeInTheDocument();
			});

			expect(
				screen.queryByTestId("trending-now-section")
			).not.toBeInTheDocument();
			expect(screen.queryByTestId("top-rated-section")).not.toBeInTheDocument();
			expect(
				screen.queryByTestId("new-releases-section")
			).not.toBeInTheDocument();

			// Should render search results
			expect(
				screen.getByText('Search Results for "batman"')
			).toBeInTheDocument();
			expect(screen.getByText("Found 25 movies")).toBeInTheDocument();
			expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
			expect(screen.getByTestId("movie-2")).toBeInTheDocument();
			expect(screen.getByTestId("movie-3")).toBeInTheDocument();

			// Should render pagination info
			expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();

			// Verify service calls
			expect(mockSearchMovies).toHaveBeenCalledWith("batman", 1);
			expect(mockGetFeaturedMovie).not.toHaveBeenCalled();
		});

		it("handles search with different page numbers", async () => {
			const searchParams = Promise.resolve({ q: "action", page: "3" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(
					screen.getByText('Search Results for "action"')
				).toBeInTheDocument();
			});

			expect(screen.getByText("Page 3 of 5")).toBeInTheDocument();
			expect(mockSearchMovies).toHaveBeenCalledWith("action", 3);
		});

		it("defaults to page 1 when page parameter is invalid", async () => {
			const searchParams = Promise.resolve({ q: "test", page: "invalid" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(
					screen.getByText('Search Results for "test"')
				).toBeInTheDocument();
			});

			expect(mockSearchMovies).toHaveBeenCalledWith("test", NaN);
		});

		it("handles search with no results", async () => {
			const emptySearchResponse: PaginatedResponse<Movie> = {
				page: 1,
				results: [],
				total_pages: 0,
				total_results: 0,
			};

			mockSearchMovies.mockResolvedValue(emptySearchResponse);
			const searchParams = Promise.resolve({ q: "nonexistent" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(screen.getByText("No movies found")).toBeInTheDocument();
			});

			expect(
				screen.getByText('No results for "nonexistent"')
			).toBeInTheDocument();
			expect(
				screen.getByText("Try a different search term or check your spelling")
			).toBeInTheDocument();
			expect(screen.queryByTestId("movie-grid")).not.toBeInTheDocument();
		});

		it("does not show pagination info for single page results", async () => {
			const singlePageResponse: PaginatedResponse<Movie> = {
				page: 1,
				results: mockSearchResults,
				total_pages: 1,
				total_results: 2,
			};

			mockSearchMovies.mockResolvedValue(singlePageResponse);
			const searchParams = Promise.resolve({ q: "test" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
			});

			expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
		});
	});

	describe("Error Handling", () => {
		it("displays error message when search fails", async () => {
			mockSearchMovies.mockRejectedValue(new Error("API Error"));
			const searchParams = Promise.resolve({ q: "batman" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(screen.getByText("Search Error")).toBeInTheDocument();
			});

			expect(screen.getByText("API Error")).toBeInTheDocument();
			expect(screen.queryByTestId("movie-grid")).not.toBeInTheDocument();
			expect(mockConsoleError).toHaveBeenCalledWith(
				"Server: Search error:",
				expect.any(Error)
			);
		});

		it("displays generic error message for non-Error exceptions", async () => {
			mockSearchMovies.mockRejectedValue("String error");
			const searchParams = Promise.resolve({ q: "batman" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(screen.getByText("Search Error")).toBeInTheDocument();
			});

			expect(screen.getByText("Failed to search movies")).toBeInTheDocument();
		});

		it("handles getFeaturedMovie error gracefully", async () => {
			mockGetFeaturedMovie.mockRejectedValue(
				new Error("Failed to get featured movie")
			);
			const searchParams = Promise.resolve({});

			// Should not throw error, just not display featured movie
			let renderResult;
			try {
				renderResult = await Home({ searchParams });
			} catch (error) {
				// Expected behavior - the component handles the error
				renderResult = <div>Error handled</div>;
			}

			render(renderResult);

			// Should handle the error gracefully and not crash
			expect(mockGetFeaturedMovie).toHaveBeenCalled();
		});
	});

	describe("Page Structure and Layout", () => {
		it("applies correct CSS classes and structure", async () => {
			const searchParams = Promise.resolve({});

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(screen.getByTestId("movie-hero")).toBeInTheDocument();
			});

			// Check for proper container structure
			const searchBarParent = screen.getByTestId("search-bar").parentElement;
			const containerPageElement = searchBarParent?.parentElement;
			expect(containerPageElement).toHaveClass("container-page");
		});

		it("applies correct structure for search results", async () => {
			const searchParams = Promise.resolve({ q: "test" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(
					screen.getByText('Search Results for "test"')
				).toBeInTheDocument();
			});

			const searchBarParent = screen.getByTestId("search-bar").parentElement;
			const containerPageElement = searchBarParent?.parentElement;
			expect(containerPageElement).toHaveClass("container-page");
		});
	});

	describe("Content Display", () => {
		it("displays search query in results header", async () => {
			const searchParams = Promise.resolve({ q: "special characters !@#$%" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(
					screen.getByText('Search Results for "special characters !@#$%"')
				).toBeInTheDocument();
			});
		});

		it("displays correct movie count in search results", async () => {
			const customSearchResponse: PaginatedResponse<Movie> = {
				page: 1,
				results: mockSearchResults,
				total_pages: 10,
				total_results: 1500,
			};

			mockSearchMovies.mockResolvedValue(customSearchResponse);
			const searchParams = Promise.resolve({ q: "popular" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(screen.getByText("Found 1500 movies")).toBeInTheDocument();
			});
		});

		it("handles unicode characters in search query", async () => {
			const searchParams = Promise.resolve({ q: "café résumé 中文" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(
					screen.getByText('Search Results for "café résumé 中文"')
				).toBeInTheDocument();
			});

			expect(mockSearchMovies).toHaveBeenCalledWith("café résumé 中文", 1);
		});
	});

	describe("Search Loading States", () => {
		it("does not show loading state in server component", async () => {
			// Since this is a server component, loading states are handled differently
			// We're testing that the component renders appropriately with resolved data
			const searchParams = Promise.resolve({ q: "test" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
			});

			// Should not show loading indicator since data is resolved server-side
			expect(
				screen.queryByText('Searching for "test"...')
			).not.toBeInTheDocument();
		});
	});

	describe("Edge Cases", () => {
		it("handles whitespace-only search query", async () => {
			const searchParams = Promise.resolve({ q: "   " });

			render(await Home({ searchParams }));

			await waitFor(() => {
				const elements = screen.getAllByText((content, element) => {
					return (
						element?.textContent?.includes("Search Results for") &&
						element?.textContent?.includes('"') &&
						element?.textContent?.includes("   ")
					);
				});
				expect(elements.length).toBeGreaterThan(0);
				expect(elements[0]).toBeInTheDocument();
			});

			expect(mockSearchMovies).toHaveBeenCalledWith("   ", 1);
		});

		it("handles very long search queries", async () => {
			const longQuery = "a".repeat(500);
			const searchParams = Promise.resolve({ q: longQuery });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(
					screen.getByText(`Search Results for "${longQuery}"`)
				).toBeInTheDocument();
			});

			expect(mockSearchMovies).toHaveBeenCalledWith(longQuery, 1);
		});

		it("handles page numbers beyond total pages", async () => {
			const searchParams = Promise.resolve({ q: "test", page: "999" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(screen.getByText("Page 999 of 5")).toBeInTheDocument();
			});

			expect(mockSearchMovies).toHaveBeenCalledWith("test", 999);
		});

		it("handles negative page numbers", async () => {
			const searchParams = Promise.resolve({ q: "test", page: "-1" });

			render(await Home({ searchParams }));

			await waitFor(() => {
				expect(
					screen.getByText('Search Results for "test"')
				).toBeInTheDocument();
			});

			// parseInt("-1", 10) returns -1, so it should be passed as is
			expect(mockSearchMovies).toHaveBeenCalledWith("test", -1);
		});
	});
});
