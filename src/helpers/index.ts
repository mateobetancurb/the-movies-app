import { Genre } from "@/src/interfaces";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const GENRE_MAP: Record<number, string> = {
	28: "Action",
	12: "Adventure",
	16: "Animation",
	35: "Comedy",
	80: "Crime",
	99: "Documentary",
	18: "Drama",
	10751: "Family",
	14: "Fantasy",
	36: "History",
	27: "Horror",
	10402: "Music",
	9648: "Mystery",
	10749: "Romance",
	878: "Science Fiction",
	10770: "TV Movie",
	53: "Thriller",
	10752: "War",
	37: "Western",
};

/**
 * Converts genre IDs to genre objects
 * @param genreIds Array of genre IDs
 * @returns Array of Genre objects
 */
export const convertGenreIdsToGenres = (genreIds?: number[]): Genre[] => {
	if (!genreIds || !Array.isArray(genreIds) || genreIds.length === 0) {
		return [];
	}

	return genreIds.map((id) => ({
		id,
		name: GENRE_MAP[id] || `Genre ${id}`,
	}));
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
