export type MapLocation = {
  label: string;
};

type MapProps = {
  location: MapLocation;
  imageUrl: string;
};

export default function Map({ location, imageUrl }: MapProps) {
  if (!imageUrl) {
    return (
      <div className="event-map-frame event-map-pending" role="status">
        <span className="event-map-pending-mark" aria-hidden="true" />
        <span>Mapa próximamente</span>
      </div>
    );
  }

  return (
    <div className="event-map-frame">
      {/* eslint-disable-next-line @next/next/no-img-element -- Static map is served directly from the configured public Storage URL. */}
      <img
        className="event-map"
        src={imageUrl}
        alt={`Mapa de ${location.label}`}
        loading="lazy"
      />
    </div>
  );
}