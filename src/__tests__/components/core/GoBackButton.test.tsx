import { render, screen } from "@testing-library/react";
import GoBackButton from "../../../components/core/GoBackButton";

// Mock next/link
jest.mock("next/link", () => {
	return ({ children, href, className }: any) => (
		<a href={href} className={className}>
			{children}
		</a>
	);
});

// Mock lucide-react
jest.mock("lucide-react", () => ({
	ArrowLeftIcon: ({ className }: { className?: string }) => (
		<svg
			data-testid="arrow-left-icon"
			className={className}
			role="img"
			aria-label="Arrow left"
		>
			<path />
		</svg>
	),
}));

describe("GoBackButton", () => {
	describe("Basic Rendering", () => {
		it("renders go back button with correct text", () => {
			render(<GoBackButton href="/home" />);

			expect(screen.getByText("Go Back")).toBeInTheDocument();
		});

		it("renders with correct href prop", () => {
			render(<GoBackButton href="/categories" />);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/categories");
		});

		it("displays arrow left icon", () => {
			render(<GoBackButton href="/movies" />);

			const icon = screen.getByTestId("arrow-left-icon");
			expect(icon).toBeInTheDocument();
		});
	});

	describe("CSS Classes and Styling", () => {
		it("applies correct CSS classes to link", () => {
			render(<GoBackButton href="/home" />);

			const link = screen.getByRole("link");
			expect(link).toHaveClass(
				"flex",
				"items-center",
				"gap-2",
				"mt-20",
				"mb-10",
				"hover:underline"
			);
		});

		it("applies correct CSS classes to icon", () => {
			render(<GoBackButton href="/home" />);

			const icon = screen.getByTestId("arrow-left-icon");
			expect(icon).toHaveClass("w-5", "h-5");
		});

		it("renders span element with correct text", () => {
			render(<GoBackButton href="/home" />);

			const span = screen.getByText("Go Back");
			expect(span.tagName).toBe("SPAN");
		});
	});

	describe("Component Structure", () => {
		it("renders with proper semantic structure", () => {
			render(<GoBackButton href="/home" />);

			const link = screen.getByRole("link");
			const icon = screen.getByTestId("arrow-left-icon");
			const text = screen.getByText("Go Back");

			expect(link).toContainElement(icon);
			expect(link).toContainElement(text);
		});

		it("renders icon before text in DOM order", () => {
			render(<GoBackButton href="/home" />);

			const link = screen.getByRole("link");
			const children = Array.from(link.children);

			expect(children[0]).toHaveAttribute("data-testid", "arrow-left-icon");
			expect(children[1].textContent).toBe("Go Back");
		});
	});

	describe("Accessibility", () => {
		it("has proper link role", () => {
			render(<GoBackButton href="/home" />);

			const link = screen.getByRole("link");
			expect(link).toBeInTheDocument();
		});

		it("has accessible text content", () => {
			render(<GoBackButton href="/home" />);

			const link = screen.getByRole("link", { name: /go back/i });
			expect(link).toBeInTheDocument();
		});

		it("icon has proper accessibility attributes", () => {
			render(<GoBackButton href="/home" />);

			const icon = screen.getByTestId("arrow-left-icon");
			expect(icon).toHaveAttribute("role", "img");
			expect(icon).toHaveAttribute("aria-label", "Arrow left");
		});
	});

	describe("Different href Values", () => {
		it("handles root path href", () => {
			render(<GoBackButton href="/" />);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/");
		});

		it("handles nested path href", () => {
			render(<GoBackButton href="/movies/123" />);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/movies/123");
		});

		it("handles path with query parameters", () => {
			render(<GoBackButton href="/search?q=action" />);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/search?q=action");
		});

		it("handles path with hash", () => {
			render(<GoBackButton href="/page#section" />);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/page#section");
		});

		it("handles external URL", () => {
			render(<GoBackButton href="https://example.com" />);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "https://example.com");
		});
	});

	describe("Edge Cases", () => {
		it("handles empty string href", () => {
			render(<GoBackButton href="" />);

			// Use getByText to find the link element when href is empty
			const link = screen.getByText("Go Back").closest("a");
			expect(link).toHaveAttribute("href", "");
		});

		it("handles href with special characters", () => {
			const specialHref = "/movies/title-with-spaces-&-symbols";
			render(<GoBackButton href={specialHref} />);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", specialHref);
		});

		it("handles unicode characters in href", () => {
			const unicodeHref = "/movies/título-película";
			render(<GoBackButton href={unicodeHref} />);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", unicodeHref);
		});
	});

	describe("Component Isolation", () => {
		it("can be rendered multiple times without conflicts", () => {
			const { rerender } = render(<GoBackButton href="/home" />);

			expect(screen.getByText("Go Back")).toBeInTheDocument();

			rerender(<GoBackButton href="/categories" />);
			expect(screen.getByText("Go Back")).toBeInTheDocument();
			expect(screen.getByRole("link")).toHaveAttribute("href", "/categories");
		});

		it("maintains consistent structure across re-renders", () => {
			const { rerender } = render(<GoBackButton href="/initial" />);

			const initialLink = screen.getByRole("link");
			const initialIcon = screen.getByTestId("arrow-left-icon");
			const initialText = screen.getByText("Go Back");

			expect(initialLink).toContainElement(initialIcon);
			expect(initialLink).toContainElement(initialText);

			rerender(<GoBackButton href="/updated" />);

			const updatedLink = screen.getByRole("link");
			const updatedIcon = screen.getByTestId("arrow-left-icon");
			const updatedText = screen.getByText("Go Back");

			expect(updatedLink).toContainElement(updatedIcon);
			expect(updatedLink).toContainElement(updatedText);
			expect(updatedLink).toHaveAttribute("href", "/updated");
		});
	});

	describe("Integration", () => {
		it("integrates properly with Next.js Link component", () => {
			render(<GoBackButton href="/movies" />);

			const link = screen.getByRole("link");
			expect(link.tagName).toBe("A"); // Mocked as anchor tag
			expect(link).toHaveAttribute("href", "/movies");
		});

		it("integrates properly with Lucide React icon", () => {
			render(<GoBackButton href="/home" />);

			const icon = screen.getByTestId("arrow-left-icon");
			expect(icon.tagName).toBe("svg");
			expect(icon).toHaveClass("w-5", "h-5");
		});
	});
});
