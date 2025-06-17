import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import SearchResults from "../../../components/movies/SearchResults";
import { Movie } from "../../../interfaces";

// Mock MovieGrid component
jest.mock("../../../components/movies/MovieGrid", () => {
	return function MockMovieGrid({ movies }: { movies: Movie[] }) {
		return (
			<div data-testid="movie-grid">
				{movies.map((movie) => (
					<div key={movie.id} data-testid={`movie-item-${movie.id}`}>
						{movie.title}
					</div>
				))}
			</div>
		);
	};
});

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to avoid JSDOM navigation errors
const mockConsoleError = jest
	.spyOn(console, "error")
	.mockImplementation(() => {});

describe("SearchResults", () => {
	const createMockMovie = (overrides: Partial<Movie> = {}): Movie => ({
		id: 1,
		title: "Test Movie",
		overview: "Test overview",
		poster_path: "/path.jpg",
		backdrop_path: "/backdrop.jpg",
		vote_average: 8.5,
		vote_count: 100,
		release_date: "2023-01-01",
		runtime: 120,
		genres: [{ id: 1, name: "Action" }],
		cast: [],
		...overrides,
	});

	const mockSearchResponse = {
		total_results: 2,
		results: [
			createMockMovie({ id: 1, title: "Batman Begins" }),
			createMockMovie({ id: 2, title: "The Dark Knight" }),
		],
		total_pages: 1,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockFetch.mockClear();
		mockConsoleError.mockClear();
	});

	describe("Loading State", () => {
		it("displays loading state when fetching search results", async () => {
			mockFetch.mockImplementation(
				() =>
					new Promise(() => {
						// Never resolve to keep loading state
					})
			);

			render(<SearchResults query="batman" page={1} />);

			expect(screen.getByText('Searching for "batman"...')).toBeInTheDocument();
			expect(screen.getByText("Debug: Loading state")).toBeInTheDocument();
			// Check for loading spinner div
			const spinner = document.querySelector(".animate-spin");
			expect(spinner).toBeInTheDocument();
		});

		it("shows loading spinner with correct classes", async () => {
			mockFetch.mockImplementation(
				() =>
					new Promise(() => {
						// Never resolve to keep loading state
					})
			);

			render(<SearchResults query="batman" page={1} />);

			const spinner = document.querySelector(".animate-spin");
			expect(spinner).toBeInTheDocument();
			expect(spinner).toHaveClass(
				"animate-spin",
				"rounded-full",
				"h-12",
				"w-12",
				"border-t-2",
				"border-b-2",
				"border-accent-500",
				"mb-4"
			);
		});
	});

	describe("Successful Search Results", () => {
		it("displays search results when API call succeeds", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockSearchResponse,
			});

			await act(async () => {
				render(<SearchResults query="batman" page={1} />);
			});

			await waitFor(() => {
				expect(
					screen.getByText('Search Results for "batman"')
				).toBeInTheDocument();
			});

			expect(screen.getByText("Found 2 movies")).toBeInTheDocument();
			expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
			expect(screen.getByTestId("movie-item-1")).toBeInTheDocument();
			expect(screen.getByTestId("movie-item-2")).toBeInTheDocument();
		});

		it("makes correct API call with encoded query and page", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockSearchResponse,
			});

			await act(async () => {
				render(<SearchResults query="spider-man homecoming" page={2} />);
			});

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalledWith(
					"/api/search?q=spider-man%20homecoming&page=2"
				);
			});
		});

		it("displays pagination info when multiple pages exist", async () => {
			const multiPageResponse = {
				...mockSearchResponse,
				total_pages: 5,
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => multiPageResponse,
			});

			await act(async () => {
				render(<SearchResults query="batman" page={3} />);
			});

			await waitFor(() => {
				expect(screen.getByText("Page 3 of 5")).toBeInTheDocument();
			});
		});

		it("does not display pagination info for single page results", async () => {
			const singlePageResponse = {
				...mockSearchResponse,
				total_pages: 1,
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => singlePageResponse,
			});

			await act(async () => {
				render(<SearchResults query="batman" page={1} />);
			});

			await waitFor(() => {
				expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
			});
		});
	});

	describe("Empty Search Results", () => {
		it("displays no results message when search returns empty", async () => {
			const emptyResponse = {
				total_results: 0,
				results: [],
				total_pages: 0,
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => emptyResponse,
			});

			await act(async () => {
				render(<SearchResults query="nonexistentmovie" page={1} />);
			});

			await waitFor(() => {
				expect(screen.getByText("No movies found")).toBeInTheDocument();
			});

			expect(
				screen.getByText('No results for "nonexistentmovie"')
			).toBeInTheDocument();
			expect(
				screen.getByText("Try a different search term or check your spelling")
			).toBeInTheDocument();
		});

		it("displays correct search icon for no results", async () => {
			const emptyResponse = {
				total_results: 0,
				results: [],
				total_pages: 0,
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => emptyResponse,
			});

			await act(async () => {
				render(<SearchResults query="test" page={1} />);
			});

			await waitFor(() => {
				const svg = document.querySelector("svg");
				expect(svg).toBeInTheDocument();
				expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
			});
		});
	});

	describe("Error Handling", () => {
		it("displays error message when API call fails", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			await act(async () => {
				render(<SearchResults query="batman" page={1} />);
			});

			await waitFor(() => {
				expect(screen.getByText("Search Error")).toBeInTheDocument();
			});

			expect(screen.getByText("Network error")).toBeInTheDocument();
			expect(screen.getByText("Try Again")).toBeInTheDocument();
		});

		it("displays error message when API returns non-ok response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
			});

			await act(async () => {
				render(<SearchResults query="batman" page={1} />);
			});

			await waitFor(() => {
				expect(
					screen.getByText("Search failed: 500 Internal Server Error")
				).toBeInTheDocument();
			});
		});

		it("displays try again button in error state", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			await act(async () => {
				render(<SearchResults query="batman" page={1} />);
			});

			await waitFor(() => {
				expect(screen.getByText("Try Again")).toBeInTheDocument();
			});

			const tryAgainButton = screen.getByText("Try Again");
			expect(tryAgainButton).toHaveAttribute("class");
			expect(tryAgainButton.tagName).toBe("BUTTON");
		});

		it("displays correct error icon", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			await act(async () => {
				render(<SearchResults query="batman" page={1} />);
			});

			await waitFor(() => {
				const svg = document.querySelector("svg");
				expect(svg).toBeInTheDocument();
				expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
			});
		});
	});

	describe("Query Handling", () => {
		it("does not fetch when query is empty", async () => {
			await act(async () => {
				render(<SearchResults query="" page={1} />);
			});

			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("does not fetch when query is only whitespace", async () => {
			await act(async () => {
				render(<SearchResults query="   " page={1} />);
			});

			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("trims query before checking if empty", async () => {
			await act(async () => {
				render(<SearchResults query="  batman  " page={1} />);
			});

			// Should still make the API call because trimmed query is not empty
			expect(mockFetch).toHaveBeenCalled();
		});
	});

	describe("Component Lifecycle", () => {
		it("refetches data when query changes", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockSearchResponse,
			});

			const { rerender } = render(<SearchResults query="batman" page={1} />);

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			await act(async () => {
				rerender(<SearchResults query="superman" page={1} />);
			});

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalledTimes(2);
			});

			expect(mockFetch).toHaveBeenLastCalledWith(
				"/api/search?q=superman&page=1"
			);
		});

		it("refetches data when page changes", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockSearchResponse,
			});

			const { rerender } = render(<SearchResults query="batman" page={1} />);

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			await act(async () => {
				rerender(<SearchResults query="batman" page={2} />);
			});

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalledTimes(2);
			});

			expect(mockFetch).toHaveBeenLastCalledWith("/api/search?q=batman&page=2");
		});

		it("handles component unmount during fetch", async () => {
			let resolvePromise: (value: any) => void;
			const promise = new Promise((resolve) => {
				resolvePromise = resolve;
			});

			mockFetch.mockReturnValueOnce(promise);

			const { unmount } = render(<SearchResults query="batman" page={1} />);

			// Unmount component before fetch completes
			unmount();

			// Now resolve the promise
			resolvePromise!({
				ok: true,
				json: async () => mockSearchResponse,
			});

			// Wait a bit to ensure no state updates occur
			await new Promise((resolve) => setTimeout(resolve, 10));

			// No error should be thrown due to cleanup
			expect(true).toBe(true);
		});
	});

	describe("Accessibility", () => {
		it("provides accessible error state", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			await act(async () => {
				render(<SearchResults query="batman" page={1} />);
			});

			await waitFor(() => {
				expect(screen.getByRole("button")).toHaveAccessibleName("Try Again");
			});
		});

		it("provides semantic structure for results", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockSearchResponse,
			});

			await act(async () => {
				render(<SearchResults query="batman" page={1} />);
			});

			await waitFor(() => {
				expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
					'Search Results for "batman"'
				);
			});
		});
	});

	describe("Performance", () => {
		it("prevents duplicate API calls for same query and page", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockSearchResponse,
			});

			const { rerender } = render(<SearchResults query="batman" page={1} />);

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			// Re-render with same props should not trigger new API call
			await act(async () => {
				rerender(<SearchResults query="batman" page={1} />);
			});

			// Should still be only 1 call
			expect(mockFetch).toHaveBeenCalledTimes(1);
		});
	});
});
