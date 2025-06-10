import MovieHero from "@/src/components/movies/MovieHero";
import SearchBar from "@/src/components/ui/SearchBar";
import TrendingNowSection from "@/src/components/movies/sections/TrendingNowSection";
import TopRatedSection from "@/src/components/movies/sections/TopRatedSection";
import NewReleasesSection from "@/src/components/movies/sections/NewReleasesSection";
import MovieGrid from "@/src/components/movies/MovieGrid";
import { getFeaturedMovie, searchMovies } from "@/src/services/movieService";

export default async function Home({
	searchParams,
}: {
	searchParams?: Promise<{
		q?: string;
		page?: string;
	}>;
}) {
	const resolvedParams = (await searchParams) || {};
	const searchQuery = resolvedParams.q || "";
	const currentPage = parseInt(resolvedParams.page || "1", 10);

	if (searchQuery) {
		let searchResults = null;
		let searchError = null;

		try {
			console.log("Server: Searching for:", searchQuery, "page:", currentPage);
			searchResults = await searchMovies(searchQuery, currentPage);
			console.log("Server: Found", searchResults.total_results, "results");
		} catch (error) {
			console.error("Server: Search error:", error);
			searchError =
				error instanceof Error ? error.message : "Failed to search movies";
		}

		return (
			<div className="pt-16">
				<div className="container-page">
					<div className="my-8">
						<SearchBar />
					</div>

					{searchError ? (
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
							<p className="text-gray-400 text-center max-w-md">
								{searchError}
							</p>
						</div>
					) : !searchResults ? (
						<div className="flex flex-col items-center justify-center py-20">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500 mb-4"></div>
							<p className="text-gray-400">Searching for "{searchQuery}"...</p>
						</div>
					) : searchResults.results.length === 0 ? (
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
							<p className="text-gray-400">No results for "{searchQuery}"</p>
							<p className="text-xs text-gray-500 mt-2">
								Try a different search term or check your spelling
							</p>
						</div>
					) : (
						<div className="space-y-6">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div>
									<h2 className="text-2xl font-bold mb-2">
										Search Results for "{searchQuery}"
									</h2>
									<p className="text-gray-400">
										Found {searchResults.total_results} movies
									</p>
								</div>
							</div>

							<MovieGrid movies={searchResults.results} />

							{/* Pagination info */}
							{searchResults.total_pages > 1 && (
								<div className="flex justify-center mt-8">
									<p className="text-gray-400 text-sm">
										Page {currentPage} of {searchResults.total_pages}
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}

	const featuredMovie = await getFeaturedMovie();

	return (
		<div className="pt-16">
			{featuredMovie && <MovieHero movie={featuredMovie} />}

			<div className="container-page">
				<div className="my-8">
					<SearchBar />
				</div>

				<div className="space-y-16 pb-16">
					<TrendingNowSection />
					<TopRatedSection />
					<NewReleasesSection />
				</div>
			</div>
		</div>
	);
}
