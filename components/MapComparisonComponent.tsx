import React from 'react';
import { MapData } from '../types';
import MapComponent from './MapComponent';

interface MapComparisonData {
    title: string;
    data: MapData[];
}

interface MapComparisonComponentProps {
    title: string;
    data: {
        mapA: MapComparisonData;
        mapB: MapComparisonData;
    };
}

const MapComparisonComponent: React.FC<MapComparisonComponentProps> = ({ title, data }) => {
    return (
        <div className="w-full h-full flex flex-col bg-deep-ocean/80 rounded-lg">
            <h3 className="text-xl font-semibold text-sea-foam mb-4 text-center pt-4">{title}</h3>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div className="w-full h-full rounded-lg overflow-hidden bg-ocean-blue/70">
                    <MapComponent title={data.mapA.title} data={data.mapA.data} />
                </div>
                <div className="w-full h-full rounded-lg overflow-hidden bg-ocean-blue/70">
                    <MapComponent title={data.mapB.title} data={data.mapB.data} />
                </div>
            </div>
        </div>
    );
};

export default MapComparisonComponent;