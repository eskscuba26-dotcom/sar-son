import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Package, Filter } from 'lucide-react';
import { api } from '@/services/api';
import * as XLSX from 'xlsx';

export const StockView = () => {
  const [stockData, setStockData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'normal', 'cut'
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNormal: 0,
    totalCut: 0,
    totalM2: 0,
  });

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await api.stock.getAll();
      const data = response.data || [];
      setStockData(data);
      
      // Calculate stats
      const normalTotal = data
        .filter(item => item.type === 'Normal')
        .reduce((sum, item) => sum + (item.quantity || 0), 0);
      
      const cutTotal = data
        .filter(item => item.type === 'Kesilmiş')
        .reduce((sum, item) => sum + (item.quantity || 0), 0);
      
      const m2Total = data.reduce((sum, item) => sum + ((item.m2 || 0) * (item.quantity || 0)), 0);
      
      setStats({
        totalNormal: normalTotal,
        totalCut: cutTotal,
        totalM2: m2Total.toFixed(2),
      });
    } catch (error) {
      console.error('Stok verileri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtreleme fonksiyonu
  const filteredData = stockData.filter(item => {
    // Tip filtresi
    if (filterType === 'normal' && item.type !== 'Normal') return false;
    if (filterType === 'cut' && item.type !== 'Kesilmiş') return false;
    
    // Arama filtresi
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        item.thickness?.toLowerCase().includes(search) ||
        item.width?.toString().includes(search) ||
        item.color?.toLowerCase().includes(search) ||
        item.type?.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map(item => ({
        'Ürün Tipi': item.type,
        'Kalınlık (mm)': item.thickness,
        'En (cm)': item.width,
        'Metre / Boy': item.length,
        'Renk': item.color,
        'Toplam m²': item.m2,
        'Toplam Adet': item.quantity,
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stok');
    XLSX.writeFile(workbook, `SAR_Stok_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Stok Görünümü</h1>
          <p className="text-slate-400 mt-1">Mevcut stok durumu ve özeti</p>
        </div>
        <Button 
          onClick={exportToExcel}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Excel'e Aktar
        </Button>
      </div>

      {/* Filtre ve Arama Bölümü */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Arama Kutusu */}
            <div className="flex-1">
              <Input
                placeholder="Kalınlık, en, renk veya tip ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            
            {/* Filtre Butonları */}
            <div className="flex gap-2">
              <Button
                onClick={() => setFilterType('all')}
                variant={filterType === 'all' ? 'default' : 'outline'}
                className={filterType === 'all' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:bg-slate-800'
                }
              >
                <Filter className="mr-2 h-4 w-4" />
                Tümü
              </Button>
              <Button
                onClick={() => setFilterType('normal')}
                variant={filterType === 'normal' ? 'default' : 'outline'}
                className={filterType === 'normal' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:bg-slate-800'
                }
              >
                Normal
              </Button>
              <Button
                onClick={() => setFilterType('cut')}
                variant={filterType === 'cut' ? 'default' : 'outline'}
                className={filterType === 'cut' 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:bg-slate-800'
                }
              >
                Kesilmiş
              </Button>
            </div>
          </div>
          
          {/* Sonuç Sayısı */}
          <div className="mt-3 text-sm text-slate-400">
            {filteredData.length} kayıt gösteriliyor
            {searchTerm && ` (toplam ${stockData.length} kayıttan)`}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Normal Ürün Stoğu</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.totalNormal}
                </p>
                <p className="text-slate-500 text-xs mt-1">adet</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Kesilmiş Ürün Stoğu</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.totalCut}
                </p>
                <p className="text-slate-500 text-xs mt-1">adet</p>
              </div>
              <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Toplam m²</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.totalM2}
                </p>
                <p className="text-slate-500 text-xs mt-1">metrekare</p>
              </div>
              <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Stok Detayları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-3 text-slate-300 font-medium">Ürün Tipi</th>
                  <th className="text-left p-3 text-slate-300 font-medium">Kalınlık</th>
                  <th className="text-left p-3 text-slate-300 font-medium">En</th>
                  <th className="text-left p-3 text-slate-300 font-medium">Metre/Boy</th>
                  <th className="text-left p-3 text-slate-300 font-medium">Renk</th>
                  <th className="text-right p-3 text-slate-300 font-medium">m²</th>
                  <th className="text-right p-3 text-slate-300 font-medium">Adet</th>
                  <th className="text-right p-3 text-slate-300 font-medium">Toplam m²</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-8 text-slate-400">
                      {searchTerm || filterType !== 'all' 
                        ? 'Arama kriterlerine uygun kayıt bulunamadı' 
                        : 'Henüz stok kaydı bulunmuyor'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.type === 'Normal' 
                          ? 'bg-blue-500/10 text-blue-400' 
                          : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{item.thickness} mm</td>
                    <td className="p-3 text-slate-300">{item.width} cm</td>
                    <td className="p-3 text-slate-300">{item.length}</td>
                    <td className="p-3">
                      <span className={`text-sm ${
                        item.colorCategory === 'Renkli' 
                          ? 'text-yellow-400' 
                          : 'text-slate-300'
                      }`}>
                        {item.color}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-300">{item.m2}</td>
                    <td className="p-3 text-right">
                      <span className={`font-medium ${
                        item.quantity < 0 
                          ? 'text-red-400' 
                          : item.quantity < 10 
                            ? 'text-yellow-400' 
                            : 'text-emerald-400'
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-300 font-medium">
                      {(item.m2 * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-600 bg-slate-700/30">
                  <td colSpan="6" className="p-3 text-right text-slate-300 font-bold">
                    TOPLAM:
                  </td>
                  <td className="p-3 text-right text-white font-bold">
                    {stats.totalNormal + stats.totalCut}
                  </td>
                  <td className="p-3 text-right text-white font-bold">
                    {stats.totalM2}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
