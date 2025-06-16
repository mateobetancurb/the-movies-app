import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GenresList from "../../../components/categories/GenresList";
import { Genre } from "../../../interfaces";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
		replace: jest.fn(),
		prefetch: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		refresh: jest.fn(),
	}),
}));

// Mock lucide-react ArrowRight icon
jest.mock("lucide-react", () => ({
	ArrowRight: ({ className }: { className?: string }) => (
		<svg data-testid="arrow-right-icon" className={className}>
			<path d="M5 12h14m-4-7l7 7-7 7" />
		</svg>
	),
}));

describe("GenresList", () => {
	const mockGenres: Genre[] = [
		{ id: 1, name: "Action" },
		{ id: 2, name: "Comedy" },
		{ id: 3, name: "Drama" },
		{ id: 4, name: "Horror" },
		{ id: 5, name: "Romance" },
		{ id: 6, name: "Sci-Fi" },
		{ id: 7, name: "Documentary" },
		{ id: 8, name: "Animation" },
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders without crashing", () => {
			render(<GenresList genres={mockGenres} />);
			expect(document.querySelector("section")).toBeInTheDocument();
		});

		it("renders all genres correctly", () => {
			render(<GenresList genres={mockGenres} />);

			mockGenres.forEach((genre) => {
				expect(
					screen.getByRole("button", { name: new RegExp(genre.name, "i") })
				).toBeInTheDocument();
			});
		});

		it("renders title when provided", () => {
			const title = "Popular Genres";
			render(<GenresList genres={mockGenres} title={title} />);

			expect(
				screen.getByRole("heading", { name: title, level: 2 })
			).toBeInTheDocument();
		});

		it("does not render title when not provided", () => {
			render(<GenresList genres={mockGenres} />);

			expect(
				screen.queryByRole("heading", { level: 2 })
			).not.toBeInTheDocument();
		});

		it("applies correct CSS classes to section", () => {
			render(<GenresList genres={mockGenres} />);

			const section = document.querySelector("section");
			expect(section).toHaveClass("my-8");
		});

		it("applies correct CSS classes to title when provided", () => {
			const title = "Movie Genres";
			render(<GenresList genres={mockGenres} title={title} />);

			const titleElement = screen.getByRole("heading", {
				name: title,
				level: 2,
			});
			expect(titleElement).toHaveClass("text-2xl", "font-bold", "mb-6");
		});

		it("applies correct CSS classes to grid container", () => {
			render(<GenresList genres={mockGenres} />);

			const gridContainer = document.querySelector("section > div");
			expect(gridContainer).toHaveClass(
				"grid",
				"grid-cols-2",
				"sm:grid-cols-3",
				"md:grid-cols-4",
				"gap-4"
			);
		});

		it("applies correct CSS classes to genre buttons", () => {
			render(<GenresList genres={mockGenres} />);

			const firstGenreButton = screen.getByRole("button", { name: /action/i });
			expect(firstGenreButton).toHaveClass(
				"bg-gray-800",
				"hover:bg-gray-700",
				"rounded-lg",
				"p-4",
				"flex",
				"items-center",
				"justify-between",
				"transition-colors",
				"group"
			);
		});

		it("renders ArrowRight icon for each genre button", () => {
			render(<GenresList genres={mockGenres} />);

			const arrowIcons = screen.getAllByTestId("arrow-right-icon");
			expect(arrowIcons).toHaveLength(mockGenres.length);
		});

		it("applies correct CSS classes to ArrowRight icons", () => {
			render(<GenresList genres={mockGenres} />);

			const arrowIcons = screen.getAllByTestId("arrow-right-icon");
			arrowIcons.forEach((icon) => {
				expect(icon).toHaveClass(
					"w-4",
					"h-4",
					"text-accent-400",
					"opacity-0",
					"group-hover:opacity-100",
					"group-hover:translate-x-1",
					"transition-all"
				);
			});
		});
	});

	describe("User Interactions", () => {
		it("handles genre button click correctly", async () => {
			const user = userEvent.setup();
			render(<GenresList genres={mockGenres} />);

			const actionButton = screen.getByRole("button", { name: /action/i });
			await user.click(actionButton);

			expect(mockPush).toHaveBeenCalledWith("/categories?genre=1");
		});

		it("handles click on different genre buttons", async () => {
			const user = userEvent.setup();
			render(<GenresList genres={mockGenres} />);

			// Test clicking Comedy genre
			const comedyButton = screen.getByRole("button", { name: /comedy/i });
			await user.click(comedyButton);

			expect(mockPush).toHaveBeenCalledWith("/categories?genre=2");

			// Test clicking Horror genre
			const horrorButton = screen.getByRole("button", { name: /horror/i });
			await user.click(horrorButton);

			expect(mockPush).toHaveBeenCalledWith("/categories?genre=4");
		});

		it("handles multiple clicks on the same genre", async () => {
			const user = userEvent.setup();
			render(<GenresList genres={mockGenres} />);

			const dramaButton = screen.getByRole("button", { name: /drama/i });

			await user.click(dramaButton);
			await user.click(dramaButton);

			expect(mockPush).toHaveBeenCalledTimes(2);
			expect(mockPush).toHaveBeenNthCalledWith(1, "/categories?genre=3");
			expect(mockPush).toHaveBeenNthCalledWith(2, "/categories?genre=3");
		});

		it("handles click using fireEvent", () => {
			render(<GenresList genres={mockGenres} />);

			const romanceButton = screen.getByRole("button", { name: /romance/i });
			fireEvent.click(romanceButton);

			expect(mockPush).toHaveBeenCalledWith("/categories?genre=5");
		});

		it("handles keyboard navigation", () => {
			render(<GenresList genres={mockGenres} />);

			const sciFiButton = screen.getByRole("button", { name: /sci-fi/i });

			// Simulate Enter key press
			fireEvent.keyDown(sciFiButton, { key: "Enter", code: "Enter" });

			// The button should still be focusable and clickable
			expect(sciFiButton).toBeInTheDocument();
		});

		it("handles focus and blur events", () => {
			render(<GenresList genres={mockGenres} />);

			const documentaryButton = screen.getByRole("button", {
				name: /documentary/i,
			});

			// Focus the button
			documentaryButton.focus();
			expect(documentaryButton).toHaveFocus();

			// Blur the button
			documentaryButton.blur();
			expect(documentaryButton).not.toHaveFocus();
		});
	});

	describe("Edge Cases", () => {
		it("renders correctly with empty genres array", () => {
			render(<GenresList genres={[]} />);

			const section = document.querySelector("section");
			expect(section).toBeInTheDocument();

			const gridContainer = section?.querySelector("div");
			expect(gridContainer?.children).toHaveLength(0);
		});

		it("renders correctly with single genre", () => {
			const singleGenre: Genre[] = [{ id: 1, name: "Action" }];
			render(<GenresList genres={singleGenre} />);

			expect(
				screen.getByRole("button", { name: /action/i })
			).toBeInTheDocument();
			expect(screen.getAllByRole("button")).toHaveLength(1);
		});

		it("handles genre with very long name", () => {
			const longNameGenre: Genre[] = [
				{ id: 1, name: "Very Long Genre Name That Might Overflow" },
			];
			render(<GenresList genres={longNameGenre} />);

			expect(
				screen.getByRole("button", { name: /very long genre name/i })
			).toBeInTheDocument();
		});

		it("handles genre with special characters in name", () => {
			const specialGenre: Genre[] = [
				{ id: 1, name: "Sci-Fi & Fantasy" },
				{ id: 2, name: "Action/Adventure" },
			];
			render(<GenresList genres={specialGenre} />);

			expect(
				screen.getByRole("button", { name: /sci-fi & fantasy/i })
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /action\/adventure/i })
			).toBeInTheDocument();
		});

		it("handles genre with numeric characters in name", () => {
			const numericGenre: Genre[] = [{ id: 1, name: "Top 10 Movies" }];
			render(<GenresList genres={numericGenre} />);

			expect(
				screen.getByRole("button", { name: /top 10 movies/i })
			).toBeInTheDocument();
		});

		it("handles very large genre ID", () => {
			const largeIdGenre: Genre[] = [{ id: 999999, name: "Test Genre" }];
			render(<GenresList genres={largeIdGenre} />);

			const button = screen.getByRole("button", { name: /test genre/i });
			fireEvent.click(button);

			expect(mockPush).toHaveBeenCalledWith("/categories?genre=999999");
		});
	});

	describe("Accessibility", () => {
		it("has proper ARIA roles", () => {
			render(<GenresList genres={mockGenres} />);

			expect(document.querySelector("section")).toBeInTheDocument();
			expect(screen.getAllByRole("button")).toHaveLength(mockGenres.length);
		});

		it("has accessible button text", () => {
			render(<GenresList genres={mockGenres} />);

			mockGenres.forEach((genre) => {
				const button = screen.getByRole("button", {
					name: new RegExp(genre.name, "i"),
				});
				expect(button).toHaveAccessibleName(genre.name);
			});
		});

		it("supports keyboard navigation", () => {
			render(<GenresList genres={mockGenres} />);

			const buttons = screen.getAllByRole("button");
			buttons.forEach((button) => {
				// Buttons are natively focusable and don't need explicit tabIndex
				expect(button.tabIndex).toBe(0);
			});
		});

		it("has proper heading hierarchy when title is provided", () => {
			const title = "Browse Genres";
			render(<GenresList genres={mockGenres} title={title} />);

			const heading = screen.getByRole("heading", { name: title, level: 2 });
			expect(heading).toBeInTheDocument();
		});
	});

	describe("Component Structure", () => {
		it("maintains correct DOM structure", () => {
			const title = "Movie Genres";
			render(<GenresList genres={mockGenres} title={title} />);

			const section = document.querySelector("section");
			expect(section?.tagName).toBe("SECTION");

			const heading = screen.getByRole("heading", { name: title, level: 2 });
			expect(heading.tagName).toBe("H2");

			const gridContainer = section?.querySelector("div");
			expect(gridContainer).toBeInTheDocument();

			const buttons = screen.getAllByRole("button");
			buttons.forEach((button) => {
				expect(button.tagName).toBe("BUTTON");
				expect(button.textContent).toBeTruthy();
			});
		});

		it("renders buttons in correct order", () => {
			render(<GenresList genres={mockGenres} />);

			const buttons = screen.getAllByRole("button");
			buttons.forEach((button, index) => {
				expect(button).toHaveTextContent(mockGenres[index].name);
			});
		});

		it("includes ArrowRight icon in each button", () => {
			render(<GenresList genres={mockGenres} />);

			const buttons = screen.getAllByRole("button");
			buttons.forEach((button) => {
				const icon = button.querySelector('[data-testid="arrow-right-icon"]');
				expect(icon).toBeInTheDocument();
			});
		});
	});

	describe("Props Validation", () => {
		it("works with different title prop types", () => {
			// Test with string title
			const { rerender } = render(
				<GenresList genres={mockGenres} title="String Title" />
			);
			expect(
				screen.getByRole("heading", { name: "String Title" })
			).toBeInTheDocument();

			// Test with undefined title
			rerender(<GenresList genres={mockGenres} title={undefined} />);
			expect(
				screen.queryByRole("heading", { level: 2 })
			).not.toBeInTheDocument();

			// Test with empty string title
			rerender(<GenresList genres={mockGenres} title="" />);
			expect(
				screen.queryByRole("heading", { level: 2 })
			).not.toBeInTheDocument();
		});

		it("handles different genre array structures", () => {
			const differentGenres: Genre[] = [
				{ id: 0, name: "Zero ID Genre" },
				{ id: -1, name: "Negative ID Genre" },
			];

			render(<GenresList genres={differentGenres} />);

			expect(
				screen.getByRole("button", { name: /zero id genre/i })
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /negative id genre/i })
			).toBeInTheDocument();
		});
	});
});
