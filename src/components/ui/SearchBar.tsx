"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import SearchSuggestions from "./SearchSuggestions";

interface SearchBarProps {
	placeholder?: string;
	onSearch?: (query: string) => void;
	showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
	placeholder = "Search for movies...",
	onSearch,
	showSuggestions = true,
}) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const [query, setQuery] = useState(searchParams.get("q")?.toString() || "");
	const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const searchContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const urlQuery = searchParams.get("q") || "";
		if (urlQuery !== query) {
			setQuery(urlQuery);
		}
	}, [searchParams]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchContainerRef.current &&
				!searchContainerRef.current.contains(event.target as Node)
			) {
				setShowSuggestionsDropdown(false);
				setIsFocused(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const performSearch = (searchQuery: string) => {
		const params = new URLSearchParams(searchParams);

		if (searchQuery.trim()) {
			params.set("q", searchQuery.trim());
			params.delete("page");

			const recentSearches = JSON.parse(
				localStorage.getItem("recentMovieSearches") || "[]"
			);
			const updatedSearches = [
				searchQuery.trim(),
				...recentSearches.filter((s: string) => s !== searchQuery.trim()),
			].slice(0, 5);
			localStorage.setItem(
				"recentMovieSearches",
				JSON.stringify(updatedSearches)
			);

			if (pathname !== "/") {
				replace(`/?${params.toString()}`);
			} else {
				replace(`${pathname}?${params.toString()}`);
			}
		} else {
			params.delete("q");
			params.delete("page");
			replace(`${pathname}?${params.toString()}`);
		}

		setShowSuggestionsDropdown(false);
		setIsFocused(false);

		if (onSearch) {
			onSearch(searchQuery.trim());
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		performSearch(query);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newQuery = e.target.value;
		setQuery(newQuery);

		// Show suggestions when user starts typing
		if (showSuggestions && isFocused) {
			setShowSuggestionsDropdown(true);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
		if (showSuggestions) {
			setShowSuggestionsDropdown(true);
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		setQuery(suggestion);
		performSearch(suggestion);
	};

	const handleClear = () => {
		setQuery("");
		setShowSuggestionsDropdown(false);
		performSearch("");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			if (query) {
				handleClear();
			} else {
				setShowSuggestionsDropdown(false);
				setIsFocused(false);
			}
		}
	};

	return (
		<div ref={searchContainerRef} className="relative w-full max-w-2xl mx-auto">
			<form onSubmit={handleSubmit} className="relative">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="search"
						value={query}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						onFocus={handleFocus}
						className="w-full p-4 pl-10 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:ring-accent-500 focus:border-accent-500 placeholder-gray-400 text-white transition-all duration-200 hover:border-gray-600"
						placeholder={placeholder}
						autoComplete="off"
						spellCheck="false"
					/>

					{/* clear button */}
					{query && (
						<button
							type="button"
							onClick={handleClear}
							className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
							aria-label="Clear search"
						>
							<X className="w-4 h-4" />
						</button>
					)}

					{/* search button */}
					<button
						type="submit"
						className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent-600 hover:bg-accent-700 text-white px-3 py-2 rounded-md transition-colors"
						aria-label="Search"
					>
						<Search className="w-4 h-4" />
					</button>
				</div>
			</form>

			{/* search suggestions */}
			{showSuggestions && (
				<SearchSuggestions
					isVisible={showSuggestionsDropdown && isFocused}
					query={query}
					onSuggestionClick={handleSuggestionClick}
				/>
			)}

			{/* search suggestions hint */}
			{query.length > 0 && query.length < 3 && !showSuggestionsDropdown && (
				<div className="absolute top-full left-0 right-0 mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-400">
					Type at least 3 characters and click search or press Enter...
				</div>
			)}
		</div>
	);
};

export default SearchBar;
