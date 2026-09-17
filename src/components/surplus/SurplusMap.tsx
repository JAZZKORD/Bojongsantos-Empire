'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ArrowRight, X, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';
import { MAP_CONFIG } from '@/lib/constants';
import { formatPrice, formatCountdown } from '@/lib/utils';
import { FOOD_CATEGORY_EMOJI, FOOD_CATEGORY_LABELS } from '@/types';
import type { SurplusItem, Coordinates, FoodCategory } from '@/types';

// Category Pin Colors
const CATEGORY_COLORS: Record<string, string> = {
  nasi: '#ea580c', // Warm Amber/Orange
  roti: '#b45309', // Caramel Brown
  sayur: '#16a34a', // Fresh Green
  buah: '#dc2626', // Vibrant Red
  minuman: '#0284c7', // Sky Blue
  kue: '#d97706',
  lauk: '#e11d48',
  all: '#1d1d1f',
};

// Create High-End Interactive Leaflet Marker
function createInteractivePin(item: SurplusItem, isSelected: boolean) {
  const color = CATEGORY_COLORS[item.foodCategory] || '#1d1d1f';
  const emoji = FOOD_CATEGORY_EMOJI[item.foodCategory] || '🍽️';
  const priceTag = item.isFree ? 'GRATIS' : formatPrice(item.price);

  return L.divIcon({
    className: 'interactive-surplus-pin',
    html: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
        cursor: pointer;
        z-index: ${isSelected ? 9999 : 100};
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      ">
        <!-- Floating Price Pill on Top -->
        <div style="
          background-color: ${item.isFree ? '#16a34a' : '#1d1d1f'};
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 2px 7px;
          border-radius: 999px;
          margin-bottom: 2px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.4);
        ">
          ${priceTag}
        </div>

        <!-- Pin Head Circle with Category Icon -->
        <div style="
          width: ${isSelected ? '44px' : '36px'};
          height: ${isSelected ? '44px' : '36px'};
          background-color: ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.35)${isSelected ? `, 0 0 0 4px rgba(0, 0, 0, 0.3)` : ''};
          transition: all 0.2s ease-out;
        ">
          <span style="font-size: ${isSelected ? '20px' : '17px'}; line-height: 1;">${emoji}</span>
        </div>

        <!-- Pin Point Tip -->
        <div style="
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid ${color};
          margin-top: -1px;
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function userLocationIcon() {
  return L.divIcon({
    className: 'user-location-pin',
    html: `
      <div style="
        position: relative;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 32px;
          height: 32px;
          background-color: rgba(0, 0, 0, 0.25);
          border-radius: 50%;
          position: absolute;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 16px;
          height: 16px;
          background-color: #1d1d1f;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
          z-index: 10;
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// Controller to auto-frame matching category items and fly to selected items
function MapController({
  items,
  center,
  focusedItem,
}: {
  items: SurplusItem[];
  center: Coordinates;
  focusedItem: SurplusItem | null;
}) {
  const map = useMap();
  const prevItemsLength = useRef<number>(items.length);

  // When focused item changes, smoothly fly to it
  useEffect(() => {
    if (focusedItem) {
      map.flyTo([focusedItem.location.lat, focusedItem.location.lng], 15.5, {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }, [focusedItem, map]);

  // When category items change, fit bounds to include nearest items
  useEffect(() => {
    if (items.length > 0) {
      const points: [number, number][] = [
        [center.lat, center.lng],
        ...items.map((i): [number, number] => [i.location.lat, i.location.lng]),
      ];
      const bounds = L.latLngBounds(points);
      map.flyToBounds(bounds.pad(0.25), {
        maxZoom: 15,
        duration: 0.9,
      });
    } else {
      map.flyTo([center.lat, center.lng], 14, { duration: 0.6 });
    }
    prevItemsLength.current = items.length;
  }, [items, center.lat, center.lng, map]);

  return null;
}

interface SurplusMapProps {
  items: SurplusItem[];
  center: Coordinates;
  onItemClick: (item: SurplusItem) => void;
  selectedCategory?: string;
}

export default function SurplusMap({
  items,
  center,
  onItemClick,
  selectedCategory = 'all',
}: SurplusMapProps) {
  const [activeItem, setActiveItem] = useState<SurplusItem | null>(null);

  // Auto-select first item when items change
  useEffect(() => {
    if (items.length > 0) {
      setActiveItem(items[0]);
    } else {
      setActiveItem(null);
    }
  }, [items]);

  const handleMarkerClick = (item: SurplusItem) => {
    setActiveItem(item);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Leaflet Map Container */}
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={MAP_CONFIG.defaultZoom}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          url={MAP_CONFIG.tileUrl}
          attribution={MAP_CONFIG.attribution}
        />

        <MapController
          items={items}
          center={center}
          focusedItem={activeItem}
        />

        {/* User Current Location Marker */}
        <Marker position={[center.lat, center.lng]} icon={userLocationIcon()} />

        {/* Dynamic Category Surplus Markers */}
        {items.map((item) => {
          const isSelected = activeItem?.id === item.id;
          return (
            <Marker
              key={item.id}
              position={[item.location.lat, item.location.lng]}
              icon={createInteractivePin(item, isSelected)}
              eventHandlers={{
                click: () => handleMarkerClick(item),
              }}
            />
          );
        })}
      </MapContainer>

      {/* TOP FLOATING CATEGORY BADGE */}
      <div className="absolute top-4 left-4 z-[999] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] shadow-md flex items-center gap-2 text-xs font-semibold text-[#1d1d1f]">
          <span className="w-2 h-2 rounded-full bg-[#1d1d1f] animate-pulse" />
          <span>
            {items.length} Lokasi {selectedCategory === 'all' ? 'Surplus' : FOOD_CATEGORY_LABELS[selectedCategory as FoodCategory] || selectedCategory} di Sekitar Anda
          </span>
        </div>
      </div>

      {/* BOTTOM FLOATING CARD: Selected Item Detail */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[999] bg-white/95 backdrop-blur-md rounded-[16px] border border-[rgba(0,0,0,0.12)] p-5 shadow-2xl"
          >
            {/* Header with Close Button */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    activeItem.isFree
                      ? 'bg-[#34c759]/15 text-[#1b8a36]'
                      : 'bg-[#1d1d1f] text-white'
                  }`}
                >
                  {activeItem.isFree ? 'GRATIS' : formatPrice(activeItem.price)}
                </span>
                <span className="text-[11px] font-medium text-[#86868b]">
                  {FOOD_CATEGORY_EMOJI[activeItem.foodCategory]} {FOOD_CATEGORY_LABELS[activeItem.foodCategory]}
                </span>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            {/* Food Title & Provider */}
            <h3 className="text-base font-bold text-[#1d1d1f] mb-1 tracking-tight">
              {activeItem.name}
            </h3>
            <p className="text-xs text-[#86868b] mb-3 flex items-center gap-1">
              <MapPin size={12} className="text-[#1d1d1f]" />
              <span className="truncate">{activeItem.providerBusinessName} • {activeItem.address}</span>
            </p>

            {/* Micro Details Bar */}
            <div className="flex items-center gap-4 text-xs text-[#555555] mb-4 py-2 px-3 bg-[#f5f5f7] rounded-[10px]">
              <div>
                Stok: <span className="font-semibold text-[#1d1d1f]">{activeItem.quantity} kg</span> ({activeItem.portionCount} porsi)
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-[#ff9500] font-medium">
                <Clock size={12} />
                <span>Sisa {formatCountdown(activeItem.expiryTime)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onItemClick(activeItem)}
                className="flex-1 btn-apple-primary btn-apple-sm text-xs py-2 px-4 flex items-center justify-center gap-1.5"
              >
                <span>Klaim Makanan Ini Sekarang</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM CAROUSEL STRIP: Click any spot to jump map */}
      <div className="absolute bottom-2 left-4 right-4 z-[998] hidden md:flex items-center gap-2 overflow-x-auto pb-1 pointer-events-auto">
        {items.map((item) => {
          const isSelected = activeItem?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleMarkerClick(item)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm ${
                isSelected
                  ? 'bg-[#1d1d1f] text-white scale-105 border-white shadow-md'
                  : 'bg-white/90 backdrop-blur-md text-[#1d1d1f] border border-[rgba(0,0,0,0.12)] hover:bg-white'
              }`}
            >
              <span>{FOOD_CATEGORY_EMOJI[item.foodCategory]}</span>
              <span className="font-semibold">{item.providerBusinessName.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75">
                ({item.isFree ? 'Gratis' : formatPrice(item.price)})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
