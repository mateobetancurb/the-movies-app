"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
	genres,
	movieCategories,
	getMoviesByCategory,
	getMoviesByGenre,
} from "../../src/data/movies";
import MovieGrid from "../../src/components/movies/MovieGrid";
import CategoryCard from "../../src/components/categories/CategoryCard";
import GenresList from "../../src/components/categories/GenresList";
import SearchBar from "../../src/components/ui/SearchBar";
import { motion } from "framer-motion";

function CategoryContent() {
	const searchParams = useSearchParams();
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null
	);
	const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const categoryId = searchParams.get("id");
		const genreId = searchParams.get("genre");

		if (categoryId) {
			setSelectedCategoryId(parseInt(categoryId));
			setSelectedGenreId(null);
		} else if (genreId) {
			setSelectedGenreId(parseInt(genreId));
			setSelectedCategoryId(null);
		} else {
			setSelectedCategoryId(null);
			setSelectedGenreId(null);
		}
	}, [searchParams]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		if (query) {
			setSelectedCategoryId(null);
			setSelectedGenreId(null);
		}
	};

	const selectedCategory = selectedCategoryId
		? movieCategories.find((cat) => cat.id === selectedCategoryId)
		: null;

	const selectedGenre = selectedGenreId
		? genres.find((genre) => genre.id === selectedGenreId)
		: null;

	const getDisplayMovies = () => {
		if (selectedCategoryId) {
			return getMoviesByCategory(selectedCategoryId);
		}

		if (selectedGenreId) {
			return getMoviesByGenre(selectedGenreId);
		}

		if (searchQuery) {
			return genres
				.filter((genre) =>
					genre.name.toLowerCase().includes(searchQuery.toLowerCase())
				)
				.flatMap((genre) => getMoviesByGenre(genre.id));
		}

		return [];
	};

	const displayMovies = getDisplayMovies();

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

			{!selectedCategoryId && !selectedGenreId && !searchQuery && (
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
							{movieCategories.map((category, index) => (
								<CategoryCard
									key={category.id}
									category={category}
									index={index}
								/>
							))}
						</div>
					</section>

					<GenresList genres={genres} title="Browse by Genre" />
				</>
			)}

			{(selectedCategoryId || selectedGenreId || searchQuery) && (
				<MovieGrid
					movies={displayMovies}
					title={
						selectedCategory?.name ||
						selectedGenre?.name ||
						`Search results for "${searchQuery}"`
					}
					emptyMessage="No movies found in this category"
				/>
			)}
		</motion.div>
	);
}

const Categories: React.FC = () => {
	return (
		<Suspense
			fallback={
				<div className="container-page pt-24">Loading categories...</div>
			}
		>
			<CategoryContent />
		</Suspense>
	);
};

export default Categories;
