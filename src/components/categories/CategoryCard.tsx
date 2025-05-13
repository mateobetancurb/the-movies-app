"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MovieCategory } from "../../types";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface CategoryCardProps {
	category: MovieCategory;
	index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
	const navigate = useNavigate();
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const handleClick = () => {
		navigate(`/categories?id=${category.id}`);
	};

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			className="card cursor-pointer group hover:bg-gray-700 transition-colors duration-300"
			onClick={handleClick}
		>
			<div className="p-6">
				<h3 className="text-xl font-bold mb-2 group-hover:text-accent-400 transition-colors">
					{category.name}
				</h3>
				<p className="text-gray-400 text-sm mb-4">{category.description}</p>
				<div className="flex items-center text-accent-400 text-sm font-medium">
					<span>Browse movies</span>
					<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
				</div>
			</div>
		</motion.div>
	);
};

export default CategoryCard;
