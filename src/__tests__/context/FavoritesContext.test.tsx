import { render, screen, act } from "@testing-library/react";
import {
	FavoritesProvider,
	useFavorites,
} from "../../context/FavoritesContext";
import { useEffect } from "react";

// Mock localStorage
const mockLocalStorage = (() => {
	let store = {};
	return {
		getItem: jest.fn((key) => store[key] || null),
		setItem: jest.fn((key, value) => {
			store[key] = value.toString();
		}),
		clear: jest.fn(() => {
			store = {};
		}),
	};
})();

Object.defineProperty(window, "localStorage", {
	value: mockLocalStorage,
});

// Test component that uses the context
const TestComponent = () => {
	const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

	// Mock movie object for testing
	const mockMovie = {
		id: 1,
		title: "Test Movie",
		overview: "Test overview",
		poster_path: "/test.jpg",
		backdrop_path: "/test-backdrop.jpg",
		release_date: "2023-01-01",
		vote_average: 8.0,
		vote_count: 100,
		runtime: 120,
		genres: [],
		cast: [],
	};

	return (
		<div>
			<div data-testid="favorites-count">{favorites.length}</div>
			<div data-testid="favorites-list">
				{favorites.map((f) => f.id).join(",")}
			</div>
			<button data-testid="add-favorite" onClick={() => addFavorite(mockMovie)}>
				Add Favorite
			</button>
			<button
				data-testid="remove-favorite"
				onClick={() => removeFavorite(mockMovie)}
			>
				Remove Favorite
			</button>
			<div data-testid="is-favorite">{isFavorite(1) ? "true" : "false"}</div>
		</div>
	);
};

describe("FavoritesContext", () => {
	beforeEach(() => {
		mockLocalStorage.clear();
		jest.clearAllMocks();
	});

	it("initializes with empty favorites by default", () => {
		mockLocalStorage.getItem.mockReturnValueOnce(null);

		render(
			<FavoritesProvider>
				<TestComponent />
			</FavoritesProvider>
		);

		expect(screen.getByTestId("favorites-count")).toHaveTextContent("0");
		expect(screen.getByTestId("favorites-list")).toHaveTextContent("");
		expect(screen.getByTestId("is-favorite")).toHaveTextContent("false");
	});

	it("initializes with favorites from localStorage", () => {
		const storedMovies = [
			{
				id: 1,
				title: "Movie 1",
				overview: "Overview 1",
				poster_path: "/1.jpg",
				backdrop_path: "/1-backdrop.jpg",
				release_date: "2023-01-01",
				vote_average: 8.0,
				vote_count: 100,
				runtime: 120,
				genres: [],
				cast: [],
			},
			{
				id: 2,
				title: "Movie 2",
				overview: "Overview 2",
				poster_path: "/2.jpg",
				backdrop_path: "/2-backdrop.jpg",
				release_date: "2023-01-02",
				vote_average: 7.5,
				vote_count: 200,
				runtime: 110,
				genres: [],
				cast: [],
			},
			{
				id: 3,
				title: "Movie 3",
				overview: "Overview 3",
				poster_path: "/3.jpg",
				backdrop_path: "/3-backdrop.jpg",
				release_date: "2023-01-03",
				vote_average: 9.0,
				vote_count: 300,
				runtime: 130,
				genres: [],
				cast: [],
			},
		];
		mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(storedMovies));

		render(
			<FavoritesProvider>
				<TestComponent />
			</FavoritesProvider>
		);

		expect(screen.getByTestId("favorites-count")).toHaveTextContent("3");
		expect(screen.getByTestId("favorites-list")).toHaveTextContent("1,2,3");
		expect(screen.getByTestId("is-favorite")).toHaveTextContent("true");
	});

	it("adds a favorite movie", () => {
		mockLocalStorage.getItem.mockReturnValueOnce(null);

		render(
			<FavoritesProvider>
				<TestComponent />
			</FavoritesProvider>
		);

		expect(screen.getByTestId("favorites-count")).toHaveTextContent("0");

		act(() => {
			screen.getByTestId("add-favorite").click();
		});

		expect(screen.getByTestId("favorites-count")).toHaveTextContent("1");
		expect(screen.getByTestId("favorites-list")).toHaveTextContent("1");
		expect(screen.getByTestId("is-favorite")).toHaveTextContent("true");
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
			"favorites",
			JSON.stringify([
				{
					id: 1,
					title: "Test Movie",
					overview: "Test overview",
					poster_path: "/test.jpg",
					backdrop_path: "/test-backdrop.jpg",
					release_date: "2023-01-01",
					vote_average: 8.0,
					vote_count: 100,
					runtime: 120,
					genres: [],
					cast: [],
				},
			])
		);
	});

	it("removes a favorite movie", () => {
		const storedMovies = [
			{
				id: 1,
				title: "Movie 1",
				overview: "Overview 1",
				poster_path: "/1.jpg",
				backdrop_path: "/1-backdrop.jpg",
				release_date: "2023-01-01",
				vote_average: 8.0,
				vote_count: 100,
				runtime: 120,
				genres: [],
				cast: [],
			},
			{
				id: 2,
				title: "Movie 2",
				overview: "Overview 2",
				poster_path: "/2.jpg",
				backdrop_path: "/2-backdrop.jpg",
				release_date: "2023-01-02",
				vote_average: 7.5,
				vote_count: 200,
				runtime: 110,
				genres: [],
				cast: [],
			},
		];
		mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(storedMovies));

		render(
			<FavoritesProvider>
				<TestComponent />
			</FavoritesProvider>
		);

		expect(screen.getByTestId("favorites-count")).toHaveTextContent("2");

		act(() => {
			screen.getByTestId("remove-favorite").click();
		});

		expect(screen.getByTestId("favorites-count")).toHaveTextContent("1");
		expect(screen.getByTestId("favorites-list")).toHaveTextContent("2");
		expect(screen.getByTestId("is-favorite")).toHaveTextContent("false");
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
			"favorites",
			JSON.stringify([storedMovies[1]])
		);
	});
});
