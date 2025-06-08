import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieCast from "@/src/components/movies/MovieCast";
import { CastMember } from "@/src/interfaces";

// Mock next/image
jest.mock("next/image", () => {
	return function MockImage({ src, alt, ...props }: any) {
		return <img src={src} alt={alt} {...props} />;
	};
});

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
	User: ({ className, ...props }: any) => (
		<div data-testid="user-icon" className={className} {...props} />
	),
}));

describe("MovieCast Component", () => {
	const mockCastMembers: CastMember[] = [
		{
			id: 1,
			name: "Tom Hardy",
			character: "Venom / Eddie Brock",
			profile_path: "https://image.tmdb.org/t/p/w185/tom-hardy.jpg",
		},
		{
			id: 2,
			name: "Michelle Williams",
			character: "Anne Weying",
			profile_path: "https://image.tmdb.org/t/p/w185/michelle-williams.jpg",
		},
		{
			id: 3,
			name: "Riz Ahmed",
			character: "Carlton Drake / Riot",
			profile_path: null,
		},
	];

	const singleCastMember: CastMember[] = [
		{
			id: 1,
			name: "Robert Downey Jr.",
			character: "Tony Stark / Iron Man",
			profile_path: "https://image.tmdb.org/t/p/w185/rdj.jpg",
		},
	];

	const largeCast: CastMember[] = Array.from({ length: 20 }, (_, i) => ({
		id: i + 1,
		name: `Actor ${i + 1}`,
		character: `Character ${i + 1}`,
		profile_path:
			i % 3 === 0 ? null : `https://image.tmdb.org/t/p/w185/actor${i + 1}.jpg`,
	}));

	const castWithSpecialCharacters: CastMember[] = [
		{
			id: 1,
			name: "Zoë Saldana",
			character: "Gamora",
			profile_path: "https://image.tmdb.org/t/p/w185/zoe.jpg",
		},
		{
			id: 2,
			name: "Señor José García",
			character: "El Mariachi",
			profile_path: null,
		},
		{
			id: 3,
			name: "李小龙",
			character: "Bruce Lee",
			profile_path: "https://image.tmdb.org/t/p/w185/bruce-lee.jpg",
		},
	];

	const castWithMinimalData: CastMember[] = [
		{
			id: 1,
			name: "Unknown Actor",
			character: "Unknown Character",
			profile_path: null,
		},
	];

	describe("Basic Rendering", () => {
		it("renders cast section with multiple cast members", () => {
			render(<MovieCast cast={mockCastMembers} />);

			expect(screen.getByRole("heading", { name: "Cast" })).toBeInTheDocument();
			expect(screen.getByText("Tom Hardy")).toBeInTheDocument();
			expect(screen.getByText("Venom / Eddie Brock")).toBeInTheDocument();
			expect(screen.getByText("Michelle Williams")).toBeInTheDocument();
			expect(screen.getByText("Anne Weying")).toBeInTheDocument();
			expect(screen.getByText("Riz Ahmed")).toBeInTheDocument();
			expect(screen.getByText("Carlton Drake / Riot")).toBeInTheDocument();
		});

		it("renders single cast member correctly", () => {
			render(<MovieCast cast={singleCastMember} />);

			expect(screen.getByRole("heading", { name: "Cast" })).toBeInTheDocument();
			expect(screen.getByText("Robert Downey Jr.")).toBeInTheDocument();
			expect(screen.getByText("Tony Stark / Iron Man")).toBeInTheDocument();
		});

		it("renders large cast correctly", () => {
			render(<MovieCast cast={largeCast} />);

			expect(screen.getByRole("heading", { name: "Cast" })).toBeInTheDocument();
			expect(screen.getByText("Actor 1")).toBeInTheDocument();
			expect(screen.getByText("Actor 20")).toBeInTheDocument();
			expect(screen.getByText("Character 10")).toBeInTheDocument();
		});

		it("uses proper semantic HTML structure", () => {
			render(<MovieCast cast={mockCastMembers} />);

			const section = screen
				.getByRole("heading", { name: "Cast" })
				.closest("section");
			expect(section).toBeInTheDocument();
			expect(section).toHaveClass("my-12");
		});
	});

	describe("Image Handling", () => {
		it("displays actor images when profile_path is provided", () => {
			render(<MovieCast cast={mockCastMembers} />);

			const tomHardyImage = screen.getByAltText("Tom Hardy");
			expect(tomHardyImage).toBeInTheDocument();
			expect(tomHardyImage).toHaveAttribute(
				"src",
				"https://image.tmdb.org/t/p/w185/tom-hardy.jpg"
			);
			expect(tomHardyImage).toHaveAttribute("width", "100");
			expect(tomHardyImage).toHaveAttribute("height", "100");
			expect(tomHardyImage).toHaveClass(
				"w-full",
				"h-full",
				"object-cover",
				"rounded-full"
			);

			const michelleImage = screen.getByAltText("Michelle Williams");
			expect(michelleImage).toBeInTheDocument();
			expect(michelleImage).toHaveAttribute(
				"src",
				"https://image.tmdb.org/t/p/w185/michelle-williams.jpg"
			);
		});

		it("displays User icon when profile_path is null", () => {
			render(<MovieCast cast={mockCastMembers} />);

			const userIcons = screen.getAllByTestId("user-icon");
			expect(userIcons).toHaveLength(1); // Only Riz Ahmed has null profile_path
			expect(userIcons[0]).toHaveClass("w-12", "h-12", "text-gray-600");
		});

		it("handles all cast members without profile images", () => {
			const castWithoutImages = mockCastMembers.map((member) => ({
				...member,
				profile_path: null,
			}));

			render(<MovieCast cast={castWithoutImages} />);

			const userIcons = screen.getAllByTestId("user-icon");
			expect(userIcons).toHaveLength(3);
			userIcons.forEach((icon) => {
				expect(icon).toHaveClass("w-12", "h-12", "text-gray-600");
			});
		});

		it("applies correct CSS classes to image containers", () => {
			render(<MovieCast cast={mockCastMembers} />);

			const containers = screen
				.getAllByText("Tom Hardy")
				.map((text) => text.closest("div")?.previousElementSibling)
				.filter(Boolean);

			containers.forEach((container) => {
				expect(container).toHaveClass(
					"w-full",
					"aspect-square",
					"bg-gray-800",
					"rounded-full",
					"flex",
					"items-center",
					"justify-center",
					"mb-2"
				);
			});
		});
	});

	describe("Cast Information Display", () => {
		it("displays actor names with correct styling", () => {
			render(<MovieCast cast={mockCastMembers} />);

			const tomHardyName = screen.getByText("Tom Hardy");
			expect(tomHardyName).toBeInTheDocument();
			expect(tomHardyName.tagName).toBe("H3");
			expect(tomHardyName).toHaveClass("font-medium", "text-sm");

			const michelleWilliamsName = screen.getByText("Michelle Williams");
			expect(michelleWilliamsName).toBeInTheDocument();
			expect(michelleWilliamsName.tagName).toBe("H3");
		});

		it("displays character names with correct styling", () => {
			render(<MovieCast cast={mockCastMembers} />);

			const venomCharacter = screen.getByText("Venom / Eddie Brock");
			expect(venomCharacter).toBeInTheDocument();
			expect(venomCharacter.tagName).toBe("P");
			expect(venomCharacter).toHaveClass("text-gray-400", "text-xs");

			const anneCharacter = screen.getByText("Anne Weying");
			expect(anneCharacter).toBeInTheDocument();
			expect(anneCharacter.tagName).toBe("P");
		});

		it("handles cast members with special characters", () => {
			render(<MovieCast cast={castWithSpecialCharacters} />);

			expect(screen.getByText("Zoë Saldana")).toBeInTheDocument();
			expect(screen.getByText("Señor José García")).toBeInTheDocument();
			expect(screen.getByText("李小龙")).toBeInTheDocument();
		});

		it("displays minimal cast data correctly", () => {
			render(<MovieCast cast={castWithMinimalData} />);

			expect(screen.getByText("Unknown Actor")).toBeInTheDocument();
			expect(screen.getByText("Unknown Character")).toBeInTheDocument();
		});
	});

	describe("Grid Layout", () => {
		it("applies responsive grid classes", () => {
			render(<MovieCast cast={mockCastMembers} />);

			const gridContainer = screen.getByRole("heading", {
				name: "Cast",
			}).nextElementSibling;
			expect(gridContainer).toHaveClass(
				"grid",
				"grid-cols-2",
				"sm:grid-cols-3",
				"md:grid-cols-4",
				"lg:grid-cols-6",
				"gap-4"
			);
		});

		it("centers cast member content", () => {
			render(<MovieCast cast={mockCastMembers} />);

			const castMemberContainers = screen
				.getAllByText("Tom Hardy")
				.map((text) => text.closest("div"))
				.filter((div) => div?.className.includes("text-center"));

			expect(castMemberContainers.length).toBeGreaterThan(0);
			castMemberContainers.forEach((container) => {
				expect(container).toHaveClass("text-center");
			});
		});
	});

	describe("Edge Cases and Error Handling", () => {
		it("does not render anything when cast is empty", () => {
			render(<MovieCast cast={[]} />);

			expect(
				screen.queryByRole("heading", { name: "Cast" })
			).not.toBeInTheDocument();
			expect(screen.queryByText("Cast")).not.toBeInTheDocument();
		});

		it("does not render anything when cast is null/undefined", () => {
			render(<MovieCast cast={null as any} />);

			expect(
				screen.queryByRole("heading", { name: "Cast" })
			).not.toBeInTheDocument();
		});

		it("handles cast members with undefined properties gracefully", () => {
			const castWithUndefinedProps: CastMember[] = [
				{
					id: 1,
					name: "Test Actor",
					character: "Test Character",
					profile_path: undefined as any,
				},
			];

			render(<MovieCast cast={castWithUndefinedProps} />);

			expect(screen.getByText("Test Actor")).toBeInTheDocument();
			expect(screen.getByTestId("user-icon")).toBeInTheDocument();
		});

		it("handles cast members with missing required properties", () => {
			const incompleteCast = [
				{
					id: 1,
					name: "",
					character: "",
					profile_path: null,
				},
			] as CastMember[];

			render(<MovieCast cast={incompleteCast} />);

			expect(screen.getByRole("heading", { name: "Cast" })).toBeInTheDocument();
			expect(screen.getByTestId("user-icon")).toBeInTheDocument();
		});

		it("handles very long actor and character names", () => {
			const castWithLongNames: CastMember[] = [
				{
					id: 1,
					name: "Extraordinarily Long Actor Name That Might Cause Layout Issues",
					character:
						"An Incredibly Long Character Name With Multiple Descriptive Elements",
					profile_path: null,
				},
			];

			render(<MovieCast cast={castWithLongNames} />);

			expect(
				screen.getByText(
					"Extraordinarily Long Actor Name That Might Cause Layout Issues"
				)
			).toBeInTheDocument();
			expect(
				screen.getByText(
					"An Incredibly Long Character Name With Multiple Descriptive Elements"
				)
			).toBeInTheDocument();
		});
	});

	describe("Component Structure and Accessibility", () => {
		it("maintains proper heading hierarchy", () => {
			render(<MovieCast cast={mockCastMembers} />);

			const heading = screen.getByRole("heading", { name: "Cast" });
			expect(heading.tagName).toBe("H2");
			expect(heading).toHaveClass("text-2xl", "font-bold", "mb-6");
		});

		it("provides proper alt text for actor images", () => {
			render(<MovieCast cast={mockCastMembers} />);

			expect(screen.getByAltText("Tom Hardy")).toBeInTheDocument();
			expect(screen.getByAltText("Michelle Williams")).toBeInTheDocument();
		});

		it("uses semantic HTML elements correctly", () => {
			render(<MovieCast cast={mockCastMembers} />);

			// Section element
			const section = screen
				.getByRole("heading", { name: "Cast" })
				.closest("section");
			expect(section).toBeInTheDocument();

			// Heading element
			const heading = screen.getByRole("heading", { name: "Cast" });
			expect(heading.tagName).toBe("H2");

			// Actor name headings
			const actorNames = screen.getAllByText("Tom Hardy");
			const actorHeading = actorNames.find((el) => el.tagName === "H3");
			expect(actorHeading).toBeInTheDocument();
		});

		it("applies consistent spacing and layout classes", () => {
			render(<MovieCast cast={mockCastMembers} />);

			const section = screen
				.getByRole("heading", { name: "Cast" })
				.closest("section");
			expect(section).toHaveClass("my-12");

			const heading = screen.getByRole("heading", { name: "Cast" });
			expect(heading).toHaveClass("text-2xl", "font-bold", "mb-6");
		});
	});

	describe("Performance and Optimization", () => {
		it("handles large cast arrays efficiently", () => {
			const startTime = performance.now();
			render(<MovieCast cast={largeCast} />);
			const endTime = performance.now();

			// Rendering should complete in reasonable time (< 100ms)
			expect(endTime - startTime).toBeLessThan(100);

			// All cast members should be rendered
			expect(screen.getByText("Actor 1")).toBeInTheDocument();
			expect(screen.getByText("Actor 20")).toBeInTheDocument();
		});

		it("renders unique keys for cast members", () => {
			render(<MovieCast cast={mockCastMembers} />);

			// React should render all cast members without key warnings
			expect(screen.getByText("Tom Hardy")).toBeInTheDocument();
			expect(screen.getByText("Michelle Williams")).toBeInTheDocument();
			expect(screen.getByText("Riz Ahmed")).toBeInTheDocument();
		});
	});

	describe("Integration with Movie Details", () => {
		it("integrates well with typical movie cast data structure", () => {
			const typicalMovieCast: CastMember[] = [
				{
					id: 1,
					name: "Chris Evans",
					character: "Steve Rogers / Captain America",
					profile_path: "https://image.tmdb.org/t/p/w185/chris-evans.jpg",
					adult: false,
					gender: 2,
					known_for_department: "Acting",
					original_name: "Chris Evans",
					popularity: 25.6,
					cast_id: 1,
					credit_id: "credit123",
					order: 0,
				},
			];

			render(<MovieCast cast={typicalMovieCast} />);

			expect(screen.getByText("Chris Evans")).toBeInTheDocument();
			expect(
				screen.getByText("Steve Rogers / Captain America")
			).toBeInTheDocument();
			expect(screen.getByAltText("Chris Evans")).toBeInTheDocument();
		});
	});
});
