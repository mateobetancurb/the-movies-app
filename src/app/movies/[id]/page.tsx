import { User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MovieHero from "@/src/components/movies/MovieHero";
import { getMovieDetails } from "@/src/services/movieService";
import SimilarMoviesYouMightLike from "@/src/components/movies/sections/SimilarMoviesYouMightLike";

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
						{movieDetails.cast && movieDetails.cast.length > 0 && (
							<section className="my-12">
								<h2 className="text-2xl font-bold mb-6">Cast</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
									{movieDetails.cast.map((person) => (
										<div key={person.id} className="text-center">
											<div className="w-full aspect-square bg-gray-800 rounded-full flex items-center justify-center mb-2">
												{person.profile_path ? (
													<Image
														src={person.profile_path}
														alt={person.name}
														width={100}
														height={100}
														className="w-full h-full object-cover rounded-full"
													/>
												) : (
													<User className="w-12 h-12 text-gray-600" />
												)}
											</div>
											<h3 className="font-medium text-sm">{person.name}</h3>
											<p className="text-gray-400 text-xs">
												{person.character}
											</p>
										</div>
									))}
								</div>
							</section>
						)}
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
