// components/Map.tsx
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

type MapProps = {
  lat: number;
  lng: number;
};

const containerStyle = {
  width: '100%',
  height: '300px',
};

export default function MapComponent({ lat, lng }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDecGIJGYIy9FVZvCLqFrTWnZVu_TIzX54',
  });

  if (!isLoaded) return <p>Se încarcă harta...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat, lng }}
      zoom={15}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
}
