import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryCard from "../../../components/categories/CategoryCard";
import { MovieCategory } from "../../../interfaces";

// Mock framer-motion
jest.mock("framer-motion", () => ({
	motion: {
		div: ({ children, className, ...props }: any) => (
			<div className={className} data-testid="motion-div" {...props}>
				{children}
			</div>
		),
	},
}));

// Mock react-intersection-observer
jest.mock("react-intersection-observer", () => ({
	useInView: jest.fn(() => [
		jest.fn(), // ref
		true, // inView
	]),
}));

// Mock lucide-react ArrowRight icon
jest.mock("lucide-react", () => ({
	ArrowRight: ({ className }: { className?: string }) => (
		<svg data-testid="arrow-right-icon" className={className}>
			<path d="M5 12h14m-4-7l7 7-7 7" />
		</svg>
	),
}));

// Mock next/link
jest.mock("next/link", () => {
	return ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href} data-testid="category-link">
			{children}
		</a>
	);
});

describe("CategoryCard", () => {
	const mockCategory: MovieCategory = {
		id: 1,
		name: "Action Movies",
		description: "High-octane action films",
	};

	const defaultProps = {
		category: mockCategory,
		index: 0,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders without crashing", () => {
			render(<CategoryCard {...defaultProps} />);
			expect(screen.getByTestId("category-link")).toBeInTheDocument();
		});

		it("renders the category name correctly", () => {
			render(<CategoryCard {...defaultProps} />);

			expect(screen.getByText("Action Movies")).toBeInTheDocument();
		});

		it("renders the 'Browse movies' text", () => {
			render(<CategoryCard {...defaultProps} />);

			expect(screen.getByText("Browse movies")).toBeInTheDocument();
		});

		it("renders the ArrowRight icon", () => {
			render(<CategoryCard {...defaultProps} />);

			expect(screen.getByTestId("arrow-right-icon")).toBeInTheDocument();
		});

		it("creates correct link to category page", () => {
			render(<CategoryCard {...defaultProps} />);

			const link = screen.getByTestId("category-link");
			expect(link).toHaveAttribute("href", "/categories/1");
		});

		it("renders motion div with correct test id", () => {
			render(<CategoryCard {...defaultProps} />);

			expect(screen.getByTestId("motion-div")).toBeInTheDocument();
		});

		it("applies correct CSS classes to motion div", () => {
			render(<CategoryCard {...defaultProps} />);

			const motionDiv = screen.getByTestId("motion-div");
			expect(motionDiv).toHaveClass(
				"card",
				"cursor-pointer",
				"group",
				"hover:bg-gray-700",
				"transition-colors",
				"duration-300"
			);
		});

		it("applies correct CSS classes to category title", () => {
			render(<CategoryCard {...defaultProps} />);

			const title = screen.getByText("Action Movies");
			expect(title).toHaveClass(
				"text-xl",
				"font-bold",
				"mb-2",
				"group-hover:text-accent-400",
				"transition-colors"
			);
		});

		it("applies correct CSS classes to browse section", () => {
			render(<CategoryCard {...defaultProps} />);

			const browseSection = screen.getByText("Browse movies").parentElement;
			expect(browseSection).toHaveClass(
				"flex",
				"items-center",
				"text-accent-400",
				"text-sm",
				"font-medium"
			);
		});

		it("applies correct CSS classes to ArrowRight icon", () => {
			render(<CategoryCard {...defaultProps} />);

			const arrowIcon = screen.getByTestId("arrow-right-icon");
			expect(arrowIcon).toHaveClass(
				"w-4",
				"h-4",
				"ml-1",
				"group-hover:translate-x-1",
				"transition-transform"
			);
		});
	});

	describe("Props Handling", () => {
		it("handles different category names", () => {
			const customCategory: MovieCategory = {
				id: 2,
				name: "Comedy Films",
				description: "Funny movies",
			};

			render(<CategoryCard category={customCategory} index={1} />);

			expect(screen.getByText("Comedy Films")).toBeInTheDocument();
		});

		it("creates correct link for different category IDs", () => {
			const customCategory: MovieCategory = {
				id: 99,
				name: "Drama",
				description: "Dramatic films",
			};

			render(<CategoryCard category={customCategory} index={2} />);

			const link = screen.getByTestId("category-link");
			expect(link).toHaveAttribute("href", "/categories/99");
		});

		it("handles category with special characters in name", () => {
			const customCategory: MovieCategory = {
				id: 3,
				name: "Sci-Fi & Fantasy",
				description: "Science fiction and fantasy films",
			};

			render(<CategoryCard category={customCategory} index={0} />);

			expect(screen.getByText("Sci-Fi & Fantasy")).toBeInTheDocument();
		});

		it("handles different index values", () => {
			render(<CategoryCard {...defaultProps} index={5} />);

			// Component should still render normally with different index
			expect(screen.getByText("Action Movies")).toBeInTheDocument();
			expect(screen.getByTestId("category-link")).toBeInTheDocument();
		});

		it("handles zero index", () => {
			render(<CategoryCard {...defaultProps} index={0} />);

			expect(screen.getByText("Action Movies")).toBeInTheDocument();
		});

		it("handles negative index gracefully", () => {
			render(<CategoryCard {...defaultProps} index={-1} />);

			expect(screen.getByText("Action Movies")).toBeInTheDocument();
		});
	});

	describe("User Interactions", () => {
		it("is clickable as a link", async () => {
			const user = userEvent.setup();
			render(<CategoryCard {...defaultProps} />);

			const link = screen.getByTestId("category-link");
			await user.click(link);

			// Link should be clickable (no errors thrown)
			expect(link).toBeInTheDocument();
		});

		it("maintains accessibility with proper link structure", () => {
			render(<CategoryCard {...defaultProps} />);

			const link = screen.getByTestId("category-link");
			expect(link).toHaveAttribute("href", "/categories/1");
			expect(link).toContainElement(screen.getByText("Action Movies"));
			expect(link).toContainElement(screen.getByText("Browse movies"));
		});
	});

	describe("Animation Integration", () => {
		it("integrates with framer-motion correctly", () => {
			render(<CategoryCard {...defaultProps} />);

			// Motion div should be present
			expect(screen.getByTestId("motion-div")).toBeInTheDocument();
		});

		it("integrates with intersection observer", () => {
			const { useInView } = require("react-intersection-observer");

			render(<CategoryCard {...defaultProps} />);

			// useInView should have been called
			expect(useInView).toHaveBeenCalledWith({
				triggerOnce: true,
				threshold: 0.1,
			});
		});
	});

	describe("Content Structure", () => {
		it("has correct content hierarchy", () => {
			render(<CategoryCard {...defaultProps} />);

			// Check that all expected elements are present in correct structure
			const link = screen.getByTestId("category-link");
			const motionDiv = screen.getByTestId("motion-div");
			const title = screen.getByText("Action Movies");
			const browseText = screen.getByText("Browse movies");
			const arrow = screen.getByTestId("arrow-right-icon");

			expect(link).toContainElement(motionDiv);
			expect(motionDiv).toContainElement(title);
			expect(motionDiv).toContainElement(browseText);
			expect(motionDiv).toContainElement(arrow);
		});

		it("maintains proper semantic structure", () => {
			render(<CategoryCard {...defaultProps} />);

			// Title should be an h3 element
			const title = screen.getByRole("heading", { level: 3 });
			expect(title).toHaveTextContent("Action Movies");
		});
	});

	describe("Edge Cases", () => {
		it("handles empty category name", () => {
			const emptyNameCategory: MovieCategory = {
				id: 1,
				name: "",
				description: "No name category",
			};

			render(<CategoryCard category={emptyNameCategory} index={0} />);

			// Should render without crashing
			expect(screen.getByTestId("category-link")).toBeInTheDocument();
			expect(screen.getByText("Browse movies")).toBeInTheDocument();
		});

		it("handles very long category names", () => {
			const longNameCategory: MovieCategory = {
				id: 1,
				name: "This is a very long category name that might cause layout issues",
				description: "Long name category",
			};

			render(<CategoryCard category={longNameCategory} index={0} />);

			expect(
				screen.getByText(
					"This is a very long category name that might cause layout issues"
				)
			).toBeInTheDocument();
		});

		it("handles category ID of 0", () => {
			const zeroIdCategory: MovieCategory = {
				id: 0,
				name: "Zero ID Category",
				description: "Category with ID 0",
			};

			render(<CategoryCard category={zeroIdCategory} index={0} />);

			const link = screen.getByTestId("category-link");
			expect(link).toHaveAttribute("href", "/categories/0");
		});

		it("handles large category IDs", () => {
			const largeIdCategory: MovieCategory = {
				id: 999999,
				name: "Large ID Category",
				description: "Category with large ID",
			};

			render(<CategoryCard category={largeIdCategory} index={0} />);

			const link = screen.getByTestId("category-link");
			expect(link).toHaveAttribute("href", "/categories/999999");
		});
	});
});
