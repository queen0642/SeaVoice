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
        <div className="w-full h-full flex flex-col bg-deep-ocean/80 rounded-lg">
            <h3 className="text-xl font-semibold text-sea-foam mb-4 text-center pt-4">{title}</h3>
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
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(119, 141, 169, 0.2)" />
                        <XAxis dataKey={xDataKey} stroke="#778DA9" tick={{ fill: '#778DA9' }} >
                            <Label value={xAxisLabel} offset={-25} position="insideBottom" fill="#778DA9" />
                        </XAxis>
                        <YAxis 
                            dataKey={yDataKey} 
                            stroke="#778DA9" 
                            tick={{ fill: '#778DA9' }} 
                            reversed={isProfileChart}
                            domain={isProfileChart ? ['dataMax', 'dataMin'] : ['auto', 'auto']}
                        >
                            <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#778DA9' }} offset={-20}/>
                        </YAxis>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0D1B2A', border: '1px solid #00BFFF' }}
                            labelStyle={{ color: '#E0E1DD' }}
                            itemStyle={{ color: '#00BFFF' }}
                        />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#E0E1DD' }} />
                        <Line type="monotone" dataKey="value" stroke="#00BFFF" strokeWidth={2} dot={false} name={xAxisLabel || 'Value'}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartComponent;