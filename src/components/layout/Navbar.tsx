
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, Phone, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/about', label: 'عن الموقع', icon: Info },
  { href: '/help', label: 'المساعدة', icon: HelpCircle },
  { href: 'https://forms.gle/WaXPkD8BZMQ7pVev6', label: 'تواصل معنا', icon: Phone, isExternal: true },
];

export default function Navbar() {
  const pathname = usePathname();

  // The sticky top position should be equal to the height of the Header component.
  // Header has InfoBar (py-1.5 = 12px) + Main Header (h-20 = 80px) + borders.
  // Let's approximate and use a value like 108px for sticky positioning.
  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b shadow-sm sticky top-[108px] z-40">
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-14">
          <ul className="flex space-x-6 rtl:space-x-reverse">
            {navLinks.map((link) => {
                const isActive = !link.isExternal && pathname === link.href;
                const LinkComponent = link.isExternal ? 'a' : Link;
                const linkProps = link.isExternal ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' } : { href: link.href };
              
                return (
                  <li key={link.href}>
                    <LinkComponent
                      {...linkProps}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md font-medium text-sm transition-all duration-200 border-b-2 border-transparent",
                        isActive
                          ? "text-primary border-primary"
                          : "text-muted-foreground hover:text-primary hover:border-primary/50"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </LinkComponent>
                  </li>
                );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
