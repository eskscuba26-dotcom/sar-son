import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const DailyConsumption = () => {
  const [consumptions, setConsumptions] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    machine: '',
    totalProduction: '',
    petkim: '',
    estol: '',
    talk: '',
    fire: '',
    gaz: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchConsumptions();
  }, []);

  useEffect(() => {
    setTotalProduction(consumptions.reduce((sum, item) => sum + parseFloat(item.totalProduction || 0), 0));
    setTotalPetkim(consumptions.reduce((sum, item) => sum + parseFloat(item.petkim || 0), 0));
    setTotalEstol(consumptions.reduce((sum, item) => sum + parseFloat(item.estol || 0), 0));
    setTotalTalk(consumptions.reduce((sum, item) => sum + parseFloat(item.talk || 0), 0));
    setTotalFire(consumptions.reduce((sum, item) => sum + parseFloat(item.fire || 0), 0));
    setTotalGaz(consumptions.reduce((sum, item) => sum + parseFloat(item.gaz || 0), 0));
  }, [consumptions]);

  const fetchConsumptions = async () => {
    try {
      const response = await axios.get(`${API}/daily-consumption`);
      setConsumptions(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/daily-consumption`, formData);
      toast({
        title: 'Başarılı',
        description: 'Tüketim kaydı eklendi',
      });
      fetchConsumptions();
      setFormData({
        date: new Date().toISOString().split('T')[0],
        machine: '',
        totalProduction: '',
        petkim: '',
        estol: '',
        talk: '',
        fire: '',
        gaz: '',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Tüketim kaydı eklenirken hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const [totalProduction, setTotalProduction] = useState(0);
  const [totalPetkim, setTotalPetkim] = useState(0);
  const [totalEstol, setTotalEstol] = useState(0);
  const [totalTalk, setTotalTalk] = useState(0);
  const [totalFire, setTotalFire] = useState(0);
  const [totalGaz, setTotalGaz] = useState(0);

  return (
    <div className="space-y-6" data-testid="daily-consumption-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Günlük Tüketim</h1>
        <p className="text-slate-400 mt-1">Hammadde tüketimlerini takip edin</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Toplam Üretim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProduction.toFixed(2)}</div>
            <p className="text-xs text-white/80 mt-1">m²</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Petkim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPetkim.toFixed(2)}</div>
            <p className="text-xs text-white/80 mt-1">kg</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-700 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Estol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalEstol.toFixed(2)}</div>
            <p className="text-xs text-white/80 mt-1">kg</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Talk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalTalk.toFixed(2)}</div>
            <p className="text-xs text-white/80 mt-1">kg</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Gaz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalGaz.toFixed(2)}</div>
            <p className="text-xs text-white/80 mt-1">kg</p>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Tüketim Kaydı Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Label className="text-slate-200">Makine</Label>
                <Select
                  value={formData.machine}
                  onValueChange={(value) => setFormData({ ...formData, machine: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Makine seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Makine 1">Makine 1</SelectItem>
                    <SelectItem value="Makine 2">Makine 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Toplam Üretim (m²)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.totalProduction}
                  onChange={(e) => setFormData({ ...formData, totalProduction: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Petkim (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.petkim}
                  onChange={(e) => setFormData({ ...formData, petkim: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Talk (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.talk}
                  onChange={(e) => setFormData({ ...formData, talk: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
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

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Tüketim Kaydı Ekle
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Tüketim Kayıtları</CardTitle>
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
                  <TableHead className="text-slate-300">Makine</TableHead>
                  <TableHead className="text-slate-300">Toplam Üretim (m²)</TableHead>
                  <TableHead className="text-slate-300">Petkim (kg)</TableHead>
                  <TableHead className="text-slate-300">Estol (kg)</TableHead>
                  <TableHead className="text-slate-300">Talk (kg)</TableHead>
                  <TableHead className="text-slate-300">Fire (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consumptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                      Henüz tüketim kaydı bulunmuyor
                    </TableCell>
                  </TableRow>
                ) : (
                  consumptions.map((item) => (
                    <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300">{item.date}</TableCell>
                      <TableCell className="text-slate-300">{item.machine}</TableCell>
                      <TableCell className="text-purple-400 font-semibold">{parseFloat(item.totalProduction).toFixed(2)}</TableCell>
                      <TableCell className="text-blue-400 font-semibold">{parseFloat(item.petkim).toFixed(2)}</TableCell>
                      <TableCell className="text-teal-400">{parseFloat(item.estol).toFixed(2)}</TableCell>
                      <TableCell className="text-cyan-400">{parseFloat(item.talk).toFixed(2)}</TableCell>
                      <TableCell className="text-red-400">{parseFloat(item.fire || 0).toFixed(2)}</TableCell>
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