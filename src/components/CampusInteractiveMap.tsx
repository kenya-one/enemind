import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { KenyanInstitution } from '../services/campusesKenya';

interface CampusMapProps {
  campuses: KenyanInstitution[];
  selectedCampus: KenyanInstitution | null;
  onSelectCampus: (campus: KenyanInstitution) => void;
}

export const CampusInteractiveMap: React.FC<CampusMapProps> = ({
  campuses,
  selectedCampus,
  onSelectCampus
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on Kenya with interactive zoom
      const map = L.map(mapContainerRef.current, {
        center: [0.0236, 37.9062],
        zoom: 7,
        scrollWheelZoom: true,
        attributionControl: false
      });

      // Modern clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright' })
        .addAttribution('© OpenStreetMap contributors | Enemind Kenya Campus Network')
        .addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup handled on component unmount
    };
  }, []);

  // Update markers whenever campuses change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    campuses.forEach((campus) => {
      const isSelected = selectedCampus?.id === campus.id;

      // Custom SVG marker pin
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-8 h-8 rounded-full ${isSelected ? 'bg-amber-500 ring-4 ring-amber-200 scale-125' : 'bg-slate-900 hover:bg-emerald-600'} text-white flex items-center justify-center shadow-lg transition-all transform duration-200">
            <span class="text-[10px] font-black">${campus.type === 'Medical Training' ? '🏥' : campus.type === 'National Poly' ? '⚙️' : '🎓'}</span>
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none ${isSelected ? 'opacity-100 ring-1 ring-amber-400' : 'opacity-0 group-hover:opacity-100'} transition-opacity">
            ${campus.shortName}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-campus-pin',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([campus.coordinates.lat, campus.coordinates.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectCampus(campus);
      });

      markersLayerRef.current?.addLayer(marker);
    });

    if (selectedCampus && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedCampus.coordinates.lat, selectedCampus.coordinates.lng],
        13,
        { duration: 1.2 }
      );
    }
  }, [campuses, selectedCampus, onSelectCampus]);

  return (
    <div className="relative w-full h-[420px] md:h-[480px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Floating Map Legend */}
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-md border border-slate-200/80 text-[11px] z-[500] flex flex-col gap-1">
        <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Kenyan Higher Education Network
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>🎓 Universities</span>
          <span>⚙️ National Polytechnics</span>
          <span>🏥 KMTC</span>
        </div>
      </div>

      {/* Recenter button */}
      <button
        id="btn-recenter-map"
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([0.0236, 37.9062], 7, { duration: 1 });
          }
        }}
        className="absolute bottom-3 left-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md z-[500] flex items-center gap-1.5 transition-colors"
      >
        🇰🇪 Reset Kenya View
      </button>
    </div>
  );
};
