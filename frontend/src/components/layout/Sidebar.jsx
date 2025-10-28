import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logoImage from '@/logo.png';
import {
  Home,
  Package,
  Scissors,
  Truck,
  BarChart3,
  ShoppingCart,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  LogOut,
  FileSpreadsheet,
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { path: '/excel-viewer', label: '📊 SAR-2025 Dosyası', icon: FileSpreadsheet },
  { path: '/production', label: 'Üretim Girişi', icon: Package },
  { path: '/cut-products', label: 'Kesilmiş Ürün', icon: Scissors },
  { path: '/shipment', label: 'Sevkiyat', icon: Truck },
  { path: '/stock', label: 'Stok Görünümü', icon: BarChart3 },
  { path: '/materials', label: 'Hammadde Yönetimi', icon: ShoppingCart },
  { path: '/daily-consumption', label: 'Günlük Tüketim', icon: Calendar },
  { path: '/cost-analysis', label: 'Maliyet Analizi', icon: TrendingUp },
  { path: '/exchange-rates', label: 'Kur Ayarları', icon: DollarSign },
  { path: '/users', label: 'Kullanıcı Yönetimi', icon: Users },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col border-r border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="SAR Ambalaj" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-white font-semibold text-lg">SAR Ambalaj</h1>
            <p className="text-slate-400 text-xs">{user?.username || 'admin'}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              data-testid={`sidebar-${item.path.substring(1)}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors w-full"
          data-testid="logout-btn"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};