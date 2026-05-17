export interface Snack {
  name: string;
  description: string;
  price: string;
  emoji: string;
  size: string;
}

export const snacks: Snack[] = [
  {
    name: "Mega Popcorn",
    description: "Freshly popped, buttery perfection in every bucket.",
    price: "35 MAD",
    emoji: "🍿",
    size: "Large Bucket",
  },
  {
    name: "Cinema Combo",
    description: "Large popcorn + drink + candy. The ultimate combo.",
    price: "65 MAD",
    emoji: "🎬",
    size: "Full Combo",
  },
  {
    name: "Ice Cold Drinks",
    description: "Refreshing beverages from classic cola to fresh juice.",
    price: "25 MAD",
    emoji: "🥤",
    size: "500ml",
  },
  {
    name: "Nachos Supreme",
    description: "Crispy nachos with warm cheese sauce and jalapeños.",
    price: "40 MAD",
    emoji: "🧀",
    size: "Sharing Size",
  },
  {
    name: "Candy Selection",
    description: "Premium imported chocolates and gummy treats.",
    price: "20 MAD",
    emoji: "🍫",
    size: "Premium Pack",
  },
  {
    name: "Hot Dog Deluxe",
    description: "All-beef hot dog with your choice of toppings.",
    price: "45 MAD",
    emoji: "🌭",
    size: "King Size",
  },
];
