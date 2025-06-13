import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../../../components/core/Carousel";

// Mock embla-carousel-react
const mockScrollPrev = jest.fn();
const mockScrollNext = jest.fn();
const mockCanScrollPrev = jest.fn();
const mockCanScrollNext = jest.fn();
const mockOn = jest.fn();
const mockOff = jest.fn();

const mockApi = {
	scrollPrev: mockScrollPrev,
	scrollNext: mockScrollNext,
	canScrollPrev: mockCanScrollPrev,
	canScrollNext: mockCanScrollNext,
	on: mockOn,
	off: mockOff,
};

const mockCarouselRef = jest.fn();

jest.mock("embla-carousel-react", () => ({
	__esModule: true,
	default: jest.fn(() => [mockCarouselRef, mockApi]),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
	ArrowLeft: ({ className }: { className?: string }) => (
		<svg
			data-testid="arrow-left-icon"
			className={className}
			role="img"
			aria-label="Arrow left"
		>
			<path />
		</svg>
	),
	ArrowRight: ({ className }: { className?: string }) => (
		<svg
			data-testid="arrow-right-icon"
			className={className}
			role="img"
			aria-label="Arrow right"
		>
			<path />
		</svg>
	),
}));

// Mock Button component
jest.mock("../../../components/core/Button", () => {
	const MockButton = React.forwardRef<
		HTMLButtonElement,
		React.ButtonHTMLAttributes<HTMLButtonElement> & {
			variant?: string;
			size?: string;
		}
	>(({ children, className, variant, size, ...props }, ref) => (
		<button ref={ref} className={className} {...props}>
			{children}
		</button>
	));
	MockButton.displayName = "Button";
	return { Button: MockButton };
});

describe("Carousel", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Setup default mock return values
		mockCanScrollPrev.mockReturnValue(false);
		mockCanScrollNext.mockReturnValue(true);
	});

	describe("Basic Rendering", () => {
		it("renders carousel container with correct structure", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
						<CarouselItem>Item 2</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const carousel = screen.getByRole("region");
			expect(carousel).toBeInTheDocument();
			expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
		});

		it("renders carousel content with overflow hidden", () => {
			render(
				<Carousel>
					<CarouselContent data-testid="carousel-content">
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const content = screen.getByTestId("carousel-content");
			expect(content.parentElement).toHaveClass("overflow-hidden");
		});

		it("renders carousel items with correct structure", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem data-testid="item-1">Item 1</CarouselItem>
						<CarouselItem data-testid="item-2">Item 2</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const item1 = screen.getByTestId("item-1");
			const item2 = screen.getByTestId("item-2");

			expect(item1).toHaveAttribute("role", "group");
			expect(item1).toHaveAttribute("aria-roledescription", "slide");
			expect(item2).toHaveAttribute("role", "group");
			expect(item2).toHaveAttribute("aria-roledescription", "slide");
		});

		it("renders navigation buttons", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			);

			expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
			expect(screen.getByTestId("arrow-right-icon")).toBeInTheDocument();
		});
	});

	describe("CSS Classes and Styling", () => {
		it("applies correct CSS classes to carousel container", () => {
			render(
				<Carousel className="custom-class">
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const carousel = screen.getByRole("region");
			expect(carousel).toHaveClass("relative", "custom-class");
		});

		it("applies correct CSS classes to carousel content for horizontal orientation", () => {
			render(
				<Carousel orientation="horizontal">
					<CarouselContent data-testid="content">
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const content = screen.getByTestId("content");
			expect(content).toHaveClass("flex", "-ml-4");
			expect(content).not.toHaveClass("flex-col", "-mt-4");
		});

		it("applies correct CSS classes to carousel content for vertical orientation", () => {
			render(
				<Carousel orientation="vertical">
					<CarouselContent data-testid="content">
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const content = screen.getByTestId("content");
			expect(content).toHaveClass("flex", "-mt-4", "flex-col");
			expect(content).not.toHaveClass("-ml-4");
		});

		it("applies correct CSS classes to carousel items for horizontal orientation", () => {
			render(
				<Carousel orientation="horizontal">
					<CarouselContent>
						<CarouselItem data-testid="item">Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const item = screen.getByTestId("item");
			expect(item).toHaveClass(
				"min-w-0",
				"shrink-0",
				"grow-0",
				"basis-full",
				"pl-4"
			);
			expect(item).not.toHaveClass("pt-4");
		});

		it("applies correct CSS classes to carousel items for vertical orientation", () => {
			render(
				<Carousel orientation="vertical">
					<CarouselContent>
						<CarouselItem data-testid="item">Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const item = screen.getByTestId("item");
			expect(item).toHaveClass(
				"min-w-0",
				"shrink-0",
				"grow-0",
				"basis-full",
				"pt-4"
			);
			expect(item).not.toHaveClass("pl-4");
		});

		it("applies correct CSS classes to previous button for horizontal orientation", () => {
			render(
				<Carousel orientation="horizontal">
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
					<CarouselPrevious data-testid="prev-btn" />
				</Carousel>
			);

			const prevBtn = screen.getByTestId("prev-btn");
			expect(prevBtn).toHaveClass(
				"absolute",
				"h-8",
				"w-8",
				"rounded-full",
				"-left-12",
				"top-1/2",
				"-translate-y-1/2"
			);
			expect(prevBtn).not.toHaveClass(
				"-top-12",
				"left-1/2",
				"-translate-x-1/2",
				"rotate-90"
			);
		});

		it("applies correct CSS classes to next button for vertical orientation", () => {
			render(
				<Carousel orientation="vertical">
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
					<CarouselNext data-testid="next-btn" />
				</Carousel>
			);

			const nextBtn = screen.getByTestId("next-btn");
			expect(nextBtn).toHaveClass(
				"absolute",
				"h-8",
				"w-8",
				"rounded-full",
				"-bottom-12",
				"left-1/2",
				"-translate-x-1/2",
				"rotate-90"
			);
			expect(nextBtn).not.toHaveClass(
				"-right-12",
				"top-1/2",
				"-translate-y-1/2"
			);
		});
	});

	describe("Navigation Functionality", () => {
		it("calls scrollPrev when previous button is clicked", async () => {
			const user = userEvent.setup();
			// Enable the previous button for this test
			mockCanScrollPrev.mockReturnValue(true);

			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
					<CarouselPrevious />
				</Carousel>
			);

			const prevBtn = screen.getByRole("button", { name: /previous slide/i });
			await user.click(prevBtn);

			expect(mockScrollPrev).toHaveBeenCalled();
		});

		it("calls scrollNext when next button is clicked", async () => {
			const user = userEvent.setup();

			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
					<CarouselNext />
				</Carousel>
			);

			const nextBtn = screen.getByRole("button", { name: /next slide/i });
			await user.click(nextBtn);

			expect(mockScrollNext).toHaveBeenCalled();
		});

		it("disables previous button when cannot scroll prev", () => {
			mockCanScrollPrev.mockReturnValue(false);

			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
					<CarouselPrevious />
				</Carousel>
			);

			const prevBtn = screen.getByRole("button", { name: /previous slide/i });
			expect(prevBtn).toBeDisabled();
		});

		it("disables next button when cannot scroll next", () => {
			mockCanScrollNext.mockReturnValue(false);

			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
					<CarouselNext />
				</Carousel>
			);

			const nextBtn = screen.getByRole("button", { name: /next slide/i });
			expect(nextBtn).toBeDisabled();
		});

		it("enables navigation buttons when can scroll", () => {
			mockCanScrollPrev.mockReturnValue(true);
			mockCanScrollNext.mockReturnValue(true);

			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			);

			const prevBtn = screen.getByRole("button", { name: /previous slide/i });
			const nextBtn = screen.getByRole("button", { name: /next slide/i });

			expect(prevBtn).not.toBeDisabled();
			expect(nextBtn).not.toBeDisabled();
		});
	});

	describe("Keyboard Navigation", () => {
		it("navigates to previous slide when ArrowLeft is pressed", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const carousel = screen.getByRole("region");
			fireEvent.keyDown(carousel, { key: "ArrowLeft", code: "ArrowLeft" });

			expect(mockScrollPrev).toHaveBeenCalled();
		});

		it("navigates to next slide when ArrowRight is pressed", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const carousel = screen.getByRole("region");
			fireEvent.keyDown(carousel, { key: "ArrowRight", code: "ArrowRight" });

			expect(mockScrollNext).toHaveBeenCalled();
		});

		it("prevents default behavior for arrow key navigation", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const carousel = screen.getByRole("region");
			const event = new KeyboardEvent("keydown", {
				key: "ArrowLeft",
				bubbles: true,
			});
			const preventDefaultSpy = jest.spyOn(event, "preventDefault");

			fireEvent(carousel, event);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it("ignores non-arrow keys", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const carousel = screen.getByRole("region");
			fireEvent.keyDown(carousel, { key: "Enter", code: "Enter" });
			fireEvent.keyDown(carousel, { key: "Space", code: "Space" });

			expect(mockScrollPrev).not.toHaveBeenCalled();
			expect(mockScrollNext).not.toHaveBeenCalled();
		});
	});

	describe("API Integration", () => {
		it("calls setApi when api is available", () => {
			const mockSetApi = jest.fn();

			render(
				<Carousel setApi={mockSetApi}>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			expect(mockSetApi).toHaveBeenCalledWith(mockApi);
		});

		it("sets up event listeners on api", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			expect(mockOn).toHaveBeenCalledWith("reInit", expect.any(Function));
			expect(mockOn).toHaveBeenCalledWith("select", expect.any(Function));
		});

		it("cleans up event listeners on unmount", () => {
			const { unmount } = render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			unmount();

			expect(mockOff).toHaveBeenCalledWith("select", expect.any(Function));
		});
	});

	describe("Accessibility", () => {
		it("has proper ARIA attributes on carousel container", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const carousel = screen.getByRole("region");
			expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
		});

		it("has proper ARIA attributes on carousel items", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem data-testid="item">Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const item = screen.getByTestId("item");
			expect(item).toHaveAttribute("role", "group");
			expect(item).toHaveAttribute("aria-roledescription", "slide");
		});

		it("has screen reader text for navigation buttons", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			);

			expect(screen.getByText("Previous slide")).toHaveClass("sr-only");
			expect(screen.getByText("Next slide")).toHaveClass("sr-only");
		});
	});

	describe("Custom Props and Options", () => {
		it("accepts custom className for carousel container", () => {
			render(
				<Carousel className="custom-carousel">
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const carousel = screen.getByRole("region");
			expect(carousel).toHaveClass("custom-carousel");
		});

		it("accepts custom className for carousel content", () => {
			render(
				<Carousel>
					<CarouselContent className="custom-content" data-testid="content">
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const content = screen.getByTestId("content");
			expect(content).toHaveClass("custom-content");
		});

		it("accepts custom className for carousel items", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem className="custom-item" data-testid="item">
							Item 1
						</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const item = screen.getByTestId("item");
			expect(item).toHaveClass("custom-item");
		});

		it("accepts custom variant and size for navigation buttons", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
					<CarouselPrevious variant="solid" size="lg" data-testid="prev" />
					<CarouselNext variant="ghost" size="sm" data-testid="next" />
				</Carousel>
			);

			// Buttons should render (mocked Button component accepts these props)
			expect(screen.getByTestId("prev")).toBeInTheDocument();
			expect(screen.getByTestId("next")).toBeInTheDocument();
		});
	});

	describe("Edge Cases", () => {
		it("handles empty carousel content", () => {
			render(
				<Carousel>
					<CarouselContent data-testid="content">
						{/* No items */}
					</CarouselContent>
				</Carousel>
			);

			const content = screen.getByTestId("content");
			expect(content).toBeInTheDocument();
			expect(content).toBeEmptyDOMElement();
		});

		it("handles single carousel item", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem data-testid="single-item">Only Item</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			const item = screen.getByTestId("single-item");
			expect(item).toBeInTheDocument();
			expect(item).toHaveTextContent("Only Item");
		});

		it("handles multiple carousel items", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem data-testid="item-1">Item 1</CarouselItem>
						<CarouselItem data-testid="item-2">Item 2</CarouselItem>
						<CarouselItem data-testid="item-3">Item 3</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			expect(screen.getByTestId("item-1")).toBeInTheDocument();
			expect(screen.getByTestId("item-2")).toBeInTheDocument();
			expect(screen.getByTestId("item-3")).toBeInTheDocument();
		});

		it("handles carousel without navigation buttons", () => {
			render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			// Should not throw error and carousel should still be functional
			const carousel = screen.getByRole("region");
			expect(carousel).toBeInTheDocument();
		});
	});

	describe("Component Isolation", () => {
		it("can be rendered multiple times without conflicts", () => {
			const { rerender } = render(
				<Carousel>
					<CarouselContent>
						<CarouselItem>Item 1</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			expect(screen.getByRole("region")).toBeInTheDocument();

			rerender(
				<Carousel orientation="vertical">
					<CarouselContent>
						<CarouselItem>Different Item</CarouselItem>
					</CarouselContent>
				</Carousel>
			);

			expect(screen.getByRole("region")).toBeInTheDocument();
			expect(screen.getByText("Different Item")).toBeInTheDocument();
		});

		it("maintains state independence between multiple instances", () => {
			render(
				<div>
					<Carousel data-testid="carousel-1">
						<CarouselContent>
							<CarouselItem>Carousel 1 Item</CarouselItem>
						</CarouselContent>
					</Carousel>
					<Carousel data-testid="carousel-2">
						<CarouselContent>
							<CarouselItem>Carousel 2 Item</CarouselItem>
						</CarouselContent>
					</Carousel>
				</div>
			);

			const carousels = screen.getAllByRole("region");
			expect(carousels).toHaveLength(2);
			expect(screen.getByText("Carousel 1 Item")).toBeInTheDocument();
			expect(screen.getByText("Carousel 2 Item")).toBeInTheDocument();
		});
	});
});
