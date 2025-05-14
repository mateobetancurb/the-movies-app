export interface Movie {
	id: number;
	title: string;
	overview: string;
	poster_path: string;
	backdrop_path: string;
	release_date: string;
	vote_average: number;
	vote_count: number;
	runtime?: number;
	genres: Genre[];
	cast?: CastMember[];
}

export interface Genre {
	id: number;
	name: string;
}

export interface CastMember {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
}

export interface MovieCategory {
	id: number;
	name: string;
	description: string;
}
