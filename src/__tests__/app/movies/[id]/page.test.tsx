import { render, screen, waitFor } from "@testing-library/react";
import MoviePage from "../../../../app/movies/[id]/page";
import * as movieService from "../../../../services/movieService";
import { MovieDetails } from "../../../../interfaces";

// Mock the movieService module
jest.mock("../../../../services/movieService", () => ({
	getMovieDetails: jest.fn(),
}));

// Mock the components used in the Movie page
jest.mock("../../../../components/movies/MovieHero", () => {
	const MockMovieHero = ({ movie }: { movie: MovieDetails }) => (
		<div data-testid="movie-hero">
			<h1>{movie.title}</h1>
			<p>{movie.overview}</p>
		</div>
	);
	MockMovieHero.displayName = "MockMovieHero";
	return MockMovieHero;
});

jest.mock("../../../../components/movies/MovieCast", () => {
	const MockMovieCast = ({ cast }: { cast: any[] }) => (
		<div data-testid="movie-cast">
			<h2>Cast</h2>
			{cast.map((member) => (
				<div key={member.id} data-testid={`cast-member-${member.id}`}>
					{member.name}
				</div>
			))}
		</div>
	);
	MockMovieCast.displayName = "MockMovieCast";
	return MockMovieCast;
});

jest.mock(
	"../../../../components/movies/sections/SimilarMoviesYouMightLike",
	() => {
		const MockSimilarMoviesYouMightLike = ({
			movieId,
		}: {
			movieId: number;
		}) => (
			<div data-testid="similar-movies-section">
				<h2>Similar Movies</h2>
				<p>Movie ID: {movieId}</p>
			</div>
		);
		MockSimilarMoviesYouMightLike.displayName = "MockSimilarMoviesYouMightLike";
		return MockSimilarMoviesYouMightLike;
	}
);

// Mock Next.js Link component
jest.mock("next/link", () => {
	const MockLink = ({
		children,
		href,
		className,
	}: {
		children: React.ReactNode;
		href: string;
		className?: string;
	}) => (
		<a href={href} className={className} data-testid="back-to-home-link">
			{children}
		</a>
	);
	MockLink.displayName = "MockLink";
	return MockLink;
});

// Mock console.error to suppress error output in tests
const mockConsoleError = jest
	.spyOn(console, "error")
	.mockImplementation(() => {});

describe("Movie Details Page", () => {
	const mockGetMovieDetails =
		movieService.getMovieDetails as jest.MockedFunction<
			typeof movieService.getMovieDetails
		>;

	const mockMovieDetails: MovieDetails = {
		id: 123,
		title: "Test Movie",
		overview: "This is a test movie with an interesting plot.",
		poster_path: "https://image.tmdb.org/t/p/w500/test-poster.jpg",
		backdrop_path: "https://image.tmdb.org/t/p/w1280/test-backdrop.jpg",
		vote_average: 8.5,
		vote_count: 1000,
		release_date: "2023-01-01",
		runtime: 120,
		budget: 50000000,
		revenue: 150000000,
		status: "Released",
		tagline: "A test movie tagline",
		homepage: "https://testmovie.com",
		imdb_id: "tt1234567",
		original_language: "en",
		original_title: "Test Movie Original",
		popularity: 85.5,
		production_companies: [
			{
				id: 1,
				name: "Test Studios",
				logo_path: "/test-logo.png",
				origin_country: "US",
			},
		],
		production_countries: [
			{
				iso_3166_1: "US",
				name: "United States of America",
			},
		],
		spoken_languages: [
			{
				english_name: "English",
				iso_639_1: "en",
				name: "English",
			},
		],
		genres: [
			{ id: 28, name: "Action" },
			{ id: 12, name: "Adventure" },
		],
		cast: [
			{
				id: 1,
				name: "John Doe",
				character: "Hero",
				known_for_department: "Acting",
				order: 0,
				cast_id: 1,
				credit_id: "credit1",
				gender: 2,
				popularity: 10.5,
				profile_path: "https://image.tmdb.org/t/p/w185/john-doe.jpg",
				adult: false,
				original_name: "John Doe",
			},
			{
				id: 2,
				name: "Jane Smith",
				character: "Villain",
				known_for_department: "Acting",
				order: 1,
				cast_id: 2,
				credit_id: "credit2",
				gender: 1,
				popularity: 8.2,
				profile_path: "https://image.tmdb.org/t/p/w185/jane-smith.jpg",
				adult: false,
				original_name: "Jane Smith",
			},
		],
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		mockConsoleError.mockRestore();
	});

	describe("Successful Movie Details Display", () => {
		it("renders movie details page with all components when movie exists", async () => {
			mockGetMovieDetails.mockResolvedValue(mockMovieDetails);
			const params = Promise.resolve({ id: "123" });

			render(await MoviePage({ params }));

			// Check that MovieHero component is rendered
			await waitFor(() => {
				expect(screen.getByTestId("movie-hero")).toBeInTheDocument();
			});

			// Check movie title and overview are displayed
			expect(screen.getByText("Test Movie")).toBeInTheDocument();
			expect(
				screen.getByText("This is a test movie with an interesting plot.")
			).toBeInTheDocument();

			// Check that MovieCast component is rendered
			expect(screen.getByTestId("movie-cast")).toBeInTheDocument();
			expect(screen.getByText("Cast")).toBeInTheDocument();

			// Check cast members are displayed
			expect(screen.getByTestId("cast-member-1")).toBeInTheDocument();
			expect(screen.getByText("John Doe")).toBeInTheDocument();
			expect(screen.getByTestId("cast-member-2")).toBeInTheDocument();
			expect(screen.getByText("Jane Smith")).toBeInTheDocument();

			// Check that SimilarMoviesYouMightLike component is rendered
			expect(screen.getByTestId("similar-movies-section")).toBeInTheDocument();
			expect(screen.getByText("Similar Movies")).toBeInTheDocument();
			expect(screen.getByText("Movie ID: 123")).toBeInTheDocument();

			// Check that container-page class is applied
			const containerPage = screen
				.getByTestId("movie-cast")
				.closest(".container-page");
			expect(containerPage).toBeInTheDocument();

			// Verify movieService was called with correct parameters
			expect(mockGetMovieDetails).toHaveBeenCalledTimes(1);
			expect(mockGetMovieDetails).toHaveBeenCalledWith(123);
		});

		it("handles movie details with empty cast array", async () => {
			const movieWithoutCast = {
				...mockMovieDetails,
				cast: [],
			};
			mockGetMovieDetails.mockResolvedValue(movieWithoutCast);
			const params = Promise.resolve({ id: "123" });

			render(await MoviePage({ params }));

			await waitFor(() => {
				expect(screen.getByTestId("movie-hero")).toBeInTheDocument();
			});

			// MovieCast component should still render even with empty cast
			expect(screen.getByTestId("movie-cast")).toBeInTheDocument();
			expect(screen.getByText("Cast")).toBeInTheDocument();

			// No cast members should be present
			expect(screen.queryByTestId("cast-member-1")).not.toBeInTheDocument();
			expect(screen.queryByTestId("cast-member-2")).not.toBeInTheDocument();

			expect(mockGetMovieDetails).toHaveBeenCalledWith(123);
		});

		it("correctly parses movie ID from params", async () => {
			mockGetMovieDetails.mockResolvedValue(mockMovieDetails);
			const params = Promise.resolve({ id: "456" });

			render(await MoviePage({ params }));

			await waitFor(() => {
				expect(screen.getByTestId("movie-hero")).toBeInTheDocument();
			});

			// Verify movieService was called with parsed ID
			expect(mockGetMovieDetails).toHaveBeenCalledWith(456);

			// Verify SimilarMoviesYouMightLike receives the correct movie ID
			expect(screen.getByText("Movie ID: 456")).toBeInTheDocument();
		});
	});

	describe("Movie Not Found Scenario", () => {
		it("renders 'Movie not found' message when movie does not exist", async () => {
			mockGetMovieDetails.mockResolvedValue(null);
			const params = Promise.resolve({ id: "999" });

			render(await MoviePage({ params }));

			await waitFor(() => {
				expect(screen.getByText("Movie not found")).toBeInTheDocument();
			});

			// Check that the error message has correct styling
			const errorMessage = screen.getByText("Movie not found");
			expect(errorMessage).toHaveClass("py-20", "text-center", "text-2xl");

			// Check that Back to Home link is present
			expect(screen.getByTestId("back-to-home-link")).toBeInTheDocument();
			expect(screen.getByText("Back to Home")).toBeInTheDocument();

			// Check that the link has correct href and styling
			const backLink = screen.getByTestId("back-to-home-link");
			expect(backLink).toHaveAttribute("href", "/");
			expect(backLink).toHaveClass("bg-[#4F46E5]", "mt-10", "rounded-md");

			// Check that the link container has correct styling
			const linkContainer = backLink.closest(".mx-auto");
			expect(linkContainer).toHaveClass("mx-auto", "text-center", "mb-10");

			// Verify that main movie components are not rendered
			expect(screen.queryByTestId("movie-hero")).not.toBeInTheDocument();
			expect(screen.queryByTestId("movie-cast")).not.toBeInTheDocument();
			expect(
				screen.queryByTestId("similar-movies-section")
			).not.toBeInTheDocument();

			// Verify movieService was called
			expect(mockGetMovieDetails).toHaveBeenCalledWith(999);
		});

		it("handles movieService throwing an error", async () => {
			mockGetMovieDetails.mockRejectedValue(new Error("API Error"));
			const params = Promise.resolve({ id: "123" });

			// The page should handle the error gracefully
			await expect(async () => {
				render(await MoviePage({ params }));
			}).rejects.toThrow("API Error");

			expect(mockGetMovieDetails).toHaveBeenCalledWith(123);
		});
	});

	describe("Edge Cases", () => {
		it("handles string movie ID conversion correctly", async () => {
			mockGetMovieDetails.mockResolvedValue(mockMovieDetails);
			const params = Promise.resolve({ id: "0" });

			render(await MoviePage({ params }));

			// Should convert "0" to 0
			expect(mockGetMovieDetails).toHaveBeenCalledWith(0);
		});

		it("handles very large movie ID", async () => {
			mockGetMovieDetails.mockResolvedValue(mockMovieDetails);
			const params = Promise.resolve({ id: "999999999" });

			render(await MoviePage({ params }));

			expect(mockGetMovieDetails).toHaveBeenCalledWith(999999999);
		});

		it("renders correctly with minimal movie data", async () => {
			const minimalMovieDetails: MovieDetails = {
				id: 123,
				title: "Minimal Movie",
				overview: "Basic overview",
				poster_path: null,
				backdrop_path: null,
				vote_average: 0,
				vote_count: 0,
				release_date: "",
				runtime: 0,
				budget: 0,
				revenue: 0,
				status: "Released",
				tagline: "",
				homepage: "",
				imdb_id: "",
				original_language: "en",
				original_title: "Minimal Movie",
				popularity: 0,
				production_companies: [],
				production_countries: [],
				spoken_languages: [],
				genres: [],
				cast: [],
			};

			mockGetMovieDetails.mockResolvedValue(minimalMovieDetails);
			const params = Promise.resolve({ id: "123" });

			render(await MoviePage({ params }));

			await waitFor(() => {
				expect(screen.getByTestId("movie-hero")).toBeInTheDocument();
			});

			expect(screen.getByText("Minimal Movie")).toBeInTheDocument();
			expect(screen.getByText("Basic overview")).toBeInTheDocument();
			expect(screen.getByTestId("movie-cast")).toBeInTheDocument();
			expect(screen.getByTestId("similar-movies-section")).toBeInTheDocument();
		});
	});
});
