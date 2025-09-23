import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { FeatureCollection } from 'geojson';
import { Trajectory } from '../types';
import InfoModal from './ui/InfoModal';

interface TrajectoryMapComponentProps {
    title: string;
    data: Trajectory[];
    worldAtlasUrl?: string;
}

type TrajectoryPoint = {
    lat: number;
    lon: number;
    timestamp: string;
    id: string;
};


const TrajectoryMapComponent: React.FC<TrajectoryMapComponentProps> = ({ title, data, worldAtlasUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json' }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [world, setWorld] = useState<FeatureCollection | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<TrajectoryPoint | null>(null);

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
            svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`)
                .attr('role', 'img')
                .attr('aria-label', title);

            const projection = d3.geoMercator().fitSize([width, height], world);
            const pathGenerator = d3.geoPath().projection(projection);

            const g = svg.append('g');

            g.append('g')
                .selectAll('path')
                .data(world.features)
                .enter().append('path')
                .attr('d', pathGenerator)
                .attr('fill', '#1B263B')
                .attr('stroke', '#0D1B2A');

            const lineGenerator = d3.line<{ lat: number; lon: number }>()
                .x(d => projection([d.lon, d.lat])![0])
                .y(d => projection([d.lon, d.lat])![1]);

            // Draw trajectories
            g.append('g')
                .selectAll('.trajectory-path')
                .data(data)
                .enter().append('path')
                .attr('class', 'trajectory-path')
                .attr('d', d => lineGenerator(d.path))
                .attr('stroke', '#00BFFF')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .style('opacity', 0.7);

            // Flatten data for points
            const allPoints: TrajectoryPoint[] = data.flatMap(traj => traj.path.map(p => ({ ...p, id: traj.id })));
            
            // Draw points on trajectories
            g.append('g')
                .selectAll('circle')
                .data(allPoints)
                .enter().append('circle')
                .attr('cx', d => projection([d.lon, d.lat])![0])
                .attr('cy', d => projection([d.lon, d.lat])![1])
                .attr('r', 3)
                .attr('fill', '#4DB6AC') // accent-teal
                .attr('stroke', '#0D1B2A')
                .style('cursor', 'pointer')
                .attr('tabindex', 0)
                .attr('aria-label', d => `Trajectory point for float ${d.id} at ${new Date(d.timestamp).toLocaleString()}`)
                .on('mouseover', (event, d) => {
                    tooltip
                        .style('opacity', 1)
                        .html(`
                            <strong>ID:</strong> ${d.id}<br/>
                            <strong>Lat:</strong> ${d.lat.toFixed(4)}<br/>
                            <strong>Lon:</strong> ${d.lon.toFixed(4)}<br/>
                            <strong>Time:</strong> ${new Date(d.timestamp).toLocaleString()}
                        `);
                })
                .on('mousemove', (event) => {
                    const [x, y] = d3.pointer(event, containerRef.current);
                    tooltip.style('left', `${x + 15}px`).style('top', `${y - 10}px`);
                })
                .on('mouseout', () => {
                    tooltip.style('opacity', 0);
                })
                .on('click', (event, d) => {
                    setSelectedPoint(d);
                })
                .on('keydown', (event, d) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedPoint(d);
                    }
                });

            const zoom = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([1, 8])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform.toString());
                });

            svg.call(zoom);
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();

    }, [data, world, title]);

    return (
        <div className="w-full h-full flex flex-col bg-deep-ocean/80 rounded-lg">
            <h3 className="text-xl font-semibold text-sea-foam pt-4 text-center">{title}</h3>
            <div ref={containerRef} className="flex-grow w-full h-full p-2 relative">
                <svg ref={svgRef}></svg>
                <div className="map-tooltip absolute opacity-0 pointer-events-none bg-deep-ocean text-sea-foam text-sm p-2 rounded-md border border-accent-cyan/50 shadow-lg transition-opacity duration-200"></div>
            </div>
            <InfoModal 
                isOpen={!!selectedPoint}
                onClose={() => setSelectedPoint(null)}
                title={`Details for Float ${selectedPoint?.id}`}
                data={selectedPoint}
            />
        </div>
    );
};

export default TrajectoryMapComponent;