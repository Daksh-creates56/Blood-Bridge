
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
  onSelectCamp: (camp: DonationCamp) => void;
  view: { center: [number, number], zoom: number };
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


export default function CampMapView({ camps, selectedCamp, userLocation, onSelectCamp, view }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    let mapContainer: HTMLDivElement | null = null;
    if (mapRef.current && !mapInstance.current) {
      mapContainer = mapRef.current;
      mapInstance.current = L.map(mapContainer).setView(view.center, view.zoom);

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
    }
    
    if (!mapContainer) mapContainer = mapRef.current;
    if (!mapContainer) return;

    const resizeObserver = new ResizeObserver(() => {
      mapInstance.current?.invalidateSize();
    });
    
    resizeObserver.observe(mapContainer);
    
    return () => {
      if (mapContainer) {
        resizeObserver.unobserve(mapContainer);
      }
    }
  }, []);

  // Handle view changes from parent (pan/zoom)
  useEffect(() => {
    if (mapInstance.current && view && view.center && !isNaN(view.center[0]) && !isNaN(view.center[1])) {
      mapInstance.current.flyTo(view.center, view.zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [view]);

  // Add/update camp markers
  useEffect(() => {
    if (mapInstance.current) {
      // Remove markers for camps that no longer exist
      Object.keys(markersRef.current).forEach(campId => {
        if (!camps.find(c => c.id === campId)) {
          markersRef.current[campId].remove();
          delete markersRef.current[campId];
        }
      });
      
      camps.forEach(camp => {
        if (camp.coordinates && !isNaN(camp.coordinates[0]) && !isNaN(camp.coordinates[1])) {
          if (!markersRef.current[camp.id]) {
            const marker = L.marker(camp.coordinates)
              .addTo(mapInstance.current!)
              .bindPopup(`<b>${camp.name}</b><br/>${camp.location}`);
            marker.on('click', () => onSelectCamp(camp));
            markersRef.current[camp.id] = marker;
          }
        }
      });
    }
  }, [camps, onSelectCamp]);

  // Handle user location marker
  useEffect(() => {
      if(mapInstance.current && userLocation) {
          if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng(userLocation);
          } else {
              userMarkerRef.current = L.marker(userLocation, { icon: userIcon })
                .addTo(mapInstance.current)
                .bindPopup('<b>Your Location</b>')
                .openPopup();
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
          selectedMarker.setIcon(selectedIcon).openPopup();
        }
      }
    }
  }, [selectedCamp]);

  return <div ref={mapRef} className="h-full w-full" />;
}
