import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const Users = () => {
  return (
    <div className="space-y-6" data-testid="users-page">
      <div>
        <h1 className="text-3xl font-bold text-white">Kullanıcı Yönetimi</h1>
        <p className="text-slate-400 mt-1">Kullanıcıları yönetin</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-8 text-center">
          <p className="text-slate-400">Henüz kullanıcı kaydı bulunmuyor.</p>
        </CardContent>
      </Card>
    </div>
  );
};