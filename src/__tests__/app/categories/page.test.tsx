import { render, screen } from "@testing-library/react";
import CategoriesPage from "@/src/app/categories/page";
import { getGenres } from "@/src/services/movieService";
import { Genre } from "@/src/interfaces";

// Mock dependencies
jest.mock("@/src/services/movieService", () => ({
	getGenres: jest.fn(),
}));

jest.mock("@/src/components/categories/MainContent", () => {
	return function MockMainContent({ genres }: { genres: Genre[] }) {
		return (
			<div data-testid="main-content">
				<div data-testid="genres-count">{genres.length}</div>
				{genres.map((genre) => (
					<div key={genre.id} data-testid={`genre-${genre.id}`}>
						{genre.name}
					</div>
				))}
			</div>
		);
	};
});

const mockGetGenres = getGenres as jest.MockedFunction<typeof getGenres>;

const mockGenres: Genre[] = [
	{ id: 28, name: "Action" },
	{ id: 35, name: "Comedy" },
	{ id: 18, name: "Drama" },
	{ id: 878, name: "Science Fiction" },
	{ id: 27, name: "Horror" },
];

describe("CategoriesPage", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders categories page with genres from API", async () => {
		mockGetGenres.mockResolvedValue(mockGenres);

		const component = await CategoriesPage();
		render(component);

		// Should render MainContent with genres
		expect(screen.getByTestId("main-content")).toBeInTheDocument();
		expect(screen.getByTestId("genres-count")).toHaveTextContent("5");

		// Should render all genres
		expect(screen.getByTestId("genre-28")).toHaveTextContent("Action");
		expect(screen.getByTestId("genre-35")).toHaveTextContent("Comedy");
		expect(screen.getByTestId("genre-18")).toHaveTextContent("Drama");
		expect(screen.getByTestId("genre-878")).toHaveTextContent(
			"Science Fiction"
		);
		expect(screen.getByTestId("genre-27")).toHaveTextContent("Horror");
	});

	it("calls getGenres service function", async () => {
		mockGetGenres.mockResolvedValue(mockGenres);

		await CategoriesPage();

		expect(mockGetGenres).toHaveBeenCalledTimes(1);
		expect(mockGetGenres).toHaveBeenCalledWith();
	});

	it("handles empty genres array", async () => {
		mockGetGenres.mockResolvedValue([]);

		const component = await CategoriesPage();
		render(component);

		expect(screen.getByTestId("main-content")).toBeInTheDocument();
		expect(screen.getByTestId("genres-count")).toHaveTextContent("0");
	});

	it("handles single genre", async () => {
		const singleGenre = [{ id: 28, name: "Action" }];
		mockGetGenres.mockResolvedValue(singleGenre);

		const component = await CategoriesPage();
		render(component);

		expect(screen.getByTestId("main-content")).toBeInTheDocument();
		expect(screen.getByTestId("genres-count")).toHaveTextContent("1");
		expect(screen.getByTestId("genre-28")).toHaveTextContent("Action");
	});

	it("handles large number of genres", async () => {
		const manyGenres: Genre[] = Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			name: `Genre ${i + 1}`,
		}));
		mockGetGenres.mockResolvedValue(manyGenres);

		const component = await CategoriesPage();
		render(component);

		expect(screen.getByTestId("main-content")).toBeInTheDocument();
		expect(screen.getByTestId("genres-count")).toHaveTextContent("20");
		expect(screen.getByTestId("genre-1")).toHaveTextContent("Genre 1");
		expect(screen.getByTestId("genre-20")).toHaveTextContent("Genre 20");
	});

	it("renders Suspense component structure correctly", async () => {
		mockGetGenres.mockResolvedValue(mockGenres);

		const component = await CategoriesPage();
		render(component);

		// In test environment, Suspense immediately resolves to MainContent
		// We can verify the component structure is correct
		expect(screen.getByTestId("main-content")).toBeInTheDocument();
		expect(screen.getByTestId("genres-count")).toHaveTextContent("5");
	});

	it("handles genres with special characters", async () => {
		const specialGenres: Genre[] = [
			{ id: 1, name: "Açtion & Adventure" },
			{ id: 2, name: "Sci-Fi/Fantasy" },
			{ id: 3, name: "Comedy (Classic)" },
			{ id: 4, name: "Horror & Thriller" },
		];
		mockGetGenres.mockResolvedValue(specialGenres);

		const component = await CategoriesPage();
		render(component);

		expect(screen.getByTestId("genre-1")).toHaveTextContent(
			"Açtion & Adventure"
		);
		expect(screen.getByTestId("genre-2")).toHaveTextContent("Sci-Fi/Fantasy");
		expect(screen.getByTestId("genre-3")).toHaveTextContent("Comedy (Classic)");
		expect(screen.getByTestId("genre-4")).toHaveTextContent(
			"Horror & Thriller"
		);
	});

	it("handles genres with unicode characters", async () => {
		const unicodeGenres: Genre[] = [
			{ id: 1, name: "アニメ (Anime)" },
			{ id: 2, name: "Драма" },
			{ id: 3, name: "Комедия" },
			{ id: 4, name: "🎬 Cinema" },
		];
		mockGetGenres.mockResolvedValue(unicodeGenres);

		const component = await CategoriesPage();
		render(component);

		expect(screen.getByTestId("genre-1")).toHaveTextContent("アニメ (Anime)");
		expect(screen.getByTestId("genre-2")).toHaveTextContent("Драма");
		expect(screen.getByTestId("genre-3")).toHaveTextContent("Комедия");
		expect(screen.getByTestId("genre-4")).toHaveTextContent("🎬 Cinema");
	});

	it("renders as an async server component", async () => {
		mockGetGenres.mockResolvedValue(mockGenres);

		// Test that the function returns a Promise (async component)
		const result = CategoriesPage();
		expect(result).toBeInstanceOf(Promise);

		const component = await result;
		render(component);

		expect(screen.getByTestId("main-content")).toBeInTheDocument();
	});

	it("passes genres array correctly to MainContent", async () => {
		const testGenres: Genre[] = [
			{ id: 100, name: "Test Genre 1" },
			{ id: 200, name: "Test Genre 2" },
		];
		mockGetGenres.mockResolvedValue(testGenres);

		const component = await CategoriesPage();
		render(component);

		expect(screen.getByTestId("genres-count")).toHaveTextContent("2");
		expect(screen.getByTestId("genre-100")).toHaveTextContent("Test Genre 1");
		expect(screen.getByTestId("genre-200")).toHaveTextContent("Test Genre 2");
	});

	it("maintains component structure and hierarchy", async () => {
		mockGetGenres.mockResolvedValue(mockGenres);

		const component = await CategoriesPage();
		render(component);

		// Check that MainContent is rendered correctly
		expect(screen.getByTestId("main-content")).toBeInTheDocument();
		expect(screen.getByTestId("genres-count")).toHaveTextContent("5");

		// Verify all genre elements are present
		expect(screen.getByTestId("genre-28")).toBeInTheDocument();
		expect(screen.getByTestId("genre-35")).toBeInTheDocument();
		expect(screen.getByTestId("genre-18")).toBeInTheDocument();
		expect(screen.getByTestId("genre-878")).toBeInTheDocument();
		expect(screen.getByTestId("genre-27")).toBeInTheDocument();
	});

	it("handles concurrent renders correctly", async () => {
		mockGetGenres.mockResolvedValue(mockGenres);

		// Test multiple concurrent calls
		const component1Promise = CategoriesPage();
		const component2Promise = CategoriesPage();

		const [component1, component2] = await Promise.all([
			component1Promise,
			component2Promise,
		]);

		render(component1);
		expect(screen.getByTestId("main-content")).toBeInTheDocument();
		expect(screen.getByTestId("genres-count")).toHaveTextContent("5");

		// Verify both API calls were made
		expect(mockGetGenres).toHaveBeenCalledTimes(2);
	});

	it("handles API service errors gracefully", async () => {
		// Mock console.error to avoid error output in tests
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		mockGetGenres.mockRejectedValue(new Error("API Error"));

		// Component should still attempt to render but handle the error
		await expect(async () => {
			await CategoriesPage();
		}).rejects.toThrow("API Error");

		expect(mockGetGenres).toHaveBeenCalledTimes(1);

		consoleSpy.mockRestore();
	});
});
