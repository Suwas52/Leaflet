import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import Leaflet from "leaflet";
import axios from "axios";
import { useEffect, useRef } from "react";

var myIcon = Leaflet.icon({
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowUrl: "my-icon-shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
});

export default function Geocoding() {
  const map = useMap();
  const markerRef = useRef();

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
      }
    } catch (error) {
      console.error("Error fetching location data", error);
    }
  };

  useEffect(() => {
    var geocoder = Leaflet.Control.Geocoder.nominatim(); // convert address to latitude and longitude

    if (typeof URLSearchParams !== "undefined" && location.search) {
      var params = new URLSearchParams(location.search);
      var geocoderString = params.get("geocoder");
      console.log(geocoderString);

      if (geocoderString && Leaflet.Control.Geocoder[geocoderString]) {
        geocoder = Leaflet.Control.Geocoder[geocoderString]();
      } else if (geocoderString) {
        console.warn("Unsupported geocoder", geocoderString);
      }
    }

    Leaflet.Control.geocoder({
      query: "",
      placeholder: "Search here...",
      defaultMarkGeocode: false,
      geocoder,
    })
      .on("markgeocode", function (e) {
        var latlng = e.geocode.center;
        markerRef.current = Leaflet.marker(latlng, { myIcon, draggable: true })
          .on("dragend", handleMarkerDragEnd)
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();
        map.fitBounds(e.geocode.bbox);
      })
      .addTo(map);
  }, []);

  return null;
}
