import { Suspense } from "react";
import { getGenres } from "@/src/services/movieService";
import MainContent from "@/src/components/categories/MainContent";
import { Genre } from "@/src/interfaces";

export default async function CategoriesPage() {
	const genres: Genre[] = await getGenres();

	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center h-screen">
					<div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-white"></div>
				</div>
			}
		>
			<MainContent genres={genres} />
		</Suspense>
	);
}
