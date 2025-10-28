import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { userApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Shield, User } from 'lucide-react';

export const Users = () => {
  const [users, setUsers] = useState([]);
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

  return (
    <div className="space-y-6" data-testid="users-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Kullanıcı Yönetimi</h1>
        <p className="text-slate-400 mt-1">Sistem kullanıcılarını yönetin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">
              Toplam Kullanıcı
            </CardTitle>
            <User className="h-6 w-6 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{users.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">
              Admin Kullanıcılar
            </CardTitle>
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
            <CardTitle className="text-sm font-medium text-white/90">
              Normal Kullanıcılar
            </CardTitle>
            <User className="h-6 w-6 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {users.filter(u => u.role !== 'admin').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Kullanıcı Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">Kullanıcı Adı</TableHead>
                  <TableHead className="text-slate-300">Ad Soyad</TableHead>
                  <TableHead className="text-slate-300">Rol</TableHead>
                  <TableHead className="text-slate-300">E-posta</TableHead>
                  <TableHead className="text-slate-300">Oluşturma Tarihi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                      Henüz kullanıcı kaydı bulunmuyor
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300">{user.username}</TableCell>
                      <TableCell className="text-slate-300">{user.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-emerald-600/20 text-emerald-400' 
                            : 'bg-blue-600/20 text-blue-400'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-300">{user.email}</TableCell>
                      <TableCell className="text-slate-300">{user.createdAt}</TableCell>
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