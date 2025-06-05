// Set up environment variables for testing
process.env.TMDB_API_KEY = "test-api-key";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: jest.fn(),
		replace: jest.fn(),
		prefetch: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		refresh: jest.fn(),
	}),
	useSearchParams: () => ({
		get: jest.fn(),
	}),
	usePathname: () => "/",
}));

// Mock react-intersection-observer
jest.mock("react-intersection-observer", () => ({
	useInView: () => [jest.fn(), true],
}));

// Optional: configure or set up a testing framework before each test
import "@testing-library/jest-dom";
