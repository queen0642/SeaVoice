import React, { useRef, useEffect, useState } from 'react';
import { json } from 'd3-fetch';
import { select } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { FeatureCollection } from 'geojson';
import { DensityMapData } from '../types';

interface DensityMapComponentProps {
    title: string;
    data: DensityMapData[];
    worldAtlasUrl?: string;
}

const DensityMapComponent: React.FC<DensityMapComponentProps> = ({ title, data, worldAtlasUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json' }) => {
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
        const tooltip = select(containerRef.current).select<HTMLDivElement>('.density-tooltip');
        
        const resizeObserver = new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            const height = width * 0.6; // Maintain aspect ratio

            svg.selectAll("*").remove();

            svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

            const projection = geoMercator().fitSize([width, height], world);
            const path = geoPath().projection(projection);

            // Color scale for density
            const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 1]);

            // Container for zoomable elements
            const g = svg.append('g');

            // Draw map
            g.append('g')
                .selectAll('path')
                .data(world.features)
                .enter().append('path')
                .attr('d', path)
                .attr('fill', '#1B263B')
                .attr('stroke', '#0D1B2A');

            // Draw density points
            g.append('g')
                .selectAll('circle')
                .data(data)
                .enter().append('circle')
                .attr('cx', d => projection([d.lon, d.lat])![0])
                .attr('cy', d => projection([d.lon, d.lat])![1])
                .attr('r', d => 2 + d.density * 5)
                .attr('fill', d => colorScale(d.density))
                .style('opacity', 0.7)
                .style('mix-blend-mode', 'lighten')
                .style('cursor', 'pointer')
                .on('mouseover', (event, d) => {
                    tooltip
                        .style('opacity', 1)
                        .html(`
                            <strong>Lat:</strong> ${d.lat.toFixed(4)}<br/>
                            <strong>Lon:</strong> ${d.lon.toFixed(4)}<br/>
                            <strong>Density:</strong> ${d.density.toFixed(3)}
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

            // Add Legend
            const legendWidth = 200;
            const legendHeight = 10;
            const legendX = width - legendWidth - 20;
            const legendY = height - legendHeight - 20;

            const legend = svg.append('g')
                .attr('transform', `translate(${legendX}, ${legendY})`);

            const gradient = legend.append('defs')
                .append('linearGradient')
                .attr('id', 'density-gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '0%');

            for (let i = 0; i <= 1; i += 0.1) {
                gradient.append('stop')
                    .attr('offset', `${i * 100}%`)
                    .attr('stop-color', colorScale(i));
            }

            legend.append('rect')
                .attr('width', legendWidth)
                .attr('height', legendHeight)
                .style('fill', 'url(#density-gradient)');

            legend.append('text')
                .attr('x', 0)
                .attr('y', legendHeight + 15)
                .attr('fill', '#E0E1DD')
                .attr('font-size', '12px')
                .text('Low Density');
            
            legend.append('text')
                .attr('x', legendWidth)
                .attr('y', legendHeight + 15)
                .attr('fill', '#E0E1DD')
                .attr('font-size', '12px')
                .attr('text-anchor', 'end')
                .text('High Density');

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
                <div className="density-tooltip absolute opacity-0 pointer-events-none bg-deep-ocean text-sea-foam text-sm p-2 rounded-md border border-accent-cyan/50 shadow-lg transition-opacity duration-200"></div>
            </div>
        </div>
    );
};

export default DensityMapComponent;