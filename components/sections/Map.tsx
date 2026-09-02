export type MapLocation = {
  latitude: number | null;
  longitude: number | null;
  label: string;
};

type MapProps = {
  location: MapLocation;
};

export default function Map({ location }: MapProps) {
  const { latitude, longitude, label } = location;
  const hasCoordinates = latitude !== null && longitude !== null;

  if (!hasCoordinates) {
    return (
      <div className="event-map-frame event-map-pending" role="status">
        <span className="event-map-pending-mark" aria-hidden="true" />
        <span>{label}</span>
      </div>
    );
  }

  const offset = 0.025;
  const bbox = [
    longitude - offset,
    latitude - offset,
    longitude + offset,
    latitude + offset,
  ].join(",");
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="event-map-frame">
      <iframe
        className="event-map"
        src={mapUrl}
        title={`Mapa de ${label}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}