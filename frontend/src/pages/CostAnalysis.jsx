import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Download, DollarSign } from 'lucide-react';
import axios from 'axios';
import { exportToExcel } from '@/utils/exportToExcel';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CostAnalysis = () => {
  const [costData, setCostData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCostData();
  }, []);

  const fetchCostData = async () => {
    try {
      const response = await axios.get(`${API}/cost-analysis`);
      setCostData(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: 'Hata',
        description: 'Maliyet verileri yüklenemedi',
        variant: 'destructive',
      });
    }
  };

  const filteredData = costData.filter(item =>
    item.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.thickness?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.machine?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMaterialCost = costData.reduce((sum, item) => sum + parseFloat(item.materialCost || 0), 0);
  const totalMasuraCost = costData.reduce((sum, item) => sum + parseFloat(item.masuraCost || 0), 0);
  const grandTotal = costData.reduce((sum, item) => sum + parseFloat(item.totalCost || 0), 0);
  const totalM2 = costData.reduce((sum, item) => sum + parseFloat(item.m2 || 0), 0);
  const totalQuantity = costData.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Maliyet Analizi</h1>
          <p className="text-slate-400 mt-1">Her üretim satırı için detaylı maliyet hesabı (Excel formatında)</p>
        </div>
        <Button 
          onClick={() => exportToExcel(filteredData, 'maliyet-analizi')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Excel'e Aktar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Toplam Hammadde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalMaterialCost.toFixed(2)} TL</div>
            <p className="text-xs text-white/80 mt-1">Petkim, Estol, Talk, Gaz</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Toplam Masura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalMasuraCost.toFixed(2)} TL</div>
            <p className="text-xs text-white/80 mt-1">{totalQuantity} adet</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Genel Toplam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{grandTotal.toFixed(2)} TL</div>
            <p className="text-xs text-white/80 mt-1">Tüm maliyetler</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-800 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Ort. m² Maliyet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalM2 > 0 ? (grandTotal / totalM2).toFixed(2) : '0.00'} TL
            </div>
            <p className="text-xs text-white/80 mt-1">{totalM2.toFixed(2)} m²</p>
          </CardContent>
        </Card>
      </div>

      {/* Arama */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="pt-6">
          <Input
            placeholder="Tarih veya kalınlık ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white"
          />
        </CardContent>
      </Card>

      {/* Tablo */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Tarih Bazında Maliyet Detayları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">Tarih</TableHead>
                  <TableHead className="text-slate-300">Makine</TableHead>
                  <TableHead className="text-slate-300">Kalınlık</TableHead>
                  <TableHead className="text-slate-300">En</TableHead>
                  <TableHead className="text-slate-300">Boy</TableHead>
                  <TableHead className="text-slate-300">m²</TableHead>
                  <TableHead className="text-slate-300">Adet</TableHead>
                  <TableHead className="text-slate-300">Masura</TableHead>
                  <TableHead className="text-slate-300">Renk</TableHead>
                  <TableHead className="text-slate-300">Petkim (kg)</TableHead>
                  <TableHead className="text-slate-300">Estol (kg)</TableHead>
                  <TableHead className="text-slate-300">Talk (kg)</TableHead>
                  <TableHead className="text-slate-300">Gaz (kg)</TableHead>
                  <TableHead className="text-slate-300">Ham. Maliyet</TableHead>
                  <TableHead className="text-slate-300">Mas. Maliyet</TableHead>
                  <TableHead className="text-slate-300 font-bold">Toplam</TableHead>
                  <TableHead className="text-slate-300 font-bold">Birim</TableHead>
                  <TableHead className="text-slate-300 font-bold">m²</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={18} className="text-center text-slate-400 py-8">
                      Henüz maliyet verisi bulunmuyor
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow key={index} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300">{item.date}</TableCell>
                      <TableCell className="text-slate-300">{item.machine}</TableCell>
                      <TableCell className="text-slate-300">{item.thickness}</TableCell>
                      <TableCell className="text-slate-300">{item.width}</TableCell>
                      <TableCell className="text-slate-300">{item.length}</TableCell>
                      <TableCell className="text-blue-400 font-semibold">{item.m2}</TableCell>
                      <TableCell className="text-purple-400 font-semibold">{item.quantity}</TableCell>
                      <TableCell className="text-slate-300 text-xs">{item.masuraType}</TableCell>
                      <TableCell className="text-slate-300 text-xs">{item.color}</TableCell>
                      <TableCell className="text-slate-300">{item.petkim}</TableCell>
                      <TableCell className="text-slate-300">{item.estol}</TableCell>
                      <TableCell className="text-slate-300">{item.talk}</TableCell>
                      <TableCell className="text-slate-300">{item.gaz}</TableCell>
                      <TableCell className="text-emerald-400">{item.materialCost} TL</TableCell>
                      <TableCell className="text-amber-400">{item.masuraCost} TL</TableCell>
                      <TableCell className="text-blue-400 font-bold">{item.totalCost} TL</TableCell>
                      <TableCell className="text-emerald-400 font-bold">{item.unitCost} TL</TableCell>
                      <TableCell className="text-orange-400 font-bold">{item.m2Cost} TL</TableCell>
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
