"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import AmbientAudio from "@/components/AmbientAudio";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";

import HeroSection from "@/components/HeroSection";
import NowShowing from "@/components/NowShowing";
import FilmReelTransition from "@/components/FilmReelTransition";
import SocialProof from "@/components/SocialProof";
import SectionDots from "@/components/SectionDots";
import LazySection from "@/components/LazySection";
import MobileBottomNav from "@/components/MobileBottomNav";
import LiveStats from "@/components/LiveStats";
import useIsDesktop from "@/hooks/useIsDesktop";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });
const BookingSection = dynamic(() => import("@/components/BookingSection"));
const ComingSoon = dynamic(() => import("@/components/ComingSoon"));
const Reviews = dynamic(() => import("@/components/Reviews"));
const ExperienceSection = dynamic(() => import("@/components/ExperienceSection"));
const StorytellingSection = dynamic(() => import("@/components/StorytellingSection"));
const IMAXSection = dynamic(() => import("@/components/IMAXSection"));
const SnacksSection = dynamic(() => import("@/components/SnacksSection"));
const MovieQuotes = dynamic(() => import("@/components/MovieQuotes"));
const LoyaltyCard = dynamic(() => import("@/components/LoyaltyCard"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  const isDesktop = useIsDesktop();

  return (
      <SmoothScroll>
        <LoadingScreen />
        <CustomCursor />
        <SocialProof />
        <AmbientAudio />
        <div className="film-grain" />

        <Navbar />
        <MobileBottomNav />
        <SectionDots />
        {isDesktop && <Scene3D />}
        <main>
          <HeroSection />
          <FilmReelTransition position="bottom" />
          <NowShowing />
          <LiveStats />
          <FilmReelTransition position="top" />
          <BookingSection />
          <FilmReelTransition position="bottom" />
          <LazySection rootMargin="300px">
            <ComingSoon />
          </LazySection>
          <LazySection rootMargin="300px">
            <ExperienceSection />
          </LazySection>
          <LazySection rootMargin="300px">
            <StorytellingSection />
          </LazySection>
          <FilmReelTransition position="top" />
          <LazySection rootMargin="300px">
            <IMAXSection />
          </LazySection>
          <LazySection rootMargin="200px">
            <SnacksSection />
          </LazySection>
          <LazySection rootMargin="200px">
            <MovieQuotes />
          </LazySection>
          <LazySection rootMargin="200px">
            <Reviews />
          </LazySection>
          <LazySection rootMargin="200px">
            <LoyaltyCard />
          </LazySection>
          <LazySection rootMargin="200px">
            <ContactSection />
          </LazySection>
        </main>
        <LazySection rootMargin="100px">
          <Footer />
        </LazySection>
      </SmoothScroll>
  );
}
