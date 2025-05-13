import React from "react";
import { Film, Github, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-900 pt-10 pb-6">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand section */}
					<div className="col-span-1">
						<Link to="/" className="flex items-center space-x-2">
							<Film className="h-8 w-8 text-accent-500" />
							<span className="text-xl font-bold text-white">CineExplorer</span>
						</Link>
						<p className="mt-2 text-sm text-gray-400">
							Discover the latest movies, save your favorites, and explore film
							categories.
						</p>
					</div>

					{/* Links section */}
					<div className="col-span-1">
						<h3 className="text-white font-medium mb-4">Navigation</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/"
									className="text-gray-400 hover:text-white transition-colors text-sm"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									to="/categories"
									className="text-gray-400 hover:text-white transition-colors text-sm"
								>
									Categories
								</Link>
							</li>
							<li>
								<Link
									to="/favorites"
									className="text-gray-400 hover:text-white transition-colors text-sm"
								>
									Favorites
								</Link>
							</li>
						</ul>
					</div>

					{/* Categories section */}
					<div className="col-span-1">
						<h3 className="text-white font-medium mb-4">Categories</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/categories"
									className="text-gray-400 hover:text-white transition-colors text-sm"
								>
									Action
								</Link>
							</li>
							<li>
								<Link
									to="/categories"
									className="text-gray-400 hover:text-white transition-colors text-sm"
								>
									Drama
								</Link>
							</li>
							<li>
								<Link
									to="/categories"
									className="text-gray-400 hover:text-white transition-colors text-sm"
								>
									Science Fiction
								</Link>
							</li>
							<li>
								<Link
									to="/categories"
									className="text-gray-400 hover:text-white transition-colors text-sm"
								>
									Comedy
								</Link>
							</li>
						</ul>
					</div>

					{/* Connect section */}
					<div className="col-span-1">
						<h3 className="text-white font-medium mb-4">Connect</h3>
						<div className="flex space-x-4">
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="GitHub"
							>
								<Github className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Twitter"
							>
								<Twitter className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Instagram"
							>
								<Instagram className="h-5 w-5" />
							</a>
						</div>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t border-gray-800">
					<p className="text-center text-gray-400 text-sm">
						&copy; {new Date().getFullYear()} CineExplorer. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
