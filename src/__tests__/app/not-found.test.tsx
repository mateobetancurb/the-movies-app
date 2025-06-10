import { render, screen } from "@testing-library/react";
import NotFound from "../../app/not-found";

// Mock next/link
jest.mock("next/link", () => {
	const MockLink = ({ children, href, className, ...props }: any) => (
		<a href={href} className={className} {...props}>
			{children}
		</a>
	);
	MockLink.displayName = "MockLink";
	return MockLink;
});

// Mock lucide-react Film icon
jest.mock("lucide-react", () => ({
	Film: ({ className, ...props }: any) => (
		<svg className={className} data-testid="film-icon" {...props}>
			<title>Film Icon</title>
		</svg>
	),
}));

describe("NotFound Component", () => {
	it("renders 404 page with correct structure", () => {
		render(<NotFound />);

		// Check main container
		const container = document.querySelector(".container");
		expect(container).toBeInTheDocument();
		expect(container).toHaveClass(
			"container",
			"mx-auto",
			"px-4",
			"pt-24",
			"pb-12",
			"flex",
			"flex-col",
			"items-center",
			"justify-center",
			"min-h-[70vh]",
			"text-center"
		);
	});

	it("displays Film icon with correct styling", () => {
		render(<NotFound />);

		const filmIcon = screen.getByTestId("film-icon");
		expect(filmIcon).toBeInTheDocument();
		expect(filmIcon).toHaveClass("w-20", "h-20", "text-gray-700", "mb-4");
	});

	it("displays correct 404 heading", () => {
		render(<NotFound />);

		const heading404 = screen.getByRole("heading", { level: 1 });
		expect(heading404).toBeInTheDocument();
		expect(heading404).toHaveTextContent("404");
		expect(heading404).toHaveClass("text-4xl", "font-bold", "mb-2");
	});

	it("displays 'Page Not Found' heading", () => {
		render(<NotFound />);

		const pageNotFoundHeading = screen.getByRole("heading", { level: 2 });
		expect(pageNotFoundHeading).toBeInTheDocument();
		expect(pageNotFoundHeading).toHaveTextContent("Page Not Found");
		expect(pageNotFoundHeading).toHaveClass("text-2xl", "font-bold", "mb-4");
	});

	it("displays descriptive error message", () => {
		render(<NotFound />);

		const errorMessage = screen.getByText(
			/The page you are looking for might have been removed/
		);
		expect(errorMessage).toBeInTheDocument();
		expect(errorMessage).toHaveClass("text-gray-400", "mb-8", "max-w-md");

		// Check full message content
		expect(errorMessage).toHaveTextContent(
			"The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
		);
	});

	it("displays back to home link with correct styling", () => {
		render(<NotFound />);

		const backToHomeLink = screen.getByRole("link", { name: /back to home/i });
		expect(backToHomeLink).toBeInTheDocument();
		expect(backToHomeLink).toHaveAttribute("href", "/");
		expect(backToHomeLink).toHaveClass("btn", "btn-primary");
		expect(backToHomeLink).toHaveTextContent("Back to Home");
	});

	it("maintains proper heading hierarchy", () => {
		render(<NotFound />);

		const h1 = screen.getByRole("heading", { level: 1 });
		const h2 = screen.getByRole("heading", { level: 2 });

		expect(h1).toBeInTheDocument();
		expect(h2).toBeInTheDocument();

		// H1 should come before H2 in the DOM
		expect(h1.compareDocumentPosition(h2)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING
		);
	});

	it("has proper semantic HTML structure", () => {
		render(<NotFound />);

		// Check that it has proper headings
		expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
		expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();

		// Check that it has a navigation link
		expect(screen.getByRole("link")).toBeInTheDocument();

		// Check that the main container exists
		const container = document.querySelector(".container");
		expect(container).toBeInTheDocument();
	});

	it("applies responsive container styling", () => {
		render(<NotFound />);

		const container = document.querySelector(".container");
		expect(container).toHaveClass("container", "mx-auto", "px-4");
	});

	it("applies proper spacing and layout classes", () => {
		render(<NotFound />);

		const container = document.querySelector(".container");
		expect(container).toHaveClass("pt-24", "pb-12"); // Top and bottom padding
		expect(container).toHaveClass("flex", "flex-col"); // Flexbox layout
		expect(container).toHaveClass("items-center", "justify-center"); // Centering
		expect(container).toHaveClass("min-h-[70vh]"); // Minimum height
		expect(container).toHaveClass("text-center"); // Text alignment
	});

	it("uses appropriate text colors for dark theme", () => {
		render(<NotFound />);

		const filmIcon = screen.getByTestId("film-icon");
		expect(filmIcon).toHaveClass("text-gray-700");

		const errorMessage = screen.getByText(/The page you are looking for/);
		expect(errorMessage).toHaveClass("text-gray-400");
	});

	it("has proper margin spacing between elements", () => {
		render(<NotFound />);

		const filmIcon = screen.getByTestId("film-icon");
		expect(filmIcon).toHaveClass("mb-4");

		const heading404 = screen.getByRole("heading", { level: 1 });
		expect(heading404).toHaveClass("mb-2");

		const pageNotFoundHeading = screen.getByRole("heading", { level: 2 });
		expect(pageNotFoundHeading).toHaveClass("mb-4");

		const errorMessage = screen.getByText(/The page you are looking for/);
		expect(errorMessage).toHaveClass("mb-8");
	});

	it("constrains error message width for readability", () => {
		render(<NotFound />);

		const errorMessage = screen.getByText(/The page you are looking for/);
		expect(errorMessage).toHaveClass("max-w-md");
	});

	it("uses appropriate font weights for hierarchy", () => {
		render(<NotFound />);

		const heading404 = screen.getByRole("heading", { level: 1 });
		expect(heading404).toHaveClass("font-bold");

		const pageNotFoundHeading = screen.getByRole("heading", { level: 2 });
		expect(pageNotFoundHeading).toHaveClass("font-bold");
	});

	it("uses appropriate font sizes for hierarchy", () => {
		render(<NotFound />);

		const heading404 = screen.getByRole("heading", { level: 1 });
		expect(heading404).toHaveClass("text-4xl");

		const pageNotFoundHeading = screen.getByRole("heading", { level: 2 });
		expect(pageNotFoundHeading).toHaveClass("text-2xl");
	});

	it("renders without any form elements", () => {
		render(<NotFound />);

		// 404 page should not have any form elements
		expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
		expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
	});

	it("has accessible error message content", () => {
		render(<NotFound />);

		// Check that the error message is informative and helpful
		const errorMessage = screen.getByText(/The page you are looking for/);
		expect(errorMessage.textContent).toContain("removed");
		expect(errorMessage.textContent).toContain("name changed");
		expect(errorMessage.textContent).toContain("temporarily unavailable");
	});

	it("provides clear navigation back to home", () => {
		render(<NotFound />);

		const backLink = screen.getByRole("link", { name: /back to home/i });
		expect(backLink).toHaveAttribute("href", "/");
		expect(backLink.textContent?.toLowerCase()).toContain("home");
	});

	it("maintains visual hierarchy with proper element order", () => {
		const { container } = render(<NotFound />);

		const elements = Array.from(container.querySelectorAll("*"));
		const iconIndex = elements.findIndex(
			(el) => el.getAttribute("data-testid") === "film-icon"
		);
		const h1Index = elements.findIndex((el) => el.tagName === "H1");
		const h2Index = elements.findIndex((el) => el.tagName === "H2");
		const paragraphIndex = elements.findIndex((el) => el.tagName === "P");
		const linkIndex = elements.findIndex((el) => el.tagName === "A");

		// Verify the order: Icon -> H1 -> H2 -> P -> Link
		expect(iconIndex).toBeLessThan(h1Index);
		expect(h1Index).toBeLessThan(h2Index);
		expect(h2Index).toBeLessThan(paragraphIndex);
		expect(paragraphIndex).toBeLessThan(linkIndex);
	});
});
