import { render, screen, waitFor } from "@testing-library/react";
import SearchResults from "../SearchResults";
import { Movie } from "@/src/interfaces";

// Mock fetch globally
global.fetch = jest.fn();

describe("SearchResults", () => {
	const mockMovie: Movie = {
		id: 1,
		title: "Test Movie",
		poster_path: "/test.jpg",
		release_date: "2024-01-01",
		vote_average: 8.5,
	};

	const mockSearchResult = {
		total_results: 1,
		results: [mockMovie],
		total_pages: 1,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("shows loading state initially", () => {
		render(<SearchResults query="test" page={1} />);
		expect(screen.getByText(/Searching for "test"/)).toBeInTheDocument();
	});

	it("shows error state when API call fails", async () => {
		(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

		render(<SearchResults query="test" page={1} />);

		await waitFor(() => {
			expect(screen.getByText("Search Error")).toBeInTheDocument();
			expect(screen.getByText("API Error")).toBeInTheDocument();
		});
	});

	it("shows no results message when search returns empty", async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({ total_results: 0, results: [], total_pages: 0 }),
		});

		render(<SearchResults query="nonexistent" page={1} />);

		await waitFor(() => {
			expect(screen.getByText("No movies found")).toBeInTheDocument();
			expect(
				screen.getByText(/No results for "nonexistent"/)
			).toBeInTheDocument();
		});
	});

	it("displays search results when API call succeeds", async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(mockSearchResult),
		});

		render(<SearchResults query="test" page={1} />);

		await waitFor(() => {
			expect(screen.getByText(/Search Results for "test"/)).toBeInTheDocument();
			expect(screen.getByText("Found 1 movies")).toBeInTheDocument();
			expect(screen.getByText("Test Movie")).toBeInTheDocument();
		});
	});

	it("does not make API call when query is empty", async () => {
		render(<SearchResults query="" page={1} />);

		await waitFor(() => {
			expect(global.fetch).not.toHaveBeenCalled();
		});
	});

	it("shows pagination info when there are multiple pages", async () => {
		const multiPageResult = {
			...mockSearchResult,
			total_pages: 3,
		};

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(multiPageResult),
		});

		render(<SearchResults query="test" page={2} />);

		await waitFor(() => {
			expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
		});
	});
});
