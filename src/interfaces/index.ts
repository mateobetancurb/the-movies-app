export interface Movie {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	vote_count: number;
	runtime?: number | null;
	genres: Genre[];
	cast: CastMember[];
	popularity?: number;
	original_language?: string;
	original_title?: string;
	adult?: boolean;
	video?: boolean;
	genre_ids?: number[];
}

export interface Genre {
	id: number;
	name: string;
}

export interface GenresResponse {
	genres: Genre[];
}

export interface CastMember {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
	adult?: boolean;
	gender?: number | null;
	known_for_department?: string;
	original_name?: string;
	popularity?: number;
	cast_id?: number;
	credit_id?: string;
	order?: number;
}

export interface MovieCategory {
	id: number;
	name: string;
	description: string;
}

export interface PaginatedResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

export interface MovieDetails extends Movie {
	belongs_to_collection?: object | null;
	budget?: number;
	homepage?: string | null;
	imdb_id?: string | null;
	production_companies?: {
		name: string;
		id: number;
		logo_path: string | null;
		origin_country: string;
	}[];
	production_countries?: {
		iso_3166_1: string;
		name: string;
	}[];
	revenue?: number;
	spoken_languages?: {
		english_name: string;
		iso_639_1: string;
		name: string;
	}[];
	status?: string;
	tagline?: string | null;
	cast: CastMember[];
}

export interface TMDBConfiguration {
	images: {
		base_url: string;
		secure_base_url: string;
		backdrop_sizes: string[];
		logo_sizes: string[];
		poster_sizes: string[];
		profile_sizes: string[];
		still_sizes: string[];
	};
	change_keys: string[];
}
