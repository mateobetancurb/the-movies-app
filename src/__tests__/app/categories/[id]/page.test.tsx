import { render, screen } from "@testing-library/react";
import CategoryPage from "@/src/app/categories/[id]/page";
import { getMoviesByGenre } from "@/src/services/movieService";
import { GENRE_MAP } from "@/src/helpers/genreHelpers";
import { Movie, PaginatedResponse } from "@/src/interfaces";

// Mock dependencies
jest.mock("@/src/services/movieService", () => ({
	getMoviesByGenre: jest.fn(),
}));

jest.mock("@/src/components/movies/MovieGrid", () => {
	return function MockMovieGrid({
		movies,
		title,
	}: {
		movies: Movie[];
		title?: string;
	}) {
		return (
			<div data-testid="movie-grid">
				{title && <div data-testid="grid-title">{title}</div>}
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

jest.mock("@/src/components/core/GoBackButton", () => {
	return function MockGoBackButton({ href }: { href: string }) {
		return (
			<div data-testid="go-back-button" data-href={href}>
				Go Back
			</div>
		);
	};
});

const mockGetMoviesByGenre = getMoviesByGenre as jest.MockedFunction<
	typeof getMoviesByGenre
>;

const mockMovies: Movie[] = [
	{
		id: 1,
		title: "Action Movie 1",
		overview: "An exciting action movie",
		poster_path: "/poster1.jpg",
		backdrop_path: "/backdrop1.jpg",
		release_date: "2023-01-01",
		vote_average: 8.5,
		vote_count: 1000,
		genres: [{ id: 28, name: "Action" }],
		cast: [],
	},
	{
		id: 2,
		title: "Action Movie 2",
		overview: "Another action-packed film",
		poster_path: "/poster2.jpg",
		backdrop_path: "/backdrop2.jpg",
		release_date: "2023-06-15",
		vote_average: 7.8,
		vote_count: 800,
		genres: [{ id: 28, name: "Action" }],
		cast: [],
	},
];

const mockPaginatedResponse: PaginatedResponse<Movie> = {
	page: 1,
	results: mockMovies,
	total_pages: 1,
	total_results: 2,
};

describe("CategoryPage", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders category page with movies from API", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		const component = await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		render(component);

		expect(screen.getByText("Category: Action")).toBeInTheDocument();
		expect(screen.getByTestId("go-back-button")).toBeInTheDocument();
		expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("2");
		expect(screen.getByTestId("movie-1")).toHaveTextContent("Action Movie 1");
		expect(screen.getByTestId("movie-2")).toHaveTextContent("Action Movie 2");
	});

	it("calls getMoviesByGenre with correct genre ID", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});

		expect(mockGetMoviesByGenre).toHaveBeenCalledTimes(1);
		expect(mockGetMoviesByGenre).toHaveBeenCalledWith(28);
	});

	it("renders correct category name from GENRE_MAP", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		const component = await CategoryPage({
			params: Promise.resolve({ id: "35" }),
		});
		render(component);

		expect(screen.getByText("Category: Comedy")).toBeInTheDocument();
		expect(mockGetMoviesByGenre).toHaveBeenCalledWith(35);
	});

	it("renders fallback category name for unknown genre ID", async () => {
		mockGetMoviesByGenre.mockResolvedValue({
			...mockPaginatedResponse,
			results: [],
		});

		const component = await CategoryPage({
			params: Promise.resolve({ id: "999" }),
		});
		render(component);

		expect(screen.getByText("Category: Category 999")).toBeInTheDocument();
		expect(mockGetMoviesByGenre).toHaveBeenCalledWith(999);
	});

	it("renders go back button with correct href", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		const component = await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		render(component);

		const goBackButton = screen.getByTestId("go-back-button");
		expect(goBackButton).toBeInTheDocument();
		expect(goBackButton).toHaveAttribute("data-href", "/categories");
	});

	it("applies correct CSS classes to container", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		const component = await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		render(component);

		const container = screen.getByText("Category: Action").closest("div");
		expect(container).toHaveClass("container-page");
	});

	it("renders correct heading hierarchy", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		const component = await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		render(component);

		const heading = screen.getByRole("heading", { level: 1 });
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent("Category: Action");
		expect(heading).toHaveClass("text-3xl", "font-bold", "mb-6");
	});

	it("handles empty movies response", async () => {
		mockGetMoviesByGenre.mockResolvedValue({
			...mockPaginatedResponse,
			results: [],
			total_results: 0,
		});

		const component = await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		render(component);

		expect(screen.getByText("Category: Action")).toBeInTheDocument();
		expect(screen.getByTestId("movies-count")).toHaveTextContent("0");
	});

	it("handles single movie in response", async () => {
		const singleMovieResponse: PaginatedResponse<Movie> = {
			...mockPaginatedResponse,
			results: [mockMovies[0]],
			total_results: 1,
		};
		mockGetMoviesByGenre.mockResolvedValue(singleMovieResponse);

		const component = await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		render(component);

		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
		expect(screen.getByTestId("movie-1")).toHaveTextContent("Action Movie 1");
		expect(screen.queryByTestId("movie-2")).not.toBeInTheDocument();
	});

	it("handles large number of movies", async () => {
		const manyMovies: Movie[] = Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			title: `Movie ${i + 1}`,
			overview: `Overview for movie ${i + 1}`,
			poster_path: `/poster${i + 1}.jpg`,
			backdrop_path: `/backdrop${i + 1}.jpg`,
			release_date: "2023-01-01",
			vote_average: 7.5,
			vote_count: 500,
			genres: [{ id: 28, name: "Action" }],
			cast: [],
		}));

		mockGetMoviesByGenre.mockResolvedValue({
			...mockPaginatedResponse,
			results: manyMovies,
			total_results: 20,
		});

		const component = await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		render(component);

		expect(screen.getByTestId("movies-count")).toHaveTextContent("20");
		expect(screen.getByTestId("movie-1")).toHaveTextContent("Movie 1");
		expect(screen.getByTestId("movie-20")).toHaveTextContent("Movie 20");
	});

	it("handles different genre IDs correctly", async () => {
		const testCases = [
			{ id: "18", expectedName: "Drama" },
			{ id: "35", expectedName: "Comedy" },
			{ id: "878", expectedName: "Science Fiction" },
			{ id: "27", expectedName: "Horror" },
		];

		for (const testCase of testCases) {
			mockGetMoviesByGenre.mockResolvedValue({
				...mockPaginatedResponse,
				results: [],
			});

			const component = await CategoryPage({
				params: Promise.resolve({ id: testCase.id }),
			});
			render(component);

			expect(
				screen.getByText(`Category: ${testCase.expectedName}`)
			).toBeInTheDocument();
			expect(mockGetMoviesByGenre).toHaveBeenCalledWith(Number(testCase.id));

			// Clean up for next iteration
			render(<div />);
		}
	});

	it("handles string IDs that convert to numbers", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		const component = await CategoryPage({
			params: Promise.resolve({ id: "0028" }), // Leading zeros
		});
		render(component);

		expect(mockGetMoviesByGenre).toHaveBeenCalledWith(28);
		expect(screen.getByText("Category: Action")).toBeInTheDocument();
	});

	it("handles edge case genre IDs", async () => {
		const edgeCases = [
			{ id: "0", expectedCall: 0, expectedName: "Category 0" },
			{ id: "-1", expectedCall: -1, expectedName: "Category -1" },
			{ id: "99999", expectedCall: 99999, expectedName: "Category 99999" },
		];

		for (const testCase of edgeCases) {
			mockGetMoviesByGenre.mockResolvedValue({
				...mockPaginatedResponse,
				results: [],
			});

			const component = await CategoryPage({
				params: Promise.resolve({ id: testCase.id }),
			});
			render(component);

			expect(mockGetMoviesByGenre).toHaveBeenCalledWith(testCase.expectedCall);
			expect(
				screen.getByText(`Category: ${testCase.expectedName}`)
			).toBeInTheDocument();

			// Clean up for next iteration
			render(<div />);
		}
	});

	it("passes movies.results to MovieGrid component", async () => {
		const customMovies = [
			{
				...mockMovies[0],
				id: 100,
				title: "Custom Movie",
			},
		];

		mockGetMoviesByGenre.mockResolvedValue({
			...mockPaginatedResponse,
			results: customMovies,
		});

		const component = await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		render(component);

		expect(screen.getByTestId("movie-100")).toHaveTextContent("Custom Movie");
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
	});

	it("renders as an async server component", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		// Test that the function returns a Promise (async component)
		const result = CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		expect(result).toBeInstanceOf(Promise);

		const component = await result;
		render(component);

		expect(screen.getByText("Category: Action")).toBeInTheDocument();
	});

	it("awaits params promise correctly", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		// Test with delayed params resolution
		let resolveParams: (value: { id: string }) => void;
		const paramsPromise = new Promise<{ id: string }>((resolve) => {
			resolveParams = resolve;
		});

		const componentPromise = CategoryPage({ params: paramsPromise });

		// Resolve params after a delay
		setTimeout(() => resolveParams({ id: "28" }), 10);

		const component = await componentPromise;
		render(component);

		expect(screen.getByText("Category: Action")).toBeInTheDocument();
		expect(mockGetMoviesByGenre).toHaveBeenCalledWith(28);
	});

	it("handles movies with special characters in titles", async () => {
		const specialMovies: Movie[] = [
			{
				...mockMovies[0],
				id: 1,
				title: "Açtion & Adventure: The Ultimate Test",
			},
			{
				...mockMovies[0],
				id: 2,
				title: "Horror & Thriller (2023)",
			},
		];

		mockGetMoviesByGenre.mockResolvedValue({
			...mockPaginatedResponse,
			results: specialMovies,
		});

		const component = await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		render(component);

		expect(screen.getByTestId("movie-1")).toHaveTextContent(
			"Açtion & Adventure: The Ultimate Test"
		);
		expect(screen.getByTestId("movie-2")).toHaveTextContent(
			"Horror & Thriller (2023)"
		);
	});

	it("handles component structure and hierarchy", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		const component = await CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		render(component);

		// Check component order: GoBackButton, heading, MovieGrid
		const container = screen.getByRole("heading").closest("div");
		expect(container).toBeInTheDocument();

		const goBackButton = screen.getByTestId("go-back-button");
		const heading = screen.getByRole("heading");
		const movieGrid = screen.getByTestId("movie-grid");

		expect(container).toContainElement(goBackButton);
		expect(container).toContainElement(heading);
		expect(container).toContainElement(movieGrid);
	});

	it("handles API service errors gracefully", async () => {
		// Mock console.error to avoid error output in tests
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		mockGetMoviesByGenre.mockRejectedValue(new Error("API Error"));

		// Component should still attempt to render but handle the error
		await expect(async () => {
			await CategoryPage({
				params: Promise.resolve({ id: "28" }),
			});
		}).rejects.toThrow("API Error");

		expect(mockGetMoviesByGenre).toHaveBeenCalledWith(28);

		consoleSpy.mockRestore();
	});

	it("handles concurrent renders with different IDs", async () => {
		mockGetMoviesByGenre.mockResolvedValue(mockPaginatedResponse);

		// Test multiple concurrent calls with different IDs
		const component1Promise = CategoryPage({
			params: Promise.resolve({ id: "28" }),
		});
		const component2Promise = CategoryPage({
			params: Promise.resolve({ id: "35" }),
		});

		const [component1, component2] = await Promise.all([
			component1Promise,
			component2Promise,
		]);

		render(component1);
		expect(screen.getByText("Category: Action")).toBeInTheDocument();

		render(component2);
		expect(screen.getByText("Category: Comedy")).toBeInTheDocument();

		// Verify both API calls were made
		expect(mockGetMoviesByGenre).toHaveBeenCalledWith(28);
		expect(mockGetMoviesByGenre).toHaveBeenCalledWith(35);
		expect(mockGetMoviesByGenre).toHaveBeenCalledTimes(2);
	});
});
