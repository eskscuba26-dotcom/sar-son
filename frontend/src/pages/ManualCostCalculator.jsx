import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ManualCostCalculator = () => {
  const [formData, setFormData] = useState({
    thickness: '',      // Kalınlık (mm)
    width: '',          // En (cm)
    length: '',         // Boy (m)
    quantity: '',       // Adet
    petkimPerM2: '',    // PETKİM gr/m²
    masuraType: 'MASURA 100'
  });

  const [exchangeRate, setExchangeRate] = useState({ usd: 34.75 });
  const [masuraPrices] = useState({
    'MASURA 100': 2.50,
    'MASURA 120': 2.75,
    'MASURA 150': 3.00,
    'MASURA 200': 3.50
  });

  const [results, setResults] = useState({
    m2: 0,
    totalPetkim: 0,
    totalEstol: 0,
    totalTalk: 0,
    petkimCost: 0,
    estolCost: 0,
    talkCost: 0,
    masuraCost: 0,
    materialCost: 0,
    withOverhead: 0,      // +%15 genel tüketim
    withProfit: 0,        // +%30 kar
    unitCost: 0,
    m2Cost: 0,
    finalUnitPrice: 0,
    finalM2Price: 0
  });

  // Birim fiyatlar (USD/kg)
  const MATERIAL_PRICES = {
    petkim: 1.24,  // USD/kg
    estol: 2.30,   // USD/kg
    talk: 2.15     // EUR/kg → USD olarak hesapla
  };

  // Döviz kurunu çek
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(`${API}/exchange-rates`);
      if (response.data) {
        setExchangeRate({ usd: response.data.usd || 34.75 });
      }
    } catch (error) {
      console.error('Döviz kuru alınamadı:', error);
    }
  };

  // Hesaplamayı yap
  useEffect(() => {
    calculateCosts();
  }, [formData, exchangeRate]);

  const calculateCosts = () => {
    const width = parseFloat(formData.width) || 0;
    const length = parseFloat(formData.length) || 0;
    const quantity = parseFloat(formData.quantity) || 0;
    const petkimGrM2 = parseFloat(formData.petkimPerM2) || 0;

    if (width === 0 || length === 0 || quantity === 0 || petkimGrM2 === 0) {
      setResults({
        m2: 0, totalPetkim: 0, totalEstol: 0, totalTalk: 0,
        petkimCost: 0, estolCost: 0, talkCost: 0, masuraCost: 0,
        materialCost: 0, withOverhead: 0, withProfit: 0,
        unitCost: 0, m2Cost: 0, finalUnitPrice: 0, finalM2Price: 0
      });
      return;
    }

    // 1. Metrekare hesapla (En cm x Boy m)
    const m2 = (width * length) / 100; // cm * m = m² (100'e böl)
    const totalM2 = m2 * quantity;

    // 2. Malzeme miktarları (kg)
    const totalPetkimKg = (petkimGrM2 * totalM2) / 1000; // gr → kg
    const totalEstolKg = totalPetkimKg * 0.03;  // %3 PETKİM
    const totalTalkKg = totalPetkimKg * 0.015;  // %1.5 PETKİM

    // 3. Malzeme maliyetleri (TL)
    const petkimCost = totalPetkimKg * MATERIAL_PRICES.petkim * exchangeRate.usd;
    const estolCost = totalEstolKg * MATERIAL_PRICES.estol * exchangeRate.usd;
    const talkCost = totalTalkKg * MATERIAL_PRICES.talk * exchangeRate.usd;
    
    // 4. Masura maliyeti
    const masuraPrice = masuraPrices[formData.masuraType] || 2.50;
    const masuraCost = quantity * masuraPrice;

    // 5. Toplam hammadde maliyeti
    const materialCost = petkimCost + estolCost + talkCost + masuraCost;

    // 6. %15 Genel Tüketim Ekle
    const withOverhead = materialCost * 1.15;

    // 7. %30 Kar Payı Ekle
    const withProfit = withOverhead * 1.30;

    // 8. Birim maliyetler
    const unitCost = materialCost / quantity;
    const m2Cost = materialCost / totalM2;
    const finalUnitPrice = withProfit / quantity;
    const finalM2Price = withProfit / totalM2;

    setResults({
      m2: totalM2,
      totalPetkim: totalPetkimKg,
      totalEstol: totalEstolKg,
      totalTalk: totalTalkKg,
      petkimCost,
      estolCost,
      talkCost,
      masuraCost,
      materialCost,
      withOverhead,
      withProfit,
      unitCost,
      m2Cost,
      finalUnitPrice,
      finalM2Price
    });
  };

  const handleReset = () => {
    setFormData({
      thickness: '',
      width: '',
      length: '',
      quantity: '',
      petkimPerM2: '',
      masuraType: 'MASURA 100'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manuel Maliyet Hesaplama</h1>
      </div>

      {/* Döviz Kuru Göstergesi */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-200">Dolar Kuru (Sistemden)</span>
            <span className="text-2xl font-bold text-white">{formatCurrency(exchangeRate.usd)} TL</span>
          </div>
        </CardContent>
      </Card>

      {/* Giriş Formu */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Ürün Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kalınlık */}
            <div className="space-y-2">
              <Label className="text-slate-200">Kalınlık (mm)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.thickness}
                onChange={(e) => setFormData({...formData, thickness: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="Örn: 1"
              />
            </div>

            {/* En */}
            <div className="space-y-2">
              <Label className="text-slate-200">En (cm)</Label>
              <Input
                type="number"
                step="1"
                value={formData.width}
                onChange={(e) => setFormData({...formData, width: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="Örn: 100"
              />
            </div>

            {/* Boy */}
            <div className="space-y-2">
              <Label className="text-slate-200">Boy (m)</Label>
              <Input
                type="number"
                step="1"
                value={formData.length}
                onChange={(e) => setFormData({...formData, length: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="Örn: 300"
              />
            </div>

            {/* Metrekare (Otomatik) */}
            <div className="space-y-2">
              <Label className="text-slate-200">Metrekare (Otomatik)</Label>
              <Input
                type="text"
                value={results.m2.toFixed(2) + ' m²'}
                disabled
                className="bg-slate-700/50 border-slate-600 text-emerald-400 font-bold"
              />
            </div>

            {/* Adet */}
            <div className="space-y-2">
              <Label className="text-slate-200">Adet</Label>
              <Input
                type="number"
                step="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="Örn: 100"
              />
            </div>

            {/* PETKİM gr/m² */}
            <div className="space-y-2">
              <Label className="text-slate-200">PETKİM (gr/m²)</Label>
              <Input
                type="number"
                step="1"
                value={formData.petkimPerM2}
                onChange={(e) => setFormData({...formData, petkimPerM2: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="Örn: 850"
              />
            </div>

            {/* Masura Tipi */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-200">Masura Tipi</Label>
              <Select value={formData.masuraType} onValueChange={(value) => setFormData({...formData, masuraType: value})}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MASURA 100">MASURA 100 ({formatCurrency(masuraPrices['MASURA 100'])} TL/adet)</SelectItem>
                  <SelectItem value="MASURA 120">MASURA 120 ({formatCurrency(masuraPrices['MASURA 120'])} TL/adet)</SelectItem>
                  <SelectItem value="MASURA 150">MASURA 150 ({formatCurrency(masuraPrices['MASURA 150'])} TL/adet)</SelectItem>
                  <SelectItem value="MASURA 200">MASURA 200 ({formatCurrency(masuraPrices['MASURA 200'])} TL/adet)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Temizle Butonu */}
            <div className="flex items-end">
              <Button onClick={handleReset} variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                <Trash2 className="mr-2 h-4 w-4" />
                Temizle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sonuçlar */}
      {results.materialCost > 0 && (
        <>
          {/* Malzeme Detayları */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Malzeme Tüketimi ve Maliyetleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded">
                  <span className="text-slate-300">PETKİM ({results.totalPetkim.toFixed(2)} kg)</span>
                  <span className="text-white font-semibold">{formatCurrency(results.petkimCost)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded">
                  <span className="text-slate-300">ESTOL ({results.totalEstol.toFixed(2)} kg) - %3</span>
                  <span className="text-white font-semibold">{formatCurrency(results.estolCost)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded">
                  <span className="text-slate-300">TALK ({results.totalTalk.toFixed(2)} kg) - %1.5</span>
                  <span className="text-white font-semibold">{formatCurrency(results.talkCost)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded">
                  <span className="text-slate-300">Masura ({formData.quantity} adet)</span>
                  <span className="text-white font-semibold">{formatCurrency(results.masuraCost)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Toplam Maliyetler */}
          <Card className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 border-emerald-700">
            <CardHeader>
              <CardTitle className="text-white">Maliyet Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/20 rounded">
                <span className="text-emerald-200 font-medium">Hammadde Maliyeti</span>
                <span className="text-white font-bold text-xl">{formatCurrency(results.materialCost)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-black/20 rounded">
                <span className="text-emerald-200 font-medium">+ %15 Genel Tüketim</span>
                <span className="text-white font-bold text-xl">{formatCurrency(results.withOverhead)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-emerald-600/30 rounded-lg border-2 border-emerald-500">
                <span className="text-white font-bold text-lg">Toplam (+ %30 Kar)</span>
                <span className="text-emerald-300 font-bold text-2xl">{formatCurrency(results.withProfit)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-700/50">
                <div className="text-center p-3 bg-black/20 rounded">
                  <div className="text-emerald-200 text-sm mb-1">Birim Maliyet</div>
                  <div className="text-white font-bold text-lg">{formatCurrency(results.finalUnitPrice)}</div>
                </div>
                <div className="text-center p-3 bg-black/20 rounded">
                  <div className="text-emerald-200 text-sm mb-1">Metrekare Maliyet</div>
                  <div className="text-white font-bold text-lg">{formatCurrency(results.finalM2Price)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
