"use client";

import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	ReactNode,
} from "react";

interface FavoritesContextProps {
	favorites: number[];
	addFavorite: (movieId: number) => void;
	removeFavorite: (movieId: number) => void;
	isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps>({
	favorites: [],
	addFavorite: () => {},
	removeFavorite: () => {},
	isFavorite: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

interface FavoritesProviderProps {
	children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
	children,
}) => {
	const [favorites, setFavorites] = useState<number[]>([]);
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

	const addFavorite = (movieId: number) => {
		setFavorites((prev) => [...prev, movieId]);
	};

	const removeFavorite = (movieId: number) => {
		setFavorites((prev) => prev.filter((id) => id !== movieId));
	};

	const isFavorite = (movieId: number) => {
		return favorites.includes(movieId);
	};

	return (
		<FavoritesContext.Provider
			value={{
				favorites,
				addFavorite,
				removeFavorite,
				isFavorite,
			}}
		>
			{children}
		</FavoritesContext.Provider>
	);
};
