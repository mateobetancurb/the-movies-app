import React from "react";
import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import Navbar from "../../../components/layout/Navbar";

// Mock next/navigation
jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
	return function MockLink({
		children,
		href,
		className,
	}: {
		children: React.ReactNode;
		href: string;
		className?: string;
	}) {
		return (
			<a href={href} className={className}>
				{children}
			</a>
		);
	};
});

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
	Film: () => <div data-testid="film-icon" />,
	Heart: () => <div data-testid="heart-icon" />,
	Grid: () => <div data-testid="grid-icon" />,
	Search: () => <div data-testid="search-icon" />,
	Menu: () => <div data-testid="menu-icon" />,
	X: () => <div data-testid="x-icon" />,
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("Navbar", () => {
	const user = userEvent.setup();

	beforeEach(() => {
		mockUsePathname.mockReturnValue("/");
		// Mock window.scrollY
		Object.defineProperty(window, "scrollY", {
			writable: true,
			value: 0,
		});
		// Mock window.addEventListener and removeEventListener
		window.addEventListener = jest.fn();
		window.removeEventListener = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Basic Rendering", () => {
		it("renders the navbar with brand logo and title", () => {
			render(<Navbar />);

			const brandLink = screen.getByRole("link", { name: /cineexplorer/i });
			expect(brandLink).toBeInTheDocument();
			expect(brandLink).toHaveAttribute("href", "/");

			const filmIcons = screen.getAllByTestId("film-icon");
			expect(filmIcons).toHaveLength(2); // Brand + mobile menu

			const brandTitle = screen.getByText("CineExplorer");
			expect(brandTitle).toBeInTheDocument();
		});

		it("renders desktop navigation links", () => {
			render(<Navbar />);

			// Get desktop navigation specifically
			const desktopNav = screen.getByRole("navigation");
			const homeLink = desktopNav.querySelector('a[href="/"]');
			const categoriesLink = desktopNav.querySelector('a[href="/categories"]');
			const favoritesLink = desktopNav.querySelector('a[href="/favorites"]');

			expect(homeLink).toBeInTheDocument();
			expect(homeLink).toHaveTextContent("Home");

			expect(categoriesLink).toBeInTheDocument();
			expect(categoriesLink).toHaveTextContent("Categories");

			expect(favoritesLink).toBeInTheDocument();
			expect(favoritesLink).toHaveTextContent("Favorites");
		});

		it("renders mobile menu button", () => {
			render(<Navbar />);

			const menuButton = screen.getByRole("button", {
				name: /open main menu/i,
			});
			expect(menuButton).toBeInTheDocument();
			expect(menuButton).toHaveAttribute("aria-expanded", "false");

			const menuIcon = screen.getByTestId("menu-icon");
			expect(menuIcon).toBeInTheDocument();
		});

		it("applies correct CSS classes for initial state", () => {
			render(<Navbar />);

			const header = screen.getByRole("banner");
			expect(header).toHaveClass(
				"fixed",
				"top-0",
				"w-full",
				"z-50",
				"transition-all",
				"duration-300"
			);
		});
	});

	describe("Mobile Menu Functionality", () => {
		it("toggles mobile menu when button is clicked", async () => {
			render(<Navbar />);

			const menuButton = screen.getByRole("button", {
				name: /open main menu/i,
			});

			// Initially closed
			expect(menuButton).toHaveAttribute("aria-expanded", "false");
			expect(screen.getByTestId("menu-icon")).toBeInTheDocument();

			// Click to open
			await user.click(menuButton);

			expect(menuButton).toHaveAttribute("aria-expanded", "true");
			expect(screen.getByTestId("x-icon")).toBeInTheDocument();

			// Click to close
			await user.click(menuButton);

			expect(menuButton).toHaveAttribute("aria-expanded", "false");
			expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
		});

		it("shows mobile menu links when menu is open", async () => {
			render(<Navbar />);

			const menuButton = screen.getByRole("button", {
				name: /open main menu/i,
			});

			// Open mobile menu
			await user.click(menuButton);

			// Check for mobile menu links with icons
			const mobileHomeLink = screen.getAllByRole("link", { name: /home/i });
			const mobileCategoriesLink = screen.getAllByRole("link", {
				name: /categories/i,
			});
			const mobileFavoritesLink = screen.getAllByRole("link", {
				name: /favorites/i,
			});

			// Should have both desktop and mobile links
			expect(mobileHomeLink).toHaveLength(2);
			expect(mobileCategoriesLink).toHaveLength(2);
			expect(mobileFavoritesLink).toHaveLength(2);

			// Check for icons in mobile menu
			expect(screen.getAllByTestId("film-icon")).toHaveLength(2); // Brand + mobile home
			expect(screen.getByTestId("grid-icon")).toBeInTheDocument();
			expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
		});

		it("hides mobile menu by default", () => {
			render(<Navbar />);

			// The mobile menu container should have the hidden class
			const mobileMenuContainer = screen
				.getByRole("banner")
				.querySelector(".md\\:hidden:not(button)");
			expect(mobileMenuContainer).toHaveClass("hidden");
		});

		it("closes mobile menu when pathname changes", () => {
			const { rerender } = render(<Navbar />);

			// Open mobile menu
			const menuButton = screen.getByRole("button", {
				name: /open main menu/i,
			});
			fireEvent.click(menuButton);
			expect(menuButton).toHaveAttribute("aria-expanded", "true");

			// Change pathname
			mockUsePathname.mockReturnValue("/categories");
			rerender(<Navbar />);

			// Menu should be closed
			expect(menuButton).toHaveAttribute("aria-expanded", "false");
		});
	});

	describe("Scroll Behavior", () => {
		beforeEach(() => {
			// Reset scroll mocks
			jest.clearAllMocks();
		});

		it("adds scroll event listener on mount", () => {
			render(<Navbar />);

			expect(window.addEventListener).toHaveBeenCalledWith(
				"scroll",
				expect.any(Function)
			);
		});

		it("removes scroll event listener on unmount", () => {
			const { unmount } = render(<Navbar />);

			unmount();

			expect(window.removeEventListener).toHaveBeenCalledWith(
				"scroll",
				expect.any(Function)
			);
		});

		it("applies scrolled styles when scrolled down", async () => {
			render(<Navbar />);

			const header = screen.getByRole("banner");

			// Initially not scrolled
			expect(header).toHaveClass(
				"bg-gradient-to-b",
				"from-gray-900",
				"to-transparent"
			);

			// Simulate scroll
			Object.defineProperty(window, "scrollY", {
				writable: true,
				value: 20,
			});

			// Get the scroll event handler that was registered
			const scrollHandler = (
				window.addEventListener as jest.Mock
			).mock.calls.find((call) => call[0] === "scroll")[1];

			// Trigger scroll event
			act(() => {
				scrollHandler();
			});

			await waitFor(() => {
				expect(header).toHaveClass(
					"bg-gray-900/95",
					"backdrop-blur-sm",
					"shadow-md"
				);
			});
		});

		it("removes scrolled styles when scrolled to top", async () => {
			render(<Navbar />);

			const header = screen.getByRole("banner");

			// Simulate being scrolled
			Object.defineProperty(window, "scrollY", {
				writable: true,
				value: 20,
			});

			const scrollHandler = (
				window.addEventListener as jest.Mock
			).mock.calls.find((call) => call[0] === "scroll")[1];

			// Trigger scroll event
			act(() => {
				scrollHandler();
			});

			await waitFor(() => {
				expect(header).toHaveClass(
					"bg-gray-900/95",
					"backdrop-blur-sm",
					"shadow-md"
				);
			});

			// Scroll back to top
			Object.defineProperty(window, "scrollY", {
				writable: true,
				value: 0,
			});

			act(() => {
				scrollHandler();
			});

			await waitFor(() => {
				expect(header).toHaveClass(
					"bg-gradient-to-b",
					"from-gray-900",
					"to-transparent"
				);
			});
		});
	});

	describe("Responsive Design", () => {
		it("hides desktop navigation on mobile screens", () => {
			render(<Navbar />);

			const desktopNav = screen
				.getByRole("banner")
				.querySelector(".hidden.md\\:flex");
			expect(desktopNav).toBeInTheDocument();
		});

		it("hides mobile menu button on desktop screens", () => {
			render(<Navbar />);

			const mobileMenuButton = screen.getByRole("button", {
				name: /open main menu/i,
			});
			expect(mobileMenuButton).toHaveClass("md:hidden");
		});

		it("applies container responsive padding", () => {
			render(<Navbar />);

			const container = screen.getByRole("banner").querySelector(".container");
			expect(container).toHaveClass("px-4", "sm:px-6", "lg:px-8");
		});
	});

	describe("Accessibility", () => {
		it("has proper semantic HTML structure", () => {
			render(<Navbar />);

			const header = screen.getByRole("banner");
			expect(header).toBeInTheDocument();

			const navigation = screen.getByRole("navigation");
			expect(navigation).toBeInTheDocument();
		});

		it("has proper ARIA attributes for mobile menu", () => {
			render(<Navbar />);

			const menuButton = screen.getByRole("button", {
				name: /open main menu/i,
			});
			expect(menuButton).toHaveAttribute("aria-expanded", "false");

			const srOnlyText = screen.getByText("Open main menu");
			expect(srOnlyText).toHaveClass("sr-only");
		});

		it("provides proper link navigation", () => {
			render(<Navbar />);

			// Get desktop navigation specifically
			const desktopNav = screen.getByRole("navigation");
			const homeLink = desktopNav.querySelector('a[href="/"]');
			const categoriesLink = desktopNav.querySelector('a[href="/categories"]');
			const favoritesLink = desktopNav.querySelector('a[href="/favorites"]');

			expect(homeLink).toHaveAttribute("href", "/");
			expect(categoriesLink).toHaveAttribute("href", "/categories");
			expect(favoritesLink).toHaveAttribute("href", "/favorites");
		});

		it("supports keyboard navigation", async () => {
			render(<Navbar />);

			const menuButton = screen.getByRole("button", {
				name: /open main menu/i,
			});

			// Focus on menu button and press Enter
			menuButton.focus();
			expect(menuButton).toHaveFocus();

			await user.keyboard("{Enter}");
			expect(menuButton).toHaveAttribute("aria-expanded", "true");
		});
	});

	describe("Edge Cases", () => {
		it("handles multiple rapid menu toggles", async () => {
			render(<Navbar />);

			const menuButton = screen.getByRole("button", {
				name: /open main menu/i,
			});

			// Rapidly toggle menu multiple times
			await user.click(menuButton);
			await user.click(menuButton);
			await user.click(menuButton);

			expect(menuButton).toHaveAttribute("aria-expanded", "true");
		});

		it("handles pathname changes while menu is open", () => {
			const { rerender } = render(<Navbar />);

			const menuButton = screen.getByRole("button", {
				name: /open main menu/i,
			});
			fireEvent.click(menuButton);
			expect(menuButton).toHaveAttribute("aria-expanded", "true");

			// Change pathname multiple times
			mockUsePathname.mockReturnValue("/categories");
			rerender(<Navbar />);
			expect(menuButton).toHaveAttribute("aria-expanded", "false");

			fireEvent.click(menuButton);
			expect(menuButton).toHaveAttribute("aria-expanded", "true");

			mockUsePathname.mockReturnValue("/favorites");
			rerender(<Navbar />);
			expect(menuButton).toHaveAttribute("aria-expanded", "false");
		});

		it("handles scroll events with edge scroll values", async () => {
			render(<Navbar />);

			const header = screen.getByRole("banner");
			const scrollHandler = (
				window.addEventListener as jest.Mock
			).mock.calls.find((call) => call[0] === "scroll")[1];

			// Test boundary value (exactly 10)
			Object.defineProperty(window, "scrollY", {
				writable: true,
				value: 10,
			});

			act(() => {
				scrollHandler();
			});

			await waitFor(() => {
				expect(header).toHaveClass(
					"bg-gradient-to-b",
					"from-gray-900",
					"to-transparent"
				);
			});

			// Test just above boundary (11)
			Object.defineProperty(window, "scrollY", {
				writable: true,
				value: 11,
			});

			act(() => {
				scrollHandler();
			});

			await waitFor(() => {
				expect(header).toHaveClass(
					"bg-gray-900/95",
					"backdrop-blur-sm",
					"shadow-md"
				);
			});
		});
	});
});
