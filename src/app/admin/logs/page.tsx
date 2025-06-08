
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ScrollText, Search, CalendarIcon, Download } from 'lucide-react'; // Removed Filter icon as Select is used
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale'; // For Arabic date formatting
import { useToast } from "@/hooks/use-toast";


interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  message: string;
  user?: string; // Optional user associated with the log
}

const mockLogs: LogEntry[] = [
  { id: 'log1', timestamp: new Date(2024, 5, 8, 10, 30, 0), level: 'INFO', message: 'المستخدم "admin@example.com" قام بتسجيل الدخول.', user: 'admin@example.com' },
  { id: 'log2', timestamp: new Date(2024, 5, 8, 10, 35, 12), level: 'SUCCESS', message: 'تمت الموافقة على المهندس "أحمد محمود".', user: 'admin@example.com' },
  { id: 'log3', timestamp: new Date(2024, 5, 8, 11, 0, 5), level: 'INFO', message: 'تم إنشاء مشروع جديد: "مشروع بناء فيلا النرجس".', user: 'م. خالد الأحمدي' },
  { id: 'log4', timestamp: new Date(2024, 5, 8, 11, 15, 45), level: 'WARNING', message: 'محاولة تسجيل دخول فاشلة للحساب "user@test.com".' },
  { id: 'log5', timestamp: new Date(2024, 5, 8, 12, 5, 22), level: 'ERROR', message: 'فشل في الاتصال بخادم قاعدة البيانات (محاكاة).', },
  { id: 'log6', timestamp: new Date(2024, 5, 7, 15, 0, 0), level: 'INFO', message: 'تم تحديث إعدادات النظام.', user: 'admin@example.com' },
  { id: 'log7', timestamp: new Date(2024, 5, 7, 16, 20, 30), level: 'SUCCESS', message: 'تم حذف المستخدم "suspended@example.com".', user: 'admin@example.com' },
];

export default function AdminLogsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevelFilter, setLogLevelFilter] = useState<string>('all');
  // Add date filter states if needed: const [dateFilter, setDateFilter] = useState<Date | undefined>();

  const filteredLogs = useMemo(() => {
    return mockLogs
      .filter(log => {
        const matchesSearch = searchTerm === '' || 
                              log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesLevel = logLevelFilter === 'all' || log.level === logLevelFilter;
        // Add date filter logic here if implementing
        return matchesSearch && matchesLevel;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by newest first
  }, [searchTerm, logLevelFilter]);

  const getLogLevelStyles = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR': return 'bg-red-100 text-red-700 border-red-500';
      case 'WARNING': return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case 'SUCCESS': return 'bg-green-100 text-green-700 border-green-500';
      case 'INFO':
      default: return 'bg-blue-100 text-blue-700 border-blue-500';
    }
  };
  
  const handleExportLogs = () => {
    // Simulate log export
    const logData = filteredLogs.map(log => `${format(log.timestamp, "yyyy/MM/dd HH:mm:ss", { locale: arSA })} | ${log.level} | ${log.user || 'N/A'} | ${log.message}`).join("\n");
    const blob = new Blob([logData], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'system_logs.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    toast({ title: "تم تصدير السجلات", description: "تم بدء تنزيل ملف السجلات المصفاة (محاكاة)." });
  };


  return (
    <Card className="bg-white/95 shadow-xl w-full">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <CardTitle className="text-3xl font-bold text-app-red flex items-center gap-2">
                <ScrollText className="h-8 w-8" /> سجلات النظام
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">مراجعة وتصفية أنشطة وأحداث النظام الهامة.</CardDescription>
        </div>
        <Button onClick={handleExportLogs} variant="outline" className="mt-4 sm:mt-0 border-app-gold text-app-gold hover:bg-app-gold/10">
          <Download className="ms-2 h-4 w-4" /> تصدير السجلات
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 text-right">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
          <div className="relative md:col-span-2">
            <Input
              type="search"
              placeholder="ابحث في رسائل السجل أو المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-white focus:border-app-gold"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Select value={logLevelFilter} onValueChange={setLogLevelFilter} dir="rtl">
            <SelectTrigger className="w-full bg-white focus:border-app-gold text-right">
              <SelectValue placeholder="تصفية حسب المستوى..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المستويات</SelectItem>
              <SelectItem value="INFO">معلومات (INFO)</SelectItem>
              <SelectItem value="SUCCESS">نجاح (SUCCESS)</SelectItem>
              <SelectItem value="WARNING">تحذير (WARNING)</SelectItem>
              <SelectItem value="ERROR">خطأ (ERROR)</SelectItem>
            </SelectContent>
          </Select>
          {/* Placeholder for Date Filter
          <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
            <CalendarIcon className="ml-2 h-4 w-4" />
            تاريخ (قريبًا)
          </Button>
          */}
        </div>

        <ScrollArea className="h-[500px] rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-100 z-10">
              <TableRow>
                <TableHead className="w-[180px] text-right font-semibold text-gray-700">الوقت والتاريخ</TableHead>
                <TableHead className="w-[100px] text-right font-semibold text-gray-700">المستوى</TableHead>
                <TableHead className="w-[150px] text-right font-semibold text-gray-700">المستخدم</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الرسالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50/50 text-sm">
                  <TableCell className="whitespace-nowrap">
                    {format(log.timestamp, "yyyy/MM/dd HH:mm:ss", { locale: arSA })}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getLogLevelStyles(log.level)}`}>
                      {log.level}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{log.user || 'نظام'}</TableCell>
                  <TableCell className="leading-relaxed">{log.message}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-10">
                    لا توجد سجلات تطابق معايير البحث أو التصفية.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        {filteredLogs.length > 0 && (
            <p className="text-xs text-gray-500 text-center">يتم عرض {filteredLogs.length} من إجمالي {mockLogs.length} سجل.</p>
        )}
      </CardContent>
    </Card>
  );
}
