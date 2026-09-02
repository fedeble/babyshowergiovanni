import Hero from "@/components/sections/Hero";
import Parents from "@/components/sections/Parents";
import Event from "@/components/sections/Event";
import GiftList from "@/components/gifts/GiftList";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Hero />

      <Parents />

      <Event />

      <GiftList />

      <Footer />
    </main>
  );
}
