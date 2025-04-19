import { Language } from '@shora/common/models/types';
import { getDictionary } from '@/i18n/config';

type BenefitsPageProps = {
  params: {
    locale: Language;
  };
};

export default async function BenefitsPage({ params: { locale } }: BenefitsPageProps) {
  // Get the dictionary for the current locale
  const dict = await getDictionary(locale);
  
  return (
    <div className="grid grid-rows-[auto_1fr] items-center justify-items-center min-h-[50vh] p-8 gap-8">
      <div className="bg-red-100 p-4 rounded border border-red-300 shadow">
        <h1 className="text-2xl font-bold text-red-800">{dict.benefits.title}</h1>
        <p className="text-red-600">Discover the advantages of our premium subscription</p>
      </div>
      <div className="bg-white p-4 rounded border border-gray-300 shadow w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">{dict.benefits.item1}</h3>
            <p className="text-gray-600">Get instant notifications when stocks you follow make significant moves.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">{dict.benefits.item2}</h3>
            <p className="text-gray-600">Access in-depth analysis from our team of financial experts.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">{dict.benefits.item3}</h3>
            <p className="text-gray-600">Join exclusive webinars and events with industry leaders.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">{dict.benefits.item4}</h3>
            <p className="text-gray-600">Receive personalized investment recommendations based on your goals.</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
            {dict.benefits.subscribe}
          </button>
        </div>
      </div>
    </div>
  );
}