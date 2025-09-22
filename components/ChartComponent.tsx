import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';
import { ProfileChartData, TimeSeriesChartData, VisualizationType } from '../types';

interface ChartComponentProps {
    type: VisualizationType.PROFILE_CHART | VisualizationType.TIME_SERIES_CHART;
    title: string;
    data: ProfileChartData[] | TimeSeriesChartData[];
    xAxisLabel?: string;
    yAxisLabel?: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type, title, data, xAxisLabel, yAxisLabel }) => {
    const isProfileChart = type === VisualizationType.PROFILE_CHART;

    const xDataKey = isProfileChart ? 'value' : 'date';
    const yDataKey = isProfileChart ? 'depth' : 'value';

    const chartData = data as any[]; // To satisfy recharts data prop type

    return (
        <div className="w-full h-full flex flex-col bg-night-sky/80 rounded-lg">
            <h3 className="text-xl font-semibold text-lavender mb-4 text-center pt-4">{title}</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 40,
                            left: 30,
                            bottom: 40,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 162, 200, 0.2)" />
                        <XAxis dataKey={xDataKey} stroke="#C8A2C8" tick={{ fill: '#C8A2C8' }} >
                            <Label value={xAxisLabel} offset={-25} position="insideBottom" fill="#C8A2C8" />
                        </XAxis>
                        <YAxis 
                            dataKey={yDataKey} 
                            stroke="#C8A2C8" 
                            tick={{ fill: '#C8A2C8' }} 
                            reversed={isProfileChart}
                            domain={isProfileChart ? ['dataMax', 'dataMin'] : ['auto', 'auto']}
                        >
                            <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#C8A2C8' }} offset={-20}/>
                        </YAxis>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A1A2D', border: '1px solid #E02C9A' }}
                            labelStyle={{ color: '#E6E6FA' }}
                            itemStyle={{ color: '#FF8C00' }}
                        />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#E6E6FA' }} />
                        <Line type="monotone" dataKey="value" stroke="#FF8C00" strokeWidth={2} dot={false} name={xAxisLabel || 'Value'}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartComponent;
