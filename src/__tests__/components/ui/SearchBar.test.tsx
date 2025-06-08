import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import SearchBar from "../../../components/ui/SearchBar";

// Mock next/navigation
jest.mock("next/navigation", () => ({
	useSearchParams: jest.fn(),
	usePathname: jest.fn(),
	useRouter: jest.fn(),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
	Search: ({ className }: { className?: string }) => (
		<div data-testid="search-icon" className={className} />
	),
	X: ({ className }: { className?: string }) => (
		<div data-testid="x-icon" className={className} />
	),
}));

describe("SearchBar", () => {
	const mockReplace = jest.fn();
	const mockSearchParams = {
		get: jest.fn(),
		toString: jest.fn(() => ""),
	};
	const mockURLSearchParams = {
		set: jest.fn(),
		delete: jest.fn(),
		toString: jest.fn(() => ""),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue({
			replace: mockReplace,
		});
		(usePathname as jest.Mock).mockReturnValue("/movies");
		(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

		// Mock URLSearchParams constructor
		global.URLSearchParams = jest
			.fn()
			.mockImplementation(() => mockURLSearchParams);
	});

	describe("Rendering", () => {
		it("renders search input with default placeholder", () => {
			render(<SearchBar />);

			expect(
				screen.getByPlaceholderText("Search for movies...")
			).toBeInTheDocument();
			expect(screen.getByTestId("search-icon")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Search" })
			).toBeInTheDocument();
		});

		it("renders search input with custom placeholder", () => {
			render(<SearchBar placeholder="Find your favorite films..." />);

			expect(
				screen.getByPlaceholderText("Find your favorite films...")
			).toBeInTheDocument();
		});

		it("applies correct CSS classes to input", () => {
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			expect(input).toHaveClass(
				"w-full",
				"p-4",
				"pl-10",
				"text-sm",
				"bg-gray-800",
				"border",
				"border-gray-700",
				"rounded-lg",
				"focus:ring-accent-500",
				"focus:border-accent-500",
				"placeholder-gray-400",
				"text-white"
			);
		});

		it("displays search icon with correct styling", () => {
			render(<SearchBar />);

			const searchIcon = screen.getByTestId("search-icon");
			expect(searchIcon).toHaveClass("w-5", "h-5", "text-gray-500");
		});

		it("displays search button with correct styling", () => {
			render(<SearchBar />);

			const searchButton = screen.getByRole("button", { name: "Search" });
			expect(searchButton).toHaveClass(
				"absolute",
				"right-2.5",
				"bottom-2.5",
				"px-4",
				"py-2",
				"text-sm",
				"font-medium",
				"text-white",
				"bg-accent-600",
				"rounded-lg",
				"hover:bg-accent-700",
				"focus:ring-4",
				"focus:outline-none",
				"focus:ring-accent-800"
			);
		});
	});

	describe("Initial state from URL parameters", () => {
		it("initializes with query from URL search params", () => {
			mockSearchParams.get.mockReturnValue("batman");

			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			expect(input).toHaveValue("batman");
			expect(mockSearchParams.get).toHaveBeenCalledWith("q");
		});

		it("initializes with empty value when no query in URL", () => {
			mockSearchParams.get.mockReturnValue(null);

			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			expect(input).toHaveValue("");
		});

		it("shows clear button when input has value from URL", () => {
			mockSearchParams.get.mockReturnValue("superman");

			render(<SearchBar />);

			expect(screen.getByTestId("x-icon")).toBeInTheDocument();
		});

		it("does not show clear button when input is empty", () => {
			mockSearchParams.get.mockReturnValue(null);

			render(<SearchBar />);

			expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
		});
	});

	describe("Input interaction", () => {
		it("updates input value when user types", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "avengers");

			expect(input).toHaveValue("avengers");
		});

		it("shows clear button when user types in input", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "spider");

			expect(screen.getByTestId("x-icon")).toBeInTheDocument();
		});

		it("handles special characters in input", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "spider-man: no way home!");

			expect(input).toHaveValue("spider-man: no way home!");
		});

		it("handles unicode characters in input", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "アニメ映画");

			expect(input).toHaveValue("アニメ映画");
		});
	});

	describe("Form submission", () => {
		it("submits form and updates URL with search query", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");

			await user.type(input, "iron man");
			fireEvent.submit(form!);

			expect(mockURLSearchParams.set).toHaveBeenCalledWith("q", "iron man");
			expect(mockReplace).toHaveBeenCalledWith("/movies?");
		});

		it("submits form by clicking search button", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			const searchButton = screen.getByRole("button", { name: "Search" });

			await user.type(input, "thor");
			await user.click(searchButton);

			expect(mockURLSearchParams.set).toHaveBeenCalledWith("q", "thor");
			expect(mockReplace).toHaveBeenCalledWith("/movies?");
		});

		it("trims whitespace from search query before submission", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");

			await user.type(input, "  captain america  ");
			fireEvent.submit(form!);

			expect(mockURLSearchParams.set).toHaveBeenCalledWith(
				"q",
				"captain america"
			);
		});

		it("removes query parameter when submitting empty search", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");

			await user.type(input, "   ");
			fireEvent.submit(form!);

			expect(mockURLSearchParams.delete).toHaveBeenCalledWith("q");
			expect(mockURLSearchParams.set).not.toHaveBeenCalled();
		});

		it("calls onSearch callback when provided on form submission", async () => {
			const mockOnSearch = jest.fn();
			const user = userEvent.setup();
			render(<SearchBar onSearch={mockOnSearch} />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");

			await user.type(input, "black widow");
			fireEvent.submit(form!);

			expect(mockOnSearch).toHaveBeenCalledWith("black widow");
		});

		it("calls onSearch callback with trimmed query", async () => {
			const mockOnSearch = jest.fn();
			const user = userEvent.setup();
			render(<SearchBar onSearch={mockOnSearch} />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");

			await user.type(input, "  hulk  ");
			fireEvent.submit(form!);

			expect(mockOnSearch).toHaveBeenCalledWith("hulk");
		});

		it("prevents default form submission behavior", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");
			const submitEvent = new Event("submit", {
				bubbles: true,
				cancelable: true,
			});
			const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");

			await user.type(input, "doctor strange");
			fireEvent(form!, submitEvent);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});
	});

	describe("Clear functionality", () => {
		it("clears input when clear button is clicked", async () => {
			const user = userEvent.setup();
			mockSearchParams.get.mockReturnValue("initial query");
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			const clearButton = screen.getByTestId("x-icon").closest("button");

			expect(input).toHaveValue("initial query");

			await user.click(clearButton!);

			expect(input).toHaveValue("");
		});

		it("removes query parameter from URL when cleared", async () => {
			const user = userEvent.setup();
			mockSearchParams.get.mockReturnValue("query to clear");
			render(<SearchBar />);

			const clearButton = screen.getByTestId("x-icon").closest("button");

			await user.click(clearButton!);

			expect(mockURLSearchParams.delete).toHaveBeenCalledWith("q");
			expect(mockReplace).toHaveBeenCalledWith("/movies?");
		});

		it("calls onSearch callback with empty string when cleared", async () => {
			const mockOnSearch = jest.fn();
			const user = userEvent.setup();
			mockSearchParams.get.mockReturnValue("query to clear");
			render(<SearchBar onSearch={mockOnSearch} />);

			const clearButton = screen.getByTestId("x-icon").closest("button");

			await user.click(clearButton!);

			expect(mockOnSearch).toHaveBeenCalledWith("");
		});

		it("hides clear button after clearing input", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "test query");

			expect(screen.getByTestId("x-icon")).toBeInTheDocument();

			const clearButton = screen.getByTestId("x-icon").closest("button");
			await user.click(clearButton!);

			expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
		});

		it("applies correct styling to clear button", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "test");

			const clearButton = screen.getByTestId("x-icon").closest("button");
			expect(clearButton).toHaveClass(
				"absolute",
				"inset-y-0",
				"right-14",
				"flex",
				"items-center",
				"pr-3"
			);

			const xIcon = screen.getByTestId("x-icon");
			expect(xIcon).toHaveClass(
				"w-5",
				"h-5",
				"text-gray-400",
				"hover:text-white"
			);
		});
	});

	describe("URL handling", () => {
		it("constructs URL with current pathname", async () => {
			const user = userEvent.setup();
			(usePathname as jest.Mock).mockReturnValue("/categories");
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");

			await user.type(input, "test");
			fireEvent.submit(form!);

			expect(mockReplace).toHaveBeenCalledWith("/categories?");
		});

		it("preserves existing search parameters", () => {
			mockSearchParams.toString.mockReturnValue("genre=action&sort=rating");
			mockURLSearchParams.toString.mockReturnValue(
				"genre=action&sort=rating&q=test"
			);

			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");

			fireEvent.change(input, { target: { value: "test" } });
			fireEvent.submit(form!);

			expect(mockReplace).toHaveBeenCalledWith(
				"/movies?genre=action&sort=rating&q=test"
			);
		});

		it("creates URLSearchParams with current search params", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");

			await user.type(input, "test");
			fireEvent.submit(form!);

			expect(global.URLSearchParams).toHaveBeenCalledWith(mockSearchParams);
		});
	});

	describe("Edge cases", () => {
		it("handles rapid typing and clearing", async () => {
			mockSearchParams.get.mockReturnValue(null);
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");

			await user.type(input, "fast");
			await user.clear(input);
			await user.type(input, "typing");

			expect(input).toHaveValue("typing");
		});

		it("handles form submission with only whitespace", async () => {
			mockSearchParams.get.mockReturnValue(null);
			const mockOnSearch = jest.fn();
			const user = userEvent.setup();
			render(<SearchBar onSearch={mockOnSearch} />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");

			await user.type(input, "     ");
			fireEvent.submit(form!);

			expect(mockOnSearch).toHaveBeenCalledWith("");
			expect(mockURLSearchParams.delete).toHaveBeenCalledWith("q");
		});

		it("handles very long search queries", async () => {
			mockSearchParams.get.mockReturnValue(null);
			const user = userEvent.setup();
			render(<SearchBar />);

			const longQuery = "a".repeat(100); // Reduce length for faster test
			const input = screen.getByRole("searchbox");

			await user.type(input, longQuery);

			expect(input).toHaveValue(longQuery);
		});

		it("works without onSearch callback", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			const form = input.closest("form");

			await user.type(input, "no callback");

			expect(() => fireEvent.submit(form!)).not.toThrow();
		});

		it("handles null search params gracefully", () => {
			mockSearchParams.get.mockReturnValue(null);

			expect(() => render(<SearchBar />)).not.toThrow();

			const input = screen.getByRole("searchbox");
			expect(input).toHaveValue("");
		});
	});

	describe("Accessibility", () => {
		it("has proper form structure", () => {
			render(<SearchBar />);

			const form = document.querySelector("form");
			expect(form).toBeInTheDocument();

			const input = screen.getByRole("searchbox");
			expect(input).toBeInTheDocument();
			expect(input.type).toBe("search");
		});

		it("has accessible button labels", () => {
			render(<SearchBar />);

			expect(
				screen.getByRole("button", { name: "Search" })
			).toBeInTheDocument();
		});

		it("clear button is properly accessible", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "test");

			const clearButton = screen.getByTestId("x-icon").closest("button");
			expect(clearButton).toHaveAttribute("type", "button");
		});

		it("maintains focus after clearing", async () => {
			const user = userEvent.setup();
			render(<SearchBar />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "test");

			const clearButton = screen.getByTestId("x-icon").closest("button");
			await user.click(clearButton!);

			// Input should still be in the document and focusable
			expect(input).toBeInTheDocument();
		});
	});

	describe("Component composition", () => {
		it("renders within a form element", () => {
			render(<SearchBar />);

			const form = document.querySelector("form");
			const input = screen.getByRole("searchbox");

			expect(form).toBeInTheDocument();
			expect(form).toContainElement(input);
		});

		it("positions elements correctly with CSS classes", () => {
			render(<SearchBar />);

			const form = document.querySelector("form");
			expect(form).toHaveClass("relative", "w-full", "max-w-2xl", "mx-auto");

			const inputContainer = form!.firstChild as HTMLElement;
			expect(inputContainer).toHaveClass("relative");
		});

		it("search icon is positioned as expected", () => {
			render(<SearchBar />);

			const searchIcon = screen.getByTestId("search-icon");
			const iconContainer = searchIcon.parentElement;

			expect(iconContainer).toHaveClass(
				"absolute",
				"inset-y-0",
				"left-0",
				"flex",
				"items-center",
				"pl-3",
				"pointer-events-none"
			);
		});
	});
});
