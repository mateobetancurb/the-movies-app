"use client";

import React, { useState, useEffect } from "react";
import {
	getMoviesByCategory,
	movies,
	movieCategories,
} from "../src/data/movies";
import MovieHero from "../src/components/movies/MovieHero";
import MovieGrid from "../src/components/movies/MovieGrid";
import SearchBar from "../src/components/ui/SearchBar";

const Home: React.FC = () => {
	const [featuredMovie, setFeaturedMovie] = useState(movies[0]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<typeof movies>([]);

	useEffect(() => {
		const randomIndex = Math.floor(Math.random() * 3);
		setFeaturedMovie(movies[randomIndex]);
	}, []);

	const handleSearch = (query: string) => {
		setSearchQuery(query);

		if (!query) {
			setSearchResults([]);
			return;
		}

		const results = movies.filter(
			(movie) =>
				movie.title.toLowerCase().includes(query.toLowerCase()) ||
				movie.overview.toLowerCase().includes(query.toLowerCase())
		);

		setSearchResults(results);
	};

	return (
		<div className="pt-16">
			<MovieHero movie={featuredMovie} />
			<div className="container-page">
				<div className="my-8">
					<SearchBar onSearch={handleSearch} />
				</div>

				{searchQuery ? (
					<MovieGrid
						movies={searchResults}
						title={`Search Results for "${searchQuery}"`}
						emptyMessage="No movies found matching your search"
					/>
				) : (
					<>
						{movieCategories.slice(0, 3).map((category) => (
							<MovieGrid
								key={category.id}
								movies={getMoviesByCategory(category.id)}
								title={category.name}
							/>
						))}
					</>
				)}
			</div>
		</div>
	);
};

export default Home;
