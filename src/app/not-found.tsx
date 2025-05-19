import { Film } from "lucide-react";
import Link from "next/link";

const NotFound: React.FC = () => {
	return (
		<div className="container mx-auto px-4 pt-24 pb-12 flex flex-col items-center justify-center min-h-[70vh] text-center">
			<Film className="w-20 h-20 text-gray-700 mb-4" />
			<h1 className="text-4xl font-bold mb-2">404</h1>
			<h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
			<p className="text-gray-400 mb-8 max-w-md">
				The page you are looking for might have been removed, had its name
				changed, or is temporarily unavailable.
			</p>
			<Link href="/" className="btn btn-primary">
				Back to Home
			</Link>
		</div>
	);
};

export default NotFound;
