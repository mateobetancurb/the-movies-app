import Link from "next/link";
import MovieHero from "@/src/components/movies/MovieHero";
import { getMovieDetails } from "@/src/services/movieService";
import SimilarMoviesYouMightLike from "@/src/components/movies/sections/SimilarMoviesYouMightLike";
import MovieCast from "@/src/components/movies/MovieCast";

export default async function MoviePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const movieDetails = await getMovieDetails(Number(id));

	return (
		<>
			{movieDetails ? (
				<>
					<MovieHero movie={movieDetails} />
					<div className="container-page">
						<MovieCast cast={movieDetails?.cast} />
						<SimilarMoviesYouMightLike movieId={Number(id)} />
					</div>
				</>
			) : (
				<>
					<div className="py-20 text-center text-2xl">Movie not found</div>
					<div className="mx-auto text-center mb-10">
						<Link href="/" className=" bg-[#4F46E5] mt-10 rounded-md">
							Back to Home
						</Link>
					</div>
				</>
			)}
		</>
	);
}
