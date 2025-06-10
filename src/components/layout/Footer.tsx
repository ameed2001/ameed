
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

// SVG for WhatsApp icon (consistent with Header.tsx)
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.33 3.43 16.79L2.05 22L7.31 20.62C8.72 21.33 10.33 21.72 12.04 21.72C17.5 21.72 21.95 17.27 21.95 11.81C21.95 6.35 17.5 2 12.04 2M12.04 3.64C16.57 3.64 20.27 7.34 20.27 11.81C20.27 16.28 16.57 19.98 12.04 19.98C10.53 19.98 9.11 19.59 7.89 18.9L7.47 18.67L4.8 19.44L5.58 16.87L5.32 16.41C4.56 15.04 4.14 13.48 4.14 11.91C4.14 7.44 7.84 3.74 12.04 3.64M17.46 14.85C17.18 15.28 16.17 15.89 15.68 15.98C15.19 16.07 14.69 16.16 12.91 15.46C10.77 14.63 9.23 12.76 9.03 12.5C8.82 12.24 7.94 11.03 7.94 10.04C7.94 9.06 8.38 8.66 8.6 8.44C8.82 8.22 9.14 8.15 9.36 8.15C9.54 8.15 9.71 8.15 9.85 8.16C10.03 8.17 10.17 8.18 10.34 8.49C10.58 8.91 11.06 10.11 11.15 10.25C11.24 10.39 11.29 10.58 11.15 10.76C11.01 10.94 10.92 11.03 10.74 11.25C10.56 11.47 10.38 11.61 10.25 11.75C10.11 11.89 9.95 12.09 10.14 12.41C10.32 12.73 11.08 13.62 11.96 14.36C13.08 15.29 13.94 15.52 14.21 15.52C14.48 15.52 14.98 15.47 15.21 15.2C15.49 14.88 15.83 14.44 16.01 14.21C16.19 13.98 16.41 13.94 16.64 14.03C16.86 14.12 17.84 14.63 18.12 14.77C18.4 14.91 18.54 15 18.63 15.1C18.72 15.19 18.45 15.57 17.46 14.85Z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-header-bg text-header-fg py-8 px-4 md:px-6 shadow-header-footer mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
        
        <div>
          <div className="flex items-center justify-end mb-4">
            <Image 
              src="https://i.imgur.com/79bO3U2.jpg" 
              alt="شعار الموقع" 
              width={50} 
              height={50} 
              className="rounded-full border-2 border-app-gold"
              data-ai-hint="logo construction"
            />
            <h3 className="text-app-red text-xl font-bold mr-3">المحترف لحساب الكميات</h3>
          </div>
          <p className="text-sm text-gray-300">
            نقدم أدوات دقيقة وسهلة الاستخدام لحساب كميات مواد البناء لمشاريعكم الإنشائية.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-app-gold mb-3">روابط سريعة</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-gray-300 hover:text-app-gold">الرئيسية</Link></li>
            <li><Link href="/about" className="text-gray-300 hover:text-app-gold">عن الموقع</Link></li>
            <li><Link href="/contact" className="text-gray-300 hover:text-app-gold">تواصل معنا</Link></li>
            <li><Link href="/help" className="text-gray-300 hover:text-app-gold">مركز المساعدة</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-app-gold mb-3">تواصل معنا</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-end gap-2">
              <span className="text-gray-300"><a href="mailto:mediaplus64@gmail.com">mediaplus64@gmail.com</a></span>
              <Mail size={18} className="text-app-gold shrink-0" />
            </li>
            <li className="flex items-center justify-end gap-2">
              <span className="text-gray-300">+972594371424</span>
              <Phone size={18} className="text-app-gold shrink-0" />
            </li>
            <li className="flex items-center justify-end gap-2">
              <span className="text-gray-300">سلفيت فلسطين</span>
              <MapPin size={18} className="text-app-gold shrink-0" />
            </li>
          </ul>
          <div className="flex justify-end gap-3 mt-4">
            <Link href="https://wa.me/972594371424" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-social-whatsapp">
              <WhatsAppIcon className="h-6 w-6" />
            </Link>
            <Link href="https://www.instagram.com/a.w.samarah3/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-social-instagram">
              <Instagram size={24} />
            </Link>
            <Link href="https://www.facebook.com/a.w.samarah4" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-social-facebook">
              <Facebook size={24} />
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 pt-8 mt-8 border-t border-gray-700">
        <p>&copy; {currentYear} المحترف لحساب الكميات. جميع الحقوق محفوظة.</p>
        <p>تصميم وتطوير: <Link href="https://www.facebook.com/a.w.samarah4" target="_blank" rel="noopener noreferrer" className="text-app-gold hover:underline">عميد سماره</Link></p>
      </div>
    </footer>
  );
};

export default Footer;
