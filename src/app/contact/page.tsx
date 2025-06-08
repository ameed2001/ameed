
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
import { Mail, Phone, MapPin, Facebook, Instagram, Send, User, MessageSquare, Loader2, Briefcase, Home as HomeIcon, ListChecks } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from '@/components/ui/separator';
// import { sendContactMessageAction, type SendContactMessageResponse } from './actions'; // Temporarily commented out
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// WhatsAppIcon component removed

const contactFormSchemaClient = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  messageType: z.string().min(1, { message: "يرجى اختيار نوع الرسالة." }),
  subject: z.string().min(5, { message: "الموضوع مطلوب (5 أحرف على الأقل)." }),
  message: z.string().min(10, { message: "الرسالة مطلوبة (10 أحرف على الأقل)." }),
});
type ContactFormValues = z.infer<typeof contactFormSchemaClient>;

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
  { name: "WhatsApp", icon: Phone, href: "https://wa.me/972594371424", colorClass: "hover:text-green-500", dataAiHint:"whatsapp contact" }, // Changed icon
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/a.w.samarah3/", colorClass: "hover:text-pink-500", dataAiHint:"instagram profile" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/a.w.samarah4", colorClass: "hover:text-blue-600", dataAiHint: "facebook page" },
];

export default function ContactPageEnhanced() {
  const { toast } = useToast();
  const [isFormLoading, setIsFormLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchemaClient),
    defaultValues: {
      name: "",
      email: "",
      messageType: "",
      subject: "",
      message: "",
    }
  });

  const onFormSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setIsFormLoading(true);
    console.log("Contact form data (SIMULATION - UI ONLY):", data);
    
    // Simulate API call delay or local processing
    await new Promise(resolve => setTimeout(resolve, 500));

    toast({
      title: "تم الإرسال (محاكاة)",
      description: "تم استلام بيانات النموذج (واجهة أمامية فقط).",
      variant: "default",
    });
    form.reset();
    
    // try {
      // const result: SendContactMessageResponse = await sendContactMessageAction(data); // Temporarily commented out

      // if (result.success) {
      //   toast({
      //     title: "تم إرسال رسالتك (محاكاة)",
      //     description: result.message || "تم استلام بيانات النموذج.",
      //     variant: "default",
      //   });
      //   form.reset();
      // } else {
      //   toast({
      //     title: "خطأ في الإرسال (محاكاة)",
      //     description: result.error || "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      //     variant: "destructive",
      //   });
      // }
    // } catch (error) {
    //   console.error("Error submitting contact form (simulation):", error);
    //   toast({
    //     title: "خطأ في الإرسال (محاكاة)",
    //     description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    //     variant: "destructive",
    //   });
    // } finally {
      setIsFormLoading(false);
    // }
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6 text-right">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-1.5 font-semibold text-gray-700">
                            <User className="inline-block ml-2 h-4 w-4 text-gray-500" />الاسم الكامل
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white focus:border-app-gold" placeholder="الاسم الذي تود أن نناديك به" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-1.5 font-semibold text-gray-700">
                            <Mail className="inline-block ml-2 h-4 w-4 text-gray-500" />البريد الإلكتروني
                          </FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="bg-white focus:border-app-gold" placeholder="example@domain.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="messageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block mb-1.5 font-semibold text-gray-700">
                          <ListChecks className="inline-block ml-2 h-4 w-4 text-gray-500" /> نوع الرسالة
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                          <FormControl>
                            <SelectTrigger className="bg-white focus:border-app-gold">
                              <SelectValue placeholder="اختر نوع الرسالة..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general_inquiry">استفسار عام</SelectItem>
                            <SelectItem value="technical_support">دعم فني</SelectItem>
                            <SelectItem value="technical_issue">مشكلة فنية</SelectItem>
                            <SelectItem value="feature_request">اقتراح إضافة</SelectItem>
                            <SelectItem value="modification_request">اقتراح تعديل</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block mb-1.5 font-semibold text-gray-700">
                          <MessageSquare className="inline-block ml-2 h-4 w-4 text-gray-500" />موضوع الرسالة
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white focus:border-app-gold" placeholder="مثال: استفسار بخصوص حساب الكميات" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block mb-1.5 font-semibold text-gray-700">
                          <MessageSquare className="inline-block ml-2 h-4 w-4 text-gray-500" />نص الرسالة
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className="bg-white focus:border-app-gold"
                            placeholder="اكتب استفسارك أو رسالتك هنا..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              </Form>
            </section>
            
            <Separator className="my-8" />

            <section className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">تابعنا على وسائل التواصل الاجتماعي</h3>
              <TooltipProvider>
                <div className="flex justify-center items-center gap-4 md:gap-6">
                  {socialLinks.map((social) => (
                    <Tooltip key={social.name}>
                      <TooltipTrigger asChild>
                        <Link href={social.href} target="_blank" rel="noopener noreferrer"
                              className={cn(
                                "p-3 rounded-full bg-gray-100 text-gray-700 transition-all duration-300 transform hover:scale-110 hover:shadow-md",
                                social.colorClass
                              )}>
                          <social.icon className="h-6 w-6 md:h-7 md:w-7" />
                          <span className="sr-only">{social.name}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>تابعنا على {social.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
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
