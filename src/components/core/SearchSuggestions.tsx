"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Clock, TrendingUp, Film } from "lucide-react";

interface SearchSuggestionsProps {
	onSuggestionClick: (suggestion: string) => void;
	isVisible: boolean;
	query: string;
}

interface MovieSuggestion {
	id: number;
	title: string;
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
	const [movieSuggestions, setMovieSuggestions] = useState<MovieSuggestion[]>(
		[]
	);
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

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

	// Debounced search function for movie suggestions
	const debouncedSearchMovies = useCallback(
		useMemo(() => {
			let timeoutId: NodeJS.Timeout;

			return (searchQuery: string) => {
				clearTimeout(timeoutId);

				if (!searchQuery.trim() || searchQuery.length < 2) {
					setMovieSuggestions([]);
					setIsLoadingSuggestions(false);
					return;
				}

				setIsLoadingSuggestions(true);

				timeoutId = setTimeout(async () => {
					try {
						const response = await fetch(
							`/api/search?q=${encodeURIComponent(searchQuery)}&page=1`
						);
						if (response.ok) {
							const data = await response.json();
							const suggestions =
								data.results?.slice(0, 6).map((movie: any) => ({
									id: movie.id,
									title: movie.title,
								})) || [];
							setMovieSuggestions(suggestions);
						} else {
							setMovieSuggestions([]);
						}
					} catch (error) {
						console.error("Error fetching movie suggestions:", error);
						setMovieSuggestions([]);
					} finally {
						setIsLoadingSuggestions(false);
					}
				}, 300);
			};
		}, []),
		[]
	);

	useEffect(() => {
		debouncedSearchMovies(query);
	}, [query, debouncedSearchMovies]);

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

	// Filter out movie suggestions that already appear in recent or popular searches
	const uniqueMovieSuggestions = movieSuggestions.filter((movie) => {
		const title = movie.title.toLowerCase();
		const isInRecent = filteredRecent.some(
			(recent) => recent.toLowerCase() === title
		);
		const isInPopular = filteredPopular.some(
			(popular) => popular.toLowerCase() === title
		);
		return !isInRecent && !isInPopular;
	});

	const hasResults =
		filteredRecent.length > 0 ||
		filteredPopular.length > 0 ||
		uniqueMovieSuggestions.length > 0;

	return (
		<div
			role="complementary"
			aria-label="Search suggestions"
			className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
		>
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
									aria-label="Clear recent searches"
								>
									Clear
								</button>
							</div>
							{filteredRecent.map((search, index) => (
								<button
									key={`recent-${index}`}
									onClick={() => handleSuggestionClick(search)}
									className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
									aria-label={`Recent search: ${search}`}
								>
									<Search className="w-4 h-4 text-gray-500" />
									<span className="text-white">{search}</span>
								</button>
							))}
						</div>
					)}

					{/* Movie Suggestions */}
					{uniqueMovieSuggestions.length > 0 && (
						<div className="mb-4">
							<div className="flex items-center px-2 py-1 text-xs text-gray-400 uppercase tracking-wide">
								<Film className="w-3 h-3 mr-1" />
								Movies
								{isLoadingSuggestions && (
									<div
										className="ml-2 animate-spin rounded-full h-3 w-3 border-t border-gray-400"
										role="status"
										aria-label="Loading movies"
									/>
								)}
							</div>
							{uniqueMovieSuggestions.map((movie) => (
								<button
									key={`movie-${movie.id}`}
									onClick={() => handleSuggestionClick(movie.title)}
									className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
									aria-label={`Movie suggestion: ${movie.title}`}
								>
									<Film className="w-4 h-4 text-gray-500" />
									<span className="text-white">{movie.title}</span>
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
									aria-label={`Popular search: ${search}`}
								>
									<TrendingUp className="w-4 h-4 text-gray-500" />
									<span className="text-white">{search}</span>
								</button>
							))}
						</div>
					)}

					{/* Loading state for movie suggestions */}
					{isLoadingSuggestions &&
						uniqueMovieSuggestions.length === 0 &&
						query.length >= 2 && (
							<div
								className="px-3 py-2 text-center text-gray-400 text-sm flex items-center justify-center gap-2"
								role="status"
								aria-label="Searching movies"
							>
								<div
									className="animate-spin rounded-full h-4 w-4 border-t border-gray-400"
									aria-hidden="true"
								/>
								<span>Searching movies...</span>
							</div>
						)}
				</div>
			) : query.length > 0 ? (
				<div className="p-4 text-center text-gray-400 text-sm">
					{isLoadingSuggestions ? (
						<div
							className="flex items-center justify-center gap-2"
							role="status"
							aria-label="Searching movies"
						>
							<div
								className="animate-spin rounded-full h-4 w-4 border-t border-gray-400"
								aria-hidden="true"
							/>
							<span>Searching movies...</span>
						</div>
					) : (
						`No suggestions found for "${query}"`
					)}
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
