import { movies, getMovieBySlug } from "@/data/movies";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MovieDetailContent from "./MovieDetailContent";

export async function generateStaticParams() {
  return movies.map((movie) => ({ slug: movie.slug }));
}

const BASE_URL = "https://marrakech.megarama.ma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) return {};

  const url = `${BASE_URL}/movies/${movie.slug}`;

  return {
    title: `${movie.title} | MEGARAMA Marrakech`,
    description: movie.synopsis,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${movie.title} | MEGARAMA Marrakech`,
      description: movie.synopsis,
      url,
      siteName: "Megarama Marrakech",
      images: [
        {
          url: movie.poster,
          width: 800,
          height: 1200,
          alt: movie.title,
        },
      ],
      type: "video.movie",
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} | MEGARAMA Marrakech`,
      description: movie.synopsis,
      images: [movie.poster],
    },
  };
}

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) notFound();
  return <MovieDetailContent movie={movie} />;
}
