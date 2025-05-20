"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import { Movie } from "../../interfaces";
import { useFavorites } from "../../context/FavoritesContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface MovieCardProps {
	movie: Movie;
	index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
	const router = useRouter();
	const { isFavorite, addFavorite, removeFavorite } = useFavorites();
	const favorite = isFavorite(movie.id);
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const handleNavigate = () => {
		router.push(`/movie/${movie.id}`);
	};

	const handleFavoriteToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (favorite) {
			removeFavorite(movie.id);
		} else {
			addFavorite(movie.id);
		}
	};

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			className="movie-card card relative group cursor-pointer"
			onClick={handleNavigate}
		>
			{/* Movie poster */}
			<div className="relative aspect-[2/3] overflow-hidden">
				<img
					src={movie.poster_path || ""}
					alt={`${movie.title} poster`}
					className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

				{/* Rating */}
				<div className="absolute top-2 left-2 flex items-center bg-black/60 rounded-full px-2 py-1 text-sm">
					<Star
						className="w-3.5 h-3.5 text-yellow-400 mr-1"
						fill="currentColor"
					/>
					<span>{movie.vote_average.toFixed(1)}</span>
				</div>

				{/* Favorite button */}
				<button
					className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
						favorite
							? "bg-secondary-600 text-white"
							: "bg-black/60 text-white/70 hover:text-white"
					}`}
					onClick={handleFavoriteToggle}
					aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
				>
					<Heart
						className="w-4 h-4"
						fill={favorite ? "currentColor" : "none"}
					/>
				</button>
			</div>

			{/* Movie info */}
			<div className="p-4">
				<h3 className="font-bold text-lg line-clamp-1 group-hover:text-accent-400 transition-colors">
					{movie.title}
				</h3>
				<p className="text-sm text-gray-400 mt-1">
					{new Date(movie.release_date).getFullYear()}
					{movie.runtime && ` • ${movie.runtime} min`}
				</p>

				{/* Genres */}
				<div className="mt-2 flex flex-wrap gap-1">
					{movie.genres.slice(0, 2).map((genre) => (
						<span
							key={genre.id}
							className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300"
						>
							{genre.name}
						</span>
					))}
				</div>
			</div>
		</motion.div>
	);
};

export default MovieCard;
