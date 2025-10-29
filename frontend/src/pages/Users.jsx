import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { userApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Plus, Trash2, Key } from 'lucide-react';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'viewer'
  });
  const [passwordChangeData, setPasswordChangeData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userApi.create(formData);
      toast({ title: 'Başarılı', description: 'Kullanıcı eklendi' });
      setFormData({ username: '', password: '', name: '', email: '', role: 'viewer' });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Hata', description: 'Kullanıcı eklenemedi', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    try {
      await userApi.delete(id);
      toast({ title: 'Başarılı', description: 'Kullanıcı silindi' });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Hata', description: 'Kullanıcı silinemedi', variant: 'destructive' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) {
      toast({ title: 'Hata', description: 'Yeni şifreler eşleşmiyor', variant: 'destructive' });
      return;
    }

    if (passwordChangeData.newPassword.length < 6) {
      toast({ title: 'Hata', description: 'Şifre en az 6 karakter olmalıdır', variant: 'destructive' });
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Mevcut şifreyi doğrula
      const loginResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          password: passwordChangeData.currentPassword
        })
      });

      if (!loginResponse.ok) {
        toast({ title: 'Hata', description: 'Mevcut şifre yanlış', variant: 'destructive' });
        return;
      }

      // Şifreyi güncelle (backend endpoint'i eklemeliyiz)
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: currentUser.username,
          newPassword: passwordChangeData.newPassword
        })
      });

      if (response.ok) {
        toast({ title: 'Başarılı', description: 'Şifreniz değiştirildi' });
        setPasswordChangeData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsPasswordDialogOpen(false);
      } else {
        throw new Error('Şifre değiştirilemedi');
      }
    } catch (error) {
      toast({ title: 'Hata', description: 'Şifre değiştirilemedi', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Kullanıcı Yönetimi</h1>
          <p className="text-slate-400 mt-1">Sistem kullanıcılarını yönetin</p>
        </div>
        
        {/* Şifre Değiştir Butonu */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Key className="h-4 w-4 mr-2" />
              Şifremi Değiştir
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Şifre Değiştir</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200">Mevcut Şifre</Label>
                <Input
                  type="password"
                  value={passwordChangeData.currentPassword}
                  onChange={(e) => setPasswordChangeData({ ...passwordChangeData, currentPassword: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-200">Yeni Şifre</Label>
                <Input
                  type="password"
                  value={passwordChangeData.newPassword}
                  onChange={(e) => setPasswordChangeData({ ...passwordChangeData, newPassword: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-200">Yeni Şifre (Tekrar)</Label>
                <Input
                  type="password"
                  value={passwordChangeData.confirmPassword}
                  onChange={(e) => setPasswordChangeData({ ...passwordChangeData, confirmPassword: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                  minLength={6}
                />
              </div>
              
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Şifreyi Değiştir
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Toplam Kullanıcı</CardTitle>
            <User className="h-6 w-6 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{users.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Admin</CardTitle>
            <Shield className="h-6 w-6 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">İzleyici</CardTitle>
            <User className="h-6 w-6 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {users.filter(u => u.role === 'viewer').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Form */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Yeni Kullanıcı Ekle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-200">Kullanıcı Adı *</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Şifre *</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Ad Soyad</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">E-posta</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Rol *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (Tam Yetki)</SelectItem>
                  <SelectItem value="viewer">İzleyici (Sadece Görüntüleme)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Kullanıcı Ekle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Kullanıcı Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300">Kullanıcı Adı</TableHead>
                  <TableHead className="text-slate-300">Ad Soyad</TableHead>
                  <TableHead className="text-slate-300">Rol</TableHead>
                  <TableHead className="text-slate-300">E-posta</TableHead>
                  <TableHead className="text-slate-300">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                      Henüz kullanıcı bulunmuyor
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300 font-medium">{user.username}</TableCell>
                      <TableCell className="text-slate-300">{user.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-emerald-600/20 text-emerald-400' 
                            : 'bg-blue-600/20 text-blue-400'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'İzleyici'}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-300">{user.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
