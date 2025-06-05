import MovieSection from "./MovieSection";
import { getUpcomingMovies } from "@/src/services/movieService";

const NewReleasesSection = async () => {
	const newReleasesMovies = await getUpcomingMovies();

	return (
		<MovieSection
			title="New Releases"
			movies={newReleasesMovies.results}
			emptyMessage="No new releases found"
		/>
	);
};

export default NewReleasesSection;
