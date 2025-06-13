import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("q");
	const page = searchParams.get("page") || "1";

	if (!query) {
		return NextResponse.json(
			{ error: "Missing query parameter" },
			{ status: 400 }
		);
	}

	const apiKey = process.env.TMDB_API_KEY;
	const baseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

	if (!apiKey) {
		return NextResponse.json(
			{ error: "API configuration error" },
			{ status: 500 }
		);
	}

	try {
		const apiUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
			query
		)}&page=${page}`;

		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(
				`HTTP error! status: ${response.status} - ${response.statusText}`
			);
		}

		const data = await response.json();

		const imageBaseUrl =
			process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

		const processedMovies = data.results.map((movie: any) => ({
			id: movie.id,
			title: movie.title,
			overview: movie.overview,
			poster_path: movie.poster_path
				? `${imageBaseUrl}/w500${movie.poster_path}`
				: null,
			backdrop_path: movie.backdrop_path
				? `${imageBaseUrl}/w1280${movie.backdrop_path}`
				: null,
			release_date: movie.release_date,
			vote_average: movie.vote_average,
			vote_count: movie.vote_count,
			genre_ids: movie.genre_ids || [],
			genres: [],
			cast: [],
			adult: movie.adult || false,
			original_language: movie.original_language,
			original_title: movie.original_title,
			popularity: movie.popularity,
			video: movie.video || false,
		}));

		const searchResult = {
			total_results: data.total_results || 0,
			results: processedMovies,
		};

		return NextResponse.json(searchResult);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to search movies";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
