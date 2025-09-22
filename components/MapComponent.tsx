import React, { useRef, useEffect, useState } from 'react';
import { json } from 'd3-fetch';
import { select } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import { FeatureCollection } from 'geojson';
import { MapData } from '../types';

interface MapComponentProps {
    title: string;
    data: MapData[];
    worldAtlasUrl?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ title, data, worldAtlasUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json' }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [world, setWorld] = useState<FeatureCollection | null>(null);

    useEffect(() => {
        json(worldAtlasUrl).then((topology: any) => {
            const countries = topojson.feature(topology, topology.objects.countries) as unknown as FeatureCollection;
            setWorld(countries);
        }).catch(error => console.error("Error loading map data:", error));
    }, [worldAtlasUrl]);

    useEffect(() => {
        if (!data || !world || !svgRef.current || !containerRef.current) return;

        const svg = select(svgRef.current);
        
        const resizeObserver = new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            const height = width * 0.6;

            svg.selectAll("*").remove();

            svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

            const projection = geoMercator()
                .fitSize([width, height], world);

            const path = geoPath().projection(projection);

            // Draw map
            svg.append('g')
                .selectAll('path')
                .data(world.features)
                .enter().append('path')
                .attr('d', path)
                .attr('fill', '#2A2A4D') // dusk-purple
                .attr('stroke', '#1A1A2D'); // night-sky

            // Draw points
            svg.append('g')
                .selectAll('circle')
                .data(data)
                .enter().append('circle')
                .attr('cx', d => projection([d.lon, d.lat])![0])
                .attr('cy', d => projection([d.lon, d.lat])![1])
                .attr('r', 3)
                .attr('fill', '#00E5FF') // accent-cyan
                .attr('stroke', '#1A1A2D') // night-sky
                .style('opacity', 0.8)
                .append('title')
                .text(d => `ID: ${d.id}\nLat: ${d.lat}, Lon: ${d.lon}`);
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();

    }, [data, world]);

    return (
        <div className="w-full h-full flex flex-col bg-night-sky/80 rounded-lg">
            <h3 className="text-xl font-semibold text-lavender pt-4 text-center">{title}</h3>
            <div ref={containerRef} className="flex-grow w-full h-full p-2">
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
};

export default MapComponent;
