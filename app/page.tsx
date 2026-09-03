import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import Parents from "@/components/sections/Parents";
import Event from "@/components/sections/Event";
import GiftList from "@/components/gifts/GiftList";
import Footer from "@/components/layout/Footer";
import { getInvitationData } from "@/lib/supabase/invitation-data";

export const dynamic = "force-dynamic";

async function SupabaseInvitationSections() {
  const { event, eventId, gifts } = await getInvitationData();

  return (
    <>
      <Event data={event} />
      <GiftList eventId={eventId} gifts={gifts} />
    </>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />

      <Parents />

      <Suspense fallback={<><Event /><GiftList /></>}>
        <SupabaseInvitationSections />
      </Suspense>

      <Footer />
    </main>
  );
}
