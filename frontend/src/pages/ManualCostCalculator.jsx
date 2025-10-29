import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';

export const ManualCostCalculator = () => {
  const [formData, setFormData] = useState({
    thickness: '',
    width: '',
    length: '',
    quantity: '',
    petkimPerM2: '', // gram/m²
    masuraPrice: ''
  });

  const [results, setResults] = useState({
    totalM2: 0,
    totalPetkim: 0,
    totalEstol: 0,
    totalTalk: 0,
    totalGaz: 0,
    petkimCost: 0,
    estolCost: 0,
    talkCost: 0,
    gazCost: 0,
    masuraCost: 0,
    totalCost: 0,
    m2Cost: 0,
    unitCost: 0
  });

  // Birim fiyatlar (TL/kg)
  const PRICES = {
    petkim: 39.18,
    estol: 72.68,
    talk: 74.18,
    gaz: 36.06
  };

  // Oranlar
  const RATIOS = {
    estol: 0.03,   // %3
    talk: 0.015,   // %1.5
    gaz: 0.04      // %4 (üretim verilerinden ortalama)
  };

  useEffect(() => {
    calculateCosts();
  }, [formData]);

  const calculateCosts = () => {
    // m² hesapla
    const singleM2 = (parseFloat(formData.width) * parseFloat(formData.length)) / 10000 || 0;
    const totalM2 = singleM2 * (parseFloat(formData.quantity) || 0);
    
    // Petkim gram/m² → toplam kg
    const petkimGramPerM2 = parseFloat(formData.petkimPerM2) || 0;
    const totalPetkimGram = petkimGramPerM2 * totalM2;
    const totalPetkimKg = totalPetkimGram / 1000;
    
    // Otomatik hesaplama
    const totalEstolKg = totalPetkimKg * RATIOS.estol;
    const totalTalkKg = totalPetkimKg * RATIOS.talk;
    const totalGazKg = totalPetkimKg * RATIOS.gaz;
    
    // Maliyetler
    const petkimCost = totalPetkimKg * PRICES.petkim;
    const estolCost = totalEstolKg * PRICES.estol;
    const talkCost = totalTalkKg * PRICES.talk;
    const gazCost = totalGazKg * PRICES.gaz;
    const masuraCost = parseFloat(formData.quantity) * parseFloat(formData.masuraPrice) || 0;
    
    const totalCost = petkimCost + estolCost + talkCost + gazCost + masuraCost;
    const unitCost = totalCost / parseFloat(formData.quantity) || 0;
    const m2Cost = totalCost / totalM2 || 0;

    setResults({
      totalM2,
      totalPetkim: totalPetkimKg,
      totalEstol: totalEstolKg,
      totalTalk: totalTalkKg,
      totalGaz: totalGazKg,
      petkimCost,
      estolCost,
      talkCost,
      gazCost,
      masuraCost,
      totalCost,
      m2Cost,
      unitCost
    });
  };

  const handleClear = () => {
    setFormData({
      thickness: '',
      width: '',
      length: '',
      quantity: '',
      petkimPerM2: '',
      masuraPrice: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Manuel Maliyet Hesaplama</h1>
          <p className="text-slate-400 mt-1">Hızlı maliyet hesaplaması</p>
        </div>
        <Button onClick={handleClear} variant="outline" className="border-slate-700">
          <Trash2 className="h-4 w-4 mr-2" />
          Temizle
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol: Form */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Girişler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">Kalınlık (mm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.thickness}
                  onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">En (cm)</Label>
                <Input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">Boy (cm)</Label>
                <Input
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Adet</Label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white text-lg"
              />
            </div>

            <div className="border-t border-slate-700 pt-4">
              <div className="space-y-2">
                <Label className="text-slate-200 text-lg">Petkim Miktarı (gram/m²)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.petkimPerM2}
                  onChange={(e) => setFormData({ ...formData, petkimPerM2: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white text-2xl font-bold"
                  placeholder="0.00"
                />
                <p className="text-xs text-slate-500">Metrekare başına Petkim gram miktarı</p>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <div className="space-y-2">
                <Label className="text-slate-200">Masura Birim Fiyatı (TL)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.masuraPrice}
                  onChange={(e) => setFormData({ ...formData, masuraPrice: e.target.value })}
                  placeholder="13.00"
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded p-3 text-xs text-blue-300">
              <p className="font-semibold mb-1">Otomatik Hesaplama:</p>
              <p>• Estol = Petkim × %3</p>
              <p>• Talk = Petkim × %1.5</p>
              <p>• Gaz = Petkim × %4</p>
            </div>
          </CardContent>
        </Card>

        {/* Sağ: Sonuçlar */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Sonuçlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                <span className="text-slate-300">Toplam m²:</span>
                <span className="text-blue-400 font-bold text-lg">{formatCurrency(results.totalM2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-white font-semibold mb-3">Hammadde Miktarları</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Petkim:</span>
                  <span className="text-slate-300 font-semibold">{formatCurrency(results.totalPetkim)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estol (otomatik):</span>
                  <span className="text-slate-300">{formatCurrency(results.totalEstol)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Talk (otomatik):</span>
                  <span className="text-slate-300">{formatCurrency(results.totalTalk)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gaz (otomatik):</span>
                  <span className="text-slate-300">{formatCurrency(results.totalGaz)} kg</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-white font-semibold mb-3">Maliyet Detayları</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Petkim:</span>
                  <span className="text-slate-300">{formatCurrency(results.petkimCost)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estol:</span>
                  <span className="text-slate-300">{formatCurrency(results.estolCost)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Talk:</span>
                  <span className="text-slate-300">{formatCurrency(results.talkCost)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gaz:</span>
                  <span className="text-slate-300">{formatCurrency(results.gazCost)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Masura:</span>
                  <span className="text-slate-300">{formatCurrency(results.masuraCost)} TL</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-3">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-600/20 to-emerald-800/20 rounded-lg border border-emerald-700">
                <span className="text-emerald-300 font-semibold">TOPLAM:</span>
                <span className="text-emerald-400 font-bold text-2xl">{formatCurrency(results.totalCost)} TL</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-600/20 rounded border border-blue-700">
                  <div className="text-blue-300 text-xs mb-1">Birim Maliyet</div>
                  <div className="text-blue-400 font-bold">{formatCurrency(results.unitCost)} TL</div>
                </div>
                <div className="p-3 bg-orange-600/20 rounded border border-orange-700">
                  <div className="text-orange-300 text-xs mb-1">m² Maliyet</div>
                  <div className="text-orange-400 font-bold">{formatCurrency(results.m2Cost)} TL</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
