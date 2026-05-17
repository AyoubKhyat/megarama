export interface Movie {
  title: string;
  genre: string;
  duration: string;
  language: string;
  rating: string;
  showtimes: string[];
  color: string;
  poster: string;
}

export const movies: Movie[] = [
  {
    title: "John Wick: Chapter 4",
    genre: "Action / Thriller",
    duration: "2h 49min",
    language: "EN / AR",
    rating: "7.7",
    showtimes: ["17:00", "20:30", "23:00"],
    color: "from-blue-900/40",
    poster: "/images/posters/john-wick.jpg",
  },
  {
    title: "Deadpool & Wolverine",
    genre: "Action / Comedy",
    duration: "2h 08min",
    language: "EN / FR",
    rating: "7.8",
    showtimes: ["14:30", "17:30", "20:00", "22:30"],
    color: "from-red-900/40",
    poster: "/images/posters/deadpool.jpg",
  },
  {
    title: "The Substance",
    genre: "Horror / Sci-Fi",
    duration: "2h 20min",
    language: "EN / FR",
    rating: "7.3",
    showtimes: ["19:00", "21:30", "23:45"],
    color: "from-amber-900/40",
    poster: "/images/posters/the-substance.jpg",
  },
  {
    title: "Gladiator II",
    genre: "Action / Drama",
    duration: "2h 28min",
    language: "EN / AR",
    rating: "6.8",
    showtimes: ["15:00", "18:00", "21:00"],
    color: "from-emerald-900/40",
    poster: "/images/posters/gladiator-2.jpg",
  },
  {
    title: "Nosferatu",
    genre: "Horror / Gothic",
    duration: "2h 12min",
    language: "EN",
    rating: "7.5",
    showtimes: ["20:30", "23:00"],
    color: "from-purple-900/40",
    poster: "/images/posters/nosferatu.jpg",
  },
  {
    title: "Alien: Romulus",
    genre: "Horror / Sci-Fi",
    duration: "1h 59min",
    language: "EN / AR",
    rating: "7.1",
    showtimes: ["17:30", "20:00", "22:30"],
    color: "from-orange-900/40",
    poster: "/images/posters/alien-romulus.jpg",
  },
];
