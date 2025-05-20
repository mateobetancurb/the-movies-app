import { Suspense } from "react";
import { getGenres } from "../../services/movieService";
import MainContent from "../../components/categories/MainContent";
import { Genre } from "../../interfaces";

export default async function CategoriesPage() {
	const genres: Genre[] = await getGenres();

	return (
		<Suspense
			fallback={
				<div className="container-page pt-24 text-white">
					Loading categories...
				</div>
			}
		>
			<MainContent genres={genres} />
		</Suspense>
	);
}
