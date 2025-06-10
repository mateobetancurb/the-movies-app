"use client";

import React from "react";
import MovieCard from "./MovieCard";
import { Movie } from "../../interfaces";
import { motion } from "framer-motion";

interface MovieGridProps {
	movies: Movie[];
	title?: string;
	emptyMessage?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({
	movies,
	title,
	emptyMessage = "No movies found",
}) => {
	return (
		<section className="my-8" data-testid="movie-grid">
			{title && (
				<motion.h2
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-2xl font-bold mb-6"
					data-testid="grid-title"
				>
					{title}
				</motion.h2>
			)}

			<div data-testid="movies-count" className="sr-only">
				{movies.length}
			</div>

			{movies.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-10 md:mb-20">
					{movies.map((movie, index) => (
						<MovieCard
							key={movie.id}
							movie={movie}
							index={index}
							data-testid={`movie-card-${movie.id}`}
						/>
					))}
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="py-12 text-center"
				>
					<p className="text-gray-400" data-testid="empty-message">
						{emptyMessage}
					</p>
				</motion.div>
			)}
		</section>
	);
};

export default MovieGrid;
