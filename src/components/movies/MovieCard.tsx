"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Movie } from "@/src/interfaces";
import { motion } from "framer-motion";
import ImageWithFallback from "../core/ImageWithFallback";

interface MovieCardProps {
	movie: Movie;
	index: number;
	"data-testid"?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
	movie,
	index,
	"data-testid": dataTestId,
}) => {
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const genres = movie.genres || [];

	return (
		<Link href={`/movies/${movie.id}`}>
			<motion.div
				ref={ref}
				initial={{ opacity: 0, y: 20 }}
				animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
				transition={{ duration: 0.3, delay: index * 0.1 }}
				className="movie-card card relative group cursor-pointer"
				data-testid={dataTestId}
			>
				{/* movie poster */}
				<div className="relative aspect-[2/3] overflow-hidden w-full rounded-md">
					<ImageWithFallback
						src={movie?.poster_path || ""}
						alt={`${movie?.title} poster`}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						className="object-cover transform group-hover:scale-105 transition-transform duration-300"
						fallback={
							<div className="w-full h-full bg-gray-800 flex items-center justify-center">
								<div className="text-center text-gray-400">
									<div className="text-4xl mb-2">🎬</div>
									<div className="text-sm px-4">No Image Available</div>
								</div>
							</div>
						}
					/>

					{/* rating */}
					<div className="absolute top-2 left-2 flex items-center bg-black/60 rounded-full px-2 py-1 text-sm">
						<Star
							className="w-3.5 h-3.5 text-yellow-400 mr-1"
							fill="currentColor"
						/>
						<span>
							{movie?.vote_average ? movie?.vote_average.toFixed(1) : "N/A"}
						</span>
					</div>
				</div>

				{/* movie info */}
				<div className="p-4">
					<h3 className="font-bold text-lg line-clamp-1 group-hover:text-accent-400 transition-colors">
						{movie?.title}
					</h3>
					<p className="text-sm text-gray-400 mt-1">
						{movie?.release_date ? movie?.release_date.split("-")[0] : "N/A"}
						{movie?.runtime && ` • ${movie?.runtime} min`}
					</p>

					{/* genres */}
					<div className="mt-2 flex flex-wrap gap-1">
						{genres.slice(0, 2).map((genre) => (
							<span
								key={genre?.id}
								className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300"
							>
								{genre?.name}
							</span>
						))}
					</div>
				</div>
			</motion.div>
		</Link>
	);
};

export default MovieCard;
