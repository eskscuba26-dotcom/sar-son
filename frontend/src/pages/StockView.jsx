import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const StockView = () => {
  return (
    <div className="space-y-6" data-testid="stock-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Stok Görünümü</h1>
        <p className="text-slate-400 mt-1">Güncel stok durumunu görüntüleyin</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-8 text-center">
          <p className="text-slate-400">Henüz stok kaydı bulunmuyor.</p>
        </CardContent>
      </Card>
    </div>
  );
};