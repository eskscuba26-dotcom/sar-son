import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Download, TrendingUp } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CostAnalysis = () => {
  const [costData, setCostData] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    product: '',
    materialCost: '',
    laborCost: '',
    energyCost: '',
    otherCost: '',
    totalCost: 0,
    quantity: '',
    unitCost: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCostData();
  }, []);

  useEffect(() => {
    const { materialCost, laborCost, energyCost, otherCost, quantity } = formData;
    const total = (parseFloat(materialCost) || 0) + (parseFloat(laborCost) || 0) + 
                  (parseFloat(energyCost) || 0) + (parseFloat(otherCost) || 0);
    const unit = quantity > 0 ? (total / parseFloat(quantity)) : 0;
    setFormData(prev => ({ 
      ...prev, 
      totalCost: total.toFixed(2),
      unitCost: unit.toFixed(2)
    }));
  }, [formData.materialCost, formData.laborCost, formData.energyCost, formData.otherCost, formData.quantity]);

  const fetchCostData = async () => {
    try {
      const response = await axios.get(`${API}/cost-analysis`);
      setCostData(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/cost-analysis`, formData);
      toast({
        title: 'Başarılı',
        description: 'Maliyet kaydı eklendi',
      });
      fetchCostData();
      setFormData({
        date: new Date().toISOString().split('T')[0],
        product: '',
        materialCost: '',
        laborCost: '',
        energyCost: '',
        otherCost: '',
        totalCost: 0,
        quantity: '',
        unitCost: 0,
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Maliyet kaydı eklenirken hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const totalMaterialCost = costData.reduce((sum, item) => sum + parseFloat(item.materialCost || 0), 0);
  const totalLaborCost = costData.reduce((sum, item) => sum + parseFloat(item.laborCost || 0), 0);
  const totalEnergyCost = costData.reduce((sum, item) => sum + parseFloat(item.energyCost || 0), 0);
  const grandTotal = costData.reduce((sum, item) => sum + parseFloat(item.totalCost || 0), 0);

  return (
    <div className="space-y-6" data-testid="cost-analysis-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Maliyet Analizi</h1>
        <p className="text-slate-400 mt-1">Üretim maliyetlerini analiz edin</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Toplam Hammadde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalMaterialCost.toFixed(2)} TL</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Toplam İşçilik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalLaborCost.toFixed(2)} TL</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Toplam Enerji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalEnergyCost.toFixed(2)} TL</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              Genel Toplam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{grandTotal.toFixed(2)} TL</div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Maliyet Kaydı Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">Tarih</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Ürün/Parti</Label>
                <Input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="Örn: 2mm x 100cm x 300m"
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Adet</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Hammadde Maliyeti (TL)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.materialCost}
                  onChange={(e) => setFormData({ ...formData, materialCost: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">İşçilik Maliyeti (TL)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.laborCost}
                  onChange={(e) => setFormData({ ...formData, laborCost: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Enerji Maliyeti (TL)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.energyCost}
                  onChange={(e) => setFormData({ ...formData, energyCost: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Diğer Maliyetler (TL)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.otherCost}
                  onChange={(e) => setFormData({ ...formData, otherCost: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Toplam Maliyet (Otomatik)</Label>
                <Input
                  type="number"
                  value={formData.totalCost}
                  readOnly
                  className="bg-slate-800/50 border-slate-700 text-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Birim Maliyet (Otomatik)</Label>
                <Input
                  type="number"
                  value={formData.unitCost}
                  readOnly
                  className="bg-slate-800/50 border-slate-700 text-purple-400"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Maliyet Kaydı Ekle
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Maliyet Kayıtları</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 border-0 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel'e Aktar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">Tarih</TableHead>
                  <TableHead className="text-slate-300">Ürün</TableHead>
                  <TableHead className="text-slate-300">Adet</TableHead>
                  <TableHead className="text-slate-300">Hammadde</TableHead>
                  <TableHead className="text-slate-300">İşçilik</TableHead>
                  <TableHead className="text-slate-300">Enerji</TableHead>
                  <TableHead className="text-slate-300">Diğer</TableHead>
                  <TableHead className="text-slate-300">Toplam</TableHead>
                  <TableHead className="text-slate-300">Birim</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-slate-400 py-8">
                      Henüz maliyet kaydı bulunmuyor
                    </TableCell>
                  </TableRow>
                ) : (
                  costData.map((item) => (
                    <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300">{item.date}</TableCell>
                      <TableCell className="text-slate-300">{item.product}</TableCell>
                      <TableCell className="text-slate-300">{item.quantity}</TableCell>
                      <TableCell className="text-blue-400">{parseFloat(item.materialCost).toFixed(2)} TL</TableCell>
                      <TableCell className="text-emerald-400">{parseFloat(item.laborCost).toFixed(2)} TL</TableCell>
                      <TableCell className="text-orange-400">{parseFloat(item.energyCost || 0).toFixed(2)} TL</TableCell>
                      <TableCell className="text-slate-400">{parseFloat(item.otherCost || 0).toFixed(2)} TL</TableCell>
                      <TableCell className="text-purple-400 font-semibold text-lg">{parseFloat(item.totalCost).toFixed(2)} TL</TableCell>
                      <TableCell className="text-emerald-400 font-semibold">{parseFloat(item.unitCost).toFixed(2)} TL</TableCell>
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