import React from 'react';
import { oceanGalleryData, OceanData } from './oceanGalleryData';
import { IconMapPin, IconTemperature, IconSalinity, IconGlobe, IconTrendingUp } from './ui/Icon';

export type IconName = 'temperature' | 'salinity' | 'mapPin' | 'globe' | 'trendingUp';

const iconMap: Record<IconName, React.ReactNode> = {
    temperature: <IconTemperature className="w-5 h-5 text-accent-cyan" />,
    salinity: <IconSalinity className="w-5 h-5 text-accent-cyan" />,
    mapPin: <IconMapPin className="w-5 h-5 text-accent-cyan" />,
    globe: <IconGlobe className="w-5 h-5 text-accent-cyan" />,
    trendingUp: <IconTrendingUp className="w-5 h-5 text-accent-cyan" />,
};

const DataCard: React.FC<{ item: OceanData }> = ({ item }) => (
  <div className="flex-shrink-0 w-80 bg-ocean-blue rounded-lg shadow-lg border border-accent-cyan/20 transform transition-all duration-300 hover:shadow-cyan-glow hover:-translate-y-2 flex flex-col p-6">
    <h4 className="text-xl font-bold text-sea-foam mb-3">{item.location}</h4>
    <p className="text-slate-gray mb-4 text-sm flex-grow">{item.description}</p>
    <div className="space-y-3 border-t border-accent-cyan/20 pt-4">
        {item.stats.map((stat, index) => (
            <div key={index} className="flex items-center text-sea-foam">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-cyan/20 mr-3">
                   {iconMap[stat.icon]}
                </div>
                <span className="text-sm font-semibold">{stat.label}:</span>
                <span className="ml-auto text-sm text-right">{stat.value}</span>
            </div>
        ))}
    </div>
  </div>
);


const OceanGallery: React.FC = () => {
  return (
    <section className="py-24 px-4 text-sea-foam bg-ocean-blue/70 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="text-center">
            <h2 className="text-4xl font-bold mb-3">Explore the World's Oceans</h2>
            <p className="text-slate-gray mb-12 max-w-2xl mx-auto">
              Discover key oceanographic regions, each with unique characteristics and critical roles in the Earth's climate system.
            </p>
        </div>
        <div className="flex gap-8 pb-4 -mx-4 px-4 overflow-x-auto ocean-gallery-scrollbar">
          {oceanGalleryData.map(item => (
            <DataCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <style>{`
        .ocean-gallery-scrollbar::-webkit-scrollbar {
            height: 8px;
        }
        .ocean-gallery-scrollbar::-webkit-scrollbar-track {
            background: #0D1B2A; /* deep-ocean */
            border-radius: 4px;
        }
        .ocean-gallery-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4DB6AC; /* accent-teal */
            border-radius: 4px;
        }
        .ocean-gallery-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #3aa69b;
        }
      `}</style>
    </section>
  );
};

export default OceanGallery;