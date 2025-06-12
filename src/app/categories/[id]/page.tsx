import { getMoviesByGenre } from "@/src/services/movieService";
import MovieGrid from "@/src/components/movies/MovieGrid";
import { GENRE_MAP } from "@/src/helpers";
import GoBackButton from "@/src/components/core/GoBackButton";

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const genreId = Number(id);

	const movies = await getMoviesByGenre(genreId);
	const categoryName = GENRE_MAP[genreId] || `Category ${id}`;

	return (
		<div className="container-page">
			<GoBackButton href="/categories" />
			<h1 className="text-3xl font-bold mb-6">Category: {categoryName}</h1>
			<MovieGrid movies={movies.results} />
		</div>
	);
}
