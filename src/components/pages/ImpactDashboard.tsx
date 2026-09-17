'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Package, TreePine, Award, ShieldCheck, Car, Droplets } from 'lucide-react';
import { impactService } from '@/services/impactService';
import type { ImpactData, ImpactTimeline } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export function ImpactDashboard() {
  const [impact, setImpact] = useState<ImpactData | null>(null);
  const [timeline, setTimeline] = useState<ImpactTimeline[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [stats, tl] = await Promise.all([
          impactService.getStats(),
          impactService.getTimeline(),
        ]);
        setImpact(stats);
        setTimeline(tl);
      } catch {
        // Handled gracefully
      }
    }
    load();
  }, []);

  if (!impact) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10 px-4 sm:px-8">
      <div className="apple-container">
        {/* Apple Environment Style Header */}
        <div className="text-center max-w-[760px] mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#34c759]/15 text-[#34c759] px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
            <Leaf size={14} /> Laporan Lingkungan & Emisi Net-Zero
          </div>
          <h1 className="text-hero-display text-[#1d1d1f] mb-3">
            Dampak Terukur. Transparan.
          </h1>
          <p className="text-lead text-[#86868b] font-normal">
            Metrik langsung dari setiap transaksi penyelamatan makanan layak di seluruh ekosistem AksesPangan.
          </p>
        </div>

        {/* 4 Core Metric Cards (Apple Store Utility Cards style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-apple-utility text-center p-6 bg-white">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-3 text-[#1d1d1f]">
              <Package size={20} />
            </div>
            <div className="text-display-md text-[#1d1d1f] font-semibold mb-0.5">
              {impact.totalKgSaved.toLocaleString('id-ID')} <span className="text-sm font-normal text-[#86868b]">kg</span>
            </div>
            <div className="text-caption-apple text-[#86868b]">Makanan Terselamatkan</div>
          </div>

          <div className="card-apple-utility text-center p-6 bg-white">
            <div className="w-10 h-10 rounded-full bg-[#34c759]/10 flex items-center justify-center mx-auto mb-3 text-[#34c759]">
              <Heart size={20} />
            </div>
            <div className="text-display-md text-[#34c759] font-semibold mb-0.5">
              {impact.totalPortions.toLocaleString('id-ID')} <span className="text-sm font-normal text-[#86868b]">porsi</span>
            </div>
            <div className="text-caption-apple text-[#86868b]">Porsi Terdistribusi</div>
          </div>

          <div className="card-apple-utility text-center p-6 bg-white">
            <div className="w-10 h-10 rounded-full bg-[#1d1d1f]/10 flex items-center justify-center mx-auto mb-3 text-[#1d1d1f]">
              <Leaf size={20} />
            </div>
            <div className="text-display-md text-[#1d1d1f] font-semibold mb-0.5">
              {impact.totalCO2eSaved.toLocaleString('id-ID')} <span className="text-sm font-normal text-[#86868b]">kg</span>
            </div>
            <div className="text-caption-apple text-[#86868b]">Emisi CO₂e Dihindari</div>
          </div>

          <div className="card-apple-utility text-center p-6 bg-white">
            <div className="w-10 h-10 rounded-full bg-[#ff9500]/10 flex items-center justify-center mx-auto mb-3 text-[#ff9500]">
              <TreePine size={20} />
            </div>
            <div className="text-display-md text-[#ff9500] font-semibold mb-0.5">
              {impact.treeEquivalent.toLocaleString('id-ID')} <span className="text-sm font-normal text-[#86868b]">pohon</span>
            </div>
            <div className="text-caption-apple text-[#86868b]">Setara Serapan Pohon</div>
          </div>
        </div>

        {/* Environmental Equivalencies (Apple Environment Tile) */}
        <div className="card-apple-utility bg-white p-8 mb-8">
          <h3 className="text-tagline text-[#1d1d1f] mb-2">Konversi Dampak Ekologis Nyata</h3>
          <p className="text-caption-apple text-[#86868b] mb-6">
            Berdasarkan metodologi Food and Agriculture Organization (FAO) dan IPCC emission factor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-5 rounded-[14px] bg-[#f5f5f7]">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#34c759] flex-shrink-0 shadow-sm">
                <TreePine size={22} />
              </div>
              <div>
                <div className="text-tagline font-semibold text-[#1d1d1f]">{impact.treeEquivalent} Pohon</div>
                <div className="text-caption-apple text-[#86868b]">
                  Setara kapasitas penyerapan karbon oleh pohon dewasa selama satu tahun penuh.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-[14px] bg-[#f5f5f7]">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1d1d1f] flex-shrink-0 shadow-sm">
                <Car size={22} />
              </div>
              <div>
                <div className="text-tagline font-semibold text-[#1d1d1f]">{Math.round(impact.totalCO2eSaved * 4.7)} km</div>
                <div className="text-caption-apple text-[#86868b]">
                  Setara jarak perjalanan mobil berbahan bakar fosil yang emisi knalpotnya ditiadakan.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-[14px] bg-[#f5f5f7]">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#ff9500] flex-shrink-0 shadow-sm">
                <Droplets size={22} />
              </div>
              <div>
                <div className="text-tagline font-semibold text-[#1d1d1f]">{(impact.totalKgSaved * 850).toLocaleString('id-ID')} Liter</div>
                <div className="text-caption-apple text-[#86868b]">
                  Air bersih yang dihemat dari siklus produksi bahan baku pertanian pangan.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Trend Chart (Apple Monochrome + Action Blue) */}
        <div className="card-apple-utility bg-white p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h3 className="text-tagline text-[#1d1d1f] mb-1">Tren Penyelamatan 7 Hari Terakhir</h3>
              <p className="text-caption-apple text-[#86868b]">Kilogram makanan yang berhasil dialirkan setiap harinya</p>
            </div>
            <span className="badge-apple badge-apple-neutral text-xs mt-2 sm:mt-0">
              Sinkronisasi Otomatis
            </span>
          </div>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#86868b', fontSize: 12, fontFamily: 'var(--font-sf-pro)' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#86868b', fontSize: 12, fontFamily: 'var(--font-sf-pro)' }}
                />
                <Tooltip
                  cursor={{ fill: '#f5f5f7' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #d2d2d7',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontFamily: 'var(--font-sf-pro)',
                    fontSize: '13px',
                  }}
                  formatter={(value: any) => [`${value} kg diselamatkan`, 'Makanan']}
                />
                <Bar dataKey="kgSaved" fill="#1d1d1f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
