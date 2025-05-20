"use client";

import { Play, Star, Clock, Heart } from "lucide-react";
import React from "react";
import { Movie } from "../../interfaces";
import { useFavorites } from "../../context/FavoritesContext";

interface MovieHeroProps {
	movie: Movie;
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
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
		<div className="relative">
			<div className="absolute inset-0 h-[70vh]">
				<img
					src={movie.backdrop_path || ""}
					alt={`${movie.title} backdrop`}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-gray-950/40"></div>
			</div>

			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-8 md:pb-16 min-h-[70vh] flex items-end">
				<div className="max-w-3xl animate-slide-up">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

					<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300 mb-6">
						<div className="flex items-center">
							<Star
								className="w-4 h-4 text-yellow-400 mr-1"
								fill="currentColor"
							/>
							<span>
								{movie.vote_average.toFixed(1)} ({movie.vote_count} reviews)
							</span>
						</div>

						<div className="flex items-center">
							<Clock className="w-4 h-4 mr-1" />
							<span>{movie.runtime} minutes</span>
						</div>

						<div>{new Date(movie.release_date).getFullYear()}</div>

						<div className="flex gap-1 flex-wrap">
							{movie.genres.map((genre, index) => (
								<React.Fragment key={genre.id}>
									<span>{genre.name}</span>
									{index < movie.genres.length - 1 && <span>•</span>}
								</React.Fragment>
							))}
						</div>
					</div>

					<p className="text-lg text-gray-300 mb-8 max-w-2xl">
						{movie.overview}
					</p>

					<div className="flex flex-wrap gap-4">
						<button className="btn btn-primary flex items-center">
							<Play className="w-5 h-5 mr-2" />
							<span>Watch Trailer</span>
						</button>

						<button
							className={`btn flex items-center ${
								favorite
									? "btn-secondary"
									: "bg-gray-800 hover:bg-gray-700 text-white"
							}`}
							onClick={handleFavoriteToggle}
						>
							<Heart
								className="w-5 h-5 mr-2"
								fill={favorite ? "currentColor" : "none"}
							/>
							<span>
								{favorite ? "Remove from Favorites" : "Add to Favorites"}
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MovieHero;
