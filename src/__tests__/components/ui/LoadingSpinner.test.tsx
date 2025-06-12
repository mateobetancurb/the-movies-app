import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../../../components/core/LoadingSpinner";

describe("LoadingSpinner", () => {
	it("renders with medium size by default", () => {
		render(<LoadingSpinner />);
		const spinner = screen.getByRole("status");
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass("w-8 h-8 border-3");
	});

	it("renders with small size when specified", () => {
		render(<LoadingSpinner size="small" />);
		const spinner = screen.getByRole("status");
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass("w-5 h-5 border-2");
	});

	it("renders with large size when specified", () => {
		render(<LoadingSpinner size="large" />);
		const spinner = screen.getByRole("status");
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass("w-12 h-12 border-4");
	});
});
