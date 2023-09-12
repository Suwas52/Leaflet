import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
  Circle,
  CircleMarker,
  Polyline,
  Polygon,
  Rectangle,
} from "react-leaflet";
import "./App.scss";
import "leaflet/dist/leaflet.css";
import Geocoding from "./container/Geocoding";
import Loading from "./container/Loading";

import { ReverseGeocoding } from "./container/ReverseGeocoding";
import LocationMarker from "./container/MyLocation";

const center = [27.708260931852365, 85.32010648576642];

const polygon1 = [
  [27.70484531193418, 85.32868275550481],
  [27.70845068538837, 85.33629153638896],
  [27.703611867348258, 85.33854202087576],
  [27.70465555213579, 85.32868275550481],
];

const polygon = [
  [27.720309626125598, 85.30682090580018],
  [27.70920969648762, 85.30767823322407],
  [27.71082257692092, 85.3198951490096],
  [27.72325044379781, 85.3062850761612],
  [27.720309626125598, 85.30671373987241],
];

const polyline1 = [
  [27.708450685386595, 85.32311012725205],
  [27.716989252487068, 85.3465794654731],
];

const polyline = [
  [27.70845068567887, 85.32150263792971],
  [27.708640438876543, 85.33629153598696],
];

const polyline2 = [
  [27.70845068567887, 85.33629153598696],
  [27.715376463532834, 85.3456149717174],
];

const rectangle = [
  [
    [27.695167141785618, 85.3301830780934],
    [27.690043057048896, 85.3301830780934],
    [27.690043057048896, 85.34486481022293],
    [27.695167141785618, 85.34486481022293],
    [27.695167141785618, 85.3301830780934],
  ],
];

const fillBlueOptions = { fillColor: "blue" };
const blackOptions = { color: "black" };
const limeOptions = { color: "lime" };
const purpleOptions = { color: "purple" };
const redOptions = { color: "red" };

const position = [center];

function Map() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markerPosition, setMarkerPosition] = useState(center);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        setLocation([
          geoPosition.coords.latitude,
          geoPosition.coords.longitude,
        ]);
        setMarkerPosition([
          geoPosition.coords.latitude,
          geoPosition.coords.longitude,
        ]);
        setLoading(false);
      },
      (geoError) => {
        setError(geoError.message);
        setLocation(position);
        setLoading(false);
      }
    );
  }, []);
  console.log(markerPosition);
  return loading ? (
    <Loading />
  ) : (
    <>
      <div className="map-container">
        <h1>GIS using React Leaflet</h1>
        <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Circle center={center} pathOptions={fillBlueOptions} radius={300} />

          {/* <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker> */}

          <CircleMarker
            center={[27.716989252487068, 85.3465794654731]}
            pathOptions={redOptions}
            radius={20}
          >
            <Popup>Popup in CircleMarker</Popup>
          </CircleMarker>

          <Polyline pathOptions={limeOptions} positions={polyline1} />
          <Polyline pathOptions={purpleOptions} positions={polyline} />
          <Polyline pathOptions={blackOptions} positions={polyline2} />

          <Polygon pathOptions={redOptions} positions={polygon} />
          <Polygon pathOptions={purpleOptions} positions={polygon1} />

          <ReverseGeocoding location={markerPosition} />
          <LocationMarker />

          <Polygon pathOptions={fillBlueOptions} positions={rectangle} />

          <ScaleControl imperial={false} />
          <Geocoding />
        </MapContainer>
      </div>
    </>
  );
}

export default Map;
