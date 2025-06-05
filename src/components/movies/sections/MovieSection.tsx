import { Movie } from "@/src/interfaces";
import MovieCarousel from "@/src/components/movies/MovieCarousel";

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
		<MovieCarousel movies={movies} title={title} emptyMessage={emptyMessage} />
	);
};

export default MovieSection;
