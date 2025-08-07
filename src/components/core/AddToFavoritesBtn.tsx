"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/src/context/FavoritesContext";
import { Movie } from "@/src/interfaces";

interface AddToFavoritesBtnProps {
	movie: Movie;
}

const AddToFavoritesBtn: React.FC<AddToFavoritesBtnProps> = ({ movie }) => {
	const { isFavorite, toggleFavorite } = useFavorites();
	const isMovieFavorited = isFavorite(movie.id);

	return (
		<button
			className={`btn flex items-center ${isMovieFavorited ? "btn-favorited text-red-600" : "btn-not-favorited"}`}
			onClick={() => toggleFavorite(movie)}
			aria-label={
				isMovieFavorited ? "Remove from favorites" : "Add to favorites"
			}
		>
			<Heart
				className="w-5 h-5 mr-2"
				fill={isMovieFavorited ? "currentColor" : "none"}
			/>
			<span>
				{isMovieFavorited ? "Remove from Favorites" : "Add to Favorites"}
			</span>
		</button>
	);
};

export default AddToFavoritesBtn;
