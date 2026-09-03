import "server-only";

import {
  invitationConfig,
  type InvitationEventDetail,
  type InvitationGift,
  type InvitationLocation,
} from "@/lib/invitation-config";
import { hasSupabaseConfig } from "./config";
import { createServerSupabaseClient } from "./server";

type EventRow = {
  id: string;
  event_date: string | null;
  event_time: string | null;
  venue: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

type GiftRow = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  quantity: number;
  reserved_quantity: number;
};

export type EventData = {
  details: readonly InvitationEventDetail[];
  location: InvitationLocation;
};

export type InvitationData = {
  event: EventData;
  eventId: string | null;
  gifts: readonly InvitationGift[];
};

const fallbackData: InvitationData = {
  event: {
    details: invitationConfig.event.details,
    location: invitationConfig.event.location,
  },
  eventId: null,
  gifts: invitationConfig.gifts.items,
};

function mapEvent(event: EventRow): EventData {
  const values = {
    calendar: event.event_date,
    clock: event.event_time?.slice(0, 5) ?? null,
    place: event.venue,
    address: event.address,
  };

  return {
    details: invitationConfig.event.details.map((detail) => ({
      ...detail,
      value: values[detail.icon],
    })),
    location: {
      ...invitationConfig.event.location,
      latitude: event.latitude,
      longitude: event.longitude,
    },
  };
}

function mapGifts(gifts: GiftRow[]): InvitationGift[] {
  return gifts.map((gift, index) => ({
    id: gift.id,
    name: gift.name,
    description: gift.description ?? "",
    imageUrl:
      gift.image ??
      invitationConfig.gifts.items[index]?.imageUrl ??
      invitationConfig.gifts.items[0].imageUrl,
    totalQuantity: gift.quantity,
    availableQuantity: Math.max(0, gift.quantity - gift.reserved_quantity),
  }));
}

export async function getInvitationData(): Promise<InvitationData> {
  if (!hasSupabaseConfig()) {
    return fallbackData;
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data: events, error: eventError } = await supabase
      .from("events")
      .select("id,event_date,event_time,venue,address,latitude,longitude")
      .limit(1)
      .returns<EventRow[]>();
    const event = events?.[0];

    if (eventError || !event) {
      return fallbackData;
    }

    const { data: gifts, error: giftsError } = await supabase
      .from("gifts")
      .select("id,name,description,image,quantity,reserved_quantity")
      .eq("event_id", event.id)
      .returns<GiftRow[]>();

    const hasGifts = !giftsError && Boolean(gifts?.length);

    return {
      event: mapEvent(event),
      eventId: hasGifts ? event.id : null,
      gifts: hasGifts ? mapGifts(gifts) : fallbackData.gifts,
    };
  } catch {
    return fallbackData;
  }
}