import MovieSection from "./MovieSection";
import { getTopRatedMovies } from "@/src/services/movieService";

const TopRatedSection = async () => {
	const topRatedMovies = await getTopRatedMovies();

	return <MovieSection title="Top Rated" movies={topRatedMovies.results} />;
};

export default TopRatedSection;
