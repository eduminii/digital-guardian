export type QuestStep = 1 | 2 | 3 | 4;

export type TileStatus = 'pending' | 'in_progress' | 'completed' | 'gm_feedback';

export type RubricLevel = 'high' | 'mid' | 'low';

export interface Quest1Data {
  scenarioId?: string; // 'soccer_kick' | 'photo_mock' | 'game_scam' | 'secret_room'
  choice: 'A' | 'B' | 'C' | 'D' | 'E' | '';
  choiceTitle: string;
  consequenceReason: string;
  friendshipDelta: number;
  completedAt?: string;
}

export interface Quest2Data {
  emotionCards: string[]; // e.g. ['외로움/고립감', '억울함']
  magicSentence: string;  // 마법의 한마디 대안 멘트
  completedAt?: string;
}

export interface Quest3Data {
  habitScores: number[]; // 5 items, each 0, 10, or 20 points
  batteryPercentage: number; // 0 ~ 100%
  honestHabitToFix: string;  // 솔직 고백란: "가장 고치고 싶은 습관 1가지"
  expBonusEarned: boolean;
  completedAt?: string;
}

export interface BuffItem {
  id: string;
  fromStudentNo: number;
  fromStudentName: string;
  toStudentNo: number;
  sticker: string; // '🌟 황금별' | '💖 따뜻한마음' | '🛡️ 수호의방패' | '🚀 응원로켓'
  comment: string;
  createdAt: string;
}

export interface Quest4Data {
  guardianPledge: string; // "앞으로 디지털 세상에서 [ ... ] 하겠습니다"
  sentBuffs: BuffItem[];  // minimum 2 required for quest completion
  receivedBuffs: BuffItem[];
  completedAt?: string;
}

export interface StudentRubric {
  ethicalSensitivity: RubricLevel; // 윤리적 민감성
  moralReflection: RubricLevel;    // 도덕적 성찰
  actionCommunity: RubricLevel;    // 실천 및 공동체성
  overallRank: '도덕 가디언' | '견습 탐정' | '성장 중';
  teacherNote?: string;
  isConfirmed: boolean;
}

export interface Student {
  studentNo: number;
  name: string;
  currentQuest: QuestStep;
  progressPercent: number;
  lastActiveAt: number; // timestamp
  isStuck: boolean;     // 5분 이상 정체 또는 도움 요청
  needsHelp: boolean;   // 학생이 명시적으로 누른 도움 요청
  helpMessage?: string;
  exp: number;
  level: number;
  goldenStamps: number; // 교사가 부여한 참 잘했어요 별점
  
  q1: Quest1Data;
  q2: Quest2Data;
  q3: Quest3Data;
  q4: Quest4Data;
  
  rubric: StudentRubric;
  neisComment: string;  // 나이스 추천 평어
}

export interface BroadcastNotification {
  id: string;
  message: string;
  type: 'alert' | 'timer' | 'info';
  timerSeconds?: number;
  createdAt: number;
}

export interface ClassroomSession {
  roomCode: string;
  grade: number;
  classNo: number;
  className: string;
  totalStudents: number;
  islandPurification: number; // 0 ~ 100%
  students: Student[];
  broadcasts: BroadcastNotification[];
  sessionStartedAt: string;
  isCompleted: boolean;
}
