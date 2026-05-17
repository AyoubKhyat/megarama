import { movies, getMovieBySlug } from "@/data/movies";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MovieDetailContent from "./MovieDetailContent";

export async function generateStaticParams() {
  return movies.map((movie) => ({ slug: movie.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) return {};
  return {
    title: `${movie.title} | MEGARAMA Marrakech`,
    description: movie.synopsis,
  };
}

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) notFound();
  return <MovieDetailContent movie={movie} />;
}
