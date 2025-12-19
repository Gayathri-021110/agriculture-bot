
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { askAgriAssistant } from '../services/gemini';
import { LocationData } from '../types';

const MOCK_PRICES = [
  { date: 'Mon', wheat: 240, corn: 180, soy: 420 },
  { date: 'Tue', wheat: 245, corn: 185, soy: 415 },
  { date: 'Wed', wheat: 238, corn: 190, soy: 425 },
  { date: 'Thu', wheat: 242, corn: 188, soy: 430 },
  { date: 'Fri', wheat: 250, corn: 195, soy: 428 },
];

interface MarketInsightProps {
  location: LocationData | null;
}

const MarketInsight: React.FC<MarketInsightProps> = ({ location }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        const prompt = "Provide a summary of the latest global and regional agricultural market trends for major commodities like wheat, corn, and soy. Mention any significant price shifts or supply chain alerts.";
        const { text } = await askAgriAssistant(prompt, location ? { lat: location.latitude, lng: location.longitude } : undefined);
        setInsight(text);
      } catch (err) {
        setInsight("Unable to fetch real-time market insights at this moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [location]);

  return (
    <div className="h-full overflow-y-auto bg-stone-50 p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="heading-font text-3xl font-bold text-stone-800 mb-2">Market Insight</h2>
          <p className="text-stone-600">Track major commodity trends and stay ahead of price volatility.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Wheat</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-700">$250.40</span>
              <span className="text-sm text-emerald-500 pb-1">▲ 3.2%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Corn</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-700">$195.12</span>
              <span className="text-sm text-emerald-500 pb-1">▲ 1.5%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Soybeans</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-700">$428.00</span>
              <span className="text-sm text-red-500 pb-1">▼ 0.8%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mb-8">
          <h3 className="font-bold text-stone-800 mb-4">Price History (Weekly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_PRICES}>
                <defs>
                  <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip />
                <Area type="monotone" dataKey="wheat" stroke="#047857" fillOpacity={1} fill="url(#colorWheat)" strokeWidth={2} />
                <Area type="monotone" dataKey="corn" stroke="#f59e0b" fillOpacity={0.05} fill="#f59e0b" strokeWidth={2} />
                <Area type="monotone" dataKey="soy" stroke="#3b82f6" fillOpacity={0.05} fill="#3b82f6" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-emerald-900">AI Market Summary</h3>
          </div>
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-emerald-100 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-emerald-100 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-emerald-100 rounded animate-pulse w-4/6"></div>
            </div>
          ) : (
            <div className="prose prose-sm text-emerald-800 leading-relaxed whitespace-pre-wrap">
              {insight}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketInsight;
