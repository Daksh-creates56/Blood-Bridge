'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import type { DonationCamp } from '@/lib/types';

interface MapViewProps {
  camp: DonationCamp;
  userLocation?: [number, number] | null;
}

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'leaflet-marker-user'
});

export default function CampMapView({ camp, userLocation }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
        
      const initialCenter = userLocation || camp.coordinates;
      const initialZoom = userLocation ? 13 : 16;
      mapInstance.current = L.map(mapRef.current).setView(initialCenter, initialZoom);

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

      // Add camp marker
      L.marker(camp.coordinates)
        .addTo(mapInstance.current)
        .bindPopup(`<b>${camp.name}</b><br/>${camp.location}`)
        .openPopup();
        
      // Add user location marker if available
      if (userLocation) {
        L.marker(userLocation).addTo(mapInstance.current)
          .bindPopup('<b>Your Location</b>');

        // Create a dotted line between user and camp
        const latlngs = [userLocation, camp.coordinates];
        L.polyline(latlngs, {color: 'hsl(var(--primary))', dashArray: '5, 10'}).addTo(mapInstance.current);

        // Adjust map bounds to show both markers
        mapInstance.current.fitBounds(L.latLngBounds(userLocation, camp.coordinates), { padding: [50, 50] });
      }

    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [camp, userLocation]);

  return <div ref={mapRef} className="h-full w-full" />;
}
