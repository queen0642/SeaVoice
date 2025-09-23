import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
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
        d3.json(worldAtlasUrl).then((topology: any) => {
            const countries = topojson.feature(topology, topology.objects.countries) as unknown as FeatureCollection;
            setWorld(countries);
        }).catch(error => console.error("Error loading map data:", error));
    }, [worldAtlasUrl]);

    useEffect(() => {
        if (!data || !world || !svgRef.current || !containerRef.current) return;

        const svg = d3.select(svgRef.current);
        const tooltip = d3.select(containerRef.current).select<HTMLDivElement>('.map-tooltip');
        
        const resizeObserver = new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            const height = width * 0.6;

            svg.selectAll("*").remove();

            svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

            const projection = d3.geoMercator()
                .fitSize([width, height], world);

            const path = d3.geoPath().projection(projection);
            
            // Container for zoomable elements
            const g = svg.append('g');

            // Draw map
            g.append('g')
                .selectAll('path')
                .data(world.features)
                .enter().append('path')
                .attr('d', path)
                .attr('fill', '#1B263B') // ocean-blue
                .attr('stroke', '#0D1B2A'); // deep-ocean

            // Draw points
            g.append('g')
                .selectAll('circle')
                .data(data)
                .enter().append('circle')
                .attr('cx', d => projection([d.lon, d.lat])![0])
                .attr('cy', d => projection([d.lon, d.lat])![1])
                .attr('r', 3)
                .attr('fill', '#00BFFF') // accent-cyan
                .attr('stroke', '#0D1B2A') // deep-ocean
                .style('opacity', 0.8)
                .style('cursor', 'pointer')
                .on('mouseover', (event, d) => {
                    tooltip
                        .style('opacity', 1)
                        .html(`
                            <strong>ID:</strong> ${d.id}<br/>
                            <strong>Lat:</strong> ${d.lat.toFixed(4)}<br/>
                            <strong>Lon:</strong> ${d.lon.toFixed(4)}
                        `);
                })
                .on('mousemove', (event) => {
                    const [x, y] = d3.pointer(event, containerRef.current);
                    tooltip
                        .style('left', `${x + 15}px`)
                        .style('top', `${y - 10}px`);
                })
                .on('mouseout', () => {
                    tooltip.style('opacity', 0);
                });

            // Zoom functionality
            const zoom = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([1, 8])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform.toString());
                });

            svg.call(zoom);
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();

    }, [data, world]);

    return (
        <div className="w-full h-full flex flex-col bg-deep-ocean/80 rounded-lg">
            <h3 className="text-xl font-semibold text-sea-foam pt-4 text-center">{title}</h3>
            <div ref={containerRef} className="flex-grow w-full h-full p-2 relative">
                <svg ref={svgRef}></svg>
                <div className="map-tooltip absolute opacity-0 pointer-events-none bg-deep-ocean text-sea-foam text-sm p-2 rounded-md border border-accent-cyan/50 shadow-lg transition-opacity duration-200"></div>
            </div>
        </div>
    );
};

export default MapComponent;