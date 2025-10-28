import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const CostAnalysis = () => {
  return (
    <div className="space-y-6" data-testid="cost-analysis-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Maliyet Analizi</h1>
        <p className="text-slate-400 mt-1">Maliyet hesaplamalarını inceleyin</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-8 text-center">
          <p className="text-slate-400">Henüz maliyet analizi bulunmuyor.</p>
        </CardContent>
      </Card>
    </div>
  );
};