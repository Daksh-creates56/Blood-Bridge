'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import type { Hospital } from '@/lib/types';

interface MapViewProps {
  hospital: Hospital;
}

export default function MapView({ hospital }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    // Only initialize the map if the ref is available and a map instance doesn't already exist.
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(hospital.coordinates, 16);

      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(mapInstance.current);

      const satelliteLayer = L.tileLayer(
        'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: '&copy; <a href="https://www.google.com/permissions/geoguidelines.html">Google Maps</a>',
        }
      );
      
      const baseMaps = {
        "Street View": streetLayer,
        "Satellite View": satelliteLayer
      };

      L.control.layers(baseMaps).addTo(mapInstance.current);

      L.marker(hospital.coordinates)
        .addTo(mapInstance.current)
        .bindPopup(`<b>${hospital.name}</b><br/>${hospital.address}`)
        .openPopup();
    }

    // Cleanup function: This is crucial.
    // It runs when the component unmounts.
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [hospital]); // Rerun effect if hospital changes

  // The ref is attached to this div, which becomes the map container.
  return <div ref={mapRef} className="h-full w-full" />;
}
