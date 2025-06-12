"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import MovieGrid from "@/src/components/movies/MovieGrid";
import CategoryCard from "@/src/components/categories/CategoryCard";
import SearchBar from "@/src/components/core/SearchBar";
import { Genre } from "@/src/interfaces";

interface MainContentProps {
	genres: Genre[];
}

export default function MainContent({ genres }: MainContentProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="container-page pt-24"
		>
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="text-3xl font-bold mb-6"
			>
				Movie Categories
			</motion.h1>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="mb-8"
			>
				<SearchBar
					onSearch={handleSearch}
					placeholder="Search genres or categories..."
				/>
			</motion.div>

			{!searchQuery && (
				<>
					<section className="my-8">
						<motion.h2
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="text-2xl font-bold mb-6"
						>
							Featured Collections
						</motion.h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
							{genres.map((category, index) => (
								<CategoryCard
									key={category.id}
									category={{
										...category,
										description: category.name,
									}}
									index={index}
								/>
							))}
						</div>
					</section>
				</>
			)}

			{searchQuery && (
				<MovieGrid
					movies={[]}
					title={`Search results for "${searchQuery}"`}
					emptyMessage="No movies found in this category"
				/>
			)}
		</motion.div>
	);
}
