import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { exchangeRateApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp } from 'lucide-react';

export const ExchangeRates = () => {
  const [rates, setRates] = useState({ usd: 0, eur: 0, lastUpdated: '' });
  const [formData, setFormData] = useState({ usd: '', eur: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await exchangeRateApi.get();
      setRates(response.data);
      setFormData({ usd: response.data.usd, eur: response.data.eur });
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await exchangeRateApi.update(formData);
      toast({
        title: 'Başarılı',
        description: 'Döviz kurları güncellendi',
      });
      fetchRates();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kurlar güncellenirken hata oluştu',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6" data-testid="exchange-rates-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Kur Ayarları</h1>
        <p className="text-slate-400 mt-1">Döviz kurlarını yönetin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Rates */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">
              Güncel USD Kuru
            </CardTitle>
            <DollarSign className="h-6 w-6 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{rates.usd} TL</div>
            <p className="text-xs text-white/80 mt-1">
              {rates.lastUpdated ? `Son güncelleme: ${new Date(rates.lastUpdated).toLocaleString('tr-TR')}` : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">
              Güncel EUR Kuru
            </CardTitle>
            <TrendingUp className="h-6 w-6 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{rates.eur} TL</div>
            <p className="text-xs text-white/80 mt-1">
              {rates.lastUpdated ? `Son güncelleme: ${new Date(rates.lastUpdated).toLocaleString('tr-TR')}` : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Update Form */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Kur Güncelleme</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usd" className="text-slate-200">USD Kuru (TL)</Label>
                <Input
                  id="usd"
                  name="usd"
                  type="number"
                  step="0.01"
                  value={formData.usd}
                  onChange={(e) => setFormData({ ...formData, usd: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eur" className="text-slate-200">EUR Kuru (TL)</Label>
                <Input
                  id="eur"
                  name="eur"
                  type="number"
                  step="0.01"
                  value={formData.eur}
                  onChange={(e) => setFormData({ ...formData, eur: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Kurları Güncelle
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <p className="text-slate-400 text-sm">
            💡 <strong>Bilgi:</strong> Döviz kurları hammadde girişlerinde otomatik olarak kullanılır. 
            USD ve EUR cinsinden yapılan alımlar bu kurlarla TL'ye çevrilir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};