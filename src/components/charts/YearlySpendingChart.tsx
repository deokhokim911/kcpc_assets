'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { YearlySummary } from '@/types/expenditure';
import { formatCurrency } from '@/utils/dataProcessor';

interface YearlySpendingChartProps {
  data: YearlySummary[];
}

const YearlySpendingChart: React.FC<YearlySpendingChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}년`}</p>
          <p className="text-blue-600">
            {`총 지출: ${formatCurrency(payload[0].value)}`}
          </p>
          <p className="text-gray-600">
            {`거래 건수: ${payload[0].payload.count}건`}
          </p>
          <p className="text-gray-600">
            {`평균 금액: ${formatCurrency(payload[0].payload.averageAmount)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="totalAmount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlySpendingChart; 