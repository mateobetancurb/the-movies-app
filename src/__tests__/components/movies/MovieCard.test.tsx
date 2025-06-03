import { render, screen } from "@testing-library/react";
import MovieCard from "../../../components/movies/MovieCard";
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

// Mock react-intersection-observer
jest.mock("react-intersection-observer", () => ({
	useInView: () => [jest.fn(), true],
}));

// Mock next/image
jest.mock("next/image", () => ({
	__esModule: true,
	default: (props) => {
		return <img {...props} />;
	},
}));

describe("MovieCard", () => {
	const mockMovie: Movie = {
		id: 1,
		title: "Test Movie",
		overview: "Test overview",
		poster_path: "/path.jpg",
		backdrop_path: "/backdrop.jpg",
		vote_average: 8.5,
		vote_count: 100,
		release_date: "2023-01-01",
		genres: [{ id: 1, name: "Action" }],
		cast: [],
	};

	it("renders movie information correctly", () => {
		render(<MovieCard movie={mockMovie} index={0} />);

		expect(screen.getByText("Test Movie")).toBeInTheDocument();
		expect(screen.getByText("2023")).toBeInTheDocument();
		expect(screen.getByText("8.5")).toBeInTheDocument();
		expect(screen.getByText("Action")).toBeInTheDocument();
	});
});
