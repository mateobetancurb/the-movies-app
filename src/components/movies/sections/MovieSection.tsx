import { Movie } from "@/src/interfaces";
import MovieGrid from "@/src/components/movies/MovieGrid";

interface MovieSectionProps {
	title: string;
	movies: Movie[];
	emptyMessage?: string;
}

const MovieSection: React.FC<MovieSectionProps> = ({
	title,
	movies,
	emptyMessage = "No movies available",
}) => {
	return (
		<MovieGrid movies={movies} title={title} emptyMessage={emptyMessage} />
	);
};

export default MovieSection;
