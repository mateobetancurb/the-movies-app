import { CastMember } from "@/src/interfaces";
import { User } from "lucide-react";
import Image from "next/image";

interface MovieCastProps {
	cast: CastMember[];
}

const MovieCast = ({ cast }: MovieCastProps) => {
	return (
		<>
			{cast && cast.length > 0 && (
				<section className="my-12">
					<h2 className="text-2xl font-bold mb-6">Cast</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{cast.map((person) => (
							<div key={person?.id} className="text-center">
								<div className="w-full aspect-square bg-gray-800 rounded-full flex items-center justify-center mb-2">
									{person?.profile_path ? (
										<Image
											src={person?.profile_path}
											alt={person?.name}
											width={100}
											height={100}
											className="w-full h-full object-cover rounded-full"
										/>
									) : (
										<User className="w-12 h-12 text-gray-600" />
									)}
								</div>
								<h3 className="font-medium text-sm">{person?.name}</h3>
								<p className="text-gray-400 text-xs">{person?.character}</p>
							</div>
						))}
					</div>
				</section>
			)}
		</>
	);
};

export default MovieCast;
