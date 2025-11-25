'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import type { Hospital } from '@/lib/types';

interface MapViewProps {
  hospital: Hospital;
  isOpen: boolean;
}

export default function MapView({ hospital, isOpen }: MapViewProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <MapContainer center={hospital.coordinates} zoom={16} scrollWheelZoom={false} className="h-full w-full">
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Street View">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite View">
          <TileLayer
            attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines.html">Google Maps</a>'
            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            maxZoom={20}
            subdomains={['mt0','mt1','mt2','mt3']}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <Marker position={hospital.coordinates}>
        <Popup>
          <b>{hospital.name}</b><br/>{hospital.address}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
