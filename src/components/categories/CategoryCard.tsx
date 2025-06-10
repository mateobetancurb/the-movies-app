"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import React from "react";
import { MovieCategory } from "@/src/interfaces/index";

interface CategoryCardProps {
	category: MovieCategory;
	index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	return (
		<Link href={`/categories/${category.id}`}>
			<motion.div
				ref={ref}
				initial={{ opacity: 0, y: 20 }}
				animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
				transition={{ duration: 0.5, delay: index * 0.1 }}
				className="card cursor-pointer group hover:bg-gray-700 transition-colors duration-300"
			>
				<div className="p-6">
					<h3 className="text-xl font-bold mb-2 group-hover:text-accent-400 transition-colors">
						{category.name}
					</h3>
					<div className="flex items-center text-accent-400 text-sm font-medium">
						<span>Browse movies</span>
						<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
					</div>
				</div>
			</motion.div>
		</Link>
	);
};

export default CategoryCard;
