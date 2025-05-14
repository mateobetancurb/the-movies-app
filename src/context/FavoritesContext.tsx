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
	const [favorites, setFavorites] = useState<number[]>(() => {
		const storedFavorites = localStorage.getItem("favorites");
		return storedFavorites ? JSON.parse(storedFavorites) : [];
	});

	useEffect(() => {
		localStorage.setItem("favorites", JSON.stringify(favorites));
	}, [favorites]);

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
