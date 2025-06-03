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

	return (
		<div>
			<div data-testid="favorites-count">{favorites.length}</div>
			<div data-testid="favorites-list">{favorites.join(",")}</div>
			<button data-testid="add-favorite" onClick={() => addFavorite(1)}>
				Add Favorite
			</button>
			<button data-testid="remove-favorite" onClick={() => removeFavorite(1)}>
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
		mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify([1, 2, 3]));

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
			JSON.stringify([1])
		);
	});

	it("removes a favorite movie", () => {
		mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify([1, 2]));

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
			JSON.stringify([2])
		);
	});
});
