'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { DepartmentSummary, ExpenditureRecord } from '@/types/expenditure';
import { formatCurrency, getDepartmentSummary } from '@/utils/dataProcessor';

interface DepartmentChartProps {
  data: DepartmentSummary[];
  rawData?: ExpenditureRecord[];
  selectedYear?: '전체' | number;
}

const TOP_N = 15;

const DepartmentChart: React.FC<DepartmentChartProps> = ({ data, rawData, selectedYear = '전체' }) => {

  // 연도 옵션들 (더 이상 필요하지 않음)
  // const yearOptions = useMemo(() => {
  //   if (!rawData) return [];
  //   return Array.from(new Set(rawData.map(d => new Date(d.date).getFullYear()))).sort((a, b) => b - a);
  // }, [rawData]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    if (!rawData || selectedYear === '전체') {
      return data;
    }
    
    const filteredRawData = rawData.filter(d => new Date(d.date).getFullYear() === selectedYear);
    return getDepartmentSummary(filteredRawData);
  }, [data, rawData, selectedYear]);

  // 금액 내림차순 정렬
  const sorted = [...filteredData].sort((a, b) => b.totalAmount - a.totalAmount);
  const top = sorted.slice(0, TOP_N);
  const others = sorted.slice(TOP_N);

  const othersTotal = others.reduce((sum, d) => sum + d.totalAmount, 0);
  const chartData = [
    ...top,
    ...(others.length > 0
      ? [{ department: '기타', totalAmount: othersTotal, count: others.length, averageAmount: othersTotal / (others.length || 1) }]
      : []),
  ];

  return (
    <div className="w-full h-[40rem]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={formatCurrency} />
          <YAxis dataKey="department" type="category" width={180} />
          <Tooltip formatter={formatCurrency} />
          <Legend />
          <Bar dataKey="totalAmount" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentChart; 