import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const CutProducts = () => {
  return (
    <div className="space-y-6" data-testid="cut-products-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Kesilmiş Ürün</h1>
        <p className="text-slate-400 mt-1">Ebatlama işlemlerini yönetin</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-8 text-center">
          <p className="text-slate-400">Henüz kesilmiş ürün kaydı bulunmuyor.</p>
        </CardContent>
      </Card>
    </div>
  );
};