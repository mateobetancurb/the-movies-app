import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchSuggestions from "@/components/core/SearchSuggestions";

// Mock localStorage
const mockLocalStorage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Mock fetch
global.fetch = jest.fn();

describe("SearchSuggestions", () => {
	const mockOnSuggestionClick = jest.fn();
	const defaultProps = {
		onSuggestionClick: mockOnSuggestionClick,
		isVisible: true,
		query: "",
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockLocalStorage.getItem.mockReturnValue(null);
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ results: [] }),
		});
	});

	it("does not render when isVisible is false", () => {
		render(<SearchSuggestions {...defaultProps} isVisible={false} />);
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});

	it("shows 'Start typing to see suggestions...' when query is empty", () => {
		render(<SearchSuggestions {...defaultProps} />);
		expect(
			screen.getByText("Start typing to see suggestions...")
		).toBeInTheDocument();
	});

	it("loads and displays recent searches from localStorage", () => {
		const recentSearches = ["Batman", "Superman"];
		mockLocalStorage.getItem.mockReturnValue(JSON.stringify(recentSearches));

		render(<SearchSuggestions {...defaultProps} />);

		expect(screen.getByText("Recent Searches")).toBeInTheDocument();
		recentSearches.forEach((search) => {
			expect(screen.getByText(search)).toBeInTheDocument();
		});
	});

	it("saves search to recent searches when clicked", async () => {
		render(<SearchSuggestions {...defaultProps} query="test" />);

		const suggestion = screen.getByText("test");
		await userEvent.click(suggestion);

		expect(mockLocalStorage.setItem).toHaveBeenCalled();
		expect(mockOnSuggestionClick).toHaveBeenCalledWith("test");
	});

	it("clears recent searches when clear button is clicked", async () => {
		const recentSearches = ["Batman", "Superman"];
		mockLocalStorage.getItem.mockReturnValue(JSON.stringify(recentSearches));

		render(<SearchSuggestions {...defaultProps} />);

		const clearButton = screen.getByText("Clear");
		await userEvent.click(clearButton);

		expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
			"recentMovieSearches"
		);
		expect(screen.queryByText("Recent Searches")).not.toBeInTheDocument();
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

		await waitFor(() => {
			expect(screen.getByText("Movies")).toBeInTheDocument();
			mockMovies.forEach((movie) => {
				expect(screen.getByText(movie.title)).toBeInTheDocument();
			});
		});
	});

	it("shows loading state while fetching movie suggestions", async () => {
		// Mock a delayed response
		(global.fetch as jest.Mock).mockImplementation(
			() => new Promise((resolve) => setTimeout(resolve, 100))
		);

		render(<SearchSuggestions {...defaultProps} query="test" />);

		// Initially should show loading state
		expect(
			screen.getByRole("status", { name: "Searching movies" })
		).toBeInTheDocument();
		expect(screen.getByText("Searching movies...")).toBeInTheDocument();

		// Wait for the loading state to be removed
		await waitFor(() => {
			expect(
				screen.queryByRole("status", { name: "Searching movies" })
			).not.toBeInTheDocument();
		});
	});

	it("handles API error gracefully", async () => {
		(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

		render(<SearchSuggestions {...defaultProps} query="test" />);

		await waitFor(() => {
			expect(
				screen.getByText('No suggestions found for "test"')
			).toBeInTheDocument();
		});
	});

	it("filters popular searches based on query", () => {
		render(<SearchSuggestions {...defaultProps} query="Bat" />);

		expect(screen.getByText("Popular Searches")).toBeInTheDocument();
		expect(screen.getByText("Batman")).toBeInTheDocument();
		expect(screen.queryByText("Marvel")).not.toBeInTheDocument();
	});

	it("shows no results message when no suggestions match query", () => {
		render(<SearchSuggestions {...defaultProps} query="xyz123" />);

		expect(
			screen.getByText('No suggestions found for "xyz123"')
		).toBeInTheDocument();
	});

	it("debounces API calls when typing", async () => {
		jest.useFakeTimers();

		const { rerender } = render(
			<SearchSuggestions {...defaultProps} query="t" />
		);
		rerender(<SearchSuggestions {...defaultProps} query="te" />);
		rerender(<SearchSuggestions {...defaultProps} query="tes" />);
		rerender(<SearchSuggestions {...defaultProps} query="test" />);

		expect(global.fetch).not.toHaveBeenCalled();

		jest.advanceTimersByTime(300);

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});

		jest.useRealTimers();
	});

	it("maintains accessibility with proper ARIA attributes", () => {
		render(<SearchSuggestions {...defaultProps} />);

		const container = screen.getByRole("complementary");
		expect(container).toHaveAttribute("aria-label", "Search suggestions");

		const buttons = screen.getAllByRole("button");
		buttons.forEach((button) => {
			const buttonText = button.textContent?.trim();
			expect(button).toHaveAttribute(
				"aria-label",
				expect.stringContaining(buttonText || "")
			);
		});
	});

	it("handles special characters and unicode in search queries", async () => {
		const specialQuery = "test 你好!@#$%";
		render(<SearchSuggestions {...defaultProps} query={specialQuery} />);

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				expect.stringContaining(encodeURIComponent(specialQuery))
			);
		});
	});

	it("limits recent searches to 5 items", async () => {
		const recentSearches = ["1", "2", "3", "4", "5", "6"];
		mockLocalStorage.getItem.mockReturnValue(JSON.stringify(recentSearches));

		render(<SearchSuggestions {...defaultProps} />);

		const recentSearchButtons = screen.getAllByRole("button", {
			name: /1|2|3|4|5/,
		});
		expect(recentSearchButtons).toHaveLength(5);
		expect(screen.queryByText("6")).not.toBeInTheDocument();
	});
});
