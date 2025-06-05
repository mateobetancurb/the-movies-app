import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../../../components/layout/Footer";

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
	Github: () => <div data-testid="github-icon" />,
	Twitter: () => <div data-testid="twitter-icon" />,
	Instagram: () => <div data-testid="instagram-icon" />,
}));

describe("Footer", () => {
	// Mock Date to ensure consistent year testing
	let originalDate: DateConstructor;

	beforeEach(() => {
		originalDate = global.Date;
		// Mock Date constructor and getFullYear method
		global.Date = class extends originalDate {
			constructor(...args: any[]) {
				if (args.length === 0) {
					super(2024, 0, 1);
				} else {
					super(...args);
				}
			}
			static getFullYear = () => 2024;
		} as any;
	});

	afterEach(() => {
		global.Date = originalDate;
	});

	describe("Basic Rendering", () => {
		it("renders the footer with brand logo and title", () => {
			render(<Footer />);

			const brandLink = screen.getByRole("link", { name: /cineexplorer/i });
			expect(brandLink).toBeInTheDocument();
			expect(brandLink).toHaveAttribute("href", "/");

			const filmIcon = screen.getByTestId("film-icon");
			expect(filmIcon).toBeInTheDocument();

			const brandTitle = screen.getByText("CineExplorer");
			expect(brandTitle).toBeInTheDocument();
		});

		it("renders the brand description", () => {
			render(<Footer />);

			const description = screen.getByText(
				"Discover the latest movies, save your favorites, and explore film categories."
			);
			expect(description).toBeInTheDocument();
		});

		it("applies correct CSS classes for layout", () => {
			render(<Footer />);

			const footer = screen.getByRole("contentinfo");
			expect(footer).toHaveClass("bg-gray-900", "pt-10", "pb-6");

			const container = footer.querySelector(".container");
			expect(container).toHaveClass("mx-auto", "px-4", "sm:px-6", "lg:px-8");

			const grid = footer.querySelector(".grid");
			expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-4", "gap-8");
		});
	});

	describe("Navigation Section", () => {
		it("renders navigation section with correct heading", () => {
			render(<Footer />);

			const navigationHeading = screen.getByRole("heading", {
				name: /navigation/i,
				level: 3,
			});
			expect(navigationHeading).toBeInTheDocument();
		});

		it("renders all navigation links", () => {
			render(<Footer />);

			const homeLink = screen.getAllByRole("link", { name: /home/i });
			const categoriesLink = screen.getAllByRole("link", {
				name: /categories/i,
			});
			const favoritesLink = screen.getAllByRole("link", { name: /favorites/i });

			// Should find only navigation links (no duplicate brand links in footer)
			expect(homeLink).toHaveLength(1);
			expect(categoriesLink).toHaveLength(1);
			expect(favoritesLink).toHaveLength(1);

			// Check navigation section links specifically
			const navigationSection = screen
				.getByRole("heading", { name: /navigation/i })
				.closest("div");

			expect(navigationSection).toBeInTheDocument();

			const navHomeLink = navigationSection?.querySelector('a[href="/"]');
			const navCategoriesLink = navigationSection?.querySelector(
				'a[href="/categories"]'
			);
			const navFavoritesLink = navigationSection?.querySelector(
				'a[href="/favorites"]'
			);

			expect(navHomeLink).toHaveTextContent("Home");
			expect(navCategoriesLink).toHaveTextContent("Categories");
			expect(navFavoritesLink).toHaveTextContent("Favorites");
		});

		it("applies correct styles to navigation links", () => {
			render(<Footer />);

			const navigationSection = screen
				.getByRole("heading", { name: /navigation/i })
				.closest("div");

			const navLinks = navigationSection?.querySelectorAll("a");
			navLinks?.forEach((link) => {
				expect(link).toHaveClass(
					"text-gray-400",
					"hover:text-white",
					"transition-colors",
					"text-sm"
				);
			});
		});
	});

	describe("Categories Section", () => {
		it("renders categories section with correct heading", () => {
			render(<Footer />);

			const categoriesHeading = screen.getByRole("heading", {
				name: /^categories$/i,
				level: 3,
			});
			expect(categoriesHeading).toBeInTheDocument();
		});

		it("renders all category links", () => {
			render(<Footer />);

			const actionLink = screen.getByRole("link", { name: /action/i });
			const dramaLink = screen.getByRole("link", { name: /drama/i });
			const sciFiLink = screen.getByRole("link", { name: /science fiction/i });
			const comedyLink = screen.getByRole("link", { name: /comedy/i });

			expect(actionLink).toBeInTheDocument();
			expect(actionLink).toHaveAttribute("href", "/categories");

			expect(dramaLink).toBeInTheDocument();
			expect(dramaLink).toHaveAttribute("href", "/categories");

			expect(sciFiLink).toBeInTheDocument();
			expect(sciFiLink).toHaveAttribute("href", "/categories");

			expect(comedyLink).toBeInTheDocument();
			expect(comedyLink).toHaveAttribute("href", "/categories");
		});

		it("applies correct styles to category links", () => {
			render(<Footer />);

			const categoriesSection = screen
				.getByRole("heading", { name: /^categories$/i })
				.closest("div");

			const categoryLinks = categoriesSection?.querySelectorAll("a");
			categoryLinks?.forEach((link) => {
				expect(link).toHaveClass(
					"text-gray-400",
					"hover:text-white",
					"transition-colors",
					"text-sm"
				);
			});
		});
	});

	describe("Connect Section", () => {
		it("renders connect section with correct heading", () => {
			render(<Footer />);

			const connectHeading = screen.getByRole("heading", {
				name: /connect/i,
				level: 3,
			});
			expect(connectHeading).toBeInTheDocument();
		});

		it("renders all social media links with icons", () => {
			render(<Footer />);

			const githubLink = screen.getByRole("link", { name: /github/i });
			const twitterLink = screen.getByRole("link", { name: /twitter/i });
			const instagramLink = screen.getByRole("link", { name: /instagram/i });

			expect(githubLink).toBeInTheDocument();
			expect(githubLink).toHaveAttribute("href", "#");

			expect(twitterLink).toBeInTheDocument();
			expect(twitterLink).toHaveAttribute("href", "#");

			expect(instagramLink).toBeInTheDocument();
			expect(instagramLink).toHaveAttribute("href", "#");

			// Check for icons
			expect(screen.getByTestId("github-icon")).toBeInTheDocument();
			expect(screen.getByTestId("twitter-icon")).toBeInTheDocument();
			expect(screen.getByTestId("instagram-icon")).toBeInTheDocument();
		});

		it("applies correct styles to social media links", () => {
			render(<Footer />);

			const githubLink = screen.getByRole("link", { name: /github/i });
			const twitterLink = screen.getByRole("link", { name: /twitter/i });
			const instagramLink = screen.getByRole("link", { name: /instagram/i });

			[githubLink, twitterLink, instagramLink].forEach((link) => {
				expect(link).toHaveClass(
					"text-gray-400",
					"hover:text-white",
					"transition-colors"
				);
			});
		});

		it("has proper accessibility labels for social media links", () => {
			render(<Footer />);

			const githubLink = screen.getByRole("link", { name: /github/i });
			const twitterLink = screen.getByRole("link", { name: /twitter/i });
			const instagramLink = screen.getByRole("link", { name: /instagram/i });

			expect(githubLink).toHaveAttribute("aria-label", "GitHub");
			expect(twitterLink).toHaveAttribute("aria-label", "Twitter");
			expect(instagramLink).toHaveAttribute("aria-label", "Instagram");
		});
	});

	describe("Copyright Section", () => {
		it("renders copyright notice with current year", () => {
			render(<Footer />);

			const copyright = screen.getByText(
				"© 2024 CineExplorer. All rights reserved."
			);
			expect(copyright).toBeInTheDocument();
		});

		it("applies correct styles to copyright section", () => {
			render(<Footer />);

			const copyrightSection = screen
				.getByText(/all rights reserved/i)
				.closest("div");

			expect(copyrightSection).toHaveClass(
				"mt-8",
				"pt-6",
				"border-t",
				"border-gray-800"
			);

			const copyrightText = screen.getByText(/all rights reserved/i);
			expect(copyrightText).toHaveClass(
				"text-center",
				"text-gray-400",
				"text-sm"
			);
		});

		it("dynamically displays current year", () => {
			// Test with a different year
			global.Date = class extends originalDate {
				constructor(...args: any[]) {
					if (args.length === 0) {
						super(2025, 0, 1);
					} else {
						super(...args);
					}
				}
				static getFullYear = () => 2025;
				getFullYear = () => 2025;
			} as any;

			render(<Footer />);

			const copyright = screen.getByText(
				"© 2025 CineExplorer. All rights reserved."
			);
			expect(copyright).toBeInTheDocument();
		});
	});

	describe("Responsive Design", () => {
		it("applies responsive grid layout", () => {
			render(<Footer />);

			const grid = screen.getByRole("contentinfo").querySelector(".grid");
			expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-4");
		});

		it("applies responsive container padding", () => {
			render(<Footer />);

			const container = screen
				.getByRole("contentinfo")
				.querySelector(".container");
			expect(container).toHaveClass("px-4", "sm:px-6", "lg:px-8");
		});

		it("properly organizes sections in grid columns", () => {
			render(<Footer />);

			const sections = screen
				.getByRole("contentinfo")
				.querySelectorAll(".col-span-1");
			expect(sections).toHaveLength(4);
		});
	});

	describe("Accessibility", () => {
		it("has proper semantic HTML structure", () => {
			render(<Footer />);

			const footer = screen.getByRole("contentinfo");
			expect(footer).toBeInTheDocument();

			// Check for proper heading levels
			const headings = screen.getAllByRole("heading", { level: 3 });
			expect(headings).toHaveLength(3);
		});

		it("provides proper heading hierarchy", () => {
			render(<Footer />);

			const navigationHeading = screen.getByRole("heading", {
				name: /navigation/i,
			});
			const categoriesHeading = screen.getByRole("heading", {
				name: /^categories$/i,
			});
			const connectHeading = screen.getByRole("heading", { name: /connect/i });

			expect(navigationHeading.tagName).toBe("H3");
			expect(categoriesHeading.tagName).toBe("H3");
			expect(connectHeading.tagName).toBe("H3");
		});

		it("provides descriptive text for brand section", () => {
			render(<Footer />);

			const description = screen.getByText(
				"Discover the latest movies, save your favorites, and explore film categories."
			);
			expect(description).toHaveClass("text-sm", "text-gray-400");
		});

		it("ensures proper color contrast for text elements", () => {
			render(<Footer />);

			// Check headings have proper contrast
			const headings = screen.getAllByRole("heading", { level: 3 });
			headings.forEach((heading) => {
				expect(heading).toHaveClass("text-white");
			});

			// Check brand title has proper contrast
			const brandTitle = screen.getByText("CineExplorer");
			expect(brandTitle).toHaveClass("text-white");
		});
	});

	describe("Content Structure", () => {
		it("organizes content in proper sections", () => {
			render(<Footer />);

			// Brand section
			const brandSection = screen.getByText("CineExplorer").closest("div");
			expect(brandSection).toBeInTheDocument();

			// Navigation section
			const navSection = screen
				.getByRole("heading", { name: /navigation/i })
				.closest("div");
			expect(navSection).toBeInTheDocument();

			// Categories section
			const categoriesSection = screen
				.getByRole("heading", { name: /^categories$/i })
				.closest("div");
			expect(categoriesSection).toBeInTheDocument();

			// Connect section
			const connectSection = screen
				.getByRole("heading", { name: /connect/i })
				.closest("div");
			expect(connectSection).toBeInTheDocument();
		});

		it("maintains consistent spacing between sections", () => {
			render(<Footer />);

			const grid = screen.getByRole("contentinfo").querySelector(".grid");
			expect(grid).toHaveClass("gap-8");
		});

		it("properly separates footer content from copyright", () => {
			render(<Footer />);

			const copyrightSection = screen
				.getByText(/all rights reserved/i)
				.closest("div");

			expect(copyrightSection).toHaveClass("border-t", "border-gray-800");
		});
	});

	describe("Link Validation", () => {
		it("ensures all internal links point to correct routes", () => {
			render(<Footer />);

			// Check brand link
			const brandLink = screen.getByRole("link", { name: /cineexplorer/i });
			expect(brandLink).toHaveAttribute("href", "/");

			// Check navigation links (excluding brand link)
			const navigationSection = screen
				.getByRole("heading", { name: /navigation/i })
				.closest("div");

			const navHomeLink = navigationSection?.querySelector('a[href="/"]');
			const navCategoriesLink = navigationSection?.querySelector(
				'a[href="/categories"]'
			);
			const navFavoritesLink = navigationSection?.querySelector(
				'a[href="/favorites"]'
			);

			expect(navHomeLink).toBeInTheDocument();
			expect(navCategoriesLink).toBeInTheDocument();
			expect(navFavoritesLink).toBeInTheDocument();

			// Check category links
			const categoryLinks = screen.getAllByRole("link", {
				name: /action|drama|science fiction|comedy/i,
			});
			categoryLinks.forEach((link) => {
				expect(link).toHaveAttribute("href", "/categories");
			});
		});

		it("sets external social media links as placeholders", () => {
			render(<Footer />);

			const socialLinks = [
				screen.getByRole("link", { name: /github/i }),
				screen.getByRole("link", { name: /twitter/i }),
				screen.getByRole("link", { name: /instagram/i }),
			];

			socialLinks.forEach((link) => {
				expect(link).toHaveAttribute("href", "#");
			});
		});
	});

	describe("Icon Integration", () => {
		it("renders all icons correctly", () => {
			render(<Footer />);

			// Check that all icons are rendered
			expect(screen.getByTestId("film-icon")).toBeInTheDocument();
			expect(screen.getByTestId("github-icon")).toBeInTheDocument();
			expect(screen.getByTestId("twitter-icon")).toBeInTheDocument();
			expect(screen.getByTestId("instagram-icon")).toBeInTheDocument();
		});
	});
});
