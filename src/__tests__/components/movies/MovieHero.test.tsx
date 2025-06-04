import { render, screen, fireEvent } from "@testing-library/react";
import MovieHero from "../../../components/movies/MovieHero";
import { Movie } from "../../../interfaces";
import React from "react";

// Mock the useFavorites hook
jest.mock("../../../context/FavoritesContext", () => ({
	useFavorites: () => ({
		isFavorite: jest.fn(() => false),
		addFavorite: jest.fn(),
		removeFavorite: jest.fn(),
	}),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: jest.fn(),
	}),
}));

// Mock next/image
jest.mock("next/image", () => ({
	__esModule: true,
	default: ({ src, alt, ...props }: any) => {
		return <img src={src} alt={alt} {...props} />;
	},
}));

describe("MovieHero", () => {
	const mockMovie: Movie = {
		id: 1,
		title: "Test Movie",
		overview:
			"This is a test movie with a compelling storyline that captivates audiences.",
		poster_path: "/test-poster.jpg",
		backdrop_path: "/test-backdrop.jpg",
		vote_average: 8.5,
		vote_count: 1250,
		release_date: "2023-06-15",
		genres: [
			{ id: 1, name: "Action" },
			{ id: 2, name: "Adventure" },
		],
		cast: [],
		runtime: 142,
	};

	const mockMovieWithoutBackdrop: Movie = {
		...mockMovie,
		backdrop_path: null,
	};

	const mockMovieWithoutRuntime: Movie = {
		...mockMovie,
		runtime: undefined,
	};

	const mockMovieWithoutGenres: Movie = {
		...mockMovie,
		genres: [],
	};

	it("renders movie information correctly", () => {
		render(<MovieHero movie={mockMovie} />);

		expect(screen.getByText("Test Movie")).toBeInTheDocument();
		expect(screen.getByText(/This is a test movie/)).toBeInTheDocument();
		expect(screen.getByText("8.5 (1250 reviews)")).toBeInTheDocument();
		expect(screen.getByText("142 minutes")).toBeInTheDocument();
		expect(screen.getByText("2023")).toBeInTheDocument();
		expect(screen.getByText("Action")).toBeInTheDocument();
		expect(screen.getByText("Adventure")).toBeInTheDocument();
	});

	it("renders backdrop image when available", () => {
		render(<MovieHero movie={mockMovie} />);

		const backdropImage = screen.getByAltText("Test Movie backdrop");
		expect(backdropImage).toBeInTheDocument();
		expect(backdropImage).toHaveAttribute("src", "/test-backdrop.jpg");
	});

	it("renders fallback content when backdrop is not available", () => {
		render(<MovieHero movie={mockMovieWithoutBackdrop} />);

		// Use getAllByText to handle multiple instances of "Test Movie"
		const titleElements = screen.getAllByText("Test Movie");
		expect(titleElements.length).toBeGreaterThan(0);
		expect(screen.getByText("No backdrop available")).toBeInTheDocument();
		expect(
			screen.queryByAltText("Test Movie backdrop")
		).not.toBeInTheDocument();
	});

	it("hides runtime when not available", () => {
		render(<MovieHero movie={mockMovieWithoutRuntime} />);

		expect(screen.queryByText(/minutes/)).not.toBeInTheDocument();
	});

	it("handles movies without genres", () => {
		render(<MovieHero movie={mockMovieWithoutGenres} />);

		// Check that title is rendered
		const titleElements = screen.getAllByText("Test Movie");
		expect(titleElements.length).toBeGreaterThan(0);
		expect(screen.queryByText("Action")).not.toBeInTheDocument();
		expect(screen.queryByText("Adventure")).not.toBeInTheDocument();
	});

	it("renders action buttons", () => {
		render(<MovieHero movie={mockMovie} />);

		const watchTrailerButton = screen.getByRole("button", {
			name: /watch trailer/i,
		});
		const addToFavoritesButton = screen.getByRole("button", {
			name: /add to favorites/i,
		});

		expect(watchTrailerButton).toBeInTheDocument();
		expect(addToFavoritesButton).toBeInTheDocument();
	});

	it("formats vote average correctly", () => {
		const movieWithDecimal: Movie = {
			...mockMovie,
			vote_average: 7.856,
		};

		render(<MovieHero movie={movieWithDecimal} />);

		expect(screen.getByText("7.9 (1250 reviews)")).toBeInTheDocument();
	});

	it("displays star icon with rating", () => {
		render(<MovieHero movie={mockMovie} />);

		const starIcon = screen
			.getByText("8.5 (1250 reviews)")
			.closest("div")
			?.querySelector("svg");
		expect(starIcon).toBeInTheDocument();
	});

	it("displays clock icon with runtime", () => {
		render(<MovieHero movie={mockMovie} />);

		const runtimeText = screen.getByText("142 minutes");
		const clockIcon = runtimeText.closest("div")?.querySelector("svg");
		expect(clockIcon).toBeInTheDocument();
	});

	it("displays play icon in watch trailer button", () => {
		render(<MovieHero movie={mockMovie} />);

		const watchTrailerButton = screen.getByRole("button", {
			name: /watch trailer/i,
		});
		const playIcon = watchTrailerButton.querySelector("svg");
		expect(playIcon).toBeInTheDocument();
	});

	it("applies correct CSS classes for styling", () => {
		const { container } = render(<MovieHero movie={mockMovie} />);

		// Check for key styling classes
		expect(container.querySelector(".relative")).toBeInTheDocument();
		expect(container.querySelector(".btn-primary")).toBeInTheDocument();
		expect(container.querySelector(".animate-slide-up")).toBeInTheDocument();
	});

	it("handles genre separation correctly", () => {
		render(<MovieHero movie={mockMovie} />);

		// Check that genres are separated by bullet points
		const genreContainer = screen.getByText("Action").closest("div");
		expect(genreContainer).toHaveTextContent("Action•Adventure");
	});

	it("handles movies with single genre", () => {
		const singleGenreMovie: Movie = {
			...mockMovie,
			genres: [{ id: 1, name: "Action" }],
		};

		render(<MovieHero movie={singleGenreMovie} />);

		expect(screen.getByText("Action")).toBeInTheDocument();
		// Should not have bullet separator for single genre
		const genreContainer = screen.getByText("Action").closest("div");
		expect(genreContainer).not.toHaveTextContent("•");
	});

	it("extracts and displays correct release year", () => {
		const movieWithDifferentDate: Movie = {
			...mockMovie,
			release_date: "1999-12-31",
		};

		render(<MovieHero movie={movieWithDifferentDate} />);

		expect(screen.getByText("1999")).toBeInTheDocument();
	});

	it("maintains responsive layout classes", () => {
		const { container } = render(<MovieHero movie={mockMovie} />);

		// Check for responsive classes - get the main title (h1)
		const title = container.querySelector("h1");
		expect(title).toHaveClass("text-4xl", "md:text-5xl");

		const mainContainer = container.querySelector(".container");
		expect(mainContainer).toHaveClass("mx-auto", "px-4", "sm:px-6", "lg:px-8");
	});
});
