import * as XLSX from 'xlsx';
import { Student } from '../types';

export function exportClassroomExcel(students: Student[], className = '4학년 2반') {
  const levelText = (lvl: 'high' | 'mid' | 'low') => {
    switch (lvl) {
      case 'high': return '상 (우수)';
      case 'mid': return '중 (보통)';
      case 'low': return '하 (노력요함)';
      default: return lvl;
    }
  };

  const rows = students.map((s) => ({
    '번호': s.studentNo,
    '이름': s.name,
    '진행률(%)': s.progressPercent + '%',
    '골든 스탬프': s.goldenStamps || 0,
    'Q1 딜레마 선택': `${s.q1?.choice || '-'} (${s.q1?.choiceTitle || '미작성'})`,
    'Q1 행동 이유 및 결과 예측': s.q1?.consequenceReason || '-',
    'Q2 피해자 감정 카드': (s.q2?.emotionCards || []).join(', ') || '-',
    'Q2 마법의 한마디 (대안 멘트)': s.q2?.magicSentence || '-',
    'Q3 배터리 점수': (s.q3?.batteryPercentage ?? 100) + '%',
    'Q3 고치고 싶은 습관 (솔직 고백)': s.q3?.honestHabitToFix || '-',
    'Q4 수호자 다짐 서약': s.q4?.guardianPledge || '-',
    '보낸 버프 수': s.q4?.sentBuffs?.length || 0,
    '받은 버프 수': s.q4?.receivedBuffs?.length || 0,
    '[루브릭] 윤리적 민감성': levelText(s.rubric?.ethicalSensitivity || 'mid'),
    '[루브릭] 도덕적 성찰': levelText(s.rubric?.moralReflection || 'mid'),
    '[루브릭] 실천 및 공동체성': levelText(s.rubric?.actionCommunity || 'mid'),
    '[종합 판정]': s.rubric?.overallRank || '견습 탐정',
    '[나이스(NEIS) 학교생활기록부 추천 평어]': s.neisComment || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // 번호
    { wch: 10 }, // 이름
    { wch: 12 }, // 진행률
    { wch: 12 }, // 골든스탬프
    { wch: 30 }, // Q1 선택
    { wch: 45 }, // Q1 이유
    { wch: 25 }, // Q2 감정
    { wch: 45 }, // Q2 마법한마디
    { wch: 12 }, // Q3 배터리
    { wch: 45 }, // Q3 습관
    { wch: 45 }, // Q4 다짐
    { wch: 12 }, // 보낸버프
    { wch: 12 }, // 받은버프
    { wch: 18 }, // 루브릭 민감성
    { wch: 18 }, // 루브릭 성찰
    { wch: 18 }, // 루브릭 실천
    { wch: 14 }, // 종합판정
    { wch: 75 }  // 나이스 평어
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '과정중심평가 및 나이스 평어');

  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `[디지털가디언즈]_${className}_과정중심평가_나이스평어_${dateStr}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
