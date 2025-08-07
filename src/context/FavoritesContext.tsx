"use client";

import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	ReactNode,
} from "react";
import { Movie } from "@/src/interfaces";

interface FavoritesContextProps {
	favorites: Movie[];
	addFavorite: (movie: Movie) => void;
	removeFavorite: (movie: Movie) => void;
	toggleFavorite: (movie: Movie) => void;
	isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps>({
	favorites: [],
	addFavorite: () => {},
	removeFavorite: () => {},
	toggleFavorite: () => {},
	isFavorite: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

interface FavoritesProviderProps {
	children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
	children,
}) => {
	const [favorites, setFavorites] = useState<Movie[]>([]);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		const storedFavorites = localStorage.getItem("favorites");
		if (storedFavorites) {
			setFavorites(JSON.parse(storedFavorites));
		}
	}, []);

	useEffect(() => {
		if (isClient) {
			localStorage.setItem("favorites", JSON.stringify(favorites));
		}
	}, [favorites, isClient]);

	const isFavorite = (movieId: number): boolean => {
		return favorites.some((movie) => movie.id === movieId);
	};

	const addFavorite = (movie: Movie) => {
		if (!isFavorite(movie.id)) {
			setFavorites((prev) => [...prev, movie]);
		}
	};

	const removeFavorite = (movie: Movie) => {
		setFavorites((prev) => prev.filter((item) => item.id !== movie.id));
	};

	const toggleFavorite = (movie: Movie) => {
		if (isFavorite(movie.id)) {
			removeFavorite(movie);
		} else {
			addFavorite(movie);
		}
	};

	return (
		<FavoritesContext.Provider
			value={{
				favorites,
				addFavorite,
				removeFavorite,
				toggleFavorite,
				isFavorite,
			}}
		>
			{children}
		</FavoritesContext.Provider>
	);
};
