"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import AmbientAudio from "@/components/AmbientAudio";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NowShowing from "@/components/NowShowing";
import BookingSection from "@/components/BookingSection";
import ExperienceSection from "@/components/ExperienceSection";
import StorytellingSection from "@/components/StorytellingSection";
import IMAXSection from "@/components/IMAXSection";
import SnacksSection from "@/components/SnacksSection";
import MovieQuotes from "@/components/MovieQuotes";
import LoyaltyCard from "@/components/LoyaltyCard";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FilmReelTransition from "@/components/FilmReelTransition";
import SocialProof from "@/components/SocialProof";
import SectionDots from "@/components/SectionDots";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <LoadingScreen />
      <CustomCursor />
      <SocialProof />
      <AmbientAudio />
      <div className="film-grain" />
      <Navbar />
      <SectionDots />
      <Scene3D />
      <main>
        <HeroSection />
        <FilmReelTransition position="bottom" />
        <NowShowing />
        <FilmReelTransition position="top" />
        <BookingSection />
        <FilmReelTransition position="bottom" />
        <ExperienceSection />
        <StorytellingSection />
        <FilmReelTransition position="top" />
        <IMAXSection />
        <SnacksSection />
        <MovieQuotes />
        <LoyaltyCard />
        <ContactSection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
