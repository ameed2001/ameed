
"use client";
// src/components/OwnerSidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Folder as FolderIcon, BarChart2 as BarChartIcon, Camera as CameraIcon, Clock as ClockIcon, MessageSquare as MessageSquareIcon, LogOut as LogOutIcon } from 'lucide-react';

interface OwnerSidebarProps {
  // You might add props here later, e.g., for active link styling or user info
}

export default function OwnerSidebar({}: OwnerSidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/owner/dashboard', label: 'لوحة التحكم الرئيسية', icon: HomeIcon },
    { href: '/owner/projects', label: 'مشاريعي', icon: FolderIcon },
    { href: '/owner/reports', label: 'تقارير الكميات', icon: BarChartIcon }, // Assuming a reports page
    { href: '/owner/visual-progress', label: 'تقدم المشروع بصريًا', icon: CameraIcon }, // Assuming a visual progress page
    { href: '/owner/timeline', label: 'الجدول الزمني للمشاريع', icon: ClockIcon }, // Assuming a timeline page
    { href: '/owner/comments', label: 'التعليقات والاستفسارات', icon: MessageSquareIcon }, // Assuming a comments page
    // { href: '/owner/more-tools', label: 'أدوات أخرى', icon: CogIcon }, // هذا الرابط مخصص لأدوات إضافية سيتم تنفيذها في المستقبل
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 text-center text-xl font-bold text-app-gold">
        لوحة المالك
      </div>
      <nav className="flex-grow">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={`flex items-center p-4 hover:bg-gray-700 ${pathname === link.href ? 'bg-gray-700 border-r-4 border-app-gold' : ''}`}>
                <link.icon className="ml-3 h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        {/* Placeholder for Logout functionality */}
        <button className="flex items-center w-full p-4 text-red-400 hover:bg-gray-700" onClick={() => {
          // Handle logout logic here
          console.log('Logging out...');
          // Redirect to login page
          // router.push('/owner-login');
        }}>
          <LogOutIcon className="ml-3 h-5 w-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
