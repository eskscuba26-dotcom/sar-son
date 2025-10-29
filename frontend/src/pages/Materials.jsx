import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { materialApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as XLSX from 'xlsx';

export const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    material: '',
    entryType: 'Giriş',
    quantity: '',
    unit: 'Kilogram',
    unitPrice: '',
    currency: 'TL',
    totalPrice: 0,
    exchangeRate: 1,
    supplier: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    // Calculate total price
    const { quantity, unitPrice, exchangeRate } = formData;
    if (quantity && unitPrice) {
      const total = parseFloat(quantity) * parseFloat(unitPrice) * parseFloat(exchangeRate || 1);
      setFormData(prev => ({ ...prev, totalPrice: total.toFixed(2) }));
    }
  }, [formData.quantity, formData.unitPrice, formData.exchangeRate]);

  const fetchMaterials = async () => {
    try {
      const response = await materialApi.getAll();
      setMaterials(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await materialApi.create(formData);
      toast({
        title: 'Başarılı',
        description: 'Hammadde kaydı eklendi',
      });
      fetchMaterials();
      setFormData({
        date: new Date().toISOString().split('T')[0],
        material: '',
        entryType: 'Giriş',
        quantity: '',
        unit: 'Kilogram',
        unitPrice: '',
        currency: 'TL',
        totalPrice: 0,
        exchangeRate: 1,
        supplier: ''
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Hammadde kaydı eklenirken hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const exportToExcel = () => {
    const exportData = materials.map(item => ({
      'Tarih': item.date,
      'Hammadde': item.material,
      'Miktar': `${item.quantity} ${item.unit}`,
      'Birim Fiyat': `${item.unitPrice} ${item.currency}`,
      'Toplam': `${item.totalPrice} TL`,
      'Tedarikçi': item.supplier || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hammadde');
    XLSX.writeFile(wb, `hammadde-kayitlari-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6" data-testid="materials-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Hammadde Yönetimi</h1>
        <p className="text-slate-400 mt-1">Hammadde giriş ve çıkışlarını takip edin</p>
      </div>

      {/* Form */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Yeni Hammadde Girişi</CardTitle>
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
                <Label className="text-slate-200">Hammadde</Label>
                <Select
                  value={formData.material}
                  onValueChange={(value) => setFormData({ ...formData, material: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Hammadde seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GAZ">GAZ</SelectItem>
                    <SelectItem value="PETKİM">PETKİM</SelectItem>
                    <SelectItem value="ESTOL">ESTOL</SelectItem>
                    <SelectItem value="TALK">TALK</SelectItem>
                    <SelectItem value="MASURA 100">MASURA 100</SelectItem>
                    <SelectItem value="MASURA 120">MASURA 120</SelectItem>
                    <SelectItem value="MASURA 150">MASURA 150</SelectItem>
                    <SelectItem value="MASURA 200">MASURA 200</SelectItem>
                    <SelectItem value="SARI">SARI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Miktar</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Birim</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kilogram">Kilogram</SelectItem>
                    <SelectItem value="Adet">Adet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Birim Fiyat</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Para Birimi</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TL">TL</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Kur (TL)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.exchangeRate}
                  onChange={(e) => setFormData({ ...formData, exchangeRate: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Toplam Tutar (TL)</Label>
                <Input
                  type="number"
                  value={formData.totalPrice}
                  readOnly
                  className="bg-slate-800/50 border-slate-700 text-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Tedarikçi</Label>
                <Input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Hammadde Kaydı Ekle
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Hammadde Kayıtları</CardTitle>
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
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
                  <TableHead className="text-slate-300">Hammadde</TableHead>
                  <TableHead className="text-slate-300">Miktar</TableHead>
                  <TableHead className="text-slate-300">Birim Fiyat</TableHead>
                  <TableHead className="text-slate-300">Toplam Tutar</TableHead>
                  <TableHead className="text-slate-300">Tedarikçi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                      Henüz hammadde kaydı bulunmuyor
                    </TableCell>
                  </TableRow>
                ) : (
                  materials.map((mat) => (
                    <TableRow key={mat.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300">{mat.date}</TableCell>
                      <TableCell className="text-slate-300">{mat.material}</TableCell>
                      <TableCell className="text-slate-300">{mat.quantity} {mat.unit}</TableCell>
                      <TableCell className="text-blue-400">{mat.unitPrice} {mat.currency}</TableCell>
                      <TableCell className="text-emerald-400 font-semibold">{mat.totalPrice} TL</TableCell>
                      <TableCell className="text-slate-300">{mat.supplier}</TableCell>
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