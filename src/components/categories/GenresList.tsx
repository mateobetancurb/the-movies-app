"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Genre } from "../../types";
import { useNavigate } from "react-router-dom";

interface GenresListProps {
	genres: Genre[];
	title?: string;
}

const GenresList: React.FC<GenresListProps> = ({ genres, title }) => {
	const navigate = useNavigate();

	const handleGenreClick = (genreId: number) => {
		navigate(`/categories?genre=${genreId}`);
	};

	return (
		<section className="my-8">
			{title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
				{genres.map((genre) => (
					<button
						key={genre.id}
						className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors group"
						onClick={() => handleGenreClick(genre.id)}
					>
						<span className="font-medium">{genre.name}</span>
						<ArrowRight className="w-4 h-4 text-accent-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
					</button>
				))}
			</div>
		</section>
	);
};

export default GenresList;
