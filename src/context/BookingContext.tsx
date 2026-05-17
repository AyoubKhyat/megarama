"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface MovieSelection {
  title: string;
  poster: string;
  showtime: string | null;
}

interface BookingContextValue {
  selectedMovie: MovieSelection | null;
  selectMovie: (movie: MovieSelection) => void;
  clearMovie: () => void;
}

const BookingContext = createContext<BookingContextValue>({
  selectedMovie: null,
  selectMovie: () => {},
  clearMovie: () => {},
});

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedMovie, setSelectedMovie] = useState<MovieSelection | null>(null);

  const selectMovie = useCallback((movie: MovieSelection) => {
    setSelectedMovie(movie);
    setTimeout(() => {
      const el = document.getElementById("booking");
      if (!el) return;
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -80 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  }, []);

  const clearMovie = useCallback(() => setSelectedMovie(null), []);

  return (
    <BookingContext.Provider value={{ selectedMovie, selectMovie, clearMovie }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
