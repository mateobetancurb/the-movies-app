import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useFavorites } from "@/src/context/FavoritesContext";
import AddToFavoritesBtn from "../../../components/core/AddToFavoritesBtn";
import { Movie } from "@/src/interfaces";

// Mock the FavoritesContext
jest.mock("@/src/context/FavoritesContext", () => ({
	useFavorites: jest.fn(),
}));

// Mock lucide-react
jest.mock("lucide-react", () => ({
	Heart: ({ className, fill, ...props }: any) => (
		<svg data-testid="heart-icon" className={className} fill={fill} {...props}>
			<path d="heart" />
		</svg>
	),
}));

// Test data
const mockMovie: Movie = {
	id: 123,
	title: "Test Movie",
	overview: "A test movie overview",
	poster_path: "/test-poster.jpg",
	backdrop_path: "/test-backdrop.jpg",
	release_date: "2023-01-01",
	vote_average: 8.5,
	vote_count: 1000,
	runtime: 120,
	genres: [
		{ id: 1, name: "Action" },
		{ id: 2, name: "Adventure" },
	],
	cast: [
		{
			id: 1,
			name: "Test Actor",
			character: "Test Character",
			profile_path: "/test-profile.jpg",
		},
	],
};

describe("AddToFavoritesBtn", () => {
	const mockAddFavorite = jest.fn();
	const mockRemoveFavorite = jest.fn();
	const mockIsFavorite = jest.fn();

	const defaultMockReturn = {
		isFavorite: mockIsFavorite,
		addFavorite: mockAddFavorite,
		removeFavorite: mockRemoveFavorite,
		favorites: [],
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useFavorites as jest.Mock).mockReturnValue(defaultMockReturn);
	});

	describe("Basic Rendering", () => {
		it("renders add to favorites button when movie is not a favorite", () => {
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const button = screen.getByRole("button");
			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent("Add to Favorites");
		});

		it("renders remove from favorites button when movie is a favorite", () => {
			mockIsFavorite.mockReturnValue(true);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const button = screen.getByRole("button");
			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent("Remove from Favorites");
		});

		it("renders heart icon in all states", () => {
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const heartIcon = screen.getByTestId("heart-icon");
			expect(heartIcon).toBeInTheDocument();
		});
	});

	describe("Visual States", () => {
		it("applies correct classes when movie is not a favorite", () => {
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const button = screen.getByRole("button");
			expect(button).toHaveClass(
				"bg-gray-800",
				"hover:bg-gray-700",
				"text-white"
			);
			expect(button).not.toHaveClass("btn-secondary");
		});

		it("applies correct classes when movie is a favorite", () => {
			mockIsFavorite.mockReturnValue(true);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const button = screen.getByRole("button");
			expect(button).toHaveClass("btn-secondary");
		});

		it("applies base button classes consistently", () => {
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const button = screen.getByRole("button");
			expect(button).toHaveClass("btn", "flex", "items-center");
		});
	});

	describe("Heart Icon States", () => {
		it("renders unfilled heart icon when movie is not a favorite", () => {
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const heartIcon = screen.getByTestId("heart-icon");
			expect(heartIcon).toHaveAttribute("fill", "none");
			expect(heartIcon).toHaveClass("w-5", "h-5", "mr-2");
		});

		it("renders filled heart icon when movie is a favorite", () => {
			mockIsFavorite.mockReturnValue(true);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const heartIcon = screen.getByTestId("heart-icon");
			expect(heartIcon).toHaveAttribute("fill", "currentColor");
			expect(heartIcon).toHaveClass("w-5", "h-5", "mr-2");
		});
	});

	describe("Click Interactions", () => {
		it("calls addFavorite when clicking on non-favorite movie", () => {
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(mockAddFavorite).toHaveBeenCalledTimes(1);
			expect(mockAddFavorite).toHaveBeenCalledWith(mockMovie.id);
			expect(mockRemoveFavorite).not.toHaveBeenCalled();
		});

		it("calls removeFavorite when clicking on favorite movie", () => {
			mockIsFavorite.mockReturnValue(true);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(mockRemoveFavorite).toHaveBeenCalledTimes(1);
			expect(mockRemoveFavorite).toHaveBeenCalledWith(mockMovie.id);
			expect(mockAddFavorite).not.toHaveBeenCalled();
		});

		it("handles multiple clicks correctly", () => {
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const button = screen.getByRole("button");
			fireEvent.click(button);
			fireEvent.click(button);
			fireEvent.click(button);

			expect(mockAddFavorite).toHaveBeenCalledTimes(3);
			expect(mockAddFavorite).toHaveBeenCalledWith(mockMovie.id);
		});
	});

	describe("Context Integration", () => {
		it("uses useFavorites hook correctly", () => {
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			expect(useFavorites).toHaveBeenCalledTimes(1);
		});

		it("calls isFavorite with correct movie id", () => {
			render(<AddToFavoritesBtn movie={mockMovie} />);

			expect(mockIsFavorite).toHaveBeenCalledWith(mockMovie.id);
		});

		it("works with different movie ids", () => {
			const anotherMovie = { ...mockMovie, id: 456 };
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={anotherMovie} />);

			expect(mockIsFavorite).toHaveBeenCalledWith(456);
		});
	});

	describe("Edge Cases", () => {
		it("handles movie with id 0", () => {
			const movieWithZeroId = { ...mockMovie, id: 0 };
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={movieWithZeroId} />);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(mockAddFavorite).toHaveBeenCalledWith(0);
		});

		it("handles negative movie id", () => {
			const movieWithNegativeId = { ...mockMovie, id: -1 };
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={movieWithNegativeId} />);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(mockAddFavorite).toHaveBeenCalledWith(-1);
		});

		it("handles very large movie id", () => {
			const movieWithLargeId = { ...mockMovie, id: 999999999 };
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={movieWithLargeId} />);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(mockAddFavorite).toHaveBeenCalledWith(999999999);
		});
	});

	describe("State Changes", () => {
		it("reflects favorite state changes correctly", () => {
			const { rerender } = render(<AddToFavoritesBtn movie={mockMovie} />);

			// Initially not a favorite
			mockIsFavorite.mockReturnValue(false);
			rerender(<AddToFavoritesBtn movie={mockMovie} />);

			expect(screen.getByText("Add to Favorites")).toBeInTheDocument();

			// Now it's a favorite
			mockIsFavorite.mockReturnValue(true);
			rerender(<AddToFavoritesBtn movie={mockMovie} />);

			expect(screen.getByText("Remove from Favorites")).toBeInTheDocument();
		});

		it("updates button appearance when favorite status changes", () => {
			const { rerender } = render(<AddToFavoritesBtn movie={mockMovie} />);

			// Initially not a favorite
			mockIsFavorite.mockReturnValue(false);
			rerender(<AddToFavoritesBtn movie={mockMovie} />);

			let button = screen.getByRole("button");
			expect(button).toHaveClass("bg-gray-800");
			expect(button).not.toHaveClass("btn-secondary");

			// Now it's a favorite
			mockIsFavorite.mockReturnValue(true);
			rerender(<AddToFavoritesBtn movie={mockMovie} />);

			button = screen.getByRole("button");
			expect(button).toHaveClass("btn-secondary");
			expect(button).not.toHaveClass("bg-gray-800");
		});
	});

	describe("Accessibility", () => {
		it("has proper button role", () => {
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			const button = screen.getByRole("button");
			expect(button).toBeInTheDocument();
		});

		it("has descriptive text for screen readers", () => {
			mockIsFavorite.mockReturnValue(false);

			render(<AddToFavoritesBtn movie={mockMovie} />);

			expect(screen.getByText("Add to Favorites")).toBeInTheDocument();
		});

		it("button text changes appropriately for different states", () => {
			// Test favorite state
			mockIsFavorite.mockReturnValue(true);
			const { rerender } = render(<AddToFavoritesBtn movie={mockMovie} />);
			expect(screen.getByText("Remove from Favorites")).toBeInTheDocument();

			// Test non-favorite state
			mockIsFavorite.mockReturnValue(false);
			rerender(<AddToFavoritesBtn movie={mockMovie} />);
			expect(screen.getByText("Add to Favorites")).toBeInTheDocument();
		});
	});
});
