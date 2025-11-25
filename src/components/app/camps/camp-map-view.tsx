'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import type { DonationCamp } from '@/lib/types';

interface MapViewProps {
  camp: DonationCamp;
}

export default function CampMapView({ camp }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(camp.coordinates, 16);

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

      L.marker(camp.coordinates)
        .addTo(mapInstance.current)
        .bindPopup(`<b>${camp.name}</b><br/>${camp.location}`)
        .openPopup();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [camp]);

  return <div ref={mapRef} className="h-full w-full" />;
}
