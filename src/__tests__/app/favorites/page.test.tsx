import { render, screen } from "@testing-library/react";
import Favorites from "../../../app/favorites/page";

// Mock the FavoritesContext
jest.mock("../../../context/FavoritesContext", () => ({
	useFavorites: jest.fn(() => ({
		favorites: [],
		addFavorite: jest.fn(),
		removeFavorite: jest.fn(),
		isFavorite: jest.fn(),
	})),
}));

// Mock next/link
jest.mock("next/link", () => {
	const MockLink = ({ children, href, ...props }: any) => (
		<a href={href} {...props}>
			{children}
		</a>
	);
	MockLink.displayName = "MockLink";
	return MockLink;
});

// Mock MovieGrid component
jest.mock("../../../components/movies/MovieGrid", () => {
	const MockMovieGrid = ({ movies, emptyMessage }: any) => (
		<div data-testid="movie-grid">
			{movies.length > 0 ? `${movies.length} movies` : emptyMessage}
		</div>
	);
	MockMovieGrid.displayName = "MockMovieGrid";
	return MockMovieGrid;
});

// Mock LoadingSpinner component
jest.mock("../../../components/core/LoadingSpinner", () => {
	const MockLoadingSpinner = () => (
		<div data-testid="loading-spinner">Loading...</div>
	);
	MockLoadingSpinner.displayName = "MockLoadingSpinner";
	return MockLoadingSpinner;
});

// Mock movieService
jest.mock("../../../services/movieService", () => ({
	getMovieDetails: jest.fn(),
}));

describe("Favorites Page", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Current Implementation", () => {
		it("renders the favorites page with current layout", () => {
			render(<Favorites />);

			// Test the current implementation with complete layout
			expect(screen.getByText("Your Favorites")).toBeInTheDocument();
			expect(
				screen.getByText("⚠️ This section is under development...")
			).toBeInTheDocument();
			expect(
				screen.getByText(
					"Your personally curated collection of favorite movies."
				)
			).toBeInTheDocument();
		});

		it("renders the main heading as h1 element", () => {
			render(<Favorites />);

			// Verify it's rendered as an h1
			const favoritesHeading = screen.getByText("Your Favorites");
			expect(favoritesHeading.tagName).toBe("H1");
		});

		it("has the correct component structure", () => {
			const { container } = render(<Favorites />);

			// Test that the component renders the complete page layout
			expect(container.firstChild).toHaveClass("container-page", "pt-24");
			expect(screen.getByText("Your Favorites")).toBeInTheDocument();
			expect(screen.getByText("No Favorites Yet")).toBeInTheDocument();
		});

		it("displays empty state when no favorites", () => {
			render(<Favorites />);

			expect(screen.getByText("No Favorites Yet")).toBeInTheDocument();
			expect(
				screen.getByText(
					"Start exploring movies and add them to your favorites by clicking the heart icon."
				)
			).toBeInTheDocument();
			expect(screen.getByText("Browse Movies")).toBeInTheDocument();
		});

		it("shows development warning", () => {
			render(<Favorites />);

			const warningElement = screen.getByText(
				"⚠️ This section is under development..."
			);
			expect(warningElement.tagName).toBe("H2");
			expect(warningElement).toHaveClass(
				"bg-yellow-100",
				"w-fit",
				"text-black",
				"rounded-md",
				"p-2"
			);
		});
	});

	describe("Component Properties", () => {
		it("is a functional component", () => {
			expect(typeof Favorites).toBe("function");
		});

		it("renders without crashing", () => {
			expect(() => render(<Favorites />)).not.toThrow();
		});

		it("renders consistently", () => {
			const { container: container1 } = render(<Favorites />);
			const { container: container2 } = render(<Favorites />);

			expect(container1.innerHTML).toBe(container2.innerHTML);
		});
	});

	describe("Accessibility", () => {
		it("has accessible text content", () => {
			render(<Favorites />);

			// The heading should be accessible
			expect(screen.getByText("Your Favorites")).toBeVisible();
			expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
				"Your Favorites"
			);
		});

		it("maintains proper DOM structure", () => {
			const { container } = render(<Favorites />);

			// Should have structured content with headings and descriptions
			expect(container.querySelector("h1")).toHaveTextContent("Your Favorites");
			expect(container.querySelector("h2")).toHaveTextContent(
				"⚠️ This section is under development..."
			);
		});

		it("has accessible links", () => {
			render(<Favorites />);

			const browseLink = screen.getByText("Browse Movies");
			expect(browseLink).toHaveAttribute("href", "/");
			expect(browseLink).toHaveClass("btn", "btn-primary", "inline-block");
		});
	});
});
