import type { MetadataRoute } from "next";
import { movies } from "@/data/movies";

const BASE_URL = "https://marrakech.megarama.ma";

export default function sitemap(): MetadataRoute.Sitemap {
  const movieEntries = movies.map((movie) => ({
    url: `${BASE_URL}/movies/${movie.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...movieEntries,
  ];
}
