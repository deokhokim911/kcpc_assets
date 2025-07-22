'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Building2, 
  PieChart as PieChartIcon,
  BarChart3,
  Download,
  FileText
} from 'lucide-react';
import YearlySpendingChart from '@/components/charts/YearlySpendingChart';
import DepartmentChart from '@/components/charts/DepartmentChart';
import CategoryChart from '@/components/charts/CategoryChart';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  parseCSVData, 
  getDepartmentSummary, 
  getYearlySummary, 
  getCategorySummary,
  formatCurrency 
} from '@/utils/dataProcessor';
import { ExpenditureRecord } from '@/types/expenditure';


const Dashboard: React.FC = () => {
  const [data, setData] = useState<ExpenditureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<'전체' | number>('전체');
  const [selectedCategoryYear, setSelectedCategoryYear] = useState<'전체' | number>('전체');
  const [selectedDeptListYear, setSelectedDeptListYear] = useState<'전체' | number>('전체');
  const [selectedCategoryListYear, setSelectedCategoryListYear] = useState<'전체' | number>('전체');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/consolidated_expenditure_data.csv');
        if (!response.ok) {
          throw new Error('데이터를 불러올 수 없습니다.');
        }
        const csvText = await response.text();
        const parsedData = parseCSVData(csvText);
        setData(parsedData);

        // console.log('parsedData ::: ', parsedData);

      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">오류가 발생했습니다: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 연도 목록 추출 (유효한 연도만 필터링)
  const yearOptions = Array.from(new Set(
    data
      .map(d => {
        const year = new Date(d.date).getFullYear();
        return isNaN(year) ? null : year;
      })
      .filter(year => year !== null)
  )).sort((a, b) => b - a) as number[];
  // 연도별 필터링 (유효한 날짜만 처리)
  const filteredData = selectedYear === '전체'
    ? data
    : data.filter(d => {
        const year = new Date(d.date).getFullYear();
        return !isNaN(year) && year === selectedYear;
      });
  const departmentSummary = getDepartmentSummary(filteredData);
  const yearlySummary = getYearlySummary(data);
  const categoryYearOptions = Array.from(new Set(
    data
      .map(d => {
        const year = new Date(d.date).getFullYear();
        return isNaN(year) ? null : year;
      })
      .filter(year => year !== null)
  )).sort((a, b) => b - a) as number[];
  const filteredCategoryData = selectedCategoryYear === '전체'
    ? data
    : data.filter(d => {
        const year = new Date(d.date).getFullYear();
        return !isNaN(year) && year === selectedCategoryYear;
      });
  const categorySummary = getCategorySummary(filteredCategoryData);
  
  const totalAmount = data.reduce((sum, record) => sum + record.amount, 0);
  const totalTransactions = data.length;
  const averageAmount = totalAmount / totalTransactions;
  const totalYears = yearlySummary.length;
  // console.log('departmentSummary', departmentSummary);
  // console.log('categorySummary', categorySummary);

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/KCPC_자산관리시스템제안.pdf';
    link.download = 'KCPC_자산관리시스템제안.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleDownloadPDF();
    }
  };



  const deptListYearOptions = Array.from(new Set(
    data
      .map(d => {
        const year = new Date(d.date).getFullYear();
        return isNaN(year) ? null : year;
      })
      .filter(year => year !== null)
  )).sort((a, b) => b - a) as number[];
  const categoryListYearOptions = deptListYearOptions;
  const filteredDeptListData = selectedDeptListYear === '전체'
    ? data
    : data.filter(d => {
        const year = new Date(d.date).getFullYear();
        return !isNaN(year) && year === selectedDeptListYear;
      });
  const filteredDeptSummary = getDepartmentSummary(filteredDeptListData).slice(0, 10);
  const filteredCategoryListData = selectedCategoryListYear === '전체'
    ? data
    : data.filter(d => {
        const year = new Date(d.date).getFullYear();
        return !isNaN(year) && year === selectedCategoryListYear;
      });
  const filteredCategorySummary = getCategorySummary(filteredCategoryListData);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="총 지출 금액"
            value={formatCurrency(totalAmount)}
            icon={DollarSign}
            color="text-blue-600"
            description={`${totalYears}년간 누적 지출`}
          />
          <StatCard
            title="총 거래 건수"
            value={totalTransactions.toLocaleString()}
            icon={TrendingUp}
            color="text-green-600"
            description="건"
          />
          <StatCard
            title="평균 거래 금액"
            value={formatCurrency(averageAmount)}
            icon={Calendar}
            color="text-purple-600"
            description="건당 평균"
          />
          <StatCard
            title="활성 부서 수"
            value={departmentSummary.length.toString()}
            icon={Building2}
            color="text-orange-600"
            description="개 부서"
          />
        </div>

        {/* PDF Download Section */}
        <div className="w-full mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 border border-blue-200">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                KCPC 자산관리시스템 제안서
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                KCPC의 자산관리시스템 구축을 위한 상세한 제안서를 다운로드하실 수 있습니다. 
                시스템의 목표, 기능, 구현 방안 등이 포함되어 있습니다.
              </p>
              <button
                onClick={handleDownloadPDF}
                onKeyDown={handleDownloadKeyDown}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105 shadow-lg"
                aria-label="PDF 다운로드"
                tabIndex={0}
              >
                <Download className="h-5 w-5" />
                <span>PDF 다운로드</span>
              </button>
              <p className="text-sm text-gray-500 mt-3">
                파일 크기: 1.3MB | 형식: PDF
              </p>
            </div>
          </div>
        </div>

        {/* Yearly Spending Trend (full width) */}
        <div className="w-full mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                연도별 지출 현황
              </h2>
            </div>
            <YearlySpendingChart data={yearlySummary} />
          </div>
        </div>

        {/* Department Spending Distribution (full width, with year selector) */}
        <div className="w-full mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mr-4">
                <Building2 className="h-5 w-5 mr-2 text-green-600" />
                부서별 지출 분포
              </h2>
              <select
                className="border rounded px-2 py-1 text-sm text-gray-900"
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value === '전체' ? '전체' : Number(e.target.value))}
              >
                <option value="전체">전체</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
            </div>
            <DepartmentChart data={departmentSummary} rawData={data} selectedYear={selectedYear} />
          </div>
        </div>

        {/* Category Analysis (with year selector) */}
        <div className="w-full mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mr-4">
                <PieChartIcon className="h-5 w-5 mr-2 text-purple-600" />
                카테고리별 지출 분석
              </h2>
              <select
                className="border rounded px-2 py-1 text-sm text-gray-900"
                value={selectedCategoryYear}
                onChange={e => setSelectedCategoryYear(e.target.value === '전체' ? '전체' : Number(e.target.value))}
              >
                <option value="전체">전체</option>
                {categoryYearOptions.map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
            </div>
            <CategoryChart data={categorySummary} rawData={data} selectedYear={selectedCategoryYear} />
          </div>
        </div>

        {/* Top Spending Summary (with year selectors) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Departments */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900 mr-4">
                  주요 지출 부서 TOP 10
                </h3>
                <select
                  className="border rounded px-2 py-1 text-sm text-gray-900"
                  value={selectedDeptListYear}
                  onChange={e => setSelectedDeptListYear(e.target.value === '전체' ? '전체' : Number(e.target.value))}
                >
                  <option value="전체">전체</option>
                  {deptListYearOptions.map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
              </div>
              
              {/* 현재 선택된 연도 표시 */}
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedDeptListYear === '전체' 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'bg-blue-600 text-white'
              }`}>
                {selectedDeptListYear === '전체' ? '전체 연도' : `${selectedDeptListYear}년 데이터`}
              </div>
            </div>
            <div className="space-y-3">
              {filteredDeptSummary.map((dept, index) => (
                <div key={dept.department} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-900">{dept.department || '미분류'}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(dept.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {dept.count}건
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900 mr-4">
                  주요 지출 카테고리
                </h3>
                <select
                  className="border rounded px-2 py-1 text-sm text-gray-900"
                  value={selectedCategoryListYear}
                  onChange={e => setSelectedCategoryListYear(e.target.value === '전체' ? '전체' : Number(e.target.value))}
                >
                  <option value="전체">전체</option>
                  {categoryListYearOptions.map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
              </div>
              
              {/* 현재 선택된 연도 표시 */}
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedCategoryListYear === '전체' 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'bg-purple-600 text-white'
              }`}>
                {selectedCategoryListYear === '전체' ? '전체 연도' : `${selectedCategoryListYear}년 데이터`}
              </div>
            </div>
            <div className="space-y-3">
              {filteredCategorySummary.map((category, index) => (
                <div key={category.category} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-900">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(category.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {category.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full mb-12">
          <DataTable data={data} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>데이터 기간: {totalTransactions}건의 거래 내역 분석</p>
          <p className="mt-1">마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}</p>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
} 