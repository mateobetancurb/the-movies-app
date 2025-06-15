import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainContent from "../../../components/categories/MainContent";
import { Genre } from "../../../interfaces";

// Mock framer-motion
jest.mock("framer-motion", () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
		h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
		h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
	},
}));

// Mock SearchBar component
jest.mock("../../../components/core/SearchBar", () => {
	return function MockSearchBar({
		onSearch,
		placeholder,
	}: {
		onSearch: (query: string) => void;
		placeholder?: string;
	}) {
		return (
			<div data-testid="search-bar">
				<input
					data-testid="search-input"
					placeholder={placeholder}
					onChange={(e) => onSearch(e.target.value)}
				/>
			</div>
		);
	};
});

// Mock CategoryCard component
jest.mock("../../../components/categories/CategoryCard", () => {
	return function MockCategoryCard({
		category,
		index,
	}: {
		category: any;
		index: number;
	}) {
		return (
			<div data-testid={`category-card-${category.id}`}>
				<h3>{category.name}</h3>
				<span data-testid="category-index">{index}</span>
			</div>
		);
	};
});

// Mock MovieGrid component
jest.mock("../../../components/movies/MovieGrid", () => {
	return function MockMovieGrid({
		movies,
		title,
		emptyMessage,
	}: {
		movies: any[];
		title: string;
		emptyMessage: string;
	}) {
		return (
			<div data-testid="movie-grid">
				<h3 data-testid="movie-grid-title">{title}</h3>
				{movies.length === 0 && (
					<p data-testid="empty-message">{emptyMessage}</p>
				)}
				{movies.map((movie) => (
					<div key={movie.id} data-testid={`movie-${movie.id}`}>
						{movie.title}
					</div>
				))}
			</div>
		);
	};
});

describe("MainContent", () => {
	const mockGenres: Genre[] = [
		{ id: 1, name: "Action" },
		{ id: 2, name: "Comedy" },
		{ id: 3, name: "Drama" },
		{ id: 4, name: "Horror" },
		{ id: 5, name: "Romance" },
		{ id: 6, name: "Sci-Fi" },
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Initial Rendering", () => {
		it("renders main title correctly", () => {
			render(<MainContent genres={mockGenres} />);

			expect(
				screen.getByRole("heading", { name: "Movie Categories", level: 1 })
			).toBeInTheDocument();
		});

		it("renders SearchBar with correct placeholder", () => {
			render(<MainContent genres={mockGenres} />);

			const searchBar = screen.getByTestId("search-bar");
			expect(searchBar).toBeInTheDocument();

			const searchInput = screen.getByTestId("search-input");
			expect(searchInput).toHaveAttribute(
				"placeholder",
				"Search genres or categories..."
			);
		});

		it("applies correct CSS classes to main container", () => {
			render(<MainContent genres={mockGenres} />);

			const mainContainer = screen.getByRole("heading", {
				name: "Movie Categories",
			}).parentElement;
			expect(mainContainer).toHaveClass("container-page", "pt-24");
		});

		it("applies correct CSS classes to main title", () => {
			render(<MainContent genres={mockGenres} />);

			const title = screen.getByRole("heading", {
				name: "Movie Categories",
				level: 1,
			});
			expect(title).toHaveClass("text-3xl", "font-bold", "mb-6");
		});
	});

	describe("Default State (No Search Query)", () => {
		it("renders Featured Collections section", () => {
			render(<MainContent genres={mockGenres} />);

			expect(
				screen.getByRole("heading", { name: "Featured Collections", level: 2 })
			).toBeInTheDocument();
		});

		it("applies correct CSS classes to Featured Collections title", () => {
			render(<MainContent genres={mockGenres} />);

			const featuredTitle = screen.getByRole("heading", {
				name: "Featured Collections",
				level: 2,
			});
			expect(featuredTitle).toHaveClass("text-2xl", "font-bold", "mb-6");
		});

		it("renders all genre categories as CategoryCards", () => {
			render(<MainContent genres={mockGenres} />);

			mockGenres.forEach((genre) => {
				const card = screen.getByTestId(`category-card-${genre.id}`);
				expect(card).toBeInTheDocument();

				// Check that the genre name is displayed in the card's title
				const titleElement = card.querySelector("h3");
				expect(titleElement).toHaveTextContent(genre.name);
			});
		});

		it("passes correct props to CategoryCard components", () => {
			render(<MainContent genres={mockGenres} />);

			mockGenres.forEach((genre, index) => {
				const card = screen.getByTestId(`category-card-${genre.id}`);
				expect(card).toBeInTheDocument();

				// Check that the genre name is displayed in the card
				const titleElement = card.querySelector("h3");
				expect(titleElement).toHaveTextContent(genre.name);

				// Check that index is passed correctly (note: multiple index elements exist, so we check within the card)
				const indexElement = card.querySelector(
					'[data-testid="category-index"]'
				);
				expect(indexElement).toHaveTextContent(index.toString());
			});
		});

		it("applies correct grid layout classes to categories container", () => {
			render(<MainContent genres={mockGenres} />);

			const gridContainer = screen.getByRole("heading", {
				name: "Featured Collections",
			}).nextElementSibling;
			expect(gridContainer).toHaveClass(
				"grid",
				"grid-cols-1",
				"sm:grid-cols-2",
				"md:grid-cols-3",
				"gap-6"
			);
		});

		it("does not render MovieGrid when no search query", () => {
			render(<MainContent genres={mockGenres} />);

			expect(screen.queryByTestId("movie-grid")).not.toBeInTheDocument();
		});
	});

	describe("Search Functionality", () => {
		it("updates search state when handleSearch is called", async () => {
			const user = userEvent.setup();
			render(<MainContent genres={mockGenres} />);

			const searchInput = screen.getByTestId("search-input");

			await user.type(searchInput, "action");

			await waitFor(() => {
				expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
			});
		});

		it("hides Featured Collections section when search query exists", async () => {
			const user = userEvent.setup();
			render(<MainContent genres={mockGenres} />);

			// Initially, Featured Collections should be visible
			expect(
				screen.getByRole("heading", { name: "Featured Collections" })
			).toBeInTheDocument();

			const searchInput = screen.getByTestId("search-input");
			await user.type(searchInput, "comedy");

			await waitFor(() => {
				expect(
					screen.queryByRole("heading", { name: "Featured Collections" })
				).not.toBeInTheDocument();
			});
		});

		it("shows MovieGrid with correct title when search query exists", async () => {
			const user = userEvent.setup();
			render(<MainContent genres={mockGenres} />);

			const searchInput = screen.getByTestId("search-input");
			await user.type(searchInput, "thriller");

			await waitFor(() => {
				const movieGrid = screen.getByTestId("movie-grid");
				expect(movieGrid).toBeInTheDocument();

				const gridTitle = screen.getByTestId("movie-grid-title");
				expect(gridTitle).toHaveTextContent('Search results for "thriller"');
			});
		});

		it("passes correct props to MovieGrid component during search", async () => {
			const user = userEvent.setup();
			render(<MainContent genres={mockGenres} />);

			const searchInput = screen.getByTestId("search-input");
			await user.type(searchInput, "horror");

			await waitFor(() => {
				const movieGrid = screen.getByTestId("movie-grid");
				expect(movieGrid).toBeInTheDocument();

				// Check that empty movies array is passed
				expect(screen.queryByTestId("movie-horror")).not.toBeInTheDocument();

				// Check that correct empty message is passed
				const emptyMessage = screen.getByTestId("empty-message");
				expect(emptyMessage).toHaveTextContent(
					"No movies found in this category"
				);
			});
		});

		it("clears search results when search query is removed", async () => {
			const user = userEvent.setup();
			render(<MainContent genres={mockGenres} />);

			const searchInput = screen.getByTestId("search-input");

			// Type search query
			await user.type(searchInput, "drama");

			await waitFor(() => {
				expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
			});

			// Clear search query
			await user.clear(searchInput);

			await waitFor(() => {
				expect(screen.queryByTestId("movie-grid")).not.toBeInTheDocument();
				expect(
					screen.getByRole("heading", { name: "Featured Collections" })
				).toBeInTheDocument();
			});
		});
	});

	describe("Edge Cases", () => {
		it("handles empty genres array gracefully", () => {
			render(<MainContent genres={[]} />);

			expect(
				screen.getByRole("heading", { name: "Movie Categories" })
			).toBeInTheDocument();
			expect(
				screen.getByRole("heading", { name: "Featured Collections" })
			).toBeInTheDocument();

			// No category cards should be rendered
			expect(screen.queryByTestId(/category-card-/)).not.toBeInTheDocument();
		});

		it("handles search with empty string", async () => {
			const user = userEvent.setup();
			render(<MainContent genres={mockGenres} />);

			const searchInput = screen.getByTestId("search-input");

			// Type and then clear
			await user.type(searchInput, "test");
			await user.clear(searchInput);

			await waitFor(() => {
				expect(screen.queryByTestId("movie-grid")).not.toBeInTheDocument();
				expect(
					screen.getByRole("heading", { name: "Featured Collections" })
				).toBeInTheDocument();
			});
		});

		it("handles search with whitespace-only query", async () => {
			const user = userEvent.setup();
			render(<MainContent genres={mockGenres} />);

			const searchInput = screen.getByTestId("search-input");
			await user.type(searchInput, "   ");

			await waitFor(() => {
				expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
				const gridTitle = screen.getByTestId("movie-grid-title");
				expect(gridTitle).toHaveTextContent('Search results for " "');
			});
		});
	});

	describe("Component Structure", () => {
		it("maintains correct section structure", () => {
			render(<MainContent genres={mockGenres} />);

			const mainContainer = screen.getByRole("heading", {
				name: "Movie Categories",
			}).parentElement;

			// Should have main title, search bar, and featured section
			expect(mainContainer?.children).toHaveLength(3);
		});

		it("applies correct CSS classes to search bar container", () => {
			render(<MainContent genres={mockGenres} />);

			const searchBarContainer = screen.getByTestId("search-bar").parentElement;
			expect(searchBarContainer).toHaveClass("mb-8");
		});

		it("applies correct CSS classes to featured section", () => {
			render(<MainContent genres={mockGenres} />);

			const featuredSection = screen.getByRole("heading", {
				name: "Featured Collections",
			}).parentElement;
			expect(featuredSection).toHaveClass("my-8");
		});
	});

	describe("Animation Properties", () => {
		it("applies initial and animate properties to main container", () => {
			render(<MainContent genres={mockGenres} />);

			const mainContainer = screen.getByRole("heading", {
				name: "Movie Categories",
			}).parentElement;

			// Check that motion.div props are applied (mocked framer-motion should preserve these)
			expect(mainContainer).toHaveAttribute("initial");
			expect(mainContainer).toHaveAttribute("animate");
			expect(mainContainer).toHaveAttribute("transition");
		});

		it("applies animation properties to title elements", () => {
			render(<MainContent genres={mockGenres} />);

			const mainTitle = screen.getByRole("heading", {
				name: "Movie Categories",
			});
			const featuredTitle = screen.getByRole("heading", {
				name: "Featured Collections",
			});

			// Check that motion properties are preserved
			expect(mainTitle).toHaveAttribute("initial");
			expect(mainTitle).toHaveAttribute("animate");
			expect(mainTitle).toHaveAttribute("transition");

			expect(featuredTitle).toHaveAttribute("initial");
			expect(featuredTitle).toHaveAttribute("animate");
			expect(featuredTitle).toHaveAttribute("transition");
		});
	});
});
