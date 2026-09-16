'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Edit, Trash2, Clock, MapPin, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { getSurplusByProvider } from '@/lib/data';
import { surplusService } from '@/services/surplusService';
import { formatCountdown, formatPrice } from '@/lib/utils';
import { FOOD_CATEGORY_LABELS, FOOD_CATEGORY_EMOJI } from '@/types';
import type { SurplusItem, FoodCategory } from '@/types';

export function PenyediaSurplus() {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [items, setItems] = useState<SurplusItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<SurplusItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [portionCount, setPortionCount] = useState('');
  const [foodCategory, setFoodCategory] = useState<FoodCategory>('nasi');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  const [expiryHours, setExpiryHours] = useState('4');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshItems = async () => {
    if (!user) return;
    try {
      const res = await surplusService.getByProvider(user.id);
      setItems(res);
    } catch {
      setItems(getSurplusByProvider(user.id));
    }
  };

  useEffect(() => {
    refreshItems();
  }, [user]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setQuantity('');
    setPortionCount('');
    setFoodCategory('nasi');
    setIsFree(true);
    setPrice('');
    setExpiryHours('4');
    setAddress(user?.businessAddress || '');
    setEditItem(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item: SurplusItem) => {
    setEditItem(item);
    setName(item.name);
    setDescription(item.description);
    setQuantity(String(item.quantity));
    setPortionCount(String(item.portionCount));
    setFoodCategory(item.foodCategory);
    setIsFree(item.isFree);
    setPrice(String(item.price));
    setAddress(item.address);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    const data = {
      providerId: user.id,
      providerName: user.name,
      providerBusinessName: user.businessName || user.name,
      name,
      description,
      photo: '',
      quantity: parseFloat(quantity) || 1,
      portionCount: parseInt(portionCount) || 2,
      productionTime: new Date().toISOString(),
      expiryTime: new Date(Date.now() + parseFloat(expiryHours) * 3600000).toISOString(),
      price: isFree ? 0 : parseInt(price) || 0,
      isFree,
      foodCategory,
      lat: user.location?.lat || -6.2088,
      lng: user.location?.lng || 106.8456,
      address,
    };

    try {
      if (editItem) {
        await surplusService.update(editItem.id, {
          name: data.name,
          description: data.description,
          quantity: data.quantity,
          portionCount: data.portionCount,
          price: data.price,
          isFree: data.isFree,
          foodCategory: data.foodCategory,
          address: data.address,
        });
        success('Surplus Diperbarui', `${name} berhasil diubah`);
      } else {
        await surplusService.create(data);
        success('Surplus Dipublikasikan! 🎉', `${name} sekarang tampil di pencarian`);
      }
      setShowForm(false);
      resetForm();
      refreshItems();
    } catch (err: any) {
      error('Gagal Menyimpan', err.message || 'Terjadi kesalahan saat menyimpan surplus');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    try {
      await surplusService.delete(id);
      success('Surplus Dihapus', `${itemName} telah dihapus dari inventaris`);
      refreshItems();
    } catch (err: any) {
      error('Gagal Menghapus', err.message || 'Gagal menghapus surplus');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4 sm:px-8">
      <div className="apple-container">
        {/* Top Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <a href="#/penyedia" className="link-apple text-xs mb-2 inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Kembali ke Dashboard
            </a>
            <h1 className="text-display-lg text-[#1d1d1f]">Kelola Inventaris Surplus</h1>
            <p className="text-body-apple text-[#86868b] m-0">
              Daftar seluruh makanan berlebih yang Anda sediakan di platform.
            </p>
          </div>

          <button onClick={openAddForm} className="btn-apple-primary self-start sm:self-auto">
            <Plus size={16} /> Tambah Makanan Baru
          </button>
        </div>

        {/* Modal Sheet for Add / Edit Surplus */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[22px] max-w-xl w-full p-6 sm:p-8 border border-[rgba(0,0,0,0.08)] shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-[rgba(0,0,0,0.06)]">
                  <h3 className="text-tagline text-[#1d1d1f]">
                    {editItem ? 'Edit Informasi Surplus' : 'Unggah Makanan Surplus Baru'}
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">Nama Makanan</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Nasi Kotak Ayam Bakar"
                      className="apple-input"
                    />
                  </div>

                  <div>
                    <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">Kategori Makanan</label>
                    <select
                      value={foodCategory}
                      onChange={(e) => setFoodCategory(e.target.value as FoodCategory)}
                      className="apple-input"
                    >
                      <option value="nasi">🍱 Nasi & Lauk</option>
                      <option value="roti">🥐 Roti & Pastry</option>
                      <option value="sayur">🥗 Sayur Mayur</option>
                      <option value="buah">🍎 Buah-Buahan</option>
                      <option value="minuman">🧃 Minuman</option>
                      <option value="lainnya">🍽️ Lainnya</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">Berat (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Contoh: 5"
                        className="apple-input"
                      />
                    </div>
                    <div>
                      <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">Estimasi Porsi</label>
                      <input
                        type="number"
                        required
                        value={portionCount}
                        onChange={(e) => setPortionCount(e.target.value)}
                        placeholder="Contoh: 10"
                        className="apple-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">Skema Harga</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsFree(true)}
                          className={`flex-1 py-2 rounded-[11px] text-xs font-semibold border ${
                            isFree ? 'bg-[#0066cc] text-white border-[#0066cc]' : 'bg-[#f5f5f7] text-[#1d1d1f] border-transparent'
                          }`}
                        >
                          Gratis (Donasi)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsFree(false)}
                          className={`flex-1 py-2 rounded-[11px] text-xs font-semibold border ${
                            !isFree ? 'bg-[#0066cc] text-white border-[#0066cc]' : 'bg-[#f5f5f7] text-[#1d1d1f] border-transparent'
                          }`}
                        >
                          Berbayar
                        </button>
                      </div>
                    </div>

                    {!isFree && (
                      <div>
                        <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">Harga per Porsi (Rp)</label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="5000"
                          className="apple-input"
                        />
                      </div>
                    )}

                    {isFree && (
                      <div>
                        <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">Masa Aman (Jam)</label>
                        <select
                          value={expiryHours}
                          onChange={(e) => setExpiryHours(e.target.value)}
                          className="apple-input"
                        >
                          <option value="2">2 Jam</option>
                          <option value="4">4 Jam (Standar Suhu Ruang)</option>
                          <option value="6">6 Jam (Pendingin)</option>
                          <option value="12">12 Jam</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">Lokasi Pengambilan</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Alamat restoran / dapur Anda"
                      className="apple-input"
                    />
                  </div>

                  <div>
                    <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">Deskripsi & Catatan Alergen</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Jelaskan kondisi makanan, kemasan, atau catatan alergi jika ada..."
                      className="apple-input h-auto py-2.5"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-[rgba(0,0,0,0.06)]">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn-apple-secondary flex-1 text-sm py-2.5"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-apple-primary flex-1 text-sm py-2.5"
                    >
                      {isSubmitting ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Publikasikan Surplus'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* List of Items */}
        {items.length === 0 ? (
          <div className="card-apple-utility bg-white p-12 text-center">
            <div className="text-4xl mb-3">🍽️</div>
            <h3 className="text-tagline mb-1 text-[#1d1d1f]">Belum Ada Makanan yang Diunggah</h3>
            <p className="text-caption-apple text-[#86868b] mb-6">
              Mulai selamatkan makanan berlebih dari usaha Anda hari ini.
            </p>
            <button onClick={openAddForm} className="btn-apple-primary">
              <Plus size={16} /> Tambah Surplus Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="card-apple-utility bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl p-2.5 bg-[#f5f5f7] rounded-[12px] inline-block">
                      {FOOD_CATEGORY_EMOJI[item.foodCategory] || '🍱'}
                    </span>
                    <span className={`badge-apple ${
                      item.status === 'active' ? 'badge-apple-success' : 'badge-apple-neutral'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-body-strong text-[#1d1d1f] mb-1 line-clamp-1">{item.name}</h3>
                  <div className="text-caption-apple text-[#86868b] mb-2">{item.quantity} kg ({item.portionCount} porsi) • {item.isFree ? 'Gratis' : formatPrice(item.price)}</div>
                  <p className="text-caption-apple text-[#86868b] line-clamp-2 mb-4">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between">
                  <span className="text-fine-print text-[#ff9500]">
                    Sisa: {formatCountdown(item.expiryTime)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(item)}
                      className="p-1.5 text-[#0066cc] hover:bg-[#0066cc]/10 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-full transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
