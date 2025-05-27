import { getMoviesByCategory } from "@/src/data/movies";
import MovieSection from "./MovieSection";

const NewReleasesSection = () => {
	const newReleasesMovies = getMoviesByCategory(3);

	return <MovieSection title="New Releases" movies={newReleasesMovies} />;
};

export default NewReleasesSection;
