import L from "leaflet";
import { useMap } from "react-leaflet";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export function ReverseGeocoding({ location }) {
  const [locationName, setLocationName] = useState("");
  const actualMap = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    // Fetch the initial location name when the component mounts
    const fetchInitialLocationName = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location[0]}&lon=${location[1]}`
        );

        const initialLocationName = response.data.display_name;
        setLocationName(initialLocationName);

        // Initialize the marker if it doesn't exist
        if (!markerRef.current) {
          const initialMarker = L.marker(location, { draggable: true }).addTo(
            actualMap
          );
          markerRef.current = initialMarker;
          initialMarker.on("dragend", handleMarkerDragEnd);
          initialMarker
            .bindPopup(`Location: ${initialLocationName}`)
            .openPopup();
        }
      } catch (error) {
        console.error("Error fetching location data", error);
      }
    };

    fetchInitialLocationName();
  }, [actualMap, location]);

  const handleMarkerDragEnd = async (e) => {
    const newLatLng = e.target.getLatLng();
    const { lat, lng } = newLatLng;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      const newLocationName = response.data.display_name;

      if (markerRef.current) {
        const marker = markerRef.current;

        marker.setLatLng([lat, lng]);
        const popupMessage = `Location: ${newLocationName}`;
        marker.bindPopup(popupMessage).openPopup();
      } else {
        const marker = L.marker([lat, lng]).addTo(actualMap);
        const popupMessage = `Location: ${newLocationName}`;
        marker.bindPopup(popupMessage).openPopup();
        markerRef.current = marker;
      }
    } catch (error) {
      console.error("Error fetching location data", error);
    }
  };

  return null;
}
