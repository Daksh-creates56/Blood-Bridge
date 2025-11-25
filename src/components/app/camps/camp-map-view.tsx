'use client';

import * as React from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import { Skeleton } from '@/components/ui/skeleton';
import type { DonationCamp, Coordinates } from '@/lib/types';
import { cn } from '@/lib/utils';

// Custom Icons
const createIcon = (color: 'blue' | 'red') => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const blueIcon = createIcon('blue');
const redIcon = createIcon('red');

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/intern-gee/leaflet-plugin-person-marker/master/dist/person.png',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
    className: 'user-location-marker'
});

interface CampMapViewProps {
  camps: DonationCamp[];
  view: { center: Coordinates; zoom: number };
  userLocation: Coordinates | null;
  selectedCamp: DonationCamp | null;
  onSelectCamp: (camp: DonationCamp) => void;
}

export function CampMapView({ camps, view, userLocation, selectedCamp, onSelectCamp }: CampMapViewProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstance = React.useRef<L.Map | null>(null);
  const markersRef = React.useRef<L.Marker[]>([]);
  const userMarkerRef = React.useRef<L.Marker | null>(null);

  // Initialize map
  React.useEffect(() => {
    let observer: ResizeObserver;
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: view.center,
        zoom: view.zoom,
      });

      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

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

      // Invalidate size on container resize
      const mapContainer = mapRef.current;
      observer = new ResizeObserver(() => {
        mapInstance.current?.invalidateSize();
      });
      observer.observe(mapContainer);
    }
    
    return () => {
        if (mapRef.current && observer) {
            observer.unobserve(mapRef.current);
        }
    };
  }, []);

  // Update view (pan/zoom)
  React.useEffect(() => {
    if (mapInstance.current && view && 
        !isNaN(view.center[0]) && !isNaN(view.center[1])) {
      mapInstance.current.flyTo(view.center, view.zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [view]);

  // Update camp markers
  React.useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    camps.forEach(camp => {
      const isSelected = selectedCamp?.id === camp.id;
      const marker = L.marker(camp.coordinates, { icon: isSelected ? redIcon : blueIcon })
        .addTo(mapInstance.current!)
        .bindPopup(`<b>${camp.name}</b><br/>${camp.address}`)
        .on('click', () => {
          onSelectCamp(camp);
        });
      
      if (isSelected) {
        marker.openPopup();
      }

      markersRef.current.push(marker);
    });
  }, [camps, selectedCamp, onSelectCamp]);

  // Update user location marker
  React.useEffect(() => {
    if (!mapInstance.current) return;

    if (userLocation) {
      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker(userLocation, { icon: userIcon, zIndexOffset: 1000 })
          .addTo(mapInstance.current)
          .bindPopup('Your Location');
      } else {
        userMarkerRef.current.setLatLng(userLocation);
      }
    } else {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
    }
  }, [userLocation]);


  return <div ref={mapRef} className="h-full w-full" />;
}
