import React from 'react';
import { IconTemperature, IconSalinity, IconMapPin, IconTrendingUp } from './ui/Icon';

interface RegionCardProps {
    regionName: string;
    description: string;
    stats: { icon: React.ReactNode; label: string; value: string }[];
}

const RegionCard: React.FC<RegionCardProps> = ({ regionName, description, stats }) => (
    <div className="bg-ocean-blue rounded-lg shadow-lg border border-accent-cyan/20 transform transition-all duration-300 hover:shadow-cyan-glow hover:-translate-y-2 flex flex-col p-6 h-full">
        <h3 className="text-xl font-bold text-sea-foam mb-3">{regionName}</h3>
        <p className="text-slate-gray mb-4 text-sm flex-grow">{description}</p>
        <div className="space-y-3 border-t border-accent-cyan/20 pt-4 mt-auto">
            {stats.map((stat, index) => (
                <div key={index} className="flex items-center text-sea-foam">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-cyan/20 mr-3">
                       {stat.icon}
                    </div>
                    <span className="text-sm font-semibold">{stat.label}:</span>
                    <span className="ml-auto text-sm">{stat.value}</span>
                </div>
            ))}
        </div>
    </div>
);

const RegionalData: React.FC = () => {
    const regions = [
        {
            regionName: "The Gulf Stream",
            description: "A powerful, warm Atlantic ocean current that originates in the Gulf of Mexico and influences weather across the globe.",
            stats: [
                { icon: <IconTemperature className="w-5 h-5 text-accent-cyan" />, label: "Surface Temp", value: ">25°C" },
                { icon: <IconTrendingUp className="w-5 h-5 text-accent-cyan" />, label: "Max Speed", value: "~2.5 m/s" },
                { icon: <IconMapPin className="w-5 h-5 text-accent-cyan" />, label: "Key Data", value: "Velocity, Temp" },
            ]
        },
        {
            regionName: "The Mediterranean Sea",
            description: "A semi-enclosed sea known for its high salinity and unique 'thermohaline' circulation, making it a natural laboratory for oceanography.",
            stats: [
                { icon: <IconTemperature className="w-5 h-5 text-accent-cyan" />, label: "Avg. Temp", value: "19-24°C" },
                { icon: <IconSalinity className="w-5 h-5 text-accent-cyan" />, label: "Avg. Salinity", value: "38 PSU" },
                { icon: <IconMapPin className="w-5 h-5 text-accent-cyan" />, label: "Key Data", value: "Evaporation, Salinity" },
            ]
        },
        {
            regionName: "The Coral Triangle",
            description: "Located in the western Pacific, this region is the global center of marine biodiversity, hosting 76% of the world's coral species.",
            stats: [
                { icon: <IconTemperature className="w-5 h-5 text-accent-cyan" />, label: "Water Temp", value: "28-31°C" },
                { icon: <IconSalinity className="w-5 h-5 text-accent-cyan" />, label: "Key Sensor", value: "Chlorophyll, pH" },
                { icon: <IconMapPin className="w-5 h-5 text-accent-cyan" />, label: "Biodiversity Hotspot", value: "600+ coral species" },
            ]
        }
    ];

    return (
        <section className="py-24 bg-deep-ocean/70 backdrop-blur-sm px-4">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-sea-foam">Focus on Key Phenomena</h2>
                    <p className="text-slate-gray">
                        From powerful currents to biodiversity hotspots, Sea Voice allows you to zoom in on specific oceanographic features and analyze their unique data signatures.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regions.map(region => (
                        <RegionCard key={region.regionName} {...region} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RegionalData;