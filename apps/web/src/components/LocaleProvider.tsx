'use client';

import { ReactNode, useEffect } from 'react';
import { Language } from '@shora/common/models/types';

type LocaleProviderProps = {
  children: ReactNode;
  locale: Language;
};

export default function LocaleProvider({ children, locale }: LocaleProviderProps) {
  useEffect(() => {
    // Set the HTML lang attribute according to the current locale
    document.documentElement.lang = locale;
  }, [locale]);

  return <>{children}</>;
} 