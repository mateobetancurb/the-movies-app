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

	try {
		console.log("API Route: Searching for:", query, "page:", page);

		const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=c46a7f2972d1a6298bffdc251988a18a&query=${encodeURIComponent(
			query
		)}&page=${page}`;
		console.log("API Route: Fetching URL:", apiUrl);

		const response = await fetch(apiUrl);
		console.log(
			"API Route: Response status:",
			response.status,
			response.statusText
		);

		if (!response.ok) {
			throw new Error(
				`HTTP error! status: ${response.status} - ${response.statusText}`
			);
		}

		const data = await response.json();
		console.log("API Route: Raw API response:", data);

		const processedMovies = data.results.map((movie: any) => ({
			id: movie.id,
			title: movie.title,
			overview: movie.overview,
			poster_path: movie.poster_path
				? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
				: null,
			backdrop_path: movie.backdrop_path
				? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
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

		console.log(
			"API Route: Successfully processed",
			processedMovies.length,
			"movies"
		);
		return NextResponse.json(searchResult);
	} catch (error) {
		console.error("API Route: Error during fetch:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Failed to search movies";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
