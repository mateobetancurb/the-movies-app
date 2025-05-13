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
		<section className="my-8">
			{title && (
				<motion.h2
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-2xl font-bold mb-6"
				>
					{title}
				</motion.h2>
			)}

			{movies.length > 0 ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
					{movies.map((movie, index) => (
						<MovieCard key={movie.id} movie={movie} index={index} />
					))}
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="py-12 text-center"
				>
					<p className="text-gray-400">{emptyMessage}</p>
				</motion.div>
			)}
		</section>
	);
};

export default MovieGrid;
