"use client";

// Home ecosystem map: Google 3D vector map when configured, otherwise the
// existing dark Leaflet map — so the section always renders something.

import GoogleWTFMap, { hasGoogleMaps } from "./GoogleWTFMap";
import WTFLeafletMap from "@/components/home/WTFLeafletMap";

export default function WTFMapHome() {
  if (hasGoogleMaps()) return <GoogleWTFMap variant="home" />;
  return <WTFLeafletMap />;
}
