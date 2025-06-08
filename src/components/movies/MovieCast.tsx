import { CastMember as CastMemberType } from "@/src/interfaces";
import CastMember from "@/src/components/core/CastMember";

interface MovieCastProps {
	cast: CastMemberType[];
}

const MovieCast = ({ cast }: MovieCastProps) => {
	return (
		<>
			{cast && cast.length > 0 && (
				<section className="my-12">
					<h2 className="text-2xl font-bold mb-6">Cast</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{cast.map((person) => (
							<CastMember key={person?.id} person={person} />
						))}
					</div>
				</section>
			)}
		</>
	);
};

export default MovieCast;
