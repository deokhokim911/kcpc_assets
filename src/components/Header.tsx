'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Download, FileText } from 'lucide-react';

const Header: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleLogout();
    }
  };

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

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              KCPC 자산 구매 현황 대시보드
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              안전한 데이터 관리 시스템
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* PDF 다운로드 버튼 */}
            <button
              onClick={handleDownloadPDF}
              onKeyDown={handleDownloadKeyDown}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
              aria-label="PDF 다운로드"
              tabIndex={0}
            >
              <Download className="h-4 w-4" />
              <span>PDF 다운로드</span>
            </button>

            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">관리자</span>
            </div>
            
            <button
              onClick={handleLogout}
              onKeyDown={handleKeyDown}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="로그아웃"
              tabIndex={0}
            >
              <LogOut className="h-4 w-4" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 