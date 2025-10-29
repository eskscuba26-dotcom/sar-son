import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';

export const ManualCostCalculator = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    machine: '',
    thickness: '',
    width: '',
    length: '',
    quantity: '',
    petkim: '',
    estol: '',
    talk: '',
    gaz: '',
    masuraType: '',
    masuraPrice: ''
  });

  const [results, setResults] = useState({
    petkimCost: 0,
    estolCost: 0,
    talkCost: 0,
    gazCost: 0,
    masuraCost: 0,
    totalCost: 0,
    m2Cost: 0,
    unitCost: 0,
    totalM2: 0
  });

  // Birim fiyatlar (Hammadde Yönetimi'nden gelecek - şimdilik sabit)
  const PRICES = {
    petkim: 39.18, // TL/kg
    estol: 72.68,  // TL/kg
    talk: 74.18,   // TL/kg
    gaz: 36.06     // TL/kg
  };

  useEffect(() => {
    calculateCosts();
  }, [formData]);

  const calculateCosts = () => {
    const m2 = (parseFloat(formData.width) * parseFloat(formData.length)) / 10000 || 0;
    const totalM2 = m2 * (parseFloat(formData.quantity) || 0);
    
    const petkimCost = parseFloat(formData.petkim) * PRICES.petkim || 0;
    const estolCost = parseFloat(formData.estol) * PRICES.estol || 0;
    const talkCost = parseFloat(formData.talk) * PRICES.talk || 0;
    const gazCost = parseFloat(formData.gaz) * PRICES.gaz || 0;
    const masuraCost = parseFloat(formData.quantity) * parseFloat(formData.masuraPrice) || 0;
    
    const totalCost = petkimCost + estolCost + talkCost + gazCost + masuraCost;
    const unitCost = totalCost / parseFloat(formData.quantity) || 0;
    const m2Cost = totalCost / totalM2 || 0;

    setResults({
      petkimCost,
      estolCost,
      talkCost,
      gazCost,
      masuraCost,
      totalCost,
      m2Cost,
      unitCost,
      totalM2
    });
  };

  const handleClear = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      machine: '',
      thickness: '',
      width: '',
      length: '',
      quantity: '',
      petkim: '',
      estol: '',
      talk: '',
      gaz: '',
      masuraType: '',
      masuraPrice: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Manuel Maliyet Hesaplama</h1>
          <p className="text-slate-400 mt-1">Hızlı maliyet hesaplaması yapın</p>
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
            <CardTitle className="text-white">Üretim Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">Tarih</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">Makine</Label>
                <Input
                  value={formData.machine}
                  onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                  placeholder="Makine 1"
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            </div>

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
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-white font-semibold mb-3">Hammadde Tüketimi</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Petkim (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.petkim}
                      onChange={(e) => setFormData({ ...formData, petkim: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">Estol (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.estol}
                      onChange={(e) => setFormData({ ...formData, estol: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Talk (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.talk}
                      onChange={(e) => setFormData({ ...formData, talk: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">Gaz (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.gaz}
                      onChange={(e) => setFormData({ ...formData, gaz: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-white font-semibold mb-3">Masura</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Masura Tipi</Label>
                  <Input
                    value={formData.masuraType}
                    onChange={(e) => setFormData({ ...formData, masuraType: e.target.value })}
                    placeholder="Masura 100"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">Birim Fiyat (TL)</Label>
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
            </div>
          </CardContent>
        </Card>

        {/* Sağ: Sonuçlar */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Hesaplama Sonuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                <span className="text-slate-300">Toplam m²:</span>
                <span className="text-blue-400 font-semibold">{formatCurrency(results.totalM2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-white font-semibold mb-3">Maliyet Detayları</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Petkim:</span>
                  <span className="text-slate-300">{formatCurrency(results.petkimCost)} TL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Estol:</span>
                  <span className="text-slate-300">{formatCurrency(results.estolCost)} TL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Talk:</span>
                  <span className="text-slate-300">{formatCurrency(results.talkCost)} TL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Gaz:</span>
                  <span className="text-slate-300">{formatCurrency(results.gazCost)} TL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Masura:</span>
                  <span className="text-slate-300">{formatCurrency(results.masuraCost)} TL</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-3">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-600/20 to-emerald-800/20 rounded-lg border border-emerald-700">
                <span className="text-emerald-300 font-semibold">TOPLAM MALİYET:</span>
                <span className="text-emerald-400 font-bold text-xl">{formatCurrency(results.totalCost)} TL</span>
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

            <div className="border-t border-slate-700 pt-4">
              <div className="text-xs text-slate-500 space-y-1">
                <p>* Birim Fiyatlar: Petkim {PRICES.petkim} TL/kg, Estol {PRICES.estol} TL/kg</p>
                <p>* Talk {PRICES.talk} TL/kg, Gaz {PRICES.gaz} TL/kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
