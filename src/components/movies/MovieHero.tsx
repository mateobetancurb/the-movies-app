import { Play, Star, Clock } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Movie } from "@/src/interfaces";
import AddToFavoritesBtn from "../core/AddToFavoritesBtn";

interface MovieHeroProps {
	movie: Movie;
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
	return (
		<div className="relative">
			<div className="absolute inset-0 h-[70vh]">
				{movie.backdrop_path ? (
					<Image
						src={movie.backdrop_path}
						alt={`${movie.title} backdrop`}
						className="w-full h-full object-cover"
						width={1000}
						height={1000}
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
						<div className="text-center text-gray-400">
							<h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
							<p className="text-sm">No backdrop available</p>
						</div>
					</div>
				)}
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

						{movie.runtime && (
							<div className="flex items-center">
								<Clock className="w-4 h-4 mr-1" />
								<span>{movie.runtime} minutes</span>
							</div>
						)}

						<div>{new Date(movie.release_date).getFullYear()}</div>

						{movie.genres && movie.genres.length > 0 && (
							<div className="flex gap-1 flex-wrap">
								{movie.genres.map((genre, index) => (
									<React.Fragment key={genre.id}>
										<span>{genre.name}</span>
										{index < movie.genres.length - 1 && <span>•</span>}
									</React.Fragment>
								))}
							</div>
						)}
					</div>

					<p className="text-lg text-gray-300 mb-8 max-w-2xl">
						{movie.overview}
					</p>

					<div className="flex flex-wrap gap-4">
						<button className="btn btn-primary flex items-center">
							<Play className="w-5 h-5 mr-2" />
							<span>Watch Trailer</span>
						</button>
						<AddToFavoritesBtn movie={movie} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default MovieHero;
