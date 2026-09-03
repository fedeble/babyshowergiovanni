export type InvitationLocation = {
  latitude: number | null;
  longitude: number | null;
  label: string;
};

export type InvitationParents = {
  title: string;
  introduction: string;
  closing: string;
  imageUrl: string;
};

export type InvitationGift = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  totalQuantity: number | null;
  availableQuantity: number | null;
  isAvailable: boolean;
};

export type InvitationEventDetail = {
  label: string;
  value: string | null;
  icon: "calendar" | "clock" | "place" | "address";
};

export const invitationConfig = {
  babyName: "Giovanni",
  title: "Baby Shower",
  welcomeText: "¡Estamos felices de compartir este momento tan especial!",
  coverImage: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/invitation/hero/portada.png`,
  parents: {
    title: "Los papás",
    introduction: "Con mucha ilusión y amor, te invitamos a celebrar la llegada de nuestro bebé.",
    closing: "Tu presencia hará este día aún más inolvidable.",
    imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/invitation/parents/jesus-celeste.png`,
  } satisfies InvitationParents,
  baby: {
    title: "Giovanni",
    introduction: "Muy pronto llegará Giovanni para llenarnos la vida de amor, risas y nuevos sueños.",
    closing: "¡No podemos esperar para conocerlo!",
    imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/invitation/parents/giovanni.png`,
  } satisfies InvitationParents,
  event: {
    title: "¿Cuándo y dónde?",
    details: [
      { label: "Fecha", value: "Sábado 19 de septiembre de 2026", icon: "calendar" },
      { label: "Hora", value: "15:00 hs", icon: "clock" },
      { label: "Lugar", value: "Albert Einstein 7795, esquina San Cayetano\nDel Viso, Pilar, Buenos Aires", icon: "place" },
    ] satisfies InvitationEventDetail[],
    directionsLabel: "Ver en el mapa",
    googleMapsUrl: "https://maps.app.goo.gl/RrcTa6ANHCEikXt49",
    mapImageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/invitation/map/ubicacion.png`,
    location: {
      latitude: -34.44681074662121,
      longitude: -58.802460437204395,
      label: "Albert Einstein 7795, esquina San Cayetano, Del Viso, Pilar, Buenos Aires",
    } satisfies InvitationLocation,
  },
  gifts: {
    sectionLabel: "Un detalle para Giovanni",
    title: "Regalos",
    introduction: "Cada detalle acompaña con cariño la llegada de Giovanni.",
    actionLabel: "Quiero regalarlo",
    reservation: {
      guestNameLabel: "Tu nombre",
      quantityLabel: "Cantidad",
      submitLabel: "Confirmar regalo",
      submittingLabel: "Reservando...",
      successMessage: "¡Gracias! Tu regalo quedó reservado.",
      invalidNameMessage: "Ingresá un nombre de entre 2 y 120 caracteres.",
      invalidQuantityMessage: "Elegí una cantidad disponible válida.",
      stockErrorMessage: "Esa cantidad ya no está disponible.",
      genericErrorMessage: "No pudimos completar la reserva. Intentá nuevamente.",
    },
    items: [
      { id: "diapers", name: "Pañales P, M en adelante", description: "Paquetes para acompañar el crecimiento de Giovanni.", imageUrl: "", totalQuantity: 20, availableQuantity: 20, isAvailable: true },
      { id: "calcareous-oil", name: "Óleo calcario", description: "Unidades para el cuidado diario del bebé.", imageUrl: "", totalQuantity: 7, availableQuantity: 7, isAvailable: true },
      { id: "cotton", name: "Algodón", description: "Paquetes para el cuidado diario del bebé.", imageUrl: "", totalQuantity: 10, availableQuantity: 10, isAvailable: true },
      { id: "wet-wipes", name: "Toallitas húmedas", description: "Paquetes para la higiene diaria del bebé.", imageUrl: "", totalQuantity: 6, availableQuantity: 6, isAvailable: true },
      { id: "newborn-clothes", name: "Ropa recién nacido", description: "Prendas para acompañar los primeros días de Giovanni.", imageUrl: "", totalQuantity: 6, availableQuantity: 6, isAvailable: true },
      { id: "muslin-blankets", name: "Mantitas de muselina o algodón", description: "Mantitas suaves para Giovanni.", imageUrl: "", totalQuantity: 4, availableQuantity: 4, isAvailable: true },
      { id: "towels", name: "Toallas", description: "Toallas para el cuidado del bebé.", imageUrl: "", totalQuantity: 4, availableQuantity: 4, isAvailable: true },
      { id: "bib", name: "Baberos", description: "Baberos para las comidas de Giovanni.", imageUrl: "", totalQuantity: 5, availableQuantity: 5, isAvailable: true },
      { id: "nursing-pillow", name: "Almohadón de lactancia", description: "Un almohadón para acompañar la lactancia.", imageUrl: "", totalQuantity: 1, availableQuantity: 1, isAvailable: true },
      { id: "baby-monitor", name: "Baby call - monitor", description: "Un monitor para acompañar el descanso del bebé.", imageUrl: "", totalQuantity: 1, availableQuantity: 1, isAvailable: true },
      { id: "bottle-warmer", name: "Calienta mamadera", description: "Un equipo para templar la mamadera.", imageUrl: "", totalQuantity: 1, availableQuantity: 1, isAvailable: true },
      { id: "sheets", name: "Sábanas", description: "Sábanas para la cuna de Giovanni.", imageUrl: "", totalQuantity: 4, availableQuantity: 4, isAvailable: true },
      { id: "blankets", name: "Frazadas", description: "Frazadas para mantener abrigado al bebé.", imageUrl: "", totalQuantity: 3, availableQuantity: 3, isAvailable: true },
      { id: "pacifiers", name: "Chupetes", description: "Chupetes para Giovanni.", imageUrl: "", totalQuantity: 4, availableQuantity: 4, isAvailable: true },
      { id: "bottles", name: "Mamaderas", description: "Mamaderas para la alimentación del bebé.", imageUrl: "", totalQuantity: 2, availableQuantity: 2, isAvailable: true },
      { id: "socks", name: "Medias", description: "Medias suaves para Giovanni.", imageUrl: "", totalQuantity: 3, availableQuantity: 3, isAvailable: true },
      { id: "shampoo", name: "Shampoo", description: "Unidades para el baño del bebé.", imageUrl: "", totalQuantity: 3, availableQuantity: 3, isAvailable: true },
      { id: "conditioner", name: "Acondicionador", description: "Unidades para el cuidado del bebé.", imageUrl: "", totalQuantity: 3, availableQuantity: 3, isAvailable: true },
      { id: "liquid-soap", name: "Jabón líquido", description: "Unidades para la higiene de Giovanni.", imageUrl: "", totalQuantity: 3, availableQuantity: 3, isAvailable: true },
      { id: "mittens", name: "Manoplas", description: "Manoplas suaves para el bebé.", imageUrl: "", totalQuantity: 3, availableQuantity: 3, isAvailable: true },
      { id: "baby-oil", name: "Aceite para bebé", description: "Una unidad para el cuidado de la piel.", imageUrl: "", totalQuantity: 1, availableQuantity: 1, isAvailable: true },
      { id: "baby-perfume", name: "Perfume de bebé", description: "Perfumes suaves para Giovanni.", imageUrl: "", totalQuantity: 2, availableQuantity: 2, isAvailable: true },
      { id: "baby-powder", name: "Talco", description: "Talco para el cuidado del bebé.", imageUrl: "", totalQuantity: 2, availableQuantity: 2, isAvailable: true },
      { id: "electric-rocker", name: "Mecedor eléctrico", description: "Un espacio de descanso para Giovanni.", imageUrl: "", totalQuantity: 1, availableQuantity: 1, isAvailable: true },
      { id: "teether", name: "Mordedores", description: "Mordedores para acompañar su crecimiento.", imageUrl: "", totalQuantity: 3, availableQuantity: 3, isAvailable: true },
      { id: "play-gym", name: "Gimnasio", description: "Un gimnasio de juegos para el bebé.", imageUrl: "", totalQuantity: 1, availableQuantity: 1, isAvailable: true },
      { id: "toys", name: "Juguetes", description: "Juguetes para acompañar sus primeros juegos.", imageUrl: "", totalQuantity: 5, availableQuantity: 5, isAvailable: true },
      { id: "maternity-bag", name: "Bolso maternal", description: "Este regalo ya está cubierto.", imageUrl: "", totalQuantity: 1, availableQuantity: 0, isAvailable: false },
      { id: "baby-bath", name: "Bañera", description: "Este regalo ya está cubierto.", imageUrl: "", totalQuantity: 1, availableQuantity: 0, isAvailable: false },
      { id: "stroller", name: "Coche", description: "Este regalo ya está cubierto.", imageUrl: "", totalQuantity: 1, availableQuantity: 0, isAvailable: false },
      { id: "car-seat", name: "Butaca", description: "Este regalo ya está cubierto.", imageUrl: "", totalQuantity: 1, availableQuantity: 0, isAvailable: false },
      { id: "breast-pump", name: "Extractor de leche", description: "Este regalo ya está cubierto.", imageUrl: "", totalQuantity: 1, availableQuantity: 0, isAvailable: false },
    ] satisfies InvitationGift[],
  },
  footer: {
    message: "¡Gracias por acompañarnos!",
    reservationNote: "(Los regalos se reservan al marcarlos)",
    teddyImageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/invitation/footer/teddy.png`,
  },
} as const;