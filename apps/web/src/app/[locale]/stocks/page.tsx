import { Language } from '@shora/common/models/types';
import { getDictionary } from '@/i18n/config';

type StocksPageProps = {
  params: {
    locale: Language;
  };
};

export default async function StocksPage({ params: { locale } }: StocksPageProps) {
  // Get the dictionary for the current locale
  const dict = await getDictionary(locale);
  
  return (
    <div className="grid grid-rows-[auto_1fr] items-center justify-items-center min-h-[50vh] p-8 gap-8">
      <div className="bg-purple-100 p-4 rounded border border-purple-300 shadow">
        <h1 className="text-2xl font-bold text-purple-800">{dict.stocks.title}</h1>
        <p className="text-purple-600">{dict.stocks.description}</p>
      </div>
      <div className="bg-white p-4 rounded border border-gray-300 shadow w-full">
        <div className="mb-4">
          <input 
            type="text" 
            placeholder={dict.stocks.search} 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">{dict.stocks.marketOverview}</h2>
            <p className="text-gray-600">Market data will appear here</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">{dict.stocks.sectors}</h2>
            <p className="text-gray-600">Sector performance will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}