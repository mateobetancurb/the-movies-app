import {
	getMoviesByCategory,
	movies,
	movieCategories,
} from "@/src/data/movies";
import MovieHero from "@/src/components/movies/MovieHero";
import MovieGrid from "@/src/components/movies/MovieGrid";
import SearchBar from "@/src/components/ui/SearchBar";

export default async function Home({
	searchParams,
}: {
	searchParams?: Promise<{
		q?: string;
	}>;
}) {
	const resolvedParams = (await searchParams) || {};
	const searchQuery = resolvedParams.q || "";
	let searchResults: typeof movies = [];

	const randomIndex = Math.floor(Math.random() * 3);
	const featuredMovie = movies[randomIndex];

	if (searchQuery) {
		searchResults = movies.filter(
			(movie) =>
				movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}

	return (
		<div className="pt-16">
			<MovieHero movie={featuredMovie} />
			<div className="container-page">
				<div className="my-8">
					<SearchBar />
				</div>

				{searchQuery ? (
					<MovieGrid
						movies={searchResults}
						title={`Search Results for "${searchQuery}"`}
						emptyMessage="No movies found matching your search"
					/>
				) : (
					<>
						{movieCategories.slice(0, 3).map((category) => (
							<MovieGrid
								key={category.id}
								movies={getMoviesByCategory(category.id)}
								title={category.name}
							/>
						))}
					</>
				)}
			</div>
		</div>
	);
}
