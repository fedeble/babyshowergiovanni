export type InvitationLocation = {
  latitude: number | null;
  longitude: number | null;
  label: string;
};

export type InvitationParent = {
  name: string | null;
  role: string;
  description: string | null;
  imageUrl: string;
  imageClass: "parent-photo-mom" | "parent-photo-dad";
};

export type InvitationGift = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  totalQuantity: number | null;
  availableQuantity: number | null;
};

export type InvitationEventDetail = {
  label: string;
  value: string | null;
  icon: "calendar" | "clock" | "place" | "address";
};

export const invitationConfig = {
  babyName: "Giovanni",
  title: "Baby Shower",
  welcomeText: "Una celebración especial para dar la bienvenida a Giovanni.",
  coverImage: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1800&q=85", // Imagen temática temporal; reemplazar por la portada definitiva.
  parents: [
    {
      name: null, // PENDIENTE: nombre definitivo de mamá.
      role: "Mamá",
      description: null, // PENDIENTE: texto de presentación de mamá.
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85", // Fotografía temporal; reemplazar por la definitiva.
      imageClass: "parent-photo-mom",
    },
    {
      name: null, // PENDIENTE: nombre definitivo de papá.
      role: "Papá",
      description: null, // PENDIENTE: texto de presentación de papá.
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85", // Fotografía temporal; reemplazar por la definitiva.
      imageClass: "parent-photo-dad",
    },
  ] satisfies InvitationParent[],
  parentsSectionLabel: "Con mucho amor",
  event: {
    sectionLabel: "Un día para celebrar",
    title: "El evento",
    details: [
      { label: "Fecha", value: null, icon: "calendar" }, // PENDIENTE: fecha definitiva.
      { label: "Hora", value: null, icon: "clock" }, // PENDIENTE: hora definitiva.
      { label: "Lugar", value: null, icon: "place" }, // PENDIENTE: nombre definitivo del lugar.
      { label: "Dirección", value: null, icon: "address" }, // PENDIENTE: dirección definitiva.
    ] satisfies InvitationEventDetail[],
    directionsLabel: "Cómo llegar",
    location: {
      latitude: null, // PENDIENTE: latitud real del evento.
      longitude: null, // PENDIENTE: longitud real del evento.
      label: "Ubicación del evento",
    } satisfies InvitationLocation,
  },
  gifts: {
    sectionLabel: "Un detalle para Giovanni",
    title: "Regalos",
    introduction: "Cada detalle acompaña con cariño la llegada de Giovanni.",
    actionLabel: "Quiero regalarlo",
    items: [
    {
      id: "gift-blanket",
      name: "Manta de bebé",
      description: "Una manta suave para acompañar los primeros días de Giovanni.",
      imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=85",
      totalQuantity: 2,
      availableQuantity: 2,
    },
    {
      id: "gift-bottle",
      name: "Set de biberones",
      description: "Un set práctico para las rutinas de alimentación del bebé.",
      imageUrl: "https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?auto=format&fit=crop&w=900&q=85",
      totalQuantity: 3,
      availableQuantity: 1,
    },
    {
      id: "gift-basket",
      name: "Canasta de cuidados",
      description: "Detalles esenciales para el cuidado diario de Giovanni.",
      imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=85",
      totalQuantity: 1,
      availableQuantity: 0,
    },
    ] satisfies InvitationGift[],
  },
  footer: {
    message: "Gracias por acompañarnos",
    name: "Giovanni",
  },
} as const;