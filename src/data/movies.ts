export interface Movie {
  title: string;
  slug: string;
  genre: string;
  duration: string;
  language: string;
  rating: string;
  showtimes: string[];
  color: string;
  poster: string;
  synopsis: string;
  trailerUrl: string;
}

export function getMovieBySlug(slug: string): Movie | undefined {
  return movies.find((m) => m.slug === slug);
}

export const movies: Movie[] = [
  {
    title: "John Wick: Chapter 4",
    slug: "john-wick-chapter-4",
    genre: "Action / Thriller",
    duration: "2h 49min",
    language: "EN / AR",
    rating: "7.7",
    showtimes: ["17:00", "20:30", "23:00"],
    color: "from-blue-900/40",
    poster: "/images/posters/john-wick.jpg",
    synopsis: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, he must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    trailerUrl: "https://www.youtube.com/embed/qEVUtrk8_B4",
  },
  {
    title: "Deadpool & Wolverine",
    slug: "deadpool-wolverine",
    genre: "Action / Comedy",
    duration: "2h 08min",
    language: "EN / FR",
    rating: "7.8",
    showtimes: ["14:30", "17:30", "20:00", "22:30"],
    color: "from-red-900/40",
    poster: "/images/posters/deadpool.jpg",
    synopsis: "Deadpool is offered a place in the Marvel Cinematic Universe by the Time Variance Authority, but instead recruits a variant of Wolverine to save his universe from extinction.",
    trailerUrl: "https://www.youtube.com/embed/73_1biulkYk",
  },
  {
    title: "The Substance",
    slug: "the-substance",
    genre: "Horror / Sci-Fi",
    duration: "2h 20min",
    language: "EN / FR",
    rating: "7.3",
    showtimes: ["19:00", "21:30", "23:45"],
    color: "from-amber-900/40",
    poster: "/images/posters/the-substance.jpg",
    synopsis: "A fading celebrity discovers a black-market drug that temporarily creates a younger, better version of herself. But the side effects are beyond anything she could have imagined.",
    trailerUrl: "https://www.youtube.com/embed/LNlrGo--g3o",
  },
  {
    title: "Gladiator II",
    slug: "gladiator-ii",
    genre: "Action / Drama",
    duration: "2h 28min",
    language: "EN / AR",
    rating: "6.8",
    showtimes: ["15:00", "18:00", "21:00"],
    color: "from-emerald-900/40",
    poster: "/images/posters/gladiator-2.jpg",
    synopsis: "Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum and look to his past to find the strength to return the glory of Rome to its people.",
    trailerUrl: "https://www.youtube.com/embed/4rgYUipGJNo",
  },
  {
    title: "Nosferatu",
    slug: "nosferatu",
    genre: "Horror / Gothic",
    duration: "2h 12min",
    language: "EN",
    rating: "7.5",
    showtimes: ["20:30", "23:00"],
    color: "from-purple-900/40",
    poster: "/images/posters/nosferatu.jpg",
    synopsis: "A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her, bringing untold horror with him. A visionary reimagining of the classic.",
    trailerUrl: "https://www.youtube.com/embed/nulvWqYUM8k",
  },
  {
    title: "Alien: Romulus",
    slug: "alien-romulus",
    genre: "Horror / Sci-Fi",
    duration: "1h 59min",
    language: "EN / AR",
    rating: "7.1",
    showtimes: ["17:30", "20:00", "22:30"],
    color: "from-orange-900/40",
    poster: "/images/posters/alien-romulus.jpg",
    synopsis: "A group of young space colonizers come face to face with the most terrifying life form in the universe while scavenging a derelict space station orbiting a desolate planet.",
    trailerUrl: "https://www.youtube.com/embed/OzY2r2JXsDM",
  },
];
