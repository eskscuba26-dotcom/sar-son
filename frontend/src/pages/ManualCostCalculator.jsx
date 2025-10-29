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
    thickness: '',
    width: '',
    length: '',
    quantity: '',
    petkimPerM2: '',
    masuraType: 'MASURA 100',
    overheadPercent: '15',
    profitPercent: '30'
  });

  const [ebatlama, setEbatlama] = useState({
    enabled: false,
    thickness: '',
    width: '',
    length: '',
    overheadPercent: '15',
    profitPercent: '30'
  });

  const [ebatlamaResults, setEbatlamaResults] = useState({
    pieceM2: 0,
    piecesFromMain: 0,
    costPerPiece: 0,
    withOverhead: 0,
    finalCostPerPiece: 0
  });

  const [materialPrices, setMaterialPrices] = useState({
    petkim: 0,
    estol: 0,
    talk: 0,
    gaz: 0,
    masura100: 0,
    masura120: 0,
    masura150: 0,
    masura200: 0
  });

  const [results, setResults] = useState({
    m2: 0,
    totalPetkim: 0,
    totalEstol: 0,
    totalTalk: 0,
    totalGaz: 0,
    baseCost: 0,
    baseUnitCost: 0,
    baseM2Cost: 0,
    withOverhead: 0,
    withOverheadUnit: 0,
    withOverheadM2: 0,
    finalCost: 0,
    finalUnitCost: 0,
    finalM2Cost: 0
  });

  // Hammadde fiyatlarını ve döviz kurunu çek
  useEffect(() => {
    fetchMaterialPrices();
  }, []);

  const fetchMaterialPrices = async () => {
    try {
      // Hammadde fiyatlarını çek
      const materialsResponse = await axios.get(`${API}/materials`);
      const materials = materialsResponse.data;

      // Döviz kurunu çek
      const ratesResponse = await axios.get(`${API}/exchange-rates`);
      const rates = ratesResponse.data;
      const usdRate = rates.usd || 42.0;
      const eurRate = rates.eur || 48.0;

      // Son girilen fiyatları bul
      const prices = {};
      
      materials.forEach(mat => {
        const name = mat.material.toUpperCase();
        const price = mat.unitPrice || 0;
        const currency = mat.currency || 'TL';
        
        // Dövizi TL'ye çevir
        let priceInTL = price;
        if (currency === 'USD') {
          priceInTL = price * usdRate;
        } else if (currency === 'EUR') {
          priceInTL = price * eurRate;
        }

        if (name.includes('PETK') || name.includes('PET')) {
          prices.petkim = priceInTL;
        } else if (name.includes('ESTO')) {
          prices.estol = priceInTL;
        } else if (name.includes('TALK')) {
          prices.talk = priceInTL;
        } else if (name.includes('GAZ')) {
          prices.gaz = priceInTL;
        } else if (name.includes('MASURA 100')) {
          prices.masura100 = priceInTL;
        } else if (name.includes('MASURA 120')) {
          prices.masura120 = priceInTL;
        } else if (name.includes('MASURA 150')) {
          prices.masura150 = priceInTL;
        } else if (name.includes('MASURA 200')) {
          prices.masura200 = priceInTL;
        }
      });

      setMaterialPrices(prices);
    } catch (error) {
      console.error('Fiyatlar alınamadı:', error);
      // Varsayılan değerler
      setMaterialPrices({
        petkim: 51.88,
        estol: 96.60,
        talk: 103.20,
        gaz: 36.06,
        masura100: 13.00,
        masura120: 16.00,
        masura150: 20.00,
        masura200: 26.00
      });
    }
  };

  // Hesaplamayı yap
  useEffect(() => {
    calculateCosts();
  }, [formData, materialPrices]);

  const calculateCosts = () => {
    const width = parseFloat(formData.width) || 0;
    const length = parseFloat(formData.length) || 0;
    const quantity = parseFloat(formData.quantity) || 0;
    const petkimGrM2 = parseFloat(formData.petkimPerM2) || 0;
    const overheadPercent = parseFloat(formData.overheadPercent) || 0;
    const profitPercent = parseFloat(formData.profitPercent) || 0;

    if (width === 0 || length === 0 || quantity === 0 || petkimGrM2 === 0) {
      setResults({
        m2: 0, totalPetkim: 0, totalEstol: 0, totalTalk: 0, totalGaz: 0,
        baseCost: 0, baseUnitCost: 0, baseM2Cost: 0,
        withOverhead: 0, withOverheadUnit: 0, withOverheadM2: 0,
        finalCost: 0, finalUnitCost: 0, finalM2Cost: 0
      });
      return;
    }

    // 1. Metrekare hesapla (En cm x Boy m)
    const m2 = (width * length) / 100;
    const totalM2 = m2 * quantity;

    // 2. Malzeme miktarları (kg)
    const totalPetkimKg = (petkimGrM2 * totalM2) / 1000;
    const totalEstolKg = totalPetkimKg * 0.03;   // %3
    const totalTalkKg = totalPetkimKg * 0.015;   // %1.5
    const totalGazKg = totalPetkimKg * 0.04;     // %4 (üretim oranı)

    // 3. Malzeme maliyetleri (Hammadde yönetiminden gelen fiyatlar)
    const petkimCost = totalPetkimKg * materialPrices.petkim;
    const estolCost = totalEstolKg * materialPrices.estol;
    const talkCost = totalTalkKg * materialPrices.talk;
    const gazCost = totalGazKg * materialPrices.gaz;

    // 4. Masura maliyeti
    let masuraPrice = materialPrices.masura100;
    if (formData.masuraType === 'MASURA 120') masuraPrice = materialPrices.masura120;
    else if (formData.masuraType === 'MASURA 150') masuraPrice = materialPrices.masura150;
    else if (formData.masuraType === 'MASURA 200') masuraPrice = materialPrices.masura200;
    
    const masuraCost = quantity * masuraPrice;

    // 5. Ham maliyet
    const baseCost = petkimCost + estolCost + talkCost + gazCost + masuraCost;
    const baseUnitCost = baseCost / quantity;
    const baseM2Cost = baseCost / totalM2;

    // 6. Genel masraflar ekle
    const withOverhead = baseCost * (1 + overheadPercent / 100);
    const withOverheadUnit = withOverhead / quantity;
    const withOverheadM2 = withOverhead / totalM2;

    // 7. Kar payı ekle
    const finalCost = withOverhead * (1 + profitPercent / 100);
    const finalUnitCost = finalCost / quantity;
    const finalM2Cost = finalCost / totalM2;

    setResults({
      m2: totalM2,
      totalPetkim: totalPetkimKg,
      totalEstol: totalEstolKg,
      totalTalk: totalTalkKg,
      totalGaz: totalGazKg,
      baseCost,
      baseUnitCost,
      baseM2Cost,
      withOverhead,
      withOverheadUnit,
      withOverheadM2,
      finalCost,
      finalUnitCost,
      finalM2Cost
    });
  };

  const handleReset = () => {
    setFormData({
      thickness: '',
      width: '',
      length: '',
      quantity: '',
      petkimPerM2: '',
      masuraType: 'MASURA 100',
      overheadPercent: '15',
      profitPercent: '30'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manuel Maliyet Hesaplama</h1>
      </div>

      {/* Hammadde Fiyatları Göstergesi */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Hammadde Yönetiminden Çekilen Fiyatlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="text-blue-200">PETKİM: {formatCurrency(materialPrices.petkim)} TL/kg</div>
            <div className="text-blue-200">ESTOL: {formatCurrency(materialPrices.estol)} TL/kg</div>
            <div className="text-blue-200">TALK: {formatCurrency(materialPrices.talk)} TL/kg</div>
            <div className="text-blue-200">GAZ: {formatCurrency(materialPrices.gaz)} TL/kg</div>
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

            <div className="space-y-2">
              <Label className="text-slate-200">Metrekare (Otomatik)</Label>
              <Input
                type="text"
                value={results.m2.toFixed(2) + ' m²'}
                disabled
                className="bg-slate-700/50 border-slate-600 text-emerald-400 font-bold"
              />
            </div>

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

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-200">Masura Tipi</Label>
              <Select value={formData.masuraType} onValueChange={(value) => setFormData({...formData, masuraType: value})}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MASURA 100">MASURA 100 ({formatCurrency(materialPrices.masura100)} TL)</SelectItem>
                  <SelectItem value="MASURA 120">MASURA 120 ({formatCurrency(materialPrices.masura120)} TL)</SelectItem>
                  <SelectItem value="MASURA 150">MASURA 150 ({formatCurrency(materialPrices.masura150)} TL)</SelectItem>
                  <SelectItem value="MASURA 200">MASURA 200 ({formatCurrency(materialPrices.masura200)} TL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleReset} variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                <Trash2 className="mr-2 h-4 w-4" />
                Temizle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yüzde Ayarları */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Maliyet Yüzdeleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-200">Genel Masraflar (%)</Label>
              <Input
                type="number"
                step="1"
                value={formData.overheadPercent}
                onChange={(e) => setFormData({...formData, overheadPercent: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="Örn: 15"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Kar Payı (%)</Label>
              <Input
                type="number"
                step="1"
                value={formData.profitPercent}
                onChange={(e) => setFormData({...formData, profitPercent: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="Örn: 30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sonuçlar */}
      {results.baseCost > 0 && (
        <>
          {/* Malzeme Detayları */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Malzeme Tüketimi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-slate-800/30 rounded">
                  <span className="text-slate-300">PETKİM: {results.totalPetkim.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-800/30 rounded">
                  <span className="text-slate-300">ESTOL: {results.totalEstol.toFixed(2)} kg (%3)</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-800/30 rounded">
                  <span className="text-slate-300">TALK: {results.totalTalk.toFixed(2)} kg (%1.5)</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-800/30 rounded">
                  <span className="text-slate-300">GAZ: {results.totalGaz.toFixed(2)} kg (%4)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maliyet Özeti */}
          <Card className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 border-emerald-700">
            <CardHeader>
              <CardTitle className="text-white">Maliyet Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ham Maliyet */}
              <div className="p-4 bg-black/20 rounded-lg">
                <div className="text-emerald-200 font-medium mb-2">Ham Maliyet (Hammadde + Masura)</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-emerald-300">Toplam</div>
                    <div className="text-white font-bold">{formatCurrency(results.baseCost)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-300">Birim</div>
                    <div className="text-white font-bold">{formatCurrency(results.baseUnitCost)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-300">M²</div>
                    <div className="text-white font-bold">{formatCurrency(results.baseM2Cost)}</div>
                  </div>
                </div>
              </div>

              {/* Genel Masraflar Dahil */}
              <div className="p-4 bg-black/20 rounded-lg">
                <div className="text-emerald-200 font-medium mb-2">+ %{formData.overheadPercent} Genel Masraflar</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-emerald-300">Toplam</div>
                    <div className="text-white font-bold">{formatCurrency(results.withOverhead)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-300">Birim</div>
                    <div className="text-white font-bold">{formatCurrency(results.withOverheadUnit)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-300">M²</div>
                    <div className="text-white font-bold">{formatCurrency(results.withOverheadM2)}</div>
                  </div>
                </div>
              </div>

              {/* Final (Kar Dahil) */}
              <div className="p-4 bg-emerald-600/30 rounded-lg border-2 border-emerald-500">
                <div className="text-white font-bold text-lg mb-3">FİNAL FİYAT (+ %{formData.profitPercent} Kar)</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-black/30 rounded">
                    <div className="text-sm text-emerald-200 mb-1">Toplam</div>
                    <div className="text-emerald-300 font-bold text-xl">{formatCurrency(results.finalCost)}</div>
                  </div>
                  <div className="p-3 bg-black/30 rounded">
                    <div className="text-sm text-emerald-200 mb-1">Birim</div>
                    <div className="text-emerald-300 font-bold text-xl">{formatCurrency(results.finalUnitCost)}</div>
                  </div>
                  <div className="p-3 bg-black/30 rounded">
                    <div className="text-sm text-emerald-200 mb-1">M²</div>
                    <div className="text-emerald-300 font-bold text-xl">{formatCurrency(results.finalM2Cost)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
