"use client";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect, useState } from "react";

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

function PropertyMap({ property }) {
  const [mapPosition, setMapPosition] = useState([20.5937, 78.9629]);
  const [locationAvailable, setLocationAvailable] = useState(true);

  useEffect(() => {
    async function fetchCoords() {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({
        query: `${property.location.city} ${property.location.state} ${property.location.pincode}`,
      });

      if (results.length === 0) {
        setLocationAvailable(false);
        return;
      }

      const position = [results[0].y, results[0].x];
      setMapPosition(position);
    }

    fetchCoords();
  }, [property]);

  return (
    <>
      {locationAvailable ? (
        <div className="w-full h-[400px]">
          <MapContainer
            className="h-full"
            center={mapPosition}
            zoom={14}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapPosition}>
              <Popup>{property.name}</Popup>
            </Marker>
            <RecenterAutomatically lat={mapPosition[0]} lng={mapPosition[1]} />
          </MapContainer>
        </div>
      ) : (
        <p>No Location Data Found </p>
      )}
    </>
  );
}

export default PropertyMap;
