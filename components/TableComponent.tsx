import React from 'react';
import { TableData } from '../types';

interface TableComponentProps {
    title: string;
    data: TableData;
}

const TableComponent: React.FC<TableComponentProps> = ({ title, data }) => {
    if (!data || data.length === 0) {
        return (
             <div className="w-full h-full flex flex-col items-center justify-center bg-deep-ocean/80 rounded-lg">
                <h3 className="text-xl font-semibold text-sea-foam mb-4">{title}</h3>
                <p className="text-slate-gray">No data available to display.</p>
            </div>
        );
    }
    
    const headers = Object.keys(data[0]);

    return (
        <div className="w-full h-full flex flex-col bg-deep-ocean/80 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-sea-foam mb-4 text-center">{title}</h3>
            <div className="flex-grow overflow-auto rounded-lg border border-accent-cyan/20">
                <table className="min-w-full divide-y divide-accent-cyan/20">
                    <thead className="bg-ocean-blue/70 sticky top-0 backdrop-blur-sm">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-accent-cyan uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-deep-ocean divide-y divide-ocean-blue">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-ocean-blue/50 transition-colors">
                                {headers.map((header) => (
                                    <td
                                        key={`${rowIndex}-${header}`}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-sea-foam"
                                    >
                                        {row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableComponent;
