
import React from 'react';
import { IconTrendingUp, IconFilter, IconSparkles, IconGlobe } from './ui/Icon';

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ icon, title, description }) => (
  <div className="bg-ocean-blue/70 p-6 rounded-lg border border-accent-cyan/20 shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-teal mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-sea-foam">{title}</h3>
    <p className="text-slate-gray">{description}</p>
  </div>
);

const OceanInsights: React.FC = () => {
  const insights = [
    {
      icon: <IconSparkles className="w-6 h-6 text-deep-ocean" />,
      title: 'Conversational AI',
      description: 'Ask questions in natural language and get instant, insightful answers and visualizations about ARGO ocean data.'
    },
    {
      icon: <IconTrendingUp className="w-6 h-6 text-deep-ocean" />,
      title: 'Dynamic Visualizations',
      description: 'Generate interactive charts, maps, and tables on the fly. Explore data profiles, time series, float trajectories, and more.'
    },
    {
      icon: <IconFilter className="w-6 h-6 text-deep-ocean" />,
      title: 'Powerful Filtering',
      description: 'Easily filter vast datasets by date range, sensor type, and geographic region to focus on the information that matters most.'
    },
    {
      icon: <IconGlobe className="w-6 h-6 text-deep-ocean" />,
      title: 'Global Data Access',
      description: 'Leverage a comprehensive backend that processes global ARGO data, providing a worldwide view of our oceans.'
    }
  ];

  return (
    <section className="py-24 bg-deep-ocean px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-4 text-sea-foam">Unlock the Power of Ocean Data</h2>
          <p className="text-slate-gray">
            Sea Voice transforms complex oceanographic data into an intuitive, interactive experience. Discover key features that make exploration seamless and insightful.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {insights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OceanInsights;
