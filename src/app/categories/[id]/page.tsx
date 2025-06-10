import { getMoviesByGenre } from "@/src/services/movieService";
import MovieGrid from "@/src/components/movies/MovieGrid";

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const movies = await getMoviesByGenre(Number(id));

	return (
		<div className="container-page">
			<h1 className="mt-20">Category: {id}</h1>
			<MovieGrid movies={movies.results} />
		</div>
	);
}
