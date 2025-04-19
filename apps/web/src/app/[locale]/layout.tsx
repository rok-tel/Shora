import { ReactNode } from 'react'
import { Language } from '@shora/common/models/types'
import { redirect } from 'next/navigation'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getDictionary } from '@/i18n/config';
import "../../styles/globals.css";

// Define the expected locales
const EXPECTED_LOCALES = ['en', 'he']

type LocaleLayoutProps = {
  children: ReactNode
  params: {
    locale: Language
  }
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // Validate locale
  if (!EXPECTED_LOCALES.includes(locale)) {
    console.log(`Invalid locale: ${locale}, redirecting to /en`);
    redirect('/en');
  }

  // Get the dictionary for the current locale
  const dict = await getDictionary(locale);
  
  // Determine text direction based on locale
  const dir = locale === 'he' ? 'rtl' : 'ltr';
  
  return (
    <html lang={locale} dir={dir}>
      <body className="antialiased min-h-screen bg-gray-50 flex flex-col">
        <Header locale={locale} dict={dict} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
