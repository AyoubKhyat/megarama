export interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  source: string;
}

export const reviews: Review[] = [
  {
    name: "Youssef B.",
    rating: 5,
    text: "The IMAX experience here is unmatched. Sound quality and screen size make you feel inside the movie. Best cinema in Morocco!",
    date: "2 days ago",
    source: "Google",
  },
  {
    name: "Fatima Z.",
    rating: 5,
    text: "Took my family for Toy Story 5 — the kids loved it. Clean halls, comfortable seats, and the popcorn is amazing.",
    date: "1 week ago",
    source: "Google",
  },
  {
    name: "Amine K.",
    rating: 4,
    text: "Premium seats are worth the extra cost. Great leg room and the reclining feature is so comfortable for long movies.",
    date: "3 days ago",
    source: "Google",
  },
  {
    name: "Sarah M.",
    rating: 5,
    text: "Booked online and the process was seamless. The 4DX experience for the Mandalorian was incredible — truly immersive!",
    date: "5 days ago",
    source: "Google",
  },
  {
    name: "Karim L.",
    rating: 5,
    text: "My go-to cinema in Marrakech. The atmosphere is premium, staff is friendly, and they always have the latest releases.",
    date: "1 week ago",
    source: "Google",
  },
];
