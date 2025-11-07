'use client';

import React, { useEffect, useRef } from 'react';

interface MapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
  }>;
}

export const Map: React.FC<MapProps> = ({
  lat = 40,
  lng = -95,
  zoom = 4,
  className = '',
  markers = [],
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder implementation
    // In a real app, you would integrate with Leaflet, Mapbox, Google Maps, etc.
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; text-align: center;">
          <div>
            <p style="font-size: 24px; margin: 0 0 10px 0;">🗺️</p>
            <p style="margin: 0; font-weight: 600;">Map Component</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">
              Latitude: ${lat}, Longitude: ${lng}<br/>
              Zoom: ${zoom}
            </p>
            ${
              markers.length > 0
                ? `<p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">Markers: ${markers.length}</p>`
                : ''
            }
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
              Integrate with Leaflet, Mapbox, or Google Maps API
            </p>
          </div>
        </div>
      `;
    }
  }, [lat, lng, zoom, markers]);

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};
