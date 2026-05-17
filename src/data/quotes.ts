export interface MovieQuote {
  text: string;
  film: string;
  size: string;
  opacity: string;
  x: string;
  y: string;
  speed: number;
}

export const quotes: MovieQuote[] = [
  {
    text: "Here's looking at you, kid.",
    film: "Casablanca",
    size: "text-2xl md:text-4xl",
    opacity: "text-white/40",
    x: "5%",
    y: "10%",
    speed: 80,
  },
  {
    text: "May the Force be with you.",
    film: "Star Wars",
    size: "text-xl md:text-3xl",
    opacity: "text-white/25",
    x: "55%",
    y: "20%",
    speed: 120,
  },
  {
    text: "I'm gonna make him an offer he can't refuse.",
    film: "The Godfather",
    size: "text-lg md:text-2xl",
    opacity: "text-white/30",
    x: "10%",
    y: "45%",
    speed: 60,
  },
  {
    text: "To infinity and beyond!",
    film: "Toy Story",
    size: "text-2xl md:text-3xl",
    opacity: "text-white/35",
    x: "60%",
    y: "55%",
    speed: 150,
  },
  {
    text: "Life is like a box of chocolates.",
    film: "Forrest Gump",
    size: "text-xl md:text-2xl",
    opacity: "text-white/20",
    x: "30%",
    y: "70%",
    speed: 100,
  },
  {
    text: "Why so serious?",
    film: "The Dark Knight",
    size: "text-3xl md:text-4xl",
    opacity: "text-white/40",
    x: "65%",
    y: "80%",
    speed: 70,
  },
  {
    text: "I'll be back.",
    film: "The Terminator",
    size: "text-xl md:text-2xl",
    opacity: "text-white/25",
    x: "40%",
    y: "30%",
    speed: 130,
  },
  {
    text: "After all, tomorrow is another day.",
    film: "Gone with the Wind",
    size: "text-lg md:text-xl",
    opacity: "text-white/20",
    x: "15%",
    y: "85%",
    speed: 90,
  },
];
