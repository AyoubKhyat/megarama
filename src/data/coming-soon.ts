export interface UpcomingMovie {
  title: string;
  genre: string;
  releaseDate: string;
  poster: string;
  tagline: string;
}

export const upcomingMovies: UpcomingMovie[] = [
  {
    title: "Sinners",
    genre: "Horror / Thriller",
    releaseDate: "2026-06-12",
    poster: "/images/posters/sinners.jpg",
    tagline: "Blood runs deep",
  },
  {
    title: "Ballerina",
    genre: "Action / Thriller",
    releaseDate: "2026-07-03",
    poster: "/images/posters/ballerina.jpg",
    tagline: "From the world of John Wick",
  },
  {
    title: "A Working Man",
    genre: "Action / Crime",
    releaseDate: "2026-08-15",
    poster: "/images/posters/a-working-man.jpg",
    tagline: "No one walks away clean",
  },
];
