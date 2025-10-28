import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { productionApi, cutProductApi, shipmentApi } from '@/services/api';

export const StockView = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateStock();
  }, []);

  const calculateStock = async () => {
    try {
      // Get all data
      const [prodRes, cutRes, shipRes] = await Promise.all([
        productionApi.getAll(),
        cutProductApi.getAll(),
        shipmentApi.getAll()
      ]);

      const productions = prodRes.data;
      const shipments = shipRes.data;

      // Group by product specs
      const stockMap = {};

      // Add productions
      productions.forEach(prod => {
        const key = `${prod.thickness}_${prod.width}_${prod.length}_${prod.color}`;
        if (!stockMap[key]) {
          stockMap[key] = {
            thickness: prod.thickness,
            width: prod.width,
            length: prod.length,
            color: prod.color,
            produced: 0,
            shipped: 0,
            remaining: 0,
            m2: 0
          };
        }
        stockMap[key].produced += prod.quantity;
      });

      // Subtract shipments (only Normal type)
      shipments.filter(s => s.type === 'Normal').forEach(ship => {
        // Try to match with stock
        Object.keys(stockMap).forEach(key => {
          const stock = stockMap[key];
          if (ship.size && ship.size.includes(stock.width) && ship.color === stock.color) {
            stock.shipped += ship.quantity || 0;
          }
        });
      });

      // Calculate remaining
      const stockArray = Object.values(stockMap).map(stock => {
        stock.remaining = stock.produced - stock.shipped;
        stock.m2 = ((parseFloat(stock.width) * parseFloat(stock.length) * stock.remaining) / 10000).toFixed(2);
        return stock;
      }).filter(s => s.remaining > 0);

      setStockData(stockArray);
      setLoading(false);
    } catch (error) {
      console.error('Stock calculation error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="stock-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Stok Görünümü</h1>
        <p className="text-slate-400 mt-1">Güncel stok durumunu görüntüleyin</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Toplam Stok Adedi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stockData.reduce((sum, item) => sum + item.remaining, 0)}
            </div>
            <p className="text-xs text-white/80 mt-1">Rulo/Adet</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Toplam m²</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stockData.reduce((sum, item) => sum + parseFloat(item.m2), 0).toFixed(2)}
            </div>
            <p className="text-xs text-white/80 mt-1">Metrekare</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Çeşit Sayısı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stockData.length}</div>
            <p className="text-xs text-white/80 mt-1">Farklı ürün</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Table */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Stok Detayları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">Kalınlık</TableHead>
                  <TableHead className="text-slate-300">En (cm)</TableHead>
                  <TableHead className="text-slate-300">Metre</TableHead>
                  <TableHead className="text-slate-300">Renk</TableHead>
                  <TableHead className="text-slate-300">Üretilen</TableHead>
                  <TableHead className="text-slate-300">Sevk Edilen</TableHead>
                  <TableHead className="text-slate-300">Kalan</TableHead>
                  <TableHead className="text-slate-300">Toplam m²</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-400 py-8">
                      Yükleniyor...
                    </TableCell>
                  </TableRow>
                ) : stockData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-400 py-8">
                      Henüz stok kaydı bulunmuyor
                    </TableCell>
                  </TableRow>
                ) : (
                  stockData.map((item, index) => (
                    <TableRow key={index} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300">{item.thickness}</TableCell>
                      <TableCell className="text-slate-300">{item.width} cm</TableCell>
                      <TableCell className="text-slate-300">{item.length} m</TableCell>
                      <TableCell className="text-slate-300">{item.color}</TableCell>
                      <TableCell className="text-blue-400">{item.produced}</TableCell>
                      <TableCell className="text-orange-400">{item.shipped}</TableCell>
                      <TableCell className="text-emerald-400 font-semibold text-lg">{item.remaining}</TableCell>
                      <TableCell className="text-purple-400 font-semibold">{item.m2} m²</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};