import { render, screen } from "@testing-library/react";
import MovieGrid from "../../../components/movies/MovieGrid";
import { Movie } from "../../../interfaces";
import React from "react";

// Mock framer-motion
jest.mock("framer-motion", () => ({
	motion: {
		h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
}));

// Mock MovieCard component
jest.mock("../../../components/movies/MovieCard", () => {
	return function MockMovieCard({
		movie,
		index,
	}: {
		movie: Movie;
		index: number;
	}) {
		return (
			<div data-testid={`movie-card-${movie.id}`} data-index={index}>
				<h3>{movie.title}</h3>
				<p>{movie.release_date}</p>
				<span>{movie.vote_average}</span>
			</div>
		);
	};
});

describe("MovieGrid", () => {
	const createMockMovie = (overrides: Partial<Movie> = {}): Movie => ({
		id: 1,
		title: "Test Movie",
		overview: "Test overview",
		poster_path: "/path.jpg",
		backdrop_path: "/backdrop.jpg",
		vote_average: 8.5,
		vote_count: 100,
		release_date: "2023-01-01",
		runtime: 120,
		genres: [{ id: 1, name: "Action" }],
		cast: [],
		...overrides,
	});

	const mockMovies = [
		createMockMovie({ id: 1, title: "Movie One" }),
		createMockMovie({ id: 2, title: "Movie Two" }),
		createMockMovie({ id: 3, title: "Movie Three" }),
	];

	describe("Rendering with Movies", () => {
		it("renders movies in a grid layout", () => {
			render(<MovieGrid movies={mockMovies} />);

			// Check that all movies are rendered
			expect(screen.getByTestId("movie-card-1")).toBeInTheDocument();
			expect(screen.getByTestId("movie-card-2")).toBeInTheDocument();
			expect(screen.getByTestId("movie-card-3")).toBeInTheDocument();

			// Check that movie titles are displayed
			expect(screen.getByText("Movie One")).toBeInTheDocument();
			expect(screen.getByText("Movie Two")).toBeInTheDocument();
			expect(screen.getByText("Movie Three")).toBeInTheDocument();
		});

		it("renders section title when provided", () => {
			const title = "Popular Movies";
			render(<MovieGrid movies={mockMovies} title={title} />);

			expect(screen.getByText(title)).toBeInTheDocument();
			expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
				title
			);
		});

		it("does not render title when not provided", () => {
			render(<MovieGrid movies={mockMovies} />);

			expect(
				screen.queryByRole("heading", { level: 2 })
			).not.toBeInTheDocument();
		});

		it("passes correct index to each MovieCard", () => {
			render(<MovieGrid movies={mockMovies} />);

			expect(screen.getByTestId("movie-card-1")).toHaveAttribute(
				"data-index",
				"0"
			);
			expect(screen.getByTestId("movie-card-2")).toHaveAttribute(
				"data-index",
				"1"
			);
			expect(screen.getByTestId("movie-card-3")).toHaveAttribute(
				"data-index",
				"2"
			);
		});

		it("applies correct grid CSS classes", () => {
			render(<MovieGrid movies={mockMovies} />);

			const gridContainer = screen.getByTestId("movie-card-1").parentElement;
			expect(gridContainer).toHaveClass(
				"grid",
				"grid-cols-1",
				"sm:grid-cols-3",
				"md:grid-cols-4",
				"lg:grid-cols-5",
				"gap-4",
				"md:gap-6",
				"mb-10",
				"md:mb-20"
			);
		});
	});

	describe("Empty State", () => {
		it("displays default empty message when no movies provided", () => {
			render(<MovieGrid movies={[]} />);

			expect(screen.getByText("No movies found")).toBeInTheDocument();
			expect(screen.queryByTestId(/movie-card/)).not.toBeInTheDocument();
		});

		it("displays custom empty message when provided", () => {
			const customMessage = "No favorite movies yet";
			render(<MovieGrid movies={[]} emptyMessage={customMessage} />);

			expect(screen.getByText(customMessage)).toBeInTheDocument();
			expect(screen.queryByText("No movies found")).not.toBeInTheDocument();
		});

		it("applies correct styling to empty state", () => {
			render(<MovieGrid movies={[]} />);

			const emptyMessage = screen.getByText("No movies found");
			expect(emptyMessage).toHaveClass("text-gray-400");
			expect(emptyMessage.parentElement).toHaveClass("py-12", "text-center");
		});

		it("shows empty state even when title is provided", () => {
			render(
				<MovieGrid
					movies={[]}
					title="My Favorites"
					emptyMessage="No favorites yet"
				/>
			);

			expect(screen.getByText("My Favorites")).toBeInTheDocument();
			expect(screen.getByText("No favorites yet")).toBeInTheDocument();
		});
	});

	describe("Different Movie Counts", () => {
		it("handles single movie", () => {
			const singleMovie = [createMockMovie({ id: 1, title: "Single Movie" })];
			render(<MovieGrid movies={singleMovie} />);

			expect(screen.getByTestId("movie-card-1")).toBeInTheDocument();
			expect(screen.getByText("Single Movie")).toBeInTheDocument();
			expect(screen.queryByTestId("movie-card-2")).not.toBeInTheDocument();
		});

		it("handles large number of movies", () => {
			const manyMovies = Array.from({ length: 20 }, (_, i) =>
				createMockMovie({ id: i + 1, title: `Movie ${i + 1}` })
			);
			render(<MovieGrid movies={manyMovies} />);

			// Check first and last movies
			expect(screen.getByTestId("movie-card-1")).toBeInTheDocument();
			expect(screen.getByTestId("movie-card-20")).toBeInTheDocument();
			expect(screen.getByText("Movie 1")).toBeInTheDocument();
			expect(screen.getByText("Movie 20")).toBeInTheDocument();
		});
	});

	describe("Movie Data Variations", () => {
		it("handles movies with missing data", () => {
			const moviesWithMissingData = [
				createMockMovie({
					id: 1,
					title: "Complete Movie",
					release_date: "2023-01-01",
					vote_average: 8.5,
				}),
				createMockMovie({
					id: 2,
					title: "Movie Without Date",
					release_date: "",
					vote_average: 7.0,
				}),
				createMockMovie({
					id: 3,
					title: "Movie With Zero Rating",
					release_date: "2022-12-25",
					vote_average: 0,
				}),
			];

			render(<MovieGrid movies={moviesWithMissingData} />);

			expect(screen.getByText("Complete Movie")).toBeInTheDocument();
			expect(screen.getByText("Movie Without Date")).toBeInTheDocument();
			expect(screen.getByText("Movie With Zero Rating")).toBeInTheDocument();
		});

		it("handles movies with special characters in titles", () => {
			const moviesWithSpecialTitles = [
				createMockMovie({ id: 1, title: "Movie: The Sequel" }),
				createMockMovie({ id: 2, title: "Movie & Friends" }),
				createMockMovie({ id: 3, title: "Movie (2023)" }),
				createMockMovie({ id: 4, title: "Movie - Director's Cut" }),
			];

			render(<MovieGrid movies={moviesWithSpecialTitles} />);

			expect(screen.getByText("Movie: The Sequel")).toBeInTheDocument();
			expect(screen.getByText("Movie & Friends")).toBeInTheDocument();
			expect(screen.getByText("Movie (2023)")).toBeInTheDocument();
			expect(screen.getByText("Movie - Director's Cut")).toBeInTheDocument();
		});
	});

	describe("Component Structure", () => {
		it("wraps content in a section element", () => {
			render(<MovieGrid movies={mockMovies} title="Test Section" />);

			const section = screen.getByTestId("movie-card-1").closest("section");
			expect(section).toBeInTheDocument();
			expect(section).toHaveClass("my-8");
		});

		it("maintains proper semantic structure", () => {
			render(<MovieGrid movies={mockMovies} title="Popular Movies" />);

			// Check that heading is properly structured
			const heading = screen.getByRole("heading", { level: 2 });
			expect(heading).toHaveTextContent("Popular Movies");

			// Check that movies are in a proper container
			const movieContainer = screen.getByTestId("movie-card-1").parentElement;
			expect(movieContainer).toBeDefined();
		});
	});

	describe("Accessibility", () => {
		it("provides meaningful section labeling when title is provided", () => {
			render(<MovieGrid movies={mockMovies} title="Trending Movies" />);

			const section = screen.getByTestId("movie-card-1").closest("section");
			const heading = screen.getByRole("heading", { level: 2 });
			expect(heading).toBeInTheDocument();
			expect(section).toContainElement(heading);
		});

		it("maintains readable empty state", () => {
			render(<MovieGrid movies={[]} emptyMessage="No results found" />);

			const emptyMessage = screen.getByText("No results found");
			expect(emptyMessage).toBeVisible();
		});
	});

	describe("Animation Integration", () => {
		it("applies motion components correctly", () => {
			render(<MovieGrid movies={mockMovies} title="Animated Movies" />);

			// The title should be wrapped in a motion.h2
			const title = screen.getByText("Animated Movies");
			expect(title.tagName).toBe("H2");

			// Empty state should also use motion component
			render(<MovieGrid movies={[]} />);
			const emptyMessage = screen.getByText("No movies found");
			expect(emptyMessage.parentElement?.tagName).toBe("DIV");
		});
	});

	describe("Props Validation", () => {
		it("handles undefined title gracefully", () => {
			render(<MovieGrid movies={mockMovies} title={undefined} />);

			expect(
				screen.queryByRole("heading", { level: 2 })
			).not.toBeInTheDocument();
			expect(screen.getByText("Movie One")).toBeInTheDocument();
		});

		it("handles undefined emptyMessage gracefully", () => {
			render(<MovieGrid movies={[]} emptyMessage={undefined} />);

			expect(screen.getByText("No movies found")).toBeInTheDocument();
		});

		it("handles empty string title", () => {
			render(<MovieGrid movies={mockMovies} title="" />);

			expect(
				screen.queryByRole("heading", { level: 2 })
			).not.toBeInTheDocument();
		});

		it("handles empty string emptyMessage", () => {
			render(<MovieGrid movies={[]} emptyMessage="" />);

			expect(screen.queryByText("No movies found")).not.toBeInTheDocument();
			// Should still render the empty state container
			const emptyContainer = document.querySelector(".py-12.text-center");
			expect(emptyContainer).toBeInTheDocument();
		});
	});
});
