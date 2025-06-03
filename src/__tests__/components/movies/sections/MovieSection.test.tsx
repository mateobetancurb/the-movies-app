import { render, screen } from "@testing-library/react";
import MovieSection from "../../../../components/movies/sections/MovieSection";
import { Movie } from "../../../../interfaces";

// Mock the MovieGrid component
jest.mock("../../../../components/movies/MovieGrid", () => {
	return function MockMovieGrid({ movies, title, emptyMessage }) {
		return (
			<div data-testid="movie-grid">
				<div data-testid="title">{title}</div>
				<div data-testid="empty-message">{emptyMessage}</div>
				<div data-testid="movies-count">{movies.length}</div>
			</div>
		);
	};
});

describe("MovieSection", () => {
	const mockMovies: Movie[] = [
		{
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
		},
	];

	it("passes props correctly to MovieGrid", () => {
		render(<MovieSection title="Test Title" movies={mockMovies} />);

		expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
		expect(screen.getByTestId("title")).toHaveTextContent("Test Title");
		expect(screen.getByTestId("movies-count")).toHaveTextContent("1");
	});

	it("uses default empty message when not provided", () => {
		render(<MovieSection title="Test Title" movies={[]} />);

		expect(screen.getByTestId("empty-message")).toHaveTextContent(
			"No movies available"
		);
	});

	it("uses custom empty message when provided", () => {
		render(
			<MovieSection
				title="Test Title"
				movies={[]}
				emptyMessage="Custom empty message"
			/>
		);

		expect(screen.getByTestId("empty-message")).toHaveTextContent(
			"Custom empty message"
		);
	});
});
