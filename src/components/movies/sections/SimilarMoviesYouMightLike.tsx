import { getSimilarMovies } from "@/src/services/movieService";
import MovieSection from "@/src/components/movies/sections/MovieSection";

const SimilarMoviesYouMightLike = async ({ movieId }: { movieId: number }) => {
	const similarMovies = await getSimilarMovies(movieId);

	return (
		<MovieSection
			movies={similarMovies.results}
			title="Similar Movies You Might Like"
			emptyMessage="No similar movies found"
		/>
	);
};

export default SimilarMoviesYouMightLike;
