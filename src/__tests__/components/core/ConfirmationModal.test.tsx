import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmationModal from "../../../components/core/ConfirmationModal";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
	X: ({ className, ...props }: any) => (
		<svg data-testid="x-icon" className={className} {...props}>
			<path d="x" />
		</svg>
	),
	AlertTriangle: ({ className, ...props }: any) => (
		<svg data-testid="alert-triangle-icon" className={className} {...props}>
			<path d="alert-triangle" />
		</svg>
	),
}));

// Mock Button component
jest.mock("../../../components/core/Button", () => ({
	Button: ({ children, variant, onClick, className, ...props }: any) => (
		<button
			onClick={onClick}
			className={`mock-button mock-variant-${variant || "default"} ${
				className || ""
			}`}
			data-variant={variant}
			{...props}
		>
			{children}
		</button>
	),
}));

describe("ConfirmationModal", () => {
	const defaultProps = {
		isOpen: true,
		onClose: jest.fn(),
		onConfirm: jest.fn(),
		title: "Confirm Action",
		message: "Are you sure you want to perform this action?",
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Basic Rendering", () => {
		it("renders when isOpen is true", () => {
			render(<ConfirmationModal {...defaultProps} />);

			expect(screen.getByText("Confirm Action")).toBeInTheDocument();
			expect(
				screen.getByText("Are you sure you want to perform this action?")
			).toBeInTheDocument();
		});

		it("does not render when isOpen is false", () => {
			render(<ConfirmationModal {...defaultProps} isOpen={false} />);

			expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
			expect(
				screen.queryByText("Are you sure you want to perform this action?")
			).not.toBeInTheDocument();
		});

		it("renders title correctly", () => {
			render(<ConfirmationModal {...defaultProps} title="Custom Title" />);

			expect(screen.getByText("Custom Title")).toBeInTheDocument();
		});

		it("renders message correctly", () => {
			render(
				<ConfirmationModal {...defaultProps} message="Custom message text" />
			);

			expect(screen.getByText("Custom message text")).toBeInTheDocument();
		});

		it("renders default button text", () => {
			render(<ConfirmationModal {...defaultProps} />);

			expect(screen.getByText("Cancel")).toBeInTheDocument();
			expect(screen.getByText("Confirm")).toBeInTheDocument();
		});

		it("renders custom button text", () => {
			render(
				<ConfirmationModal
					{...defaultProps}
					cancelText="Go Back"
					confirmText="Delete"
				/>
			);

			expect(screen.getByText("Go Back")).toBeInTheDocument();
			expect(screen.getByText("Delete")).toBeInTheDocument();
		});
	});

	describe("Modal Types", () => {
		it("renders danger type modal with correct icon color", () => {
			render(<ConfirmationModal {...defaultProps} type="danger" />);

			const iconContainer = screen.getByTestId(
				"alert-triangle-icon"
			).parentElement;
			expect(iconContainer).toHaveClass("text-red-500");
		});

		it("renders warning type modal with correct icon color", () => {
			render(<ConfirmationModal {...defaultProps} type="warning" />);

			const iconContainer = screen.getByTestId(
				"alert-triangle-icon"
			).parentElement;
			expect(iconContainer).toHaveClass("text-yellow-500");
		});

		it("renders info type modal with correct icon color", () => {
			render(<ConfirmationModal {...defaultProps} type="info" />);

			const iconContainer = screen.getByTestId(
				"alert-triangle-icon"
			).parentElement;
			expect(iconContainer).toHaveClass("text-blue-500");
		});

		it("uses danger as default type if not specified", () => {
			render(<ConfirmationModal {...defaultProps} />);

			const iconContainer = screen.getByTestId(
				"alert-triangle-icon"
			).parentElement;
			expect(iconContainer).toHaveClass("text-red-500");
		});
	});

	describe("Button Variants", () => {
		it("uses destructive variant for confirm button in danger type", () => {
			render(<ConfirmationModal {...defaultProps} type="danger" />);

			const confirmButton = screen.getByText("Confirm");
			expect(confirmButton).toHaveAttribute("data-variant", "destructive");
		});

		it("uses destructive variant for confirm button in warning type", () => {
			render(<ConfirmationModal {...defaultProps} type="warning" />);

			const confirmButton = screen.getByText("Confirm");
			expect(confirmButton).toHaveAttribute("data-variant", "destructive");
		});

		it("uses default variant for confirm button in info type", () => {
			render(<ConfirmationModal {...defaultProps} type="info" />);

			const confirmButton = screen.getByText("Confirm");
			expect(confirmButton).toHaveAttribute("data-variant", "default");
		});
	});

	describe("Interactions", () => {
		it("calls onClose when clicking the close button", () => {
			render(<ConfirmationModal {...defaultProps} />);

			const closeButton = screen.getByLabelText("Close modal");
			fireEvent.click(closeButton);

			expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		});

		it("calls onClose when clicking the cancel button", () => {
			render(<ConfirmationModal {...defaultProps} />);

			const cancelButton = screen.getByText("Cancel");
			fireEvent.click(cancelButton);

			expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		});

		it("calls both onConfirm and onClose when clicking the confirm button", () => {
			render(<ConfirmationModal {...defaultProps} />);

			const confirmButton = screen.getByText("Confirm");
			fireEvent.click(confirmButton);

			expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
			expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		});

		it("calls onClose when clicking the backdrop", () => {
			render(<ConfirmationModal {...defaultProps} />);

			// Get the backdrop element (the outermost div with the onClick handler)
			const backdrop =
				screen.getByText("Confirm Action").parentElement?.parentElement
					?.parentElement?.parentElement;
			fireEvent.click(backdrop as HTMLElement);

			expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		});

		it("does not call onClose when clicking inside the modal content", () => {
			render(<ConfirmationModal {...defaultProps} />);

			// Click on the modal content
			const modalContent = screen.getByText(
				"Are you sure you want to perform this action?"
			);
			fireEvent.click(modalContent);

			expect(defaultProps.onClose).not.toHaveBeenCalled();
		});
	});

	describe("Keyboard Interactions", () => {
		it("calls onClose when pressing Escape key", () => {
			render(<ConfirmationModal {...defaultProps} />);

			// Simulate pressing the Escape key
			fireEvent.keyDown(document, { key: "Escape" });

			expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		});

		it("does not call onClose when pressing other keys", () => {
			render(<ConfirmationModal {...defaultProps} />);

			// Simulate pressing the Enter key
			fireEvent.keyDown(document, { key: "Enter" });

			expect(defaultProps.onClose).not.toHaveBeenCalled();
		});
	});

	describe("Document Body Modifications", () => {
		it("sets body overflow to hidden when modal is open", () => {
			render(<ConfirmationModal {...defaultProps} />);

			expect(document.body.style.overflow).toBe("hidden");
		});

		it("resets body overflow when modal is closed", () => {
			const { unmount } = render(<ConfirmationModal {...defaultProps} />);

			unmount();

			expect(document.body.style.overflow).toBe("unset");
		});

		it("resets body overflow when isOpen changes to false", () => {
			const { rerender } = render(<ConfirmationModal {...defaultProps} />);

			rerender(<ConfirmationModal {...defaultProps} isOpen={false} />);

			expect(document.body.style.overflow).toBe("unset");
		});
	});

	describe("Accessibility", () => {
		it("provides accessible labels for buttons", () => {
			render(<ConfirmationModal {...defaultProps} />);

			expect(screen.getByLabelText("Cancel")).toBeInTheDocument();
			expect(screen.getByLabelText("Confirm")).toBeInTheDocument();
		});

		it("provides custom accessible labels for buttons when specified", () => {
			render(
				<ConfirmationModal
					{...defaultProps}
					cancelText="Go Back"
					confirmText="Delete"
				/>
			);

			expect(screen.getByLabelText("Go Back")).toBeInTheDocument();
			expect(screen.getByLabelText("Delete")).toBeInTheDocument();
		});

		it("has accessible close button", () => {
			render(<ConfirmationModal {...defaultProps} />);

			expect(screen.getByLabelText("Close modal")).toBeInTheDocument();
		});
	});

	describe("Animation Classes", () => {
		it("has animation classes on backdrop", () => {
			render(<ConfirmationModal {...defaultProps} />);

			const backdrop =
				screen.getByText("Confirm Action").parentElement?.parentElement
					?.parentElement?.previousElementSibling;
			expect(backdrop).toHaveClass("animate-in", "fade-in", "duration-300");
		});

		it("has animation classes on modal", () => {
			render(<ConfirmationModal {...defaultProps} />);

			const modal =
				screen.getByText("Confirm Action").parentElement?.parentElement
					?.parentElement;
			expect(modal).toHaveClass(
				"animate-in",
				"fade-in",
				"zoom-in-95",
				"duration-300"
			);
		});
	});

	describe("Edge Cases", () => {
		it("handles empty title and message", () => {
			render(<ConfirmationModal {...defaultProps} title="" message="" />);

			// Should still render the modal structure
			expect(screen.getByText("Confirm")).toBeInTheDocument();
			expect(screen.getByText("Cancel")).toBeInTheDocument();
		});

		it("handles very long content", () => {
			const longMessage = "A".repeat(500);
			render(<ConfirmationModal {...defaultProps} message={longMessage} />);

			// Should render the long message
			expect(screen.getByText(longMessage)).toBeInTheDocument();
		});
	});
});
