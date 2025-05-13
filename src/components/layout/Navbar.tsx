"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Heart, Grid, Search, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Close mobile menu when navigating to a new page
	useEffect(() => {
		setIsOpen(false);
	}, [location.pathname]);

	return (
		<header
			className={`fixed top-0 w-full z-50 transition-all duration-300 ${
				isScrolled
					? "bg-gray-900/95 backdrop-blur-sm shadow-md"
					: "bg-gradient-to-b from-gray-900 to-transparent"
			}`}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo and site name */}
					<Link to="/" className="flex items-center space-x-2">
						<Film className="h-8 w-8 text-accent-500" />
						<span className="text-xl font-bold text-white">CineExplorer</span>
					</Link>

					{/* Desktop navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						<Link
							to="/"
							className="nav-link text-white hover:text-accent-400 transition-colors"
						>
							Home
						</Link>
						<Link
							to="/categories"
							className="nav-link text-white hover:text-accent-400 transition-colors"
						>
							Categories
						</Link>
						<Link
							to="/favorites"
							className="nav-link text-white hover:text-accent-400 transition-colors"
						>
							Favorites
						</Link>
					</nav>

					{/* Search and mobile menu buttons */}
					<div className="flex items-center space-x-4">
						<button
							className="p-1 rounded-full hover:bg-gray-800 transition-colors text-white"
							aria-label="Search"
						>
							<Search className="h-5 w-5" />
						</button>

						{/* Mobile menu button */}
						<button
							onClick={toggleMenu}
							className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-white hover:bg-gray-800 transition-colors"
							aria-expanded={isOpen}
						>
							<span className="sr-only">Open main menu</span>
							{isOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu, show/hide based on menu state */}
			<div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
				<div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 shadow-lg">
					<Link
						to="/"
						className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
					>
						<div className="flex items-center space-x-2">
							<Film className="h-5 w-5" />
							<span>Home</span>
						</div>
					</Link>
					<Link
						to="/categories"
						className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
					>
						<div className="flex items-center space-x-2">
							<Grid className="h-5 w-5" />
							<span>Categories</span>
						</div>
					</Link>
					<Link
						to="/favorites"
						className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
					>
						<div className="flex items-center space-x-2">
							<Heart className="h-5 w-5" />
							<span>Favorites</span>
						</div>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
