
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash2, KeyRound, CheckCircle, UserPlus, Filter } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Engineer' | 'Admin';
  status: 'Active' | 'Pending Approval' | 'Suspended';
}

const mockUsers: User[] = [
  { id: 'u1', name: 'أحمد محمود', email: 'ahmad@example.com', role: 'Engineer', status: 'Pending Approval' },
  { id: 'u2', name: 'فاطمة علي', email: 'fatima@example.com', role: 'Owner', status: 'Active' },
  { id: 'u3', name: 'المشرف العام', email: 'admin@example.com', role: 'Admin', status: 'Active' },
  { id: 'u4', name: 'خالد إبراهيم', email: 'khalid@example.com', role: 'Engineer', status: 'Active' },
  { id: 'u5', name: 'سارة ياسين', email: 'sara@example.com', role: 'Owner', status: 'Suspended' },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    user.role.toLowerCase().includes(searchTerm)
  );

  const handleEditUser = (userId: string) => {
    toast({ title: "تعديل المستخدم", description: `بدء تعديل المستخدم ${userId} (محاكاة).` });
    // Logic for opening an edit modal/form would go here
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    // Simulate backend deletion
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({ title: "تم حذف المستخدم", description: `تم حذف المستخدم ${userName} بنجاح (محاكاة).`, variant: "destructive" });
  };
  
  const handleResetPassword = (userName: string) => {
    toast({ title: "إعادة تعيين كلمة المرور", description: `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${userName} (محاكاة).` });
  };

  const handleApproveEngineer = (userId: string, userName: string) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === userId ? {...user, status: 'Active'} : user));
    toast({ title: "تمت الموافقة على المهندس", description: `تم تفعيل حساب المهندس ${userName} (محاكاة).` });
  };


  return (
    <Card className="bg-white/95 shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-app-red">إدارة المستخدمين</CardTitle>
        <CardDescription className="text-gray-600">عرض، بحث، وتعديل حسابات المستخدمين في النظام.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-right">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder="ابحث بالاسم، البريد الإلكتروني، أو الدور..."
              value={searchTerm}
              onChange={handleSearch}
              className="pr-10 bg-white focus:border-app-gold"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button variant="outline" className="border-app-gold text-app-gold hover:bg-app-gold/10">
            <Filter className="ms-2 h-4 w-4" /> تطبيق الفلاتر
          </Button>
          <Button className="bg-app-red hover:bg-red-700 text-white">
            <UserPlus className="ms-2 h-4 w-4" /> إضافة مستخدم جديد
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
                      'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'Active' ? 'نشط' : user.status === 'Pending Approval' ? 'بانتظار الموافقة' : 'معلق'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center space-x-1 space-x-reverse">
                    {user.role === 'Engineer' && user.status === 'Pending Approval' && (
                       <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800 hover:bg-green-100" onClick={() => handleApproveEngineer(user.id, user.name)}>
                        <CheckCircle className="h-5 w-5" /><span className="sr-only">موافقة</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100" onClick={() => handleEditUser(user.id)}>
                      <Edit className="h-5 w-5" /><span className="sr-only">تعديل</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800 hover:bg-red-100">
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
                    <Button variant="ghost" size="icon" className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100" onClick={() => handleResetPassword(user.name)}>
                      <KeyRound className="h-5 w-5" /><span className="sr-only">إعادة تعيين كلمة المرور</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    لا يوجد مستخدمون يطابقون معايير البحث.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

