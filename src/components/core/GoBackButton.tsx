import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

interface GoBackButtonProps {
	href: string;
}

const GoBackButton = ({ href }: GoBackButtonProps) => {
	return (
		<Link
			href={href}
			className="flex items-center gap-2 mt-20 mb-10 hover:underline"
		>
			<ArrowLeftIcon className="w-5 h-5" />
			<span>Go Back</span>
		</Link>
	);
};

export default GoBackButton;
