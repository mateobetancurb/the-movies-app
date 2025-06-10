"use client";

import { useState, useEffect } from "react";
import MovieGrid from "./MovieGrid";
import { Movie } from "@/src/interfaces";

interface SearchResultsProps {
	query: string;
	page: number;
}

interface SearchResult {
	total_results: number;
	results: Movie[];
	total_pages: number;
}

export default function SearchResults({ query, page }: SearchResultsProps) {
	const [results, setResults] = useState<SearchResult | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;

		async function fetchMovies() {
			if (!query?.trim()) {
				if (mounted) {
					setResults(null);
					setLoading(false);
				}
				return;
			}

			console.log("SearchResults: Starting search for:", query, "page:", page);
			setLoading(true);
			setError(null);

			try {
				const apiUrl = `/api/search?q=${encodeURIComponent(
					query
				)}&page=${page}`;
				console.log("SearchResults: Fetching from:", apiUrl);

				const response = await fetch(apiUrl);
				console.log("SearchResults: Response status:", response.status);

				if (!response.ok) {
					throw new Error(
						`Search failed: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.json();
				console.log("SearchResults: Received data:", {
					total_results: data.total_results,
					results_count: data.results?.length || 0,
					first_movie: data.results?.[0]?.title,
				});

				if (mounted) {
					setResults(data);
					setLoading(false);
				}
			} catch (err) {
				console.error("SearchResults: Error fetching movies:", err);
				if (mounted) {
					setError(
						err instanceof Error ? err.message : "Failed to search movies"
					);
					setLoading(false);
				}
			}
		}

		fetchMovies();

		return () => {
			mounted = false;
		};
	}, [query, page]);

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500 mb-4"></div>
				<p className="text-gray-400">Searching for "{query}"...</p>
				<p className="text-xs text-gray-500 mt-2">Debug: Loading state</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<div className="text-red-400 mb-4">
					<svg
						className="w-12 h-12 mx-auto mb-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<h3 className="text-xl font-semibold mb-2 text-red-400">
					Search Error
				</h3>
				<p className="text-gray-400 text-center max-w-md">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
				>
					Try Again
				</button>
			</div>
		);
	}

	if (!results || results.results.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<div className="text-gray-400 mb-4">
					<svg
						className="w-12 h-12 mx-auto mb-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				<h3 className="text-xl font-semibold mb-2">No movies found</h3>
				<p className="text-gray-400">No results for "{query}"</p>
				<p className="text-xs text-gray-500 mt-2">
					Try a different search term or check your spelling
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold mb-2">
						Search Results for "{query}"
					</h2>
					<p className="text-gray-400">Found {results.total_results} movies</p>
				</div>
			</div>

			<MovieGrid movies={results.results} />

			{/* pagination info */}
			{results.total_pages > 1 && (
				<div className="flex justify-center mt-8">
					<p className="text-gray-400 text-sm">
						Page {page} of {results.total_pages}
					</p>
				</div>
			)}
		</div>
	);
}
