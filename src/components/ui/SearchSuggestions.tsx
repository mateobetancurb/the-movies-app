"use client";

import { useState, useEffect } from "react";
import { Search, Clock, TrendingUp } from "lucide-react";

interface SearchSuggestionsProps {
	onSuggestionClick: (suggestion: string) => void;
	isVisible: boolean;
	query: string;
}

const popularSearches = [
	"Batman",
	"Marvel",
	"Star Wars",
	"Horror",
	"Comedy",
	"Action",
	"Drama",
	"Sci-Fi",
	"Adventure",
	"Thriller",
];

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
	onSuggestionClick,
	isVisible,
	query,
}) => {
	const [recentSearches, setRecentSearches] = useState<string[]>([]);

	useEffect(() => {
		const saved = localStorage.getItem("recentMovieSearches");
		if (saved) {
			try {
				setRecentSearches(JSON.parse(saved));
			} catch (error) {
				console.error("Error loading recent searches:", error);
			}
		}
	}, []);

	const saveRecentSearch = (searchQuery: string) => {
		if (!searchQuery.trim()) return;

		const updated = [
			searchQuery,
			...recentSearches.filter((s) => s !== searchQuery),
		].slice(0, 5);

		setRecentSearches(updated);
		localStorage.setItem("recentMovieSearches", JSON.stringify(updated));
	};

	const handleSuggestionClick = (suggestion: string) => {
		saveRecentSearch(suggestion);
		onSuggestionClick(suggestion);
	};

	const clearRecentSearches = () => {
		setRecentSearches([]);
		localStorage.removeItem("recentMovieSearches");
	};

	if (!isVisible) return null;

	const filteredPopular = popularSearches.filter((search) =>
		search.toLowerCase().includes(query.toLowerCase())
	);

	const filteredRecent = recentSearches.filter((search) =>
		search.toLowerCase().includes(query.toLowerCase())
	);

	const hasResults = filteredRecent.length > 0 || filteredPopular.length > 0;

	return (
		<div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
			{hasResults ? (
				<div className="p-2">
					{/* Recent Searches */}
					{filteredRecent.length > 0 && (
						<div className="mb-4">
							<div className="flex items-center justify-between px-2 py-1 text-xs text-gray-400 uppercase tracking-wide">
								<div className="flex items-center gap-1">
									<Clock className="w-3 h-3" />
									Recent Searches
								</div>
								<button
									onClick={clearRecentSearches}
									className="hover:text-white transition-colors"
								>
									Clear
								</button>
							</div>
							{filteredRecent.map((search, index) => (
								<button
									key={`recent-${index}`}
									onClick={() => handleSuggestionClick(search)}
									className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
								>
									<Search className="w-4 h-4 text-gray-500" />
									<span className="text-white">{search}</span>
								</button>
							))}
						</div>
					)}

					{/* Popular Searches */}
					{filteredPopular.length > 0 && (
						<div>
							<div className="flex items-center px-2 py-1 text-xs text-gray-400 uppercase tracking-wide">
								<TrendingUp className="w-3 h-3 mr-1" />
								Popular Searches
							</div>
							{filteredPopular.map((search, index) => (
								<button
									key={`popular-${index}`}
									onClick={() => handleSuggestionClick(search)}
									className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
								>
									<TrendingUp className="w-4 h-4 text-gray-500" />
									<span className="text-white">{search}</span>
								</button>
							))}
						</div>
					)}
				</div>
			) : query.length > 0 ? (
				<div className="p-4 text-center text-gray-400 text-sm">
					No suggestions found for "{query}"
				</div>
			) : (
				<div className="p-4 text-center text-gray-400 text-sm">
					Start typing to see suggestions...
				</div>
			)}
		</div>
	);
};

export default SearchSuggestions;
