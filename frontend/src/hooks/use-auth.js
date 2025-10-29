// Rol bazlı yetkilendirme helper'ı
export const useAuth = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return {
    user,
    isAdmin: () => user.role === 'admin',
    isViewer: () => user.role === 'viewer',
    canEdit: () => user.role === 'admin',
    canDelete: () => user.role === 'admin',
    canAdd: () => user.role === 'admin',
  };
};

// Kullanım: 
// const { canEdit, canDelete, canAdd } = useAuth();
// {canAdd() && <Button>Ekle</Button>}
