"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
	onSearch: (query: string) => void;
	placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	placeholder = "Search for movies...",
}) => {
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			onSearch(query.trim());
		}
	};

	const clearSearch = () => {
		setQuery("");
		onSearch("");
	};

	return (
		<form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
			<div className="relative">
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<Search className="w-5 h-5 text-gray-500" />
				</div>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-full p-4 pl-10 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:ring-accent-500 focus:border-accent-500 placeholder-gray-400 text-white"
					placeholder={placeholder}
				/>
				{query && (
					<button
						type="button"
						onClick={clearSearch}
						className="absolute inset-y-0 right-14 flex items-center pr-3"
					>
						<X className="w-5 h-5 text-gray-400 hover:text-white" />
					</button>
				)}
				<button
					type="submit"
					className="absolute right-2.5 bottom-2.5 px-4 py-2 text-sm font-medium text-white bg-accent-600 rounded-lg hover:bg-accent-700 focus:ring-4 focus:outline-none focus:ring-accent-800"
				>
					Search
				</button>
			</div>
		</form>
	);
};

export default SearchBar;
