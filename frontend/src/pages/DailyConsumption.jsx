import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const DailyConsumption = () => {
  return (
    <div className="space-y-6" data-testid="daily-consumption-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Günlük Tüketim</h1>
        <p className="text-slate-400 mt-1">Günlük tüketim raporlarını görüntüleyin</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-8 text-center">
          <p className="text-slate-400">Henüz tüketim kaydı bulunmuyor.</p>
        </CardContent>
      </Card>
    </div>
  );
};