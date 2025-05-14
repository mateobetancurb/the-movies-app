import { Movie } from "../interfaces";
import { movies } from "../data/movies";

export const getMoviesByGenre = (genreId: number): Movie[] => {
	return movies.filter((movie) =>
		movie.genres.some((genre) => genre.id === genreId)
	);
};

export const getMovieById = (id: number): Movie | undefined => {
	return movies.find((movie) => movie.id === id);
};
