import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { productionApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Download, Filter } from 'lucide-react';

export const Production = () => {
  const [productions, setProductions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    machine: '',
    thickness: '',
    width: '',
    length: '',
    m2: 0,
    quantity: '',
    masuraType: '',
    color: '',
    colorCategory: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProductions();
  }, []);

  useEffect(() => {
    // Calculate m2 automatically
    const { thickness, width, length, quantity } = formData;
    if (width && length && quantity) {
      const m2 = (parseFloat(width) * parseFloat(length) * parseFloat(quantity)) / 10000;
      setFormData(prev => ({ ...prev, m2: m2.toFixed(2) }));
    }
  }, [formData.width, formData.length, formData.quantity]);

  const fetchProductions = async () => {
    try {
      const response = await productionApi.getAll();
      setProductions(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing record
        await productionApi.update(editingId, formData);
        toast({
          title: 'Başarılı',
          description: 'Üretim kaydı güncellendi',
        });
        setEditingId(null);
      } else {
        // Create new record
        await productionApi.create(formData);
        toast({
          title: 'Başarılı',
          description: 'Üretim kaydı eklendi',
        });
      }
      fetchProductions();
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        machine: '',
        thickness: '',
        width: '',
        length: '',
        m2: 0,
        quantity: '',
        masuraType: '',
        color: '',
        colorCategory: '',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: editingId ? 'Güncelleme başarısız' : 'Üretim kaydı eklenirken hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (production) => {
    setEditingId(production.id);
    setFormData({
      date: production.date,
      machine: production.machine,
      thickness: production.thickness,
      width: production.width,
      length: production.length,
      m2: production.m2,
      quantity: production.quantity,
      masuraType: production.masuraType,
      color: production.color,
      colorCategory: production.colorCategory,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      machine: '',
      thickness: '',
      width: '',
      length: '',
      m2: 0,
      quantity: '',
      masuraType: '',
      color: '',
      colorCategory: '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
      try {
        await productionApi.delete(id);
        toast({
          title: 'Başarılı',
          description: 'Üretim kaydı silindi',
        });
        fetchProductions();
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Silme işlemi başarısız',
          variant: 'destructive',
        });
      }
    }
  };

  const exportToExcel = () => {
    toast({
      title: 'Bilgi',
      description: 'Excel export özelliği yakında eklenecek',
    });
  };

  return (
    <div className="space-y-6" data-testid="production-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Üretim Girişi</h1>
        <p className="text-slate-400 mt-1">{editingId ? 'Üretim kaydını düzenleyin' : 'Yeni üretim kaydı oluşturun'}</p>
      </div>

      {/* Form */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-200">Tarih</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="machine" className="text-slate-200">Makine</Label>
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
                    <SelectItem value="Makine 3">Makine 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thickness" className="text-slate-200">Kalınlık (mm)</Label>
                <Input
                  id="thickness"
                  type="text"
                  value={formData.thickness}
                  onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="width" className="text-slate-200">En (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="length" className="text-slate-200">Metre</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="m2" className="text-slate-200">Metrekare (Otomatik)</Label>
                <Input
                  id="m2"
                  type="number"
                  value={formData.m2}
                  readOnly
                  className="bg-slate-800/50 border-slate-700 text-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-slate-200">Adet</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="masuraType" className="text-slate-200">Masura Tipi</Label>
                <Select
                  value={formData.masuraType}
                  onValueChange={(value) => setFormData({ ...formData, masuraType: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Masura tipi seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masura 100">Masura 100</SelectItem>
                    <SelectItem value="Masura 120">Masura 120</SelectItem>
                    <SelectItem value="Masura 150">Masura 150</SelectItem>
                    <SelectItem value="Masura 200">Masura 200</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="colorCategory" className="text-slate-200">Renk Kategorisi</Label>
                <Select
                  value={formData.colorCategory}
                  onValueChange={(value) => setFormData({ ...formData, colorCategory: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Renk kategorisi seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Doğal">Doğal</SelectItem>
                    <SelectItem value="Renkli">Renkli</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="text-slate-200">Renk</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData({ ...formData, color: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Renk seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Şeffaf">Şeffaf</SelectItem>
                    <SelectItem value="Siyah">Siyah</SelectItem>
                    <SelectItem value="Mavi">Mavi</SelectItem>
                    <SelectItem value="Kırmızı">Kırmızı</SelectItem>
                    <SelectItem value="Sarı">Sarı</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                data-testid="submit-production-btn"
              >
                {editingId ? 'Güncelle' : 'Üretim Kaydı Ekle'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  İptal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Production List */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Üretim Kayıtları</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              className="bg-emerald-600 hover:bg-emerald-700 border-0 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Excel'e Aktar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtreleri Göster
            </Button>
          </div>
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
                  <TableHead className="text-slate-300">Metre</TableHead>
                  <TableHead className="text-slate-300">m²</TableHead>
                  <TableHead className="text-slate-300">Adet</TableHead>
                  <TableHead className="text-slate-300">Masura</TableHead>
                  <TableHead className="text-slate-300">Renk</TableHead>
                  <TableHead className="text-slate-300">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-slate-400 py-8">
                      Henüz üretim kaydı bulunmuyor
                    </TableCell>
                  </TableRow>
                ) : (
                  productions.map((production) => (
                    <TableRow key={production.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300">{production.date}</TableCell>
                      <TableCell className="text-slate-300">{production.machine}</TableCell>
                      <TableCell className="text-slate-300">{production.thickness}</TableCell>
                      <TableCell className="text-slate-300">{production.width} cm</TableCell>
                      <TableCell className="text-slate-300">{production.length} m</TableCell>
                      <TableCell className="text-emerald-400 font-semibold">{production.m2}</TableCell>
                      <TableCell className="text-slate-300">{production.quantity}</TableCell>
                      <TableCell className="text-blue-400">{production.masuraType}</TableCell>
                      <TableCell className="text-slate-300">{production.color}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(production)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-slate-800"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(production.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-slate-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
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
