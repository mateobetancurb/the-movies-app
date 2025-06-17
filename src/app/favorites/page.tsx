"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFavorites } from "@/src/context/FavoritesContext";
import MovieGrid from "@/src/components/movies/MovieGrid";
import { getMovieDetails } from "@/src/services/movieService";
import { MovieDetails } from "@/src/interfaces";
import LoadingSpinner from "@/src/components/core/LoadingSpinner";

const Favorites: React.FC = () => {
	const { favorites } = useFavorites();
	const [favoriteMovies, setFavoriteMovies] = useState<MovieDetails[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (loading) {
		return (
			<div className="container-page pt-24">
				<div className="flex justify-center items-center py-16">
					<LoadingSpinner />
				</div>
			</div>
		);
	}

	return (
		<div className="container-page pt-24">
			<h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
			<h2 className="bg-yellow-100 w-fit text-black rounded-md p-2">
				⚠️ This section is under development...
			</h2>
			<p className="text-gray-400 mb-8">
				Your personally curated collection of favorite movies.
			</p>

			{error && (
				<div className="bg-red-900/20 border border-red-900/50 text-red-300 p-4 rounded-lg mb-8">
					{error}
				</div>
			)}

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
