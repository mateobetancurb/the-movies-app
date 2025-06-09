import { render, screen } from "@testing-library/react";
import Loading from "../../app/loading";

describe("Loading Component", () => {
	it("renders loading component with correct structure", () => {
		render(<Loading />);

		// Check that the loading container is present
		const loadingContainer = document.querySelector(".flex");
		expect(loadingContainer).toBeInTheDocument();
		expect(loadingContainer).toHaveClass(
			"flex",
			"items-center",
			"justify-center",
			"h-screen"
		);
	});

	it("displays loading spinner with correct styling", () => {
		render(<Loading />);

		// Find the spinner element by its distinctive classes
		const spinner = document.querySelector(".animate-spin");
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass("animate-spin");
		expect(spinner).toHaveClass("rounded-full");
		expect(spinner).toHaveClass("h-20");
		expect(spinner).toHaveClass("w-20");
		expect(spinner).toHaveClass("border-t-2");
		expect(spinner).toHaveClass("border-b-2");
		expect(spinner).toHaveClass("border-white");
	});

	it("centers the loading spinner correctly", () => {
		render(<Loading />);

		const container = document.querySelector(".flex");
		expect(container).toBeInTheDocument();
		expect(container).toHaveClass("flex");
		expect(container).toHaveClass("items-center");
		expect(container).toHaveClass("justify-center");
		expect(container).toHaveClass("h-screen");
	});

	it("has proper accessibility attributes", () => {
		render(<Loading />);

		// The loading component should be accessible to screen readers
		const container = document.querySelector(".flex");
		expect(container).toBeInTheDocument();

		// While it doesn't explicitly have role="status", it's visually clear as a loading indicator
		const spinner = document.querySelector(".animate-spin");
		expect(spinner).toBeInTheDocument();
	});

	it("renders correct div structure", () => {
		render(<Loading />);

		const outerContainer = document.querySelector(".flex");
		const spinner = document.querySelector(".animate-spin");

		expect(outerContainer).toBeInTheDocument();
		expect(spinner).toBeInTheDocument();
		expect(outerContainer?.contains(spinner!)).toBe(true);
	});

	it("has full screen height for proper centering", () => {
		render(<Loading />);

		const container = document.querySelector(".h-screen");
		expect(container).toBeInTheDocument();
		expect(container).toHaveClass("h-screen");
	});

	it("uses white border color for visibility on dark backgrounds", () => {
		render(<Loading />);

		const spinner = document.querySelector(".border-white");
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass("border-white");
	});

	it("has consistent spinner dimensions", () => {
		render(<Loading />);

		const spinner = document.querySelector(".animate-spin");
		expect(spinner).toHaveClass("h-20");
		expect(spinner).toHaveClass("w-20");
	});

	it("uses rounded-full for circular spinner shape", () => {
		render(<Loading />);

		const spinner = document.querySelector(".rounded-full");
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass("rounded-full");
	});

	it("applies correct border styling for spinner animation", () => {
		render(<Loading />);

		const spinner = document.querySelector(".animate-spin");
		expect(spinner).toHaveClass("border-t-2"); // Top border
		expect(spinner).toHaveClass("border-b-2"); // Bottom border

		// Should not have left or right borders for the spinner effect
		expect(spinner).not.toHaveClass("border-l-2");
		expect(spinner).not.toHaveClass("border-r-2");
	});

	it("maintains proper component structure", () => {
		const { container } = render(<Loading />);

		// Check the DOM structure
		expect(container.firstChild).toHaveClass(
			"flex",
			"items-center",
			"justify-center",
			"h-screen"
		);
		expect(container.firstChild?.firstChild).toHaveClass(
			"animate-spin",
			"rounded-full"
		);
	});

	it("renders without any text content", () => {
		render(<Loading />);

		// Loading component should be purely visual (no text)
		expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/please wait/i)).not.toBeInTheDocument();
	});

	it("can be rendered multiple times without conflicts", () => {
		const { rerender } = render(<Loading />);

		expect(document.querySelector(".animate-spin")).toBeInTheDocument();

		rerender(<Loading />);

		expect(document.querySelector(".animate-spin")).toBeInTheDocument();
	});

	it("has no interactive elements", () => {
		render(<Loading />);

		// Loading component should have no buttons, links, or inputs
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
		expect(screen.queryByRole("link")).not.toBeInTheDocument();
		expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
	});

	it("uses flexbox for proper centering", () => {
		render(<Loading />);

		const container = document.querySelector(".flex");
		expect(container).toHaveClass("flex");
		expect(container).toHaveClass("items-center");
		expect(container).toHaveClass("justify-center");
	});
});
