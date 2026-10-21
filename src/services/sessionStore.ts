import { ClassroomSession, Student, BuffItem, RubricLevel } from '../types';
import { INITIAL_SESSION, evaluateStudentRubric, generateNeisComment } from '../data/initialData';

const STORAGE_KEY = 'neo_island_classroom_session_v1';
const BROADCAST_CHANNEL_NAME = 'neo_island_channel';

class SessionStore {
  private session: ClassroomSession;
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(session: ClassroomSession) => void> = new Set();

  constructor() {
    this.session = this.loadInitial();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_SESSION' && event.data.payload) {
            this.session = event.data.payload;
            this.notify();
          }
        };
      } catch {
        // Fallback gracefully
      }
    }
  }

  private loadInitial(): ClassroomSession {
    if (typeof window === 'undefined') return INITIAL_SESSION;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_SESSION;
  }

  private saveAndSync() {
    this.recalculatePurification();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.session));
      } catch {
        // Ignore quota
      }
    }
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'SYNC_SESSION', payload: this.session });
      } catch {
        // Ignore
      }
    }
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.session);
    }
  }

  public subscribe(listener: (session: ClassroomSession) => void) {
    this.listeners.add(listener);
    listener(this.session);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getSession(): ClassroomSession {
    return this.session;
  }

  private recalculatePurification() {
    if (!this.session.students.length) {
      this.session.islandPurification = 0;
      return;
    }
    const totalProgress = this.session.students.reduce((acc, s) => acc + s.progressPercent, 0);
    const avg = Math.round(totalProgress / this.session.students.length);
    this.session.islandPurification = Math.min(100, Math.max(0, avg));
  }

  public resetToDefault() {
    this.session = JSON.parse(JSON.stringify(INITIAL_SESSION));
    this.saveAndSync();
  }

  public getStudent(studentNo: number): Student | undefined {
    return this.session.students.find(s => s.studentNo === studentNo);
  }

  public joinOrCreateStudent(studentNo: number, name: string): Student {
    let student = this.getStudent(studentNo);
    if (!student) {
      student = {
        studentNo,
        name,
        currentQuest: 1,
        progressPercent: 10,
        lastActiveAt: Date.now(),
        isStuck: false,
        needsHelp: false,
        exp: 50,
        level: 1,
        goldenStamps: 0,
        q1: { choice: '', choiceTitle: '', consequenceReason: '', friendshipDelta: 0 },
        q2: { emotionCards: [], magicSentence: '' },
        q3: { habitScores: [0, 0, 0, 0, 0], batteryPercentage: 100, honestHabitToFix: '', expBonusEarned: false },
        q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
        rubric: {
          ethicalSensitivity: 'mid',
          moralReflection: 'mid',
          actionCommunity: 'mid',
          overallRank: '견습 탐정',
          isConfirmed: false
        },
        neisComment: ''
      };
      this.session.students.push(student);
      this.session.totalStudents = this.session.students.length;
      this.saveAndSync();
    } else if (name && student.name !== name) {
      student.name = name;
      student.lastActiveAt = Date.now();
      this.saveAndSync();
    }
    return student;
  }

  public setStudentScenario(studentNo: number, scenarioId: string) {
    const student = this.getStudent(studentNo);
    if (!student) return;
    student.q1.scenarioId = scenarioId;
    this.saveAndSync();
  }

  public updateStudentQ1(
    studentNo: number,
    choice: 'A' | 'B' | 'C' | 'D' | 'E',
    title: string,
    reason: string,
    delta: number,
    scenarioId?: string
  ) {
    const student = this.getStudent(studentNo);
    if (!student) return;
    student.q1 = {
      scenarioId,
      choice,
      choiceTitle: title,
      consequenceReason: reason,
      friendshipDelta: delta,
      completedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
    student.currentQuest = Math.max(student.currentQuest, 2) as 1 | 2 | 3 | 4;
    student.progressPercent = Math.max(student.progressPercent, 35);
    student.exp += 100;
    student.level = Math.floor(student.exp / 100) + 1;
    student.lastActiveAt = Date.now();
    student.isStuck = false;
    student.needsHelp = false;
    student.rubric = evaluateStudentRubric(student);
    student.neisComment = generateNeisComment(student);
    this.saveAndSync();
  }

  public updateStudentQ2(studentNo: number, emotions: string[], magicSentence: string) {
    const student = this.getStudent(studentNo);
    if (!student) return;
    student.q2 = {
      emotionCards: emotions,
      magicSentence,
      completedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
    student.currentQuest = Math.max(student.currentQuest, 3) as 1 | 2 | 3 | 4;
    student.progressPercent = Math.max(student.progressPercent, 60);
    student.exp += 100;
    student.level = Math.floor(student.exp / 100) + 1;
    student.lastActiveAt = Date.now();
    student.isStuck = false;
    student.needsHelp = false;
    student.rubric = evaluateStudentRubric(student);
    student.neisComment = generateNeisComment(student);
    this.saveAndSync();
  }

  public updateStudentQ3(studentNo: number, scores: number[], batteryPercentage: number, habit: string) {
    const student = this.getStudent(studentNo);
    if (!student) return;
    student.q3 = {
      habitScores: scores,
      batteryPercentage,
      honestHabitToFix: habit,
      expBonusEarned: habit.trim().length > 3,
      completedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
    student.currentQuest = Math.max(student.currentQuest, 4) as 1 | 2 | 3 | 4;
    student.progressPercent = Math.max(student.progressPercent, 80);
    student.exp += (habit.trim().length > 3 ? 150 : 100);
    student.level = Math.floor(student.exp / 100) + 1;
    student.lastActiveAt = Date.now();
    student.isStuck = false;
    student.needsHelp = false;
    student.rubric = evaluateStudentRubric(student);
    student.neisComment = generateNeisComment(student);
    this.saveAndSync();
  }

  public updateStudentQ4(studentNo: number, pledge: string) {
    const student = this.getStudent(studentNo);
    if (!student) return;
    student.q4.guardianPledge = pledge;
    if (student.q4.sentBuffs.length >= 2) {
      student.progressPercent = 100;
      student.q4.completedAt = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else {
      student.progressPercent = Math.max(student.progressPercent, 90);
    }
    student.lastActiveAt = Date.now();
    student.exp += 100;
    student.level = Math.floor(student.exp / 100) + 1;
    student.rubric = evaluateStudentRubric(student);
    student.neisComment = generateNeisComment(student);
    this.saveAndSync();
  }

  public sendBuff(fromStudentNo: number, toStudentNo: number, sticker: string, comment: string): boolean {
    const sender = this.getStudent(fromStudentNo);
    const receiver = this.getStudent(toStudentNo);
    if (!sender || !receiver) return false;

    const buff: BuffItem = {
      id: 'buff_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      fromStudentNo,
      fromStudentName: sender.name,
      toStudentNo,
      sticker,
      comment,
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    sender.q4.sentBuffs.push(buff);
    receiver.q4.receivedBuffs.push(buff);

    sender.exp += 50;
    if (sender.q4.sentBuffs.length >= 2 && sender.q4.guardianPledge.trim().length > 5) {
      sender.progressPercent = 100;
      sender.q4.completedAt = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
    sender.rubric = evaluateStudentRubric(sender);
    sender.neisComment = generateNeisComment(sender);

    receiver.exp += 30; // bonus for receiving buff

    this.saveAndSync();
    return true;
  }

  public toggleHelpRequest(studentNo: number, message?: string) {
    const student = this.getStudent(studentNo);
    if (!student) return;
    student.needsHelp = !student.needsHelp;
    student.isStuck = student.needsHelp;
    student.helpMessage = student.needsHelp ? (message || '선생님, 이 퀘스트가 조금 어려워요!') : undefined;
    this.saveAndSync();
  }

  // Teacher actions
  public awardGoldenStamp(studentNo: number) {
    const student = this.getStudent(studentNo);
    if (!student) return;
    student.goldenStamps = (student.goldenStamps || 0) + 1;
    student.exp += 80;
    student.level = Math.floor(student.exp / 100) + 1;
    student.isStuck = false;
    student.needsHelp = false;
    this.saveAndSync();
  }

  public broadcastMessage(message: string, type: 'alert' | 'timer' | 'info' = 'alert', timerSeconds?: number) {
    const bc: ClassroomSession['broadcasts'][0] = {
      id: 'bc_' + Date.now(),
      message,
      type,
      timerSeconds,
      createdAt: Date.now()
    };
    this.session.broadcasts.unshift(bc);
    if (this.session.broadcasts.length > 10) {
      this.session.broadcasts.pop();
    }
    this.saveAndSync();
  }

  public updateRubric(
    studentNo: number,
    criteria: 'ethicalSensitivity' | 'moralReflection' | 'actionCommunity',
    level: RubricLevel
  ) {
    const student = this.getStudent(studentNo);
    if (!student) return;
    student.rubric[criteria] = level;
    
    // Recalculate rank
    const highs = [student.rubric.ethicalSensitivity, student.rubric.moralReflection, student.rubric.actionCommunity].filter(r => r === 'high').length;
    const lows = [student.rubric.ethicalSensitivity, student.rubric.moralReflection, student.rubric.actionCommunity].filter(r => r === 'low').length;
    if (highs >= 2) student.rubric.overallRank = '도덕 가디언';
    else if (lows >= 2) student.rubric.overallRank = '성장 중';
    else student.rubric.overallRank = '견습 탐정';

    student.rubric.isConfirmed = true;
    student.neisComment = generateNeisComment(student);
    this.saveAndSync();
  }

  public updateNeisComment(studentNo: number, comment: string) {
    const student = this.getStudent(studentNo);
    if (!student) return;
    student.neisComment = comment;
    this.saveAndSync();
  }
}

export const sessionStore = new SessionStore();
