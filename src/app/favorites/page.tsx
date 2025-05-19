"use client";

import { useFavorites } from "../../context/FavoritesContext";
import { getMovieById } from "../../data/movies";
import MovieGrid from "../../components/movies/MovieGrid";
import { Heart } from "lucide-react";
import Link from "next/link";

const Favorites: React.FC = () => {
	const { favorites } = useFavorites();

	const favoriteMovies = favorites
		.map((id) => getMovieById(id))
		.filter((movie) => movie !== undefined);

	return (
		<div className="container-page pt-24">
			<h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
			<p className="text-gray-400 mb-8">
				Your personally curated collection of favorite movies.
			</p>
			{favoriteMovies.length > 0 ? (
				<MovieGrid
					movies={favoriteMovies}
					emptyMessage="You haven't added any favorites yet"
				/>
			) : (
				<div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-lg">
					<Heart className="w-16 h-16 mx-auto text-gray-700 mb-4" />
					<h2 className="text-2xl font-bold mb-2">No Favorites Yet</h2>
					<p className="text-gray-400 mb-6 max-w-md mx-auto">
						Start exploring movies and add them to your favorites by clicking
						the heart icon.
					</p>
					<Link href="/" className="btn btn-primary inline-block">
						Browse Movies
					</Link>
				</div>
			)}
		</div>
	);
};

export default Favorites;
