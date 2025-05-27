"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface SearchBarProps {
	placeholder?: string;
	onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
	placeholder = "Search for movies...",
	onSearch,
}) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const [query, setQuery] = useState(searchParams.get("q")?.toString() || "");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams);
		if (query.trim()) {
			params.set("q", query.trim());
		} else {
			params.delete("q");
		}
		replace(`${pathname}?${params.toString()}`);

		if (onSearch) {
			onSearch(query.trim());
		}
	};

	const clearSearch = () => {
		setQuery("");
		const params = new URLSearchParams(searchParams);
		params.delete("q");
		replace(`${pathname}?${params.toString()}`);

		if (onSearch) {
			onSearch("");
		}
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
					onChange={handleInputChange}
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
