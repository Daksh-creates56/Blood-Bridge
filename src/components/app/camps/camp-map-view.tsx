'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import type { DonationCamp } from '@/lib/types';

interface MapViewProps {
  camps: DonationCamp[];
  selectedCamp: DonationCamp | null;
  userLocation?: [number, number] | null;
  panToLocation?: [number, number] | null;
}

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export default function CampMapView({ camps, selectedCamp, userLocation, panToLocation }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
        
      const initialCenter: [number, number] = camps.length > 0 ? camps[0].coordinates : [19.0760, 72.8777]; // Default to Mumbai
      const initialZoom = 12;
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

      // Add camp markers
      camps.forEach(camp => {
          const marker = L.marker(camp.coordinates)
            .addTo(mapInstance.current!)
            .bindPopup(`<b>${camp.name}</b><br/>${camp.location}`);
          markersRef.current[camp.id] = marker;
      });
    }

  }, [camps]); 

  // Handle user location marker
  useEffect(() => {
      if(mapInstance.current && userLocation) {
          if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng(userLocation);
          } else {
              userMarkerRef.current = L.marker(userLocation, { icon: userIcon })
                .addTo(mapInstance.current)
                .bindPopup('<b>Your Location</b>');
          }
      }
  }, [userLocation]);


  // Handle camp selection highlighting
  useEffect(() => {
    if (mapInstance.current) {
      
      // Reset all icons to default
      Object.values(markersRef.current).forEach(marker => marker.setIcon(new L.Icon.Default()));

      // Set selected icon
      if (selectedCamp) {
        const selectedMarker = markersRef.current[selectedCamp.id];
        if (selectedMarker) {
          selectedMarker.setIcon(selectedIcon);
          selectedMarker.openPopup();
        }
      }
    }
  }, [selectedCamp]);

  // Handle panning the map
  useEffect(() => {
    if (mapInstance.current && panToLocation) {
        mapInstance.current.flyTo(panToLocation, 15, {
            animate: true,
            duration: 1.5
        });
    }
  }, [panToLocation])


  return <div ref={mapRef} className="h-full w-full" />;
}
