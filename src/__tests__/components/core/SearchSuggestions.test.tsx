import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchSuggestions from "../../../components/core/SearchSuggestions";

// Mock localStorage
const mockLocalStorage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Mock fetch
global.fetch = jest.fn();

// Mock console.error to suppress error output in tests
const mockConsoleError = jest
	.spyOn(console, "error")
	.mockImplementation(() => {});

describe("SearchSuggestions", () => {
	const mockOnSuggestionClick = jest.fn();
	const defaultProps = {
		onSuggestionClick: mockOnSuggestionClick,
		isVisible: true,
		query: "",
	};

	beforeEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
		mockLocalStorage.getItem.mockReturnValue(null);
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ results: [] }),
		});
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	afterAll(() => {
		mockConsoleError.mockRestore();
	});

	describe("Visibility Control", () => {
		it("does not render when isVisible is false", () => {
			render(<SearchSuggestions {...defaultProps} isVisible={false} />);
			expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
		});

		it("renders when isVisible is true", () => {
			render(<SearchSuggestions {...defaultProps} isVisible={true} />);
			expect(screen.getByRole("complementary")).toBeInTheDocument();
		});
	});

	describe("Empty State Handling", () => {
		it("shows popular searches when query is empty", () => {
			render(<SearchSuggestions {...defaultProps} />);
			expect(screen.getByText("Popular Searches")).toBeInTheDocument();
		});

		it("shows no suggestions message when query has only whitespace", () => {
			render(<SearchSuggestions {...defaultProps} query="   " />);
			// Use getAllByText to handle potential multiple elements due to React StrictMode
			const noSuggestionsElements = screen.getAllByText((content, element) => {
				return element?.textContent === 'No suggestions found for "   "';
			});
			expect(noSuggestionsElements.length).toBeGreaterThanOrEqual(1);
			expect(noSuggestionsElements[0]).toBeInTheDocument();
		});
	});

	describe("Recent Searches", () => {
		it("loads and displays recent searches from localStorage", () => {
			const recentSearches = ["Batman", "Superman"];
			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(recentSearches));

			render(<SearchSuggestions {...defaultProps} />);

			expect(screen.getByText("Recent Searches")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Recent search: Batman" })
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Recent search: Superman" })
			).toBeInTheDocument();
		});

		it("handles malformed localStorage data gracefully", () => {
			mockLocalStorage.getItem.mockReturnValue("invalid json");

			render(<SearchSuggestions {...defaultProps} />);

			expect(mockConsoleError).toHaveBeenCalledWith(
				"Error loading recent searches:",
				expect.any(Error)
			);
			expect(screen.queryByText("Recent Searches")).not.toBeInTheDocument();
		});

		it("saves search to recent searches when clicked", async () => {
			const user = userEvent.setup();
			const recentSearches = ["Old Search"];
			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(recentSearches));

			render(<SearchSuggestions {...defaultProps} query="act" />);

			// Wait for popular searches to appear
			await waitFor(() => {
				expect(screen.getByText("Popular Searches")).toBeInTheDocument();
			});

			const suggestion = screen.getByRole("button", {
				name: /Popular search: Action/i,
			});
			await user.click(suggestion);

			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				"recentMovieSearches",
				JSON.stringify(["Action", "Old Search"])
			);
			expect(mockOnSuggestionClick).toHaveBeenCalledWith("Action");
		});

		it("limits recent searches to 5 items when saving new search", async () => {
			const user = userEvent.setup();
			const existingSearches = [
				"Search1",
				"Search2",
				"Search3",
				"Search4",
				"Search5",
			];
			mockLocalStorage.getItem.mockReturnValue(
				JSON.stringify(existingSearches)
			);

			render(<SearchSuggestions {...defaultProps} query="act" />);

			await waitFor(() => {
				expect(screen.getByText("Popular Searches")).toBeInTheDocument();
			});

			const suggestion = screen.getByRole("button", {
				name: /Popular search: Action/i,
			});
			await user.click(suggestion);

			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				"recentMovieSearches",
				JSON.stringify(["Action", "Search1", "Search2", "Search3", "Search4"])
			);
		});

		it("moves existing search to top when clicked again", async () => {
			const user = userEvent.setup();
			const existingSearches = ["Search1", "Search2", "Search3"];
			mockLocalStorage.getItem.mockReturnValue(
				JSON.stringify(existingSearches)
			);

			render(<SearchSuggestions {...defaultProps} query="search2" />);

			await waitFor(() => {
				expect(screen.getByText("Recent Searches")).toBeInTheDocument();
			});

			const suggestion = screen.getByRole("button", {
				name: /Recent search: Search2/i,
			});
			await user.click(suggestion);

			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				"recentMovieSearches",
				JSON.stringify(["Search2", "Search1", "Search3"])
			);
		});

		it("clears recent searches when clear button is clicked", async () => {
			const user = userEvent.setup();
			const recentSearches = ["Batman", "Superman"];
			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(recentSearches));

			render(<SearchSuggestions {...defaultProps} />);

			const clearButton = screen.getByRole("button", {
				name: "Clear recent searches",
			});
			await user.click(clearButton);

			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
				"recentMovieSearches"
			);
			expect(screen.queryByText("Recent Searches")).not.toBeInTheDocument();
		});

		it("filters recent searches based on query", () => {
			const recentSearches = ["Batman", "Superman", "Spider-Man"];
			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(recentSearches));

			render(<SearchSuggestions {...defaultProps} query="man" />);

			expect(screen.getByText("Recent Searches")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Recent search: Batman" })
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Recent search: Superman" })
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Recent search: Spider-Man" })
			).toBeInTheDocument();
		});
	});

	describe("Movie Suggestions API", () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		it("fetches and displays movie suggestions when query length >= 2", async () => {
			const mockMovies = [
				{ id: 1, title: "Test Movie 1" },
				{ id: 2, title: "Test Movie 2" },
			];
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ results: mockMovies }),
			});

			render(<SearchSuggestions {...defaultProps} query="test" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(screen.getByText("Movies")).toBeInTheDocument();
				expect(
					screen.getByRole("button", { name: "Movie suggestion: Test Movie 1" })
				).toBeInTheDocument();
				expect(
					screen.getByRole("button", { name: "Movie suggestion: Test Movie 2" })
				).toBeInTheDocument();
			});

			expect(global.fetch).toHaveBeenCalledWith("/api/search?q=test&page=1");
		});

		it("does not fetch suggestions for queries shorter than 2 characters", async () => {
			render(<SearchSuggestions {...defaultProps} query="t" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(global.fetch).not.toHaveBeenCalled();
			});
		});

		it("debounces API calls when typing rapidly", async () => {
			const { rerender } = render(
				<SearchSuggestions {...defaultProps} query="t" />
			);
			rerender(<SearchSuggestions {...defaultProps} query="te" />);
			rerender(<SearchSuggestions {...defaultProps} query="tes" />);
			rerender(<SearchSuggestions {...defaultProps} query="test" />);

			expect(global.fetch).not.toHaveBeenCalled();

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(global.fetch).toHaveBeenCalledTimes(1);
			});
		});

		it("shows loading state while fetching movie suggestions", async () => {
			let resolvePromise: (value: any) => void;
			const mockPromise = new Promise((resolve) => {
				resolvePromise = resolve;
			});
			(global.fetch as jest.Mock).mockReturnValue(mockPromise);

			render(<SearchSuggestions {...defaultProps} query="test" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(
					screen.getByRole("status", { name: "Searching movies" })
				).toBeInTheDocument();
				expect(screen.getByText("Searching movies...")).toBeInTheDocument();
			});

			// Resolve the promise
			act(() => {
				resolvePromise!({
					ok: true,
					json: () => Promise.resolve({ results: [] }),
				});
			});

			await waitFor(() => {
				expect(
					screen.queryByRole("status", { name: "Searching movies" })
				).not.toBeInTheDocument();
			});
		});

		it("handles fetch errors gracefully", async () => {
			(global.fetch as jest.Mock).mockRejectedValueOnce(
				new Error("Network error")
			);

			render(<SearchSuggestions {...defaultProps} query="test" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(mockConsoleError).toHaveBeenCalledWith(
					"Error fetching movie suggestions:",
					expect.any(Error)
				);
			});
		});

		it("handles non-ok HTTP responses gracefully", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: false,
				status: 500,
			});

			render(<SearchSuggestions {...defaultProps} query="test" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(
					screen.getByText('No suggestions found for "test"')
				).toBeInTheDocument();
			});
		});

		it("limits movie suggestions to 6 items", async () => {
			const mockMovies = Array.from({ length: 10 }, (_, i) => ({
				id: i + 1,
				title: `Movie ${i + 1}`,
			}));
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ results: mockMovies }),
			});

			render(<SearchSuggestions {...defaultProps} query="movie" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(screen.getByText("Movies")).toBeInTheDocument();
				// Should only show first 6 movies
				for (let i = 1; i <= 6; i++) {
					expect(
						screen.getByRole("button", { name: `Movie suggestion: Movie ${i}` })
					).toBeInTheDocument();
				}
				// Should not show movies 7-10
				for (let i = 7; i <= 10; i++) {
					expect(
						screen.queryByRole("button", {
							name: `Movie suggestion: Movie ${i}`,
						})
					).not.toBeInTheDocument();
				}
			});
		});

		it("clears suggestions when query becomes too short", async () => {
			const { rerender } = render(
				<SearchSuggestions {...defaultProps} query="test" />
			);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			// Now change to short query
			rerender(<SearchSuggestions {...defaultProps} query="t" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(screen.queryByText("Movies")).not.toBeInTheDocument();
			});
		});
	});

	describe("Popular Searches", () => {
		it("filters popular searches based on query", () => {
			render(<SearchSuggestions {...defaultProps} query="Bat" />);

			expect(screen.getByText("Popular Searches")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Popular search: Batman" })
			).toBeInTheDocument();
			expect(
				screen.queryByRole("button", { name: "Popular search: Marvel" })
			).not.toBeInTheDocument();
		});

		it("shows all popular searches when query is empty", () => {
			render(<SearchSuggestions {...defaultProps} />);

			expect(screen.getByText("Popular Searches")).toBeInTheDocument();
			// Should show all popular searches
			const popularSearches = [
				"Batman",
				"Marvel",
				"Star Wars",
				"Horror",
				"Comedy",
			];
			popularSearches.forEach((search) => {
				expect(
					screen.getByRole("button", { name: `Popular search: ${search}` })
				).toBeInTheDocument();
			});
		});

		it("handles case-insensitive filtering", () => {
			render(<SearchSuggestions {...defaultProps} query="BATMAN" />);

			expect(screen.getByText("Popular Searches")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Popular search: Batman" })
			).toBeInTheDocument();
		});
	});

	describe("Suggestion Deduplication", () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		it("filters out movie suggestions that appear in recent searches", async () => {
			const recentSearches = ["Batman"];
			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(recentSearches));

			const mockMovies = [
				{ id: 1, title: "Batman" },
				{ id: 2, title: "Batman Returns" },
			];
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ results: mockMovies }),
			});

			render(<SearchSuggestions {...defaultProps} query="bat" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(screen.getByText("Recent Searches")).toBeInTheDocument();
				expect(screen.getByText("Movies")).toBeInTheDocument();

				// "Batman" should only appear in recent searches, not in movies
				const recentBatman = screen.getByRole("button", {
					name: /Recent search: Batman/i,
				});
				expect(recentBatman).toBeInTheDocument();

				// "Batman Returns" should appear in movies
				expect(
					screen.getByRole("button", {
						name: /Movie suggestion: Batman Returns/i,
					})
				).toBeInTheDocument();

				// "Batman" should NOT appear as a movie suggestion
				expect(
					screen.queryByRole("button", { name: /Movie suggestion: Batman$/i })
				).not.toBeInTheDocument();
			});
		});

		it("filters out movie suggestions that appear in popular searches", async () => {
			const mockMovies = [
				{ id: 1, title: "Batman" },
				{ id: 2, title: "Batman Returns" },
			];
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ results: mockMovies }),
			});

			render(<SearchSuggestions {...defaultProps} query="bat" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(screen.getByText("Popular Searches")).toBeInTheDocument();
				expect(screen.getByText("Movies")).toBeInTheDocument();

				// "Batman" should only appear in popular searches, not in movies
				const popularBatman = screen.getByRole("button", {
					name: /Popular search: Batman/i,
				});
				expect(popularBatman).toBeInTheDocument();

				// "Batman Returns" should appear in movies
				expect(
					screen.getByRole("button", {
						name: /Movie suggestion: Batman Returns/i,
					})
				).toBeInTheDocument();

				// "Batman" should NOT appear as a movie suggestion
				expect(
					screen.queryByRole("button", { name: /Movie suggestion: Batman$/i })
				).not.toBeInTheDocument();
			});
		});
	});

	describe("Accessibility and Semantic Structure", () => {
		it("maintains accessibility with proper ARIA attributes", () => {
			render(<SearchSuggestions {...defaultProps} />);

			const container = screen.getByRole("complementary");
			expect(container).toHaveAttribute("aria-label", "Search suggestions");
		});

		it("provides proper accessibility labels for suggestion buttons", async () => {
			const recentSearches = ["Batman"];
			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(recentSearches));

			render(<SearchSuggestions {...defaultProps} query="bat" />);

			await waitFor(() => {
				const recentButton = screen.getByRole("button", {
					name: "Recent search: Batman",
				});
				expect(recentButton).toBeInTheDocument();

				const popularButton = screen.getByRole("button", {
					name: "Popular search: Batman",
				});
				expect(popularButton).toBeInTheDocument();
			});
		});

		it("provides proper accessibility labels for movie suggestions", async () => {
			jest.useFakeTimers();

			const mockMovies = [{ id: 1, title: "Test Movie" }];
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ results: mockMovies }),
			});

			render(<SearchSuggestions {...defaultProps} query="test" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				const movieButton = screen.getByRole("button", {
					name: "Movie suggestion: Test Movie",
				});
				expect(movieButton).toBeInTheDocument();
			});
		});

		it("provides proper accessibility for loading states", async () => {
			jest.useFakeTimers();

			let resolvePromise: (value: any) => void;
			const mockPromise = new Promise((resolve) => {
				resolvePromise = resolve;
			});
			(global.fetch as jest.Mock).mockReturnValue(mockPromise);

			render(<SearchSuggestions {...defaultProps} query="test" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				const loadingStatus = screen.getByRole("status", {
					name: "Searching movies",
				});
				expect(loadingStatus).toBeInTheDocument();
			});

			act(() => {
				resolvePromise!({
					ok: true,
					json: () => Promise.resolve({ results: [] }),
				});
			});
		});
	});

	describe("Edge Cases and Special Characters", () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		it("handles special characters and unicode in search queries", async () => {
			const specialQuery = "test 你好!@#$%";
			render(<SearchSuggestions {...defaultProps} query={specialQuery} />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(global.fetch).toHaveBeenCalledWith(
					`/api/search?q=${encodeURIComponent(specialQuery)}&page=1`
				);
			});
		});

		it("handles empty search results gracefully", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ results: [] }),
			});

			render(<SearchSuggestions {...defaultProps} query="nonexistent" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(
					screen.getByText('No suggestions found for "nonexistent"')
				).toBeInTheDocument();
			});
		});

		it("handles malformed API responses gracefully", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ results: null }),
			});

			render(<SearchSuggestions {...defaultProps} query="test" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				expect(
					screen.getByText('No suggestions found for "test"')
				).toBeInTheDocument();
			});
		});

		it("does not save empty queries to recent searches", async () => {
			// Don't use fake timers for this test as it doesn't need API calls
			jest.useRealTimers();

			const user = userEvent.setup();
			render(<SearchSuggestions {...defaultProps} query="" />);

			const popularButton = screen.getByRole("button", {
				name: "Popular search: Batman",
			});
			await user.click(popularButton);

			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				"recentMovieSearches",
				JSON.stringify(["Batman"])
			);
		});
	});

	describe("Component State Management", () => {
		it("properly cleans up timeouts on unmount", () => {
			jest.useFakeTimers();
			const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

			const { unmount } = render(
				<SearchSuggestions {...defaultProps} query="test" />
			);

			unmount();

			expect(clearTimeoutSpy).toHaveBeenCalled();
			clearTimeoutSpy.mockRestore();
		});

		it("handles rapid query changes without race conditions", async () => {
			jest.useFakeTimers();
			const { rerender } = render(
				<SearchSuggestions {...defaultProps} query="te" />
			);

			// Simulate rapid typing
			rerender(<SearchSuggestions {...defaultProps} query="tes" />);
			rerender(<SearchSuggestions {...defaultProps} query="test" />);
			rerender(<SearchSuggestions {...defaultProps} query="testi" />);
			rerender(<SearchSuggestions {...defaultProps} query="testin" />);
			rerender(<SearchSuggestions {...defaultProps} query="testing" />);

			act(() => {
				jest.advanceTimersByTime(300);
			});

			await waitFor(() => {
				// Should only make one API call for the final query
				expect(global.fetch).toHaveBeenCalledTimes(1);
				expect(global.fetch).toHaveBeenCalledWith(
					"/api/search?q=testing&page=1"
				);
			});
		});
	});
});
