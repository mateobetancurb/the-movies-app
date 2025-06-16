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

describe("Favorites Page", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Current Implementation", () => {
		it("renders the favorites page with current simple implementation", () => {
			render(<Favorites />);

			// Test the current implementation which just renders "Favorites"
			expect(screen.getByText("Favorites")).toBeInTheDocument();
		});

		it("renders as a paragraph element", () => {
			render(<Favorites />);

			// Verify it's rendered as a paragraph
			const favoritesText = screen.getByText("Favorites");
			expect(favoritesText.tagName).toBe("P");
		});

		it("has the correct component structure", () => {
			const { container } = render(<Favorites />);

			// Test that the component renders a single paragraph with "Favorites" text
			expect(container.firstChild).toMatchInlineSnapshot(`
				<p>
				  Favorites
				</p>
			`);
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

			// The text should be accessible
			expect(screen.getByText("Favorites")).toBeVisible();
		});

		it("maintains proper DOM structure", () => {
			const { container } = render(<Favorites />);

			// Should have a single text node
			expect(container.textContent).toBe("Favorites");
		});
	});
});
