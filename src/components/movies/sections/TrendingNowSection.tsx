import MovieSection from "./MovieSection";
import { getTrendingMovies } from "@/src/services/movieService";

const TrendingNowSection = async () => {
	const trendingMoviesResponse = await getTrendingMovies();

	return (
		<MovieSection
			title="Trending Now"
			movies={trendingMoviesResponse.results}
		/>
	);
};

export default TrendingNowSection;
