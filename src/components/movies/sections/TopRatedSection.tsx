import { getMoviesByCategory } from "@/src/data/movies";
import MovieSection from "./MovieSection";

const TopRatedSection = () => {
	const topRatedMovies = getMoviesByCategory(2);

	return <MovieSection title="Top Rated" movies={topRatedMovies} />;
};

export default TopRatedSection;
