import { CastMember as CastMemberType } from "@/src/interfaces/index";
import { User } from "lucide-react";
import Image from "next/image";

interface CastMemberProps {
	person: CastMemberType;
}

const CastMember = ({ person }: CastMemberProps) => {
	return (
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
	);
};

export default CastMember;
