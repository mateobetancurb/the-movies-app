import {
	Movie,
	Genre,
	GenresResponse,
	CastMember,
	PaginatedResponse,
	MovieDetails,
	TMDBConfiguration,
} from "../interfaces";
import { convertGenreIdsToGenres } from "../helpers/genreHelpers";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

const constructImageUrl = (
	path: string | null,
	size: string = "w500"
): string | null => {
	return path ? `${IMAGE_BASE_URL}${size}${path}` : null;
};

async function fetchTMDB<T>(
	endpoint: string,
	params: Record<string, string | number | boolean> = {},
	cacheOptions?: RequestInit["next"]
): Promise<T> {
	if (!API_KEY) {
		throw new Error(
			"TMDB API key is missing. Please set TMDB_API_KEY environment variable"
		);
	}
	const urlParams = new URLSearchParams({
		api_key: API_KEY,
		...Object.fromEntries(
			Object.entries(params).map(([key, value]) => [key, String(value)])
		),
	});
	const url = `${BASE_URL}/${endpoint}?${urlParams.toString()}`;

	const response = await fetch(url, { next: cacheOptions });

	if (!response.ok) {
		const errorData = await response.json();
		console.error("TMDB API Error:", errorData);
		throw new Error(
			`Failed to fetch data from TMDB: ${response.statusText} - ${
				errorData.status_message || "Unknown error"
			}`
		);
	}
	return response.json() as Promise<T>;
}

export const getGenres = async (): Promise<Genre[]> => {
	const data = await fetchTMDB<GenresResponse>(
		"genre/movie/list",
		{},
		{ revalidate: 3600 * 24 }
	);
	return data.genres;
};

const processMovieListItem = (movie: any): Movie => ({
	...movie,
	poster_path: constructImageUrl(movie.poster_path),
	backdrop_path: constructImageUrl(movie.backdrop_path, "w1280"),
	genres: movie.genres || convertGenreIdsToGenres(movie.genre_ids) || [],
	cast: movie.cast || [],
});

const processPaginatedMovies = (
	response: PaginatedResponse<any>
): PaginatedResponse<Movie> => ({
	...response,
	results: response.results.map(processMovieListItem),
});

export const getTrendingMovies = async (
	page: number = 1
): Promise<PaginatedResponse<Movie>> => {
	const data = await fetchTMDB<PaginatedResponse<any>>(
		"trending/movie/week",
		{ page },
		{ revalidate: 3600 * 24 }
	);
	return processPaginatedMovies(data);
};

export const getTopRatedMovies = async (
	page: number = 1
): Promise<PaginatedResponse<Movie>> => {
	const data = await fetchTMDB<PaginatedResponse<any>>(
		"movie/top_rated",
		{ page },
		{ revalidate: 3600 * 24 }
	);
	return processPaginatedMovies(data);
};

export const getUpcomingMovies = async (
	page: number = 1
): Promise<PaginatedResponse<Movie>> => {
	const data = await fetchTMDB<PaginatedResponse<any>>(
		"movie/upcoming",
		{ page },
		{ revalidate: 3600 * 24 }
	);
	return processPaginatedMovies(data);
};

export const getNowPlayingMovies = async (
	page: number = 1
): Promise<PaginatedResponse<Movie>> => {
	const data = await fetchTMDB<PaginatedResponse<any>>(
		"movie/now_playing",
		{ page },
		{ revalidate: 3600 * 24 }
	);
	return processPaginatedMovies(data);
};

export const getMoviesByGenre = async (
	genreId: number,
	page: number = 1
): Promise<PaginatedResponse<Movie>> => {
	const data = await fetchTMDB<PaginatedResponse<any>>(
		"discover/movie",
		{ with_genres: genreId, page, sort_by: "popularity.desc" },
		{ revalidate: 3600 * 24 }
	);
	return processPaginatedMovies(data);
};

export const searchMovies = async (
	query: string,
	page: number = 1
): Promise<PaginatedResponse<Movie>> => {
	if (!query.trim()) {
		return { page: 1, results: [], total_pages: 0, total_results: 0 };
	}
	const data = await fetchTMDB<PaginatedResponse<any>>(
		"search/movie",
		{ query, page },
		{ revalidate: 3600 }
	);
	return processPaginatedMovies(data);
};

interface CreditsResponse {
	cast: CastMember[];
	crew: any[];
}

const processMovieDetails = (
	movie: any,
	credits: CreditsResponse
): MovieDetails => ({
	...movie,
	poster_path: constructImageUrl(movie.poster_path),
	backdrop_path: constructImageUrl(movie.backdrop_path, "w1280"),
	genres: movie.genres || [],
	cast: credits.cast
		.map((member) => ({
			...member,
			profile_path: constructImageUrl(member.profile_path, "w185"),
		}))
		.slice(0, 15),
});

export const getMovieDetails = async (
	movieId: number
): Promise<MovieDetails | null> => {
	try {
		const movieDataPromise = fetchTMDB<any>(
			`movie/${movieId}`,
			{},
			{ revalidate: 3600 * 36 }
		);
		const creditsPromise = fetchTMDB<CreditsResponse>(
			`movie/${movieId}/credits`,
			{},
			{ revalidate: 3600 * 36 }
		);

		const [movieData, creditsData] = await Promise.all([
			movieDataPromise,
			creditsPromise,
		]);

		if (!movieData) return null;

		return processMovieDetails(movieData, creditsData);
	} catch (error) {
		console.error(`Error fetching details for movie ${movieId}:`, error);
		return null;
	}
};

export const getRecommendedMovies = async (
	movieId: number,
	page: number = 1
): Promise<PaginatedResponse<Movie>> => {
	const data = await fetchTMDB<PaginatedResponse<any>>(
		`movie/${movieId}/recommendations`,
		{ page },
		{ revalidate: 3600 * 24 }
	);
	return processPaginatedMovies(data);
};

export const getSimilarMovies = async (
	movieId: number,
	page: number = 1
): Promise<PaginatedResponse<Movie>> => {
	const data = await fetchTMDB<PaginatedResponse<any>>(
		`movie/${movieId}/similar`,
		{ page },
		{ revalidate: 3600 * 24 }
	);
	return processPaginatedMovies(data);
};

export const getTMDBConfiguration = async (): Promise<TMDBConfiguration> => {
	const data = await fetchTMDB<TMDBConfiguration>(
		"configuration",
		{},
		{ revalidate: 3600 * 24 * 7 }
	);
	return data;
};

export const getFeaturedMovie = async (): Promise<Movie | null> => {
	try {
		const trendingMovies = await getTrendingMovies(1);

		if (trendingMovies.results.length === 0) {
			return null;
		}

		const randomIndex = Math.floor(
			Math.random() * Math.min(10, trendingMovies.results.length)
		);
		const selectedMovie = trendingMovies.results[randomIndex];
		return await getMovieDetails(selectedMovie.id);
	} catch (error) {
		console.error("Error fetching featured movie:", error);
		return null;
	}
};
