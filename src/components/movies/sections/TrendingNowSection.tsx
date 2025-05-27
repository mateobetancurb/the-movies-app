import { getMoviesByCategory } from "@/src/data/movies";
import MovieSection from "./MovieSection";

const TrendingNowSection = () => {
	const trendingMovies = getMoviesByCategory(1);

	return <MovieSection title="Trending Now" movies={trendingMovies} />;
};

export default TrendingNowSection;
