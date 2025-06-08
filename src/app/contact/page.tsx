
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Facebook, Instagram, Send, User, MessageSquare, Loader2, Briefcase, Home as HomeIcon } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from '@/components/ui/separator';

// SVG for WhatsApp icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.33 3.43 16.79L2.05 22L7.31 20.62C8.72 21.33 10.33 21.72 12.04 21.72C17.5 21.72 21.95 17.27 21.95 11.81C21.95 6.35 17.5 2 12.04 2M12.04 3.64C16.57 3.64 20.27 7.34 20.27 11.81C20.27 16.28 16.57 19.98 12.04 19.98C10.53 19.98 9.11 19.59 7.89 18.9L7.47 18.67L4.8 19.44L5.58 16.87L5.32 16.41C4.56 15.04 4.14 13.48 4.14 11.91C4.14 7.44 7.84 3.74 12.04 3.64M17.46 14.85C17.18 15.28 16.17 15.89 15.68 15.98C15.19 16.07 14.69 16.16 12.91 15.46C10.77 14.63 9.23 12.76 9.03 12.5C8.82 12.24 7.94 11.03 7.94 10.04C7.94 9.06 8.38 8.66 8.6 8.44C8.82 8.22 9.14 8.15 9.36 8.15C9.54 8.15 9.71 8.15 9.85 8.16C10.03 8.17 10.17 8.18 10.34 8.49C10.58 8.91 11.06 10.11 11.15 10.25C11.24 10.39 11.29 10.58 11.15 10.76C11.01 10.94 10.92 11.03 10.74 11.25C10.56 11.47 10.38 11.61 10.25 11.75C10.11 11.89 9.95 12.09 10.14 12.41C10.32 12.73 11.08 13.62 11.96 14.36C13.08 15.29 13.94 15.52 14.21 15.52C14.48 15.52 14.98 15.47 15.21 15.2C15.49 14.88 15.83 14.44 16.01 14.21C16.19 13.98 16.41 13.94 16.64 14.03C16.86 14.12 17.84 14.63 18.12 14.77C18.4 14.91 18.54 15 18.63 15.1C18.72 15.19 18.45 15.57 17.46 14.85Z" />
  </svg>
);

const contactFormSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  subject: z.string().min(5, { message: "الموضوع مطلوب (5 أحرف على الأقل)." }),
  message: z.string().min(10, { message: "الرسالة مطلوبة (10 أحرف على الأقل)." }),
});
type ContactFormValues = z.infer<typeof contactFormSchema>;

const contactMethods = [
  {
    icon: Mail,
    label: "البريد الإلكتروني:",
    value: "mediaplus64@gmail.com",
    href: "mailto:mediaplus64@gmail.com",
    dataAiHint: "email address"
  },
  {
    icon: Phone,
    label: "الهاتف / واتساب:",
    value: "+972 594 371 424",
    href: "tel:+972594371424",
    dataAiHint: "phone number"
  },
  {
    icon: MapPin,
    label: "الموقع:",
    value: "سلفيت، فلسطين",
    href: "https://maps.google.com/?q=Salfit,Palestine", 
    dataAiHint: "office location"
  },
  {
    icon: Briefcase, 
    label: "أوقات العمل:",
    value: "الأحد - الخميس، 9 صباحًا – 4 مساءً",
    dataAiHint: "working hours"
  }
];

const socialLinks = [
  { name: "WhatsApp", icon: WhatsAppIcon, href: "https://wa.me/972594371424", colorClass: "hover:text-green-500", dataAiHint:"whatsapp contact" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/a.w.samarah3/", colorClass: "hover:text-pink-500", dataAiHint:"instagram profile" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/a.w.samarah4", colorClass: "hover:text-blue-600", dataAiHint: "facebook page" },
];


export default function ContactPageEnhanced() {
  const { toast } = useToast();
  const [isFormLoading, setIsFormLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onFormSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setIsFormLoading(true);
    console.log("Contact form data:", data); 
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "تم إرسال رسالتك بنجاح!",
      description: "سيتواصل معك فريقنا في أقرب وقت ممكن.",
      variant: "default",
    });
    reset();
    setIsFormLoading(false);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-4xl mx-auto bg-white/95 shadow-xl border border-gray-200/80">
          <CardHeader className="text-center pb-4">
            <HomeIcon className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">تواصل معنا</CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
              نحن هنا لخدمتك والإجابة على كل استفساراتك. فريقنا متخصص ومستعد لمساعدتك في أسرع وقت ممكن.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 px-4 md:px-8 py-6">
            
            <section>
              <h2 className="text-2xl font-semibold text-app-red text-right mb-6 pb-2 border-b-2 border-app-gold">
                معلومات الاتصال المباشر
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-right">
                {contactMethods.map((method) => (
                  <div key={method.label} className="flex items-start justify-end gap-3 group" data-ai-hint={method.dataAiHint}>
                    <method.icon className="h-7 w-7 text-app-red mt-1 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{method.label}</p>
                      {method.href ? (
                        <a
                          href={method.href}
                          target={method.href.startsWith('http') ? '_blank' : undefined}
                          rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-gray-600 hover:text-app-gold transition-colors duration-200 break-words"
                        >
                          {method.value}
                        </a>
                      ) : (
                        <p className="text-gray-600">{method.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold text-app-red text-right mb-6 pb-2 border-b-2 border-app-gold">
                أرسل لنا رسالة سريعة
              </h2>
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 text-right">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="block mb-1.5 font-semibold text-gray-700">
                      <User className="inline-block ml-2 h-4 w-4 text-gray-500" />الاسم الكامل
                    </Label>
                    <Input id="name" {...register("name")} className="bg-white focus:border-app-gold" placeholder="الاسم الذي تود أن نناديك به" />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email" className="block mb-1.5 font-semibold text-gray-700">
                      <Mail className="inline-block ml-2 h-4 w-4 text-gray-500" />البريد الإلكتروني
                    </Label>
                    <Input id="email" type="email" {...register("email")} className="bg-white focus:border-app-gold" placeholder="example@domain.com" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject" className="block mb-1.5 font-semibold text-gray-700">
                    <MessageSquare className="inline-block ml-2 h-4 w-4 text-gray-500" />موضوع الرسالة
                  </Label>
                  <Input id="subject" {...register("subject")} className="bg-white focus:border-app-gold" placeholder="مثال: استفسار بخصوص حساب الكميات" />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <Label htmlFor="message" className="block mb-1.5 font-semibold text-gray-700">
                    <MessageSquare className="inline-block ml-2 h-4 w-4 text-gray-500" />نص الرسالة
                  </Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    rows={5}
                    className="bg-white focus:border-app-gold"
                    placeholder="اكتب استفسارك أو رسالتك هنا..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full md:w-auto bg-app-red hover:bg-red-700 text-white font-bold py-3 px-8 text-lg" disabled={isFormLoading}>
                  {isFormLoading ? (
                    <>
                      <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="ms-2 h-5 w-5" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </form>
            </section>
            
            <Separator className="my-8" />

            <section className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">تابعنا على وسائل التواصل الاجتماعي</h3>
              <div className="flex justify-center items-center gap-4 md:gap-6">
                {socialLinks.map((social) => (
                  <TooltipProvider key={social.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={social.href} target="_blank" rel="noopener noreferrer"
                              className={`p-3 rounded-full bg-gray-100 text-gray-700 ${social.colorClass} transition-all duration-300 transform hover:scale-110 hover:shadow-md`}>
                          <social.icon className="h-6 w-6 md:h-7 md:w-7" />
                          <span className="sr-only">{social.name}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>تابعنا على {social.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </section>

            <div className="mt-10 md:hidden text-center">
              <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg">
                <a href="tel:+972594371424">
                  <Phone className="ms-2 h-5 w-5" />
                  اتصل بنا الآن
                </a>
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
