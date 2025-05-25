"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/src/context/FavoritesContext";
import { Movie } from "@/src/interfaces";

interface MovieHeroProps {
	movie: Movie;
}

const AddToFavoritesBtn: React.FC<MovieHeroProps> = ({ movie }) => {
	const { isFavorite, addFavorite, removeFavorite } = useFavorites();
	const favorite = isFavorite(movie.id);

	const handleFavoriteToggle = () => {
		if (favorite) {
			removeFavorite(movie.id);
		} else {
			addFavorite(movie.id);
		}
	};
	return (
		<button
			className={`btn flex items-center ${
				favorite ? "btn-secondary" : "bg-gray-800 hover:bg-gray-700 text-white"
			}`}
			onClick={handleFavoriteToggle}
		>
			<Heart
				className="w-5 h-5 mr-2"
				fill={favorite ? "currentColor" : "none"}
			/>
			<span>{favorite ? "Remove from Favorites" : "Add to Favorites"}</span>
		</button>
	);
};

export default AddToFavoritesBtn;
