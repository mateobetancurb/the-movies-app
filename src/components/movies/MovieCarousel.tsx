"use client";

import React from "react";
import { Movie } from "../../interfaces";
import { motion } from "framer-motion";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import MovieCard from "./MovieCard";

interface MovieCarouselProps {
	movies: Movie[];
	title?: string;
	emptyMessage?: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
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
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="relative"
				>
					<Carousel
						opts={{
							align: "start",
							loop: false,
						}}
						className="w-full"
					>
						<CarouselContent className="-ml-2 md:-ml-4">
							{movies.map((movie, index) => (
								<CarouselItem
									key={movie.id}
									className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
								>
									<MovieCard movie={movie} index={index} />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
						<CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
					</Carousel>
				</motion.div>
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

export default MovieCarousel;
