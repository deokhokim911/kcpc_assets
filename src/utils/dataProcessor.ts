import { format, parseISO, getYear, getMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ExpenditureRecord, DepartmentSummary, YearlySummary, CategorySummary, MonthlyTrend } from '@/types/expenditure';

export function parseCSVData(csvText: string): ExpenditureRecord[] {
  const lines = csvText.split('\n');
  const data: ExpenditureRecord[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = parseCSVLine(line);
    if (columns.length >= 8) {
      const amount = parseFloat(columns[3]) || 0;
      if (amount > 0) {
        data.push({
          poNumber: columns[0] || '',
          date: columns[1] || '',
          description: columns[2] || '',
          amount: amount,
          department: (columns[4] || '').trim(), // 부서명 공백 제거
          requester: columns[5] || '',
          sheet: columns[6] || '',
          notes: columns[7] || ''
        });
      }
    }
  }
  
  return data;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export function getDepartmentSummary(data: ExpenditureRecord[]): DepartmentSummary[] {
  const departmentMap = new Map<string, { total: number; count: number }>();
  
  data.forEach(record => {
    // 부서명에서 공백을 제거하고 빈 문자열인 경우 '기타'로 처리
    const dept = (record.department || '').trim() || '기타';
    const existing = departmentMap.get(dept) || { total: 0, count: 0 };
    departmentMap.set(dept, {
      total: existing.total + record.amount,
      count: existing.count + 1
    });
  });
  
  return Array.from(departmentMap.entries())
    .map(([department, stats]) => ({
      department,
      totalAmount: stats.total,
      count: stats.count,
      averageAmount: stats.total / stats.count
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

export function getYearlySummary(data: ExpenditureRecord[]): YearlySummary[] {
  const yearMap = new Map<number, { total: number; count: number }>();
  
  data.forEach(record => {
    if (!record.date) return;
    
    try {
      const year = getYear(parseISO(record.date));
      const existing = yearMap.get(year) || { total: 0, count: 0 };
      yearMap.set(year, {
        total: existing.total + record.amount,
        count: existing.count + 1
      });
    } catch (error) {
      // Invalid date format, skip
    }
  });
  
  return Array.from(yearMap.entries())
    .map(([year, stats]) => ({
      year,
      totalAmount: stats.total,
      count: stats.count,
      averageAmount: stats.total / stats.count
    }))
    .sort((a, b) => a.year - b.year);
}

export function getCategorySummary(data: ExpenditureRecord[]): CategorySummary[] {
  const totalAmount = data.reduce((sum, record) => sum + record.amount, 0);
  const categoryMap = new Map<string, { total: number; count: number }>();
  
  data.forEach(record => {
    const category = categorizeExpenditure(record.description);
    const existing = categoryMap.get(category) || { total: 0, count: 0 };
    categoryMap.set(category, {
      total: existing.total + record.amount,
      count: existing.count + 1
    });
  });
  
  return Array.from(categoryMap.entries())
    .map(([category, stats]) => ({
      category,
      totalAmount: stats.total,
      count: stats.count,
      percentage: (stats.total / totalAmount) * 100
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

export function getMonthlyTrend(data: ExpenditureRecord[]): MonthlyTrend[] {
  const monthMap = new Map<string, { total: number; count: number; year: number }>();
  
  data.forEach(record => {
    if (!record.date) return;
    
    try {
      const date = parseISO(record.date);
      const year = getYear(date);
      const month = getMonth(date);
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      const monthName = format(date, 'yyyy년 MM월', { locale: ko });
      
      const existing = monthMap.get(key) || { total: 0, count: 0, year };
      monthMap.set(key, {
        total: existing.total + record.amount,
        count: existing.count + 1,
        year
      });
    } catch (error) {
      // Invalid date format, skip
    }
  });
  
  return Array.from(monthMap.entries())
    .map(([key, stats]) => ({
      month: format(parseISO(`${key}-01`), 'yyyy년 MM월', { locale: ko }),
      year: stats.year,
      totalAmount: stats.total,
      count: stats.count
    }))
    .sort((a, b) => a.year - b.year);
}

function categorizeExpenditure(description: string): string {
  const desc = (description || '').trim().toLowerCase();
  
  if (desc.includes('computer') || desc.includes('laptop') || desc.includes('desktop') || 
      desc.includes('컴퓨터') || desc.includes('랩탑') || desc.includes('맥북') || 
      desc.includes('macbook') || desc.includes('ipad') || desc.includes('모니터') || 
      desc.includes('monitor')) {
    return 'IT 장비';
  }
  
  if (desc.includes('projector') || desc.includes('camera') || desc.includes('mic') || 
      desc.includes('speaker') || desc.includes('audio') || desc.includes('video') ||
      desc.includes('프로젝터') || desc.includes('카메라') || desc.includes('마이크') ||
      desc.includes('스피커') || desc.includes('음향') || desc.includes('영상') ||
      desc.includes('방송')) {
    return '음향/영상 장비';
  }
  
  if (desc.includes('retreat') || desc.includes('수련회') || desc.includes('수양회') || 
      desc.includes('conference') || desc.includes('컨퍼런스') || desc.includes('camp') ||
      desc.includes('캠프')) {
    return '행사/수련회';
  }
  
  if (desc.includes('renovation') || desc.includes('repair') || desc.includes('installation') ||
      desc.includes('hvac') || desc.includes('door') || desc.includes('cabinet') ||
      desc.includes('공사') || desc.includes('수리') || desc.includes('설치') ||
      desc.includes('시설')) {
    return '시설 관리';
  }
  
  if (desc.includes('book') || desc.includes('curriculum') || desc.includes('교재') ||
      desc.includes('교육') || desc.includes('훈련') || desc.includes('큐티북')) {
    return '교육/훈련 자료';
  }
  
  if (desc.includes('shirt') || desc.includes('uniform') || desc.includes('티셔츠') ||
      desc.includes('후디') || desc.includes('유니폼') || desc.includes('의류')) {
    return '의류/유니폼';
  }
  
  if (desc.includes('gift') || desc.includes('선물') || desc.includes('card') ||
      desc.includes('카드') || desc.includes('상품권')) {
    return '선물/상품권';
  }
  
  if (desc.includes('food') || desc.includes('meal') || desc.includes('catering') ||
      desc.includes('도시락') || desc.includes('음식') || desc.includes('식사') ||
      desc.includes('김밥')) {
    return '식음료';
  }
  
  if (desc.includes('bus') || desc.includes('charter') || desc.includes('transport') ||
      desc.includes('항공') || desc.includes('버스') || desc.includes('교통') ||
      desc.includes('차량')) {
    return '교통비';
  }
  
  return '기타';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
} 