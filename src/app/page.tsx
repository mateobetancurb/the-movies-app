import MovieHero from "@/src/components/movies/MovieHero";
import MovieGrid from "@/src/components/movies/MovieGrid";
import SearchBar from "@/src/components/ui/SearchBar";
import TrendingNowSection from "@/src/components/movies/sections/TrendingNowSection";
import TopRatedSection from "@/src/components/movies/sections/TopRatedSection";
import NewReleasesSection from "@/src/components/movies/sections/NewReleasesSection";
import { getFeaturedMovie, searchMovies } from "@/src/services/movieService";
import { Movie } from "@/src/interfaces";

export default async function Home({
	searchParams,
}: {
	searchParams?: Promise<{
		q?: string;
	}>;
}) {
	const resolvedParams = (await searchParams) || {};
	const searchQuery = resolvedParams.q || "";

	const featuredMovie = await getFeaturedMovie();

	let searchResults = {
		results: [] as Movie[],
		total_results: 0,
		page: 1,
		total_pages: 0,
	};
	if (searchQuery) {
		searchResults = await searchMovies(searchQuery);
	}

	return (
		<div className="pt-16">
			{featuredMovie ? (
				<MovieHero movie={featuredMovie} />
			) : (
				<div className="relative h-[70vh] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							Welcome to The Movies App
						</h1>
						<p className="text-xl text-gray-300">
							Discover amazing movies and TV shows
						</p>
					</div>
				</div>
			)}
			<div className="container-page">
				<div className="my-8">
					<SearchBar />
				</div>

				{searchQuery ? (
					<MovieGrid
						movies={searchResults.results}
						title={`Search Results for "${searchQuery}"`}
						emptyMessage="No movies found matching your search"
					/>
				) : (
					<>
						<TrendingNowSection />
						<TopRatedSection />
						<NewReleasesSection />
					</>
				)}
			</div>
		</div>
	);
}
