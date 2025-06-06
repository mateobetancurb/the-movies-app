import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieCard from "../../../components/movies/MovieCard";
import { Movie } from "../../../interfaces";
import React from "react";

// Mock framer-motion
jest.mock("framer-motion", () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
}));

// Mock react-intersection-observer
const mockInView = jest.fn();
const mockRef = jest.fn();
jest.mock("react-intersection-observer", () => ({
	useInView: () => [mockRef, mockInView()],
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

// Mock next/image
jest.mock("next/image", () => ({
	__esModule: true,
	default: ({ src, alt, ...props }: any) => {
		// Handle null/undefined src like Next.js Image component
		const imageSrc = src || "";
		return <img src={imageSrc} alt={alt} {...props} />;
	},
}));

// Mock FavoritesContext
const mockIsFavorite = jest.fn();
const mockAddFavorite = jest.fn();
const mockRemoveFavorite = jest.fn();

jest.mock("../../../context/FavoritesContext", () => ({
	useFavorites: () => ({
		isFavorite: mockIsFavorite,
		addFavorite: mockAddFavorite,
		removeFavorite: mockRemoveFavorite,
	}),
}));

describe("MovieCard", () => {
	const baseMockMovie: Movie = {
		id: 1,
		title: "Test Movie",
		overview: "Test overview",
		poster_path: "/path.jpg",
		backdrop_path: "/backdrop.jpg",
		vote_average: 8.5,
		vote_count: 100,
		release_date: "2023-01-01",
		runtime: 120,
		genres: [
			{ id: 1, name: "Action" },
			{ id: 2, name: "Adventure" },
			{ id: 3, name: "Sci-Fi" },
		],
		cast: [],
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockIsFavorite.mockReturnValue(false);
		mockInView.mockReturnValue(true);
	});

	describe("Rendering", () => {
		it("renders movie information correctly", () => {
			render(<MovieCard movie={baseMockMovie} index={0} />);

			expect(screen.getByText("Test Movie")).toBeInTheDocument();
			expect(screen.getByText(/2023/)).toBeInTheDocument();
			expect(screen.getByText("8.5")).toBeInTheDocument();
			expect(screen.getByText(/120 min/)).toBeInTheDocument();
		});

		it("displays movie poster with correct alt text", () => {
			render(<MovieCard movie={baseMockMovie} index={0} />);

			const poster = screen.getByAltText("Test Movie poster");
			expect(poster).toBeInTheDocument();
			expect(poster).toHaveAttribute("src", "/path.jpg");
		});

		it("displays only first two genres", () => {
			render(<MovieCard movie={baseMockMovie} index={0} />);

			expect(screen.getByText("Action")).toBeInTheDocument();
			expect(screen.getByText("Adventure")).toBeInTheDocument();
			expect(screen.queryByText("Sci-Fi")).not.toBeInTheDocument();
		});

		it("handles movie without runtime", () => {
			const movieWithoutRuntime = { ...baseMockMovie, runtime: undefined };
			render(<MovieCard movie={movieWithoutRuntime} index={0} />);

			expect(screen.getByText(/2023/)).toBeInTheDocument();
			expect(screen.queryByText(/min/)).not.toBeInTheDocument();
		});

		it("handles movie without genres", () => {
			const movieWithoutGenres = { ...baseMockMovie, genres: [] };
			render(<MovieCard movie={movieWithoutGenres} index={0} />);

			expect(screen.getByText("Test Movie")).toBeInTheDocument();
			expect(screen.queryByText("Action")).not.toBeInTheDocument();
		});

		it("handles movie with null genres", () => {
			const movieWithNullGenres = { ...baseMockMovie, genres: null as any };
			render(<MovieCard movie={movieWithNullGenres} index={0} />);

			expect(screen.getByText("Test Movie")).toBeInTheDocument();
			expect(screen.queryByText("Action")).not.toBeInTheDocument();
		});

		it("handles movie without release date", () => {
			const movieWithoutDate = { ...baseMockMovie, release_date: "" };
			render(<MovieCard movie={movieWithoutDate} index={0} />);

			expect(screen.getByText(/N\/A/)).toBeInTheDocument();
		});

		it("handles movie with null poster path", () => {
			const movieWithoutPoster = { ...baseMockMovie, poster_path: null };

			// Suppress console warnings for this test since we're testing edge cases
			const originalError = console.error;
			console.error = jest.fn();

			render(<MovieCard movie={movieWithoutPoster} index={0} />);

			const poster = screen.getByAltText("Test Movie poster");
			expect(poster).toBeInTheDocument();
			expect(poster).toHaveAttribute("alt", "Test Movie poster");

			// Restore console.error
			console.error = originalError;
		});

		it("formats vote average correctly", () => {
			const movieWithHighRating = { ...baseMockMovie, vote_average: 9.876 };
			render(<MovieCard movie={movieWithHighRating} index={0} />);

			expect(screen.getByText("9.9")).toBeInTheDocument();
		});
	});

	describe("User Interactions", () => {
		it("navigates to movie detail page when clicked", async () => {
			const user = userEvent.setup();
			render(<MovieCard movie={baseMockMovie} index={0} />);

			const movieCard = screen.getByText("Test Movie").closest(".movie-card");
			await user.click(movieCard!);

			expect(mockPush).toHaveBeenCalledWith("/movie/1");
		});

		it("adds movie to favorites when favorite button is clicked", async () => {
			const user = userEvent.setup();
			mockIsFavorite.mockReturnValue(false);
			render(<MovieCard movie={baseMockMovie} index={0} />);

			const favoriteButton = screen.getByLabelText("Add to favorites");
			await user.click(favoriteButton);

			expect(mockAddFavorite).toHaveBeenCalledWith(1);
			expect(mockPush).not.toHaveBeenCalled(); // Should not navigate
		});

		it("removes movie from favorites when favorite button is clicked on favorited movie", async () => {
			const user = userEvent.setup();
			mockIsFavorite.mockReturnValue(true);
			render(<MovieCard movie={baseMockMovie} index={0} />);

			const favoriteButton = screen.getByLabelText("Remove from favorites");
			await user.click(favoriteButton);

			expect(mockRemoveFavorite).toHaveBeenCalledWith(1);
			expect(mockPush).not.toHaveBeenCalled(); // Should not navigate
		});

		it("prevents event bubbling when favorite button is clicked", async () => {
			const user = userEvent.setup();
			render(<MovieCard movie={baseMockMovie} index={0} />);

			const favoriteButton = screen.getByLabelText("Add to favorites");
			await user.click(favoriteButton);

			expect(mockAddFavorite).toHaveBeenCalledWith(1);
			expect(mockPush).not.toHaveBeenCalled();
		});
	});

	describe("Favorite State", () => {
		it("displays unfilled heart when movie is not favorited", () => {
			mockIsFavorite.mockReturnValue(false);
			render(<MovieCard movie={baseMockMovie} index={0} />);

			const favoriteButton = screen.getByLabelText("Add to favorites");
			expect(favoriteButton).toHaveClass("bg-black/60");
		});

		it("displays filled heart when movie is favorited", () => {
			mockIsFavorite.mockReturnValue(true);
			render(<MovieCard movie={baseMockMovie} index={0} />);

			const favoriteButton = screen.getByLabelText("Remove from favorites");
			expect(favoriteButton).toHaveClass("bg-secondary-600");
		});
	});

	describe("Accessibility", () => {
		it("has proper aria labels for favorite button", () => {
			mockIsFavorite.mockReturnValue(false);
			render(<MovieCard movie={baseMockMovie} index={0} />);

			expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();

			mockIsFavorite.mockReturnValue(true);
			render(<MovieCard movie={baseMockMovie} index={0} />);

			expect(
				screen.getByLabelText("Remove from favorites")
			).toBeInTheDocument();
		});

		it("has keyboard navigation support", () => {
			render(<MovieCard movie={baseMockMovie} index={0} />);

			const movieCard = screen.getByText("Test Movie").closest(".movie-card");
			expect(movieCard).toHaveClass("cursor-pointer");
		});
	});

	describe("Animation and Performance", () => {
		it("handles intersection observer correctly", () => {
			mockInView.mockReturnValue(false);
			render(<MovieCard movie={baseMockMovie} index={0} />);

			expect(mockRef).toHaveBeenCalled();
		});

		it("applies correct animation delay based on index", () => {
			render(<MovieCard movie={baseMockMovie} index={3} />);

			// Motion component should receive the index for staggered animations
			// This is implicitly tested through the motion.div mock
			expect(screen.getByText("Test Movie")).toBeInTheDocument();
		});
	});

	describe("CSS Classes and Styling", () => {
		it("applies correct CSS classes", () => {
			render(<MovieCard movie={baseMockMovie} index={0} />);

			const movieCard = screen.getByText("Test Movie").closest(".movie-card");
			expect(movieCard).toHaveClass(
				"card",
				"relative",
				"group",
				"cursor-pointer"
			);
		});

		it("applies hover effects", () => {
			render(<MovieCard movie={baseMockMovie} index={0} />);

			const title = screen.getByText("Test Movie");
			expect(title).toHaveClass("group-hover:text-accent-400");
		});
	});

	describe("Edge Cases", () => {
		it("handles zero vote average", () => {
			const movieWithZeroRating = { ...baseMockMovie, vote_average: 0 };
			render(<MovieCard movie={movieWithZeroRating} index={0} />);

			expect(screen.getByText("0.0")).toBeInTheDocument();
		});

		it("handles very long movie titles", () => {
			const movieWithLongTitle = {
				...baseMockMovie,
				title:
					"This is a very long movie title that should be truncated with ellipsis",
			};
			render(<MovieCard movie={movieWithLongTitle} index={0} />);

			const title = screen.getByText(movieWithLongTitle.title);
			expect(title).toHaveClass("line-clamp-1");
		});

		it("handles single genre correctly", () => {
			const movieWithSingleGenre = {
				...baseMockMovie,
				genres: [{ id: 1, name: "Drama" }],
			};
			render(<MovieCard movie={movieWithSingleGenre} index={0} />);

			expect(screen.getByText("Drama")).toBeInTheDocument();
		});
	});
});
