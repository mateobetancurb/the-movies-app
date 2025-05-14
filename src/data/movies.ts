import { Movie, Genre, MovieCategory } from "../interfaces";

export const genres: Genre[] = [
	{ id: 28, name: "Action" },
	{ id: 12, name: "Adventure" },
	{ id: 16, name: "Animation" },
	{ id: 35, name: "Comedy" },
	{ id: 80, name: "Crime" },
	{ id: 18, name: "Drama" },
	{ id: 10751, name: "Family" },
	{ id: 14, name: "Fantasy" },
	{ id: 36, name: "History" },
	{ id: 27, name: "Horror" },
	{ id: 10402, name: "Music" },
	{ id: 9648, name: "Mystery" },
	{ id: 10749, name: "Romance" },
	{ id: 878, name: "Science Fiction" },
	{ id: 53, name: "Thriller" },
];

export const movieCategories: MovieCategory[] = [
	{
		id: 1,
		name: "Trending Now",
		description: "Movies that are trending this week",
	},
	{
		id: 2,
		name: "Top Rated",
		description: "Movies with the highest ratings",
	},
	{
		id: 3,
		name: "New Releases",
		description: "Recently released movies",
	},
	{
		id: 4,
		name: "Upcoming",
		description: "Movies coming soon to theaters",
	},
	{
		id: 5,
		name: "Award Winners",
		description: "Movies that have won major awards",
	},
];

export const movies: Movie[] = [
	{
		id: 1,
		title: "Dune: Part Two",
		overview:
			"Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
		poster_path:
			"https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg",
		backdrop_path:
			"https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg",
		release_date: "2024-03-01",
		vote_average: 8.5,
		vote_count: 3245,
		runtime: 166,
		genres: [
			{ id: 878, name: "Science Fiction" },
			{ id: 12, name: "Adventure" },
			{ id: 18, name: "Drama" },
		],
		cast: [
			{
				id: 1,
				name: "Timothée Chalamet",
				character: "Paul Atreides",
				profile_path: null,
			},
			{ id: 2, name: "Zendaya", character: "Chani", profile_path: null },
			{
				id: 3,
				name: "Rebecca Ferguson",
				character: "Lady Jessica",
				profile_path: null,
			},
		],
	},
	{
		id: 2,
		title: "The Batman",
		overview:
			"When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
		poster_path:
			"https://images.pexels.com/photos/3648139/pexels-photo-3648139.jpeg",
		backdrop_path:
			"https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
		release_date: "2022-03-04",
		vote_average: 7.8,
		vote_count: 6352,
		runtime: 176,
		genres: [
			{ id: 80, name: "Crime" },
			{ id: 9648, name: "Mystery" },
			{ id: 28, name: "Action" },
		],
		cast: [
			{
				id: 4,
				name: "Robert Pattinson",
				character: "Bruce Wayne / Batman",
				profile_path: null,
			},
			{
				id: 5,
				name: "Zoë Kravitz",
				character: "Selina Kyle / Catwoman",
				profile_path: null,
			},
			{
				id: 6,
				name: "Paul Dano",
				character: "Edward Nashton / Riddler",
				profile_path: null,
			},
		],
	},
	{
		id: 3,
		title: "Everything Everywhere All at Once",
		overview:
			"An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
		poster_path:
			"https://images.pexels.com/photos/2670269/pexels-photo-2670269.jpeg",
		backdrop_path:
			"https://images.pexels.com/photos/2310713/pexels-photo-2310713.jpeg",
		release_date: "2022-03-25",
		vote_average: 8.9,
		vote_count: 4879,
		runtime: 139,
		genres: [
			{ id: 28, name: "Action" },
			{ id: 12, name: "Adventure" },
			{ id: 35, name: "Comedy" },
			{ id: 878, name: "Science Fiction" },
		],
		cast: [
			{
				id: 7,
				name: "Michelle Yeoh",
				character: "Evelyn Wang",
				profile_path: null,
			},
			{
				id: 8,
				name: "Ke Huy Quan",
				character: "Waymond Wang",
				profile_path: null,
			},
			{
				id: 9,
				name: "Jamie Lee Curtis",
				character: "Deirdre Beaubeirdre",
				profile_path: null,
			},
		],
	},
	{
		id: 4,
		title: "Top Gun: Maverick",
		overview:
			"After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.",
		poster_path:
			"https://images.pexels.com/photos/4522975/pexels-photo-4522975.jpeg",
		backdrop_path:
			"https://images.pexels.com/photos/76946/pexels-photo-76946.jpeg",
		release_date: "2022-05-27",
		vote_average: 8.3,
		vote_count: 5423,
		runtime: 130,
		genres: [
			{ id: 28, name: "Action" },
			{ id: 18, name: "Drama" },
		],
		cast: [
			{
				id: 10,
				name: "Tom Cruise",
				character: "Capt. Pete Mitchell / Maverick",
				profile_path: null,
			},
			{
				id: 11,
				name: "Miles Teller",
				character: "Lt. Bradley Bradshaw / Rooster",
				profile_path: null,
			},
			{
				id: 12,
				name: "Jennifer Connelly",
				character: "Penny Benjamin",
				profile_path: null,
			},
		],
	},
	{
		id: 5,
		title: "Oppenheimer",
		overview:
			"The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
		poster_path:
			"https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg",
		backdrop_path:
			"https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg",
		release_date: "2023-07-21",
		vote_average: 8.7,
		vote_count: 4678,
		runtime: 180,
		genres: [
			{ id: 18, name: "Drama" },
			{ id: 36, name: "History" },
			{ id: 53, name: "Thriller" },
		],
		cast: [
			{
				id: 13,
				name: "Cillian Murphy",
				character: "J. Robert Oppenheimer",
				profile_path: null,
			},
			{
				id: 14,
				name: "Emily Blunt",
				character: "Katherine Oppenheimer",
				profile_path: null,
			},
			{
				id: 15,
				name: "Matt Damon",
				character: "General Leslie Groves",
				profile_path: null,
			},
		],
	},
	{
		id: 6,
		title: "The Whale",
		overview:
			"A reclusive English teacher attempts to reconnect with his estranged teenage daughter.",
		poster_path:
			"https://images.pexels.com/photos/6076461/pexels-photo-6076461.jpeg",
		backdrop_path:
			"https://images.pexels.com/photos/386148/pexels-photo-386148.jpeg",
		release_date: "2022-12-09",
		vote_average: 7.7,
		vote_count: 2789,
		runtime: 117,
		genres: [{ id: 18, name: "Drama" }],
		cast: [
			{
				id: 16,
				name: "Brendan Fraser",
				character: "Charlie",
				profile_path: null,
			},
			{ id: 17, name: "Sadie Sink", character: "Ellie", profile_path: null },
			{ id: 18, name: "Hong Chau", character: "Liz", profile_path: null },
		],
	},
	{
		id: 7,
		title: "Poor Things",
		overview:
			"The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
		poster_path:
			"https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg",
		backdrop_path:
			"https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg",
		release_date: "2023-12-08",
		vote_average: 8.4,
		vote_count: 2156,
		runtime: 141,
		genres: [
			{ id: 18, name: "Drama" },
			{ id: 14, name: "Fantasy" },
			{ id: 10749, name: "Romance" },
		],
		cast: [
			{
				id: 19,
				name: "Emma Stone",
				character: "Bella Baxter",
				profile_path: null,
			},
			{
				id: 20,
				name: "Mark Ruffalo",
				character: "Duncan Wedderburn",
				profile_path: null,
			},
			{
				id: 21,
				name: "Willem Dafoe",
				character: "Dr. Godwin Baxter",
				profile_path: null,
			},
		],
	},
	{
		id: 8,
		title: "The Super Mario Bros. Movie",
		overview:
			"A plumber named Mario travels through an underground labyrinth with his brother, Luigi, trying to save a captured princess.",
		poster_path:
			"https://images.pexels.com/photos/10771000/pexels-photo-10771000.jpeg",
		backdrop_path:
			"https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg",
		release_date: "2023-04-05",
		vote_average: 7.2,
		vote_count: 5867,
		runtime: 92,
		genres: [
			{ id: 16, name: "Animation" },
			{ id: 12, name: "Adventure" },
			{ id: 10751, name: "Family" },
		],
		cast: [
			{
				id: 22,
				name: "Chris Pratt",
				character: "Mario (voice)",
				profile_path: null,
			},
			{
				id: 23,
				name: "Anya Taylor-Joy",
				character: "Princess Peach (voice)",
				profile_path: null,
			},
			{
				id: 24,
				name: "Charlie Day",
				character: "Luigi (voice)",
				profile_path: null,
			},
		],
	},
];

export const getMoviesByCategory = (categoryId: number): Movie[] => {
	switch (categoryId) {
		case 1: // Trending Now
			return movies.slice(0, 4);
		case 2: // Top Rated
			return movies.filter((movie) => movie.vote_average >= 8.0);
		case 3: // New Releases
			return movies.filter((movie) => {
				const releaseDate = new Date(movie.release_date);
				const sixMonthsAgo = new Date();
				sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
				return releaseDate > sixMonthsAgo;
			});
		case 4: // Upcoming
			return movies.slice(5, 8);
		case 5: // Award Winners
			return [movies[2], movies[4], movies[6]];
		default:
			return [];
	}
};

export const getMoviesByGenre = (genreId: number): Movie[] => {
	return movies.filter((movie) =>
		movie.genres.some((genre) => genre.id === genreId)
	);
};

export const getMovieById = (id: number): Movie | undefined => {
	return movies.find((movie) => movie.id === id);
};
