
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
    <footer className="mt-auto">
      {/* Top Grey Section */}
      <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-right">
            {/* About Section - Far Right in RTL */}
            <div className="sm:col-span-2 lg:col-span-1 lg:order-last">
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
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                نقدم أدوات دقيقة وسهلة الاستخدام لحساب كميات مواد البناء لمشاريعكم الإنشائية، مع إرشادات ونصائح هندسية قيمة.
              </p>
              {/* Social Media Icons - Styled as squares */}
              <div className="flex justify-end gap-2 mt-4">
                <Link href="https://wa.me/972594371424" target="_blank" rel="noopener noreferrer" title="WhatsApp"
                      className="p-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition-colors">
                  <WhatsAppIcon className="h-5 w-5" />
                </Link>
                <Link href="https://www.instagram.com/a.w.samarah3/" target="_blank" rel="noopener noreferrer" title="Instagram"
                      className="p-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition-colors">
                  <Instagram size={20} />
                </Link>
                <Link href="https://www.facebook.com/a.w.samarah4" target="_blank" rel="noopener noreferrer" title="Facebook"
                      className="p-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition-colors">
                  <Facebook size={20} />
                </Link>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="lg:order-2">
              <h4 className="text-lg font-bold text-app-red border-b-2 border-app-red pb-1 mb-3 inline-block">روابط سريعة</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-app-gold transition-colors duration-200">الرئيسية</Link></li>
                <li><Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-app-gold transition-colors duration-200">عن الموقع</Link></li>
                <li><Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-app-gold transition-colors duration-200">تواصل معنا</Link></li>
                <li><Link href="/help" className="text-gray-700 dark:text-gray-300 hover:text-app-gold transition-colors duration-200">مركز المساعدة</Link></li>
                <li><Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-app-gold transition-colors duration-200">تسجيل الدخول</Link></li>
                <li><Link href="/signup" className="text-gray-700 dark:text-gray-300 hover:text-app-gold transition-colors duration-200">إنشاء حساب</Link></li>
              </ul>
            </div>

            {/* Contact Info Section */}
            <div className="lg:order-1">
              <h4 className="text-lg font-bold text-app-red border-b-2 border-app-red pb-1 mb-3 inline-block">اتصل بنا</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-end gap-2">
                  <span className="text-gray-700 dark:text-gray-300 hover:text-app-gold transition-colors duration-200"><a href="mailto:mediaplus64@gmail.com">mediaplus64@gmail.com</a></span>
                  <Mail size={18} className="text-app-red shrink-0" />
                </li>
                <li className="flex items-center justify-end gap-2">
                  <span className="text-gray-700 dark:text-gray-300">+972594371424</span>
                  <Phone size={18} className="text-app-red shrink-0" />
                </li>
                <li className="flex items-center justify-end gap-2">
                  <span className="text-gray-700 dark:text-gray-300">سلفيت فلسطين</span>
                  <MapPin size={18} className="text-app-red shrink-0" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Silhouette Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-0 md:py-0"> {/* Reduced padding */}
        <div className="container mx-auto px-0">
          <Image
            src="https://placehold.co/1200x100/E8E8E8/B40404?text=Construction+Silhouette" // Placeholder with red text on grey
            alt="Construction Silhouette"
            width={1200}
            height={100} // Adjusted height
            className="w-full h-auto max-h-[100px] object-cover" // Made responsive and constrained height
            data-ai-hint="construction workers silhouette"
          />
        </div>
      </div>

      {/* Bottom Red Bar */}
      <div className="bg-app-red text-white text-xs text-center py-3">
        <p>&copy; {currentYear} المحترف لحساب الكميات. جميع الحقوق محفوظة.</p>
        <p className="mt-1">تصميم وتطوير: <Link href="https://www.facebook.com/a.w.samarah4" target="_blank" rel="noopener noreferrer" className="hover:text-app-gold transition-colors">عميد سماره</Link></p>
      </div>
    </footer>
  );
};

export default Footer;

    