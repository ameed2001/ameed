
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash2, KeyRound, UserPlus, UserCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  dbUsers, 
  type User, 
  type UserRole, 
  type UserStatus, 
  deleteUser as dbDeleteUser, 
  updateUser as dbUpdateUser,
  getUsers,
  suspendUser,
  approveEngineer
} from '@/lib/mock-db';

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsersState] = useState<User[]>(dbUsers); 
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const refreshUsersFromDb = () => {
     const usersResponse = getUsers(currentUser.id); 
      if (usersResponse.success && usersResponse.users) {
        setUsersState([...usersResponse.users]);
      } else {
        setUsersState([]); // Or handle error
        toast({ title: "خطأ", description: usersResponse.message || "فشل تحميل المستخدمين.", variant: "destructive" });
      }
  };


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      (user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)) &&
      (roleFilter === 'all' || user.role === roleFilter) &&
      (statusFilter === 'all' || user.status === statusFilter)
    );
  }, [users, searchTerm, roleFilter, statusFilter]);

  const currentUser = { id: 'admin-001', role: 'Admin' }; 

  async function handleDeleteUser(userId: string, userName: string) {
    const result = dbDeleteUser(userId); 
    if (result.success) {
      toast({
        title: "نجاح",
        description: result.message,
        variant: "default",
      });
      refreshUsersFromDb();
    } else {
      toast({
        title: "خطأ",
        description: result.message,
        variant: "destructive",
      });
    }
  }

  async function handleUpdateUser(userId: string, updates: Partial<User>) {
    const result = dbUpdateUser(userId, updates); 
    if (result.success) {
      toast({
        title: "نجاح",
        description: "تم تحديث بيانات المستخدم بنجاح",
        variant: "default",
      });
        refreshUsersFromDb();
    } else {
      toast({ title: "خطأ", description: result.message, variant: "destructive" });
    }
  };
  
  const handleResetPassword = (userName: string) => {
    toast({ title: "إعادة تعيين كلمة المرور", description: `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${userName} (محاكاة).` });
  };

  const handleApproveEngineer = (userId: string, userName: string) => {
    const result = approveEngineer(currentUser.id, userId); 
    if (result.success) {
      refreshUsersFromDb();
      toast({ title: "تمت الموافقة على المهندس", description: `تم تفعيل حساب المهندس ${userName} وجعله نشطاً.`, variant: "default" });
    } else {
      toast({ title: "خطأ", description: result.message, variant: "destructive" });
    }
  };

  const handleSuspendUser = (userId: string, userName: string) => {
    const result = suspendUser(currentUser.id, userId); 
    if (result.success) {
      refreshUsersFromDb();
      toast({ title: "تم التعامل مع المستخدم", description: `${result.message}`, variant: "default" });
    } else {
      toast({ title: "خطأ", description: result.message, variant: "destructive" });
    }
  };

  
   const handleEditUserClick = (user: User) => {
    console.log("Attempting to edit user:", user);
    toast({ title: "تعديل المستخدم", description: `سيتم فتح نموذج لتعديل المستخدم ${user.name} (محاكاة).` });
  };


  const handleAddUser = () => {
    toast({ title: "إضافة مستخدم جديد", description: "سيتم فتح نموذج لإضافة مستخدم جديد (محاكاة)." });
  };

  // Initial fetch of users
  React.useEffect(() => {
    refreshUsersFromDb();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <Card className="bg-white/95 shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-app-red">إدارة المستخدمين</CardTitle>
        <CardDescription className="text-gray-600">عرض، بحث، وتعديل حسابات المستخدمين في النظام.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-right">
        <div className="flex flex-col sm:flex-row gap-4 items-center p-4 border rounded-lg bg-gray-50">
          <div className="relative flex-grow w-full sm:w-auto">
            <Input
              type="search"
              placeholder="ابحث بالاسم، البريد الإلكتروني..."
              value={searchTerm}
              onChange={handleSearch}
              className="pr-10 bg-white focus:border-app-gold"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter} dir="rtl">
            <SelectTrigger className="w-full sm:w-auto bg-white focus:border-app-gold text-right">
              <SelectValue placeholder="تصفية حسب الدور..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأدوار</SelectItem>
              <SelectItem value="Engineer">مهندس</SelectItem>
              <SelectItem value="Owner">مالك</SelectItem>
              <SelectItem value="Admin">مشرف</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter} dir="rtl">
            <SelectTrigger className="w-full sm:w-auto bg-white focus:border-app-gold text-right">
              <SelectValue placeholder="تصفية حسب الحالة..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="Active">نشط</SelectItem>
              <SelectItem value="Pending Approval">بانتظار الموافقة</SelectItem>
              <SelectItem value="Suspended">معلق</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddUser} className="w-full sm:w-auto bg-app-red hover:bg-red-700 text-white">
            <UserPlus className="ms-2 h-4 w-4" /> إضافة مستخدم
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-right font-semibold text-gray-700">الاسم</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">البريد الإلكتروني</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الدور</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الحالة</TableHead>
                <TableHead className="text-center font-semibold text-gray-700">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role === 'Engineer' ? 'مهندس' : user.role === 'Owner' ? 'مالك' : 'مشرف'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' :
                      user.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700' // Suspended
                    }`}>
                      {user.status === 'Active' ? 'نشط' : user.status === 'Pending Approval' ? 'بانتظار الموافقة' : 'معلق'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center space-x-1 space-x-reverse">
                    {user.role === 'Engineer' && user.status === 'Pending Approval' && (
                       <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800 hover:bg-green-100" title="موافقة على المهندس" onClick={() => handleApproveEngineer(user.id, user.name)}>
                        <UserCheck className="h-5 w-5" /><span className="sr-only">موافقة</span>
                      </Button>
                    )}
                     {user.role !== 'Admin' && ( // Admins cannot suspend other admins or themselves via this button typically
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={user.status === 'Suspended' ? "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100" : "text-orange-600 hover:text-orange-800 hover:bg-orange-100"}
                            title={user.status === 'Suspended' ? "إلغاء تعليق المستخدم" : "تعليق المستخدم"}
                            onClick={() => handleSuspendUser(user.id, user.name)}
                        >
                          <Edit className="h-5 w-5" /> {/* Icon can be changed for suspend/unsuspend */}
                          <span className="sr-only">{user.status === 'Suspended' ? "إلغاء تعليق" : "تعليق"}</span>
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100" title="تعديل" onClick={() => handleEditUserClick(user)}>
                      <Edit className="h-5 w-5" /><span className="sr-only">تعديل</span>
                    </Button>
                    {user.role !== 'Admin' && (
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800 hover:bg-red-100" title="حذف">
                            <Trash2 className="h-5 w-5" /><span className="sr-only">حذف</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription>
                                هل أنت متأكد أنك تريد حذف المستخدم "{user.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id, user.name)} className="bg-destructive hover:bg-destructive/90">
                                حذف
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <Button variant="ghost" size="icon" className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100" title="إعادة تعيين كلمة المرور" onClick={() => handleResetPassword(user.name)}>
                      <KeyRound className="h-5 w-5" /><span className="sr-only">إعادة تعيين كلمة المرور</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    لا يوجد مستخدمون يطابقون معايير البحث أو التصفية.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {filteredUsers.length > 0 && (
            <p className="text-xs text-gray-500 text-center">يتم عرض {filteredUsers.length} من إجمالي {users.length} مستخدم.</p>
        )}
      </CardContent>
    </Card>
  );
}

