import { Student, StudentRubric, ClassroomSession } from '../types';
import { hasJongseong } from '../utils/koreanJosa';

export interface DilemmaScenario {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  victimName: string;
  groupName: string;
  context: string;
  chatLogs: Array<{
    sender: string;
    message: string;
    isMe?: boolean;
    isSystem?: boolean;
    time: string;
  }>;
  choices: Array<{
    id: 'A' | 'B' | 'C' | 'D' | 'E';
    title: string;
    realDilemma: string; // 초등 4학년의 실제 현실 고민
    desc: string;
    friendshipDelta: number;
    category: string;
  }>;
}

export const Q1_SCENARIOS: DilemmaScenario[] = [
  {
    id: 'soccer_kick',
    title: '사건 1: 축구 단톡방 골키퍼 강퇴 사건',
    subtitle: '사이버 집단 따돌림 & 방관의 딜레마',
    badge: '⚽ 축구 단톡방',
    victimName: '민재',
    groupName: '4학년 축구 결사대 (5명)',
    context: '반 대항 축구 경기에서 골키퍼 민재가 아쉽게 공을 놓쳐 경기에서 졌습니다. 방과 후 단체 채팅방에서 친구들이 민재를 비난하며 방에서 강퇴시켰습니다.',
    chatLogs: [
      { sender: '준호', message: '야 민재 걔 때문에 오늘 다 이긴 거 졌잖아 ㅡㅡ', isMe: false, time: '16:05' },
      { sender: '서진', message: '인정ㅋㅋ 공도 못 잡으면서 왜 골키퍼 한다고 나댐? 실력 실화냐', isMe: false, time: '16:06' },
      { sender: '민재', message: '얘들아 진짜 미안해... 햇빛 때문에 눈이 부셨어...', isMe: false, time: '16:06' },
      { sender: '시스템', message: '준호 님이 민재 님을 내보냈습니다.', isMe: false, isSystem: true, time: '16:07' },
      { sender: '도윤', message: 'ㅋㅋㅋ 쌤통이다. 내일 교실에서 말도 걸지 말자', isMe: false, time: '16:07' }
    ],
    choices: [
      {
        id: 'A',
        title: '단톡방 알림 끄고, 민재한테만 갠톡(개인톡)으로 위로하기',
        realDilemma: '나까지 타깃될까 봐 두려워 단톡방선 침묵하지만, 친구는 몰래 챙기고 싶음',
        desc: '단톡방에선 아무 말 안 하고, 민재에게만 “민재야 너무 기죽지 마... 쟤네가 심한 거야”라고 보낸다.',
        friendshipDelta: 15,
        category: '갠톡위로'
      },
      {
        id: 'B',
        title: '아무 말 없이 엉뚱한 게임 링크나 웃긴 짤 올려서 화제 돌리기',
        realDilemma: '갈등이 너무 무섭고 불편해서 딴청 피우며 어색하게 물타기함',
        desc: '“야 로블록스 신맵 나왔는데 같이 할 사람?” 하고 엉뚱한 말을 던져 단톡방 분위기를 억지로 돌려본다.',
        friendshipDelta: 10,
        category: '물타기'
      },
      {
        id: 'C',
        title: '단톡방에 “야 준호 너도 전반에 똥볼 찼잖아;” 하고 직격탄 반박하기',
        realDilemma: '속은 시원하지만, 준호 패거리와 내가 대판 싸워 학급 파벌 싸움으로 번질 위험',
        desc: '“민재만 잘못했냐? 다 같이 실수해놓고 한 사람 몰아가는 거 개치사해.” 하고 공개적으로 맞선다.',
        friendshipDelta: 35,
        category: '직설반박'
      },
      {
        id: 'D',
        title: '준호한테 갠톡으로 “야 쟤 울겠다. 쌤한테 걸리면 우리 다 혼나” 설득하기',
        realDilemma: '친구들 자존심을 건드리지 않으면서 실질적으로 민재를 다시 초대하려는 현실적 중재',
        desc: '주동자인 준호에게 뒤로 접근해 “내일 쌤이 단톡 검사하면 다 걸려. 걍 다시 초대해서 좋게 풀자”고 협상한다.',
        friendshipDelta: 30,
        category: '물밑중재'
      },
      {
        id: 'E',
        title: '손절당할까 봐 무서워서 “ㅋㅋㅋ 그러게” 하고 분위기에 휩쓸리기',
        realDilemma: '나쁜 짓인 걸 뻔히 알지만, 무리에서 소외될까 봐 어쩔 수 없이 가담하는 비겁한 심리',
        desc: '친구들의 눈치를 보며 어색하게 맞장구를 치고 나중에 양심의 가책을 느낀다.',
        friendshipDelta: -40,
        category: '동조'
      }
    ]
  },
  {
    id: 'photo_mock',
    title: '사건 2: 모둠 과제방 굴욕 엽기 사진 유포 사건',
    subtitle: '초상권 침해 & 조롱 밈(짤) 굴욕 딜레마',
    badge: '📸 모둠 과제방',
    victimName: '하은',
    groupName: '수학 3모둠 숙제방 (6명)',
    context: '수학 모둠 숙제방에서 하은이가 수업 시간에 입 벌리고 조는 흑역사 사진에 콧수염 낙서를 합성해서 ‘우리 반 공식 밈’이라며 단톡방에 올렸습니다.',
    chatLogs: [
      { sender: '태민', message: '야 이거 하은이 수학 시간에 침 흘리고 자는 거 봨ㅋㅋㅋㅋ 콧수염 합성함', isMe: false, time: '17:10' },
      { sender: '준서', message: '와 레전드 엽기짤 탄생ㅋㅋㅋㅋ 우리 반 틱톡에도 올려도 됨? 조회수 폭발각', isMe: false, time: '17:11' },
      { sender: '하은', message: '아 진짜 장난치지 마 지워줘 제발...ㅠㅠ 진짜 상처받아...', isMe: false, time: '17:12' },
      { sender: '태민', message: '뭐래 장난인데 왜 혼자 진지빰? 삐돌이 개복치임? ㅋㅋㅋ', isMe: false, time: '17:13' },
      { sender: '우진', message: '스티커로 만들어서 단톡방에 뿌려야짘ㅋㅋ', isMe: false, time: '17:13' }
    ],
    choices: [
      {
        id: 'A',
        title: '단톡방에서 “남의 자는 사진 몰래 올리는 건 선 넘었어. 지워” 정색하기',
        realDilemma: '태민이가 “너 왜 분위기 깨냐”며 나한테 화살을 돌릴 수도 있지만 피해자를 단호히 지킴',
        desc: '“장난은 상대방도 웃어야 장난이지. 하은이가 싫다잖아. 당장 사진 삭제해.” 하고 단호하게 제지한다.',
        friendshipDelta: 35,
        category: '단호제지'
      },
      {
        id: 'B',
        title: '태민이에게 갠톡으로 “학폭으로 신고당하기 전에 얼른 펑(삭제)해라” 협상하기',
        realDilemma: '단톡방 공개 충돌을 피하면서 실제 사진 유포를 막으려는 지혜로운 설득',
        desc: '태민이에게 “야 하은이 진짜 울고 있어. 부모님이나 쌤 귀에 들어가면 진짜 학폭 열려. 지워라” 귀띔한다.',
        friendshipDelta: 30,
        category: '물밑설득'
      },
      {
        id: 'C',
        title: '웃기긴 하니까 일단 내 갤러리에 저장해두고 단톡방에선 침묵하기',
        realDilemma: '남의 불행을 재미로 소비하면서도 겉으로는 착한 척 가만히 있는 현실적 방관',
        desc: '나중에 애들이랑 볼 생각에 캡처만 떠두고 하은이의 괴로움은 외면한다.',
        friendshipDelta: -25,
        category: '방관소비'
      },
      {
        id: 'D',
        title: '단톡방 캡처해서 하은이 몰래 담임 선생님께 비밀 상담 요청하기',
        realDilemma: '‘고자질쟁이’ 낙인이 두렵지만, 틱톡 등 SNS 2차 유포를 확실하게 차단함',
        desc: '더 큰 사이버 모욕으로 번지기 전에 믿을 수 있는 선생님께 조용히 스크린샷을 전송한다.',
        friendshipDelta: 30,
        category: '도움요청'
      }
    ]
  },
  {
    id: 'game_scam',
    title: '사건 3: 게임 계정 사기 & 번호 박제 협박 사건',
    subtitle: '사이버 명예훼손 & 개인정보 유출 딜레마',
    badge: '🎮 게임 파티방',
    victimName: '도현',
    groupName: '브롤 & 로블 마스터방 (7명)',
    context: '게임 스킨을 교환하기로 했는데 도현이가 부모님께 폰을 뺏겨 연락이 끊기자, 우진이가 “사기꾼 이도현 폰번호 틱톡에 박제한다”며 단톡방에 욕설과 함께 협박하는 상황입니다.',
    chatLogs: [
      { sender: '우진', message: '야 이도현 스킨 교환한다 해놓고 왜 접속 끊음? 사기꾼새끼네', isMe: false, time: '19:20' },
      { sender: '건우', message: '도현이 폰번호랑 사는 아파트 틱톡에 박제 간다ㅋㅋㅋ 인생 망해봐라', isMe: false, time: '19:21' },
      { sender: '도현', message: '차단한 거 아니고 엄마가 폰 뺏어가서 그런 거야 ㅠㅠ 내일 돌려줄게 제발 박제하지 마', isMe: false, time: '19:22' },
      { sender: '우진', message: '변명 쩌네 박제당하기 싫으면 지금 당장 로벅스 1000원치 내놔 ㅡㅡ', isMe: false, time: '19:23' }
    ],
    choices: [
      {
        id: 'A',
        title: '“전화번호랑 사는 곳 까는 건 진짜 사이버 범죄야” 경고하기',
        realDilemma: '우진이 무리가 “너도 공범이냐”고 시비 걸 수 있지만 개인정보 유출의 위험성을 경고함',
        desc: '“스킨 문제는 내일 학교에서 교환하면 되잖아. 신상 터는 건 진짜 경찰서 갈 일이야.” 하고 막아선다.',
        friendshipDelta: 35,
        category: '법적경고'
      },
      {
        id: 'B',
        title: '“도현이 진짜 폰 뺏긴 것 같아. 내일 내가 같이 확인해줄게” 보증 서기',
        realDilemma: '스스로 책임을 분담하여 성난 친구들을 진정시키는 용기 있는 중재',
        desc: '내일 아침 등교하자마자 도현이와 함께 스킨을 교환할 것을 약속하며 당장의 폭력을 중단시킨다.',
        friendshipDelta: 40,
        category: '책임중재'
      },
      {
        id: 'C',
        title: '“도현이가 먼저 약속 어겼으니 꼴좋네 ㅋㅋㅋ” 하고 부추기기',
        realDilemma: '전후 사정도 모른 채 인터넷식 마녀사냥과 사이버 협박에 편승하는 심리',
        desc: '우진이 편을 들어 도현이를 몰아세우며 금전 요구를 방조한다.',
        friendshipDelta: -45,
        category: '협박가담'
      },
      {
        id: 'D',
        title: '협박 내용 캡처해서 즉시 부모님이나 선생님께 긴급 제보하기',
        realDilemma: '아이들 수준을 넘어선 금전 요구와 개인정보 범죄이므로 어른의 개입이 필수적임',
        desc: '사이버 폭력이 틱톡 등 외부로 퍼지기 전에 증거를 확보하여 어른에게 알린다.',
        friendshipDelta: 30,
        category: '긴급신고'
      }
    ]
  },
  {
    id: 'secret_room',
    title: '사건 4: 예은이 없는 ‘비밀 뒷담방’ 캡처 유출 사건',
    subtitle: '사이버 파벌 & 이간질 배신 딜레마',
    badge: '🤫 비밀 뒷담방',
    victimName: '예은',
    groupName: '예은이 빼고 모인 방 (5명)',
    context: '예은이를 뺀 단톡방에서 “예은이 잘난 척 오진다”고 험담하던 중, 누군가 대화 내용을 캡처해서 예은이에게 전달하여 교실이 발칵 뒤집힌 상황입니다.',
    chatLogs: [
      { sender: '채원', message: '누가 예은이한테 단톡 캡처 유출함? 미쳤음? 첩자 누구냐 손절각이다', isMe: false, time: '20:00' },
      { sender: '나윤', message: '나 아님 진짜... 근데 예은이 지금 화장실에서 울고 있대 어떡함', isMe: false, time: '20:01' },
      { sender: '수빈', message: '야 솔직히 우리 다 같이 욕했잖아. 이제 와서 갠톡으로 혼자 착한 척한 사람 누구임?', isMe: false, time: '20:02' },
      { sender: '채원', message: '앞으로 예은이 편드는 애도 똑같이 손절한다 ㅡㅡ 첩자 자수해라', isMe: false, time: '20:03' }
    ],
    choices: [
      {
        id: 'A',
        title: '“뒤에서 비밀방 파서 욕한 우리가 100% 잘못이야. 다 같이 사과하자”',
        realDilemma: '아이들의 거센 반발과 “너나 사과해” 소리를 들을 각오를 해야 하는 진정한 용기',
        desc: '누가 유출했는지 색출하는 마녀사냥을 멈추고, 비밀 험담 자체가 잘못임을 인정하자고 설득한다.',
        friendshipDelta: 45,
        category: '용기사과'
      },
      {
        id: 'B',
        title: '비밀 단톡방을 조용히 나가고, 예은이를 찾아가 진심으로 사과하기',
        realDilemma: '친구들에게 배신자로 찍힐 위험이 있지만, 스스로 비겁한 뒷담방에서 발을 뺌',
        desc: '파벌 싸움에 더 이상 엮이지 않고 피해 학생에게 직접 찾아가 용서를 빈다.',
        friendshipDelta: 35,
        category: '탈퇴사과'
      },
      {
        id: 'C',
        title: '의심받아 손절당할까 봐 “난 진짜 안 보냈어! 수빈이가 보낸 거 아님?” 남 탓하기',
        realDilemma: '자신의 죄책감을 덮고 친구 무리에서 살아남기 위해 다른 친구에게 누명을 씌우는 비겁함',
        desc: '거짓말로 발뺌하며 다른 무고한 친구를 의심하여 갈등을 더 키운다.',
        friendshipDelta: -40,
        category: '누명전가'
      },
      {
        id: 'D',
        title: '우리끼리 풀 수 없는 파벌 싸움이 되었으니 담임 선생님께 털어놓기',
        realDilemma: '‘고자질’로 원망받을 수 있지만 집단 따돌림의 악순환을 끊기 위해 사실을 고백함',
        desc: '상황이 더 걷잡을 수 없이 파국으로 치닫기 전에 담임 선생님께 사실대로 털어놓고 도움을 청한다.',
        friendshipDelta: 30,
        category: '진실고백'
      }
    ]
  }
];

export const Q1_DILEMMA_SCENARIO = Q1_SCENARIOS[0];

export const Q2_EMOTION_CARDS = [
  { id: 'lonely', label: '외로움과 고립감 💔', description: '나 혼자 버려진 것 같고 아무도 내 편이 없다는 느낌' },
  { id: 'unfair', label: '억울함과 분함 😢', description: '고의가 아니었는데 아무도 내 설명을 들어주지 않는 슬픔' },
  { id: 'fear', label: '학교 가기 두려움 😨', description: '내일 교실에서 친구들이 나를 쳐다보고 수군거릴까 봐 불안함' },
  { id: 'betrayal', label: '친구에 대한 배신감 😠', description: '어제까지 친했던 친구들이 한순간에 등을 돌린 상처' },
  { id: 'shame', label: '자책감과 수치심 🥺', description: '모든 게 나 때문이라는 생각에 자존감이 무너지는 느낌' }
];

export const Q3_BATTERY_QUESTIONS = [
  {
    id: 1,
    question: '게임이나 유튜브 쇼츠를 보느라 숙제나 수면 시간을 미룬 적이 있나요?',
    hint: '디지털 기기 이용 시간 조절 습관'
  },
  {
    id: 2,
    question: '온라인에서 상대방 얼굴이 안 보인다고 반말이나 거친 말을 쓴 적이 있나요?',
    hint: '사이버 언어 예절 및 존중'
  },
  {
    id: 3,
    question: '다른 사람의 사진, 그림, 글을 허락 없이 퍼오거나 단톡방에 공유한 적이 있나요?',
    hint: '디지털 저작권 및 초상권 보호'
  },
  {
    id: 4,
    question: '친구가 메시지를 보냈을 때 일부러 단체로 읽씹하거나 따돌림에 동조한 적이 있나요?',
    hint: '사이버 불링 예방 및 배려'
  },
  {
    id: 5,
    question: '스마트폰을 손에서 놓으면 불안하거나 수업 시간에 딴생각이 든 적이 있나요?',
    hint: '디지털 과의존 예방 및 집중력'
  }
];

export const BUFF_STICKERS = [
  { id: 'star', name: '황금별 🌟', desc: '빛나는 실천 의지' },
  { id: 'heart', name: '따뜻한 마음 💖', desc: '친구를 감싸주는 공감' },
  { id: 'shield', name: '수호의 방패 🛡️', desc: '사이버 불링을 막는 용기' },
  { id: 'rocket', name: '응원 로켓 🚀', desc: '끝까지 해내는 끈기' }
];

// Helper to calculate rubric grades from student logs
export function evaluateStudentRubric(student: Partial<Student>): StudentRubric {
  // 1. 윤리적 민감성: Q1 선택지 & Q1 사유 & Q2 감정 카드
  let ethicalSensitivity: 'high' | 'mid' | 'low' = 'mid';
  const choice = student.q1?.choice;
  const reasonLen = (student.q1?.consequenceReason || '').trim().length;
  const emotionCount = (student.q2?.emotionCards || []).length;
  const magicLen = (student.q2?.magicSentence || '').trim().length;

  if ((choice === 'C' || choice === 'D' || choice === 'B' || choice === 'A') && reasonLen >= 10 && emotionCount >= 1 && magicLen >= 8) {
    ethicalSensitivity = (choice === 'C' || choice === 'D') ? 'high' : 'mid';
  } else if (choice === 'E' || reasonLen < 5 || magicLen < 4) {
    ethicalSensitivity = 'low';
  }

  // 2. 도덕적 성찰: Q3 배터리 점수 & 솔직 고백란 구체성
  let moralReflection: 'high' | 'mid' | 'low' = 'mid';
  const habitLen = (student.q3?.honestHabitToFix || '').trim().length;
  const batteryAnswered = (student.q3?.habitScores || []).length === 5;

  if (batteryAnswered && habitLen >= 12) {
    moralReflection = 'high';
  } else if (!batteryAnswered || habitLen < 4) {
    moralReflection = 'low';
  }

  // 3. 실천 및 공동체성: Q4 다짐 & 친구 버프 전송 횟수
  let actionCommunity: 'high' | 'mid' | 'low' = 'mid';
  const pledgeLen = (student.q4?.guardianPledge || '').trim().length;
  const sentBuffsCount = (student.q4?.sentBuffs || []).length;

  if (pledgeLen >= 10 && sentBuffsCount >= 2) {
    actionCommunity = 'high';
  } else if (pledgeLen < 5 || sentBuffsCount === 0) {
    actionCommunity = 'low';
  }

  // 종합 판정
  const highs = [ethicalSensitivity, moralReflection, actionCommunity].filter(r => r === 'high').length;
  const lows = [ethicalSensitivity, moralReflection, actionCommunity].filter(r => r === 'low').length;
  let overallRank: '도덕 가디언' | '견습 탐정' | '성장 중' = '견습 탐정';
  if (highs >= 2) overallRank = '도덕 가디언';
  else if (lows >= 2) overallRank = '성장 중';

  return {
    ethicalSensitivity,
    moralReflection,
    actionCommunity,
    overallRank,
    isConfirmed: false
  };
}

// Generate NEIS standard observation comments (2022 개정 도덕 4도03-02 기준)
export function generateNeisComment(student: {
  name: string;
  q1?: { choice?: string; consequenceReason?: string };
  q2?: { magicSentence?: string };
  q3?: { honestHabitToFix?: string };
  q4?: { guardianPledge?: string; sentBuffs?: unknown[] };
  rubric?: { overallRank?: string; ethicalSensitivity?: string };
}): string {
  const name = student.name || '학생';
  const choiceMap: Record<string, string> = {
    'A': '갈등 상황에서 피해 친구의 어려움을 살피며',
    'B': '단톡방 내 긴장된 분위기를 완화하기 위해 노력하며',
    'C': '단톡방 사이버 괴롭힘 상황에서 용기 있게 부당함을 지적하고',
    'D': '갈등 상황을 실질적으로 해결하기 위해 주동 친구를 지혜롭게 설득하며',
    'E': '집단 동조 압력의 위험성을 성찰하고 올바른 판단력을 기르고자 하며'
  };
  const q1Action = choiceMap[student.q1?.choice || 'C'] || '디지털 갈등 상황을 올바르게 인식하고';
  
  const habit = student.q3?.honestHabitToFix?.trim() || '디지털 기기를 과도하게 이용';
  const pledge = student.q4?.guardianPledge?.trim() || '바른 언어와 약속된 이용 시간 준수';
  const buffCount = student.q4?.sentBuffs?.length || 0;

  const nameWithTopic = hasJongseong(name) ? `${name}은` : `${name}는`;

  if (student.rubric?.overallRank === '도덕 가디언' || student.rubric?.ethicalSensitivity === 'high') {
    return `${nameWithTopic} 디지털 사회의 의사소통 갈등 상황을 올바르게 인식하고 ${q1Action}, 피해자의 심리적 상처에 깊이 공감함. 자신의 생활을 솔직히 성찰하여 평소 '${habit}'하던 태도를 개선하고자 '${pledge}'을(를) 구체적인 실천 목표로 확립함. 동료 급우들에게 진심 어린 격려를 ${buffCount}회 이상 전하며 학급 내 건강하고 배려 깊은 디지털 시민 문화 형성을 주도함.`;
  } else if (student.rubric?.overallRank === '성장 중') {
    return `${nameWithTopic} 단톡방 내 갈등 사례를 통해 사이버 윤리의 필요성을 탐색함. 자신의 디지털 습관(${habit})을 점검하고 '${pledge}'을(를) 다짐하며 올바른 정보통신 이용 태도를 기르고자 노력함.`;
  } else {
    return `${nameWithTopic} 디지털 갈등 상황을 인식하고 ${q1Action}, 피해 학생을 돕기 위한 대안을 탐색함. 자신의 디지털 생활을 점검하여 '${habit}' 습관을 바로잡기 위해 '${pledge}'을(를) 실천 과제로 정립하고 동료들을 따뜻하게 응원함.`;
  }
}

// 24 realistic 4th grade students for instant interactive classroom demo
export const INITIAL_STUDENTS: Student[] = [
  {
    studentNo: 1,
    name: '강수빈',
    currentQuest: 4,
    progressPercent: 90,
    lastActiveAt: Date.now() - 40000,
    isStuck: false,
    needsHelp: false,
    exp: 420,
    level: 4,
    goldenStamps: 2,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '민재가 혼자 울고 학교에 오기 싫어질 것 같아서 내일 교실에서 풀자고 말렸어요.',
      friendshipDelta: 35,
      completedAt: '10:05'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔', '억울함과 분함 😢'],
      magicSentence: '“민재야 오늘 경기 수고 많았어. 단톡방 말들 너무 마음에 담아두지 마. 내일 같이 등교하자!”',
      completedAt: '10:12'
    },
    q3: {
      habitScores: [10, 0, 0, 0, 10],
      batteryPercentage: 85,
      honestHabitToFix: '밤 10시 넘어서 이불 속에서 유튜브 쇼츠를 30분씩 계속 넘겨보는 것',
      expBonusEarned: true,
      completedAt: '10:20'
    },
    q4: {
      guardianPledge: '밤 9시 30분 이후에는 스마트폰을 거실 충전 바구니에 두고 자겠습니다!',
      sentBuffs: [
        { id: 'b1', fromStudentNo: 1, fromStudentName: '강수빈', toStudentNo: 2, sticker: '🌟 황금별', comment: '민우야 너 다짐 멋지다! 같이 지키자', createdAt: '10:25' },
        { id: 'b2', fromStudentNo: 1, fromStudentName: '강수빈', toStudentNo: 4, sticker: '💖 따뜻한 마음', comment: '도현아 천천히 해도 괜찮아 힘내!', createdAt: '10:26' }
      ],
      receivedBuffs: [
        { id: 'rb1', fromStudentNo: 3, fromStudentName: '박지민', toStudentNo: 1, sticker: '🌟 황금별', comment: '수빈이 오늘 단톡방 중재 답변 완전 감동이었어', createdAt: '10:27' }
      ],
      completedAt: '10:28'
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'high',
      overallRank: '도덕 가디언',
      isConfirmed: true
    },
    neisComment: ''
  },
  {
    studentNo: 2,
    name: '김민우',
    currentQuest: 3,
    progressPercent: 65,
    lastActiveAt: Date.now() - 90000,
    isStuck: false,
    needsHelp: false,
    exp: 280,
    level: 3,
    goldenStamps: 1,
    q1: {
      choice: 'D',
      choiceTitle: '화면을 캡처하고 담임 선생님께 알리기',
      consequenceReason: '우리끼리 싸우면 단톡방이 더 험악해지니까 선생님께 도움을 청해야 해결돼요.',
      friendshipDelta: 30,
      completedAt: '10:07'
    },
    q2: {
      emotionCards: ['학교 가기 두려움 😨'],
      magicSentence: '“민재야, 네 잘못 아니니까 기죽지 마. 내가 선생님께 말씀드렸어.”',
      completedAt: '10:15'
    },
    q3: {
      habitScores: [20, 10, 0, 0, 10],
      batteryPercentage: 60,
      honestHabitToFix: '게임 연패했을 때 단톡방에 괜히 짜증 섞인 이모티콘을 도배했던 습관',
      expBonusEarned: true
    },
    q4: {
      guardianPledge: '',
      sentBuffs: [],
      receivedBuffs: [
        { id: 'rb2', fromStudentNo: 1, fromStudentName: '강수빈', toStudentNo: 2, sticker: '🌟 황금별', comment: '민우야 너 다짐 멋지다! 같이 지키자', createdAt: '10:25' }
      ]
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'mid',
      actionCommunity: 'mid',
      overallRank: '견습 탐정',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 3,
    name: '박지민',
    currentQuest: 4,
    progressPercent: 100,
    lastActiveAt: Date.now() - 10000,
    isStuck: false,
    needsHelp: false,
    exp: 500,
    level: 5,
    goldenStamps: 3,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '사이버 불링은 방관하면 가해자가 된다고 배웠기 때문에 꼭 멈춰야 합니다.',
      friendshipDelta: 35,
      completedAt: '10:04'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔', '배신감 😠', '자책감과 수치심 🥺'],
      magicSentence: '“누구나 실수할 수 있어. 승패보다 우리 반 우정이 훨씬 소중해!”',
      completedAt: '10:10'
    },
    q3: {
      habitScores: [0, 0, 0, 0, 0],
      batteryPercentage: 100,
      honestHabitToFix: '친구 답장이 조금 늦게 오면 바로 재촉 카톡을 세 번씩 보내던 조급함',
      expBonusEarned: true,
      completedAt: '10:18'
    },
    q4: {
      guardianPledge: '친구가 상처받을 말은 키보드로 절대 치지 않고, 온라인에서도 존댓말을 쓰겠습니다!',
      sentBuffs: [
        { id: 'b3', fromStudentNo: 3, fromStudentName: '박지민', toStudentNo: 1, sticker: '🌟 황금별', comment: '수빈이 오늘 단톡방 중재 답변 완전 감동이었어', createdAt: '10:27' },
        { id: 'b4', fromStudentNo: 3, fromStudentName: '박지민', toStudentNo: 5, sticker: '🛡️ 수호의 방패', comment: '예은아 우리 사이버 수호대 같이 열심히 하자!', createdAt: '10:28' }
      ],
      receivedBuffs: [],
      completedAt: '10:30'
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'high',
      overallRank: '도덕 가디언',
      isConfirmed: true
    },
    neisComment: ''
  },
  {
    studentNo: 4,
    name: '이도현',
    currentQuest: 1,
    progressPercent: 20,
    lastActiveAt: Date.now() - 360000, // > 5 minutes stuck!
    isStuck: true,
    needsHelp: true,
    helpMessage: '선생님, 단톡방에서 생길 일을 뭐라고 적어야 할지 잘 모르겠어요!',
    exp: 80,
    level: 1,
    goldenStamps: 0,
    q1: {
      choice: 'A',
      choiceTitle: '조용히 읽기만 하고 침묵하기',
      consequenceReason: '친구들 눈치가 보여서...',
      friendshipDelta: -20
    },
    q2: { emotionCards: [], magicSentence: '' },
    q3: { habitScores: [10, 10, 0, 0, 10], batteryPercentage: 70, honestHabitToFix: '', expBonusEarned: false },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'low',
      moralReflection: 'low',
      actionCommunity: 'low',
      overallRank: '성장 중',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 5,
    name: '정예은',
    currentQuest: 4,
    progressPercent: 88,
    lastActiveAt: Date.now() - 50000,
    isStuck: false,
    needsHelp: false,
    exp: 410,
    level: 4,
    goldenStamps: 2,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '민재가 방에서 쫓겨나면 너무 외롭고 무서울 것 같아서 다시 초대해야 해요.',
      friendshipDelta: 35,
      completedAt: '10:06'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔', '억울함과 분함 😢'],
      magicSentence: '“민재야 내가 방 다시 만들어서 초대해줄게. 기운 내!”',
      completedAt: '10:14'
    },
    q3: {
      habitScores: [10, 0, 10, 0, 10],
      batteryPercentage: 75,
      honestHabitToFix: '인터넷 검색한 사진을 숙제에 쓸 때 출처를 안 적었던 것',
      expBonusEarned: true,
      completedAt: '10:22'
    },
    q4: {
      guardianPledge: '다른 사람의 글과 사진을 쓸 때는 반드시 허락을 구하고 출처를 밝히겠습니다!',
      sentBuffs: [
        { id: 'b5', fromStudentNo: 5, fromStudentName: '정예은', toStudentNo: 6, sticker: '🚀 응원 로켓', comment: '서준아 힘내서 4단계까지 오렴!', createdAt: '10:28' }
      ],
      receivedBuffs: [
        { id: 'rb5', fromStudentNo: 3, fromStudentName: '박지민', toStudentNo: 5, sticker: '🛡️ 수호의 방패', comment: '예은아 우리 사이버 수호대 같이 열심히 하자!', createdAt: '10:28' }
      ]
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'mid',
      overallRank: '도덕 가디언',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 6,
    name: '최서준',
    currentQuest: 3,
    progressPercent: 55,
    lastActiveAt: Date.now() - 120000,
    isStuck: false,
    needsHelp: false,
    exp: 250,
    level: 2,
    goldenStamps: 1,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '축구는 팀 게임이니까 한 사람 탓을 하면 안 돼요.',
      friendshipDelta: 35,
      completedAt: '10:08'
    },
    q2: {
      emotionCards: ['자책감과 수치심 🥺'],
      magicSentence: '“다음엔 우리가 골 더 많이 넣으면 돼. 민재야 슬퍼하지 마!”',
      completedAt: '10:18'
    },
    q3: {
      habitScores: [20, 0, 0, 0, 10],
      batteryPercentage: 70,
      honestHabitToFix: '로블록스 하느라 엄마가 밥 먹으라고 세 번 부를 때까지 대답 안 한 것',
      expBonusEarned: true
    },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'mid',
      moralReflection: 'mid',
      actionCommunity: 'mid',
      overallRank: '견습 탐정',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 7,
    name: '한채원',
    currentQuest: 4,
    progressPercent: 95,
    lastActiveAt: Date.now() - 25000,
    isStuck: false,
    needsHelp: false,
    exp: 460,
    level: 4,
    goldenStamps: 2,
    q1: {
      choice: 'D',
      choiceTitle: '화면을 캡처하고 담임 선생님께 알리기',
      consequenceReason: '심각한 언어폭력은 증거를 남겨서 빠르게 어른들이 중재해야 2차 피해를 막습니다.',
      friendshipDelta: 30,
      completedAt: '10:05'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔', '학교 가기 두려움 😨'],
      magicSentence: '“민재야 우리가 편들어줄 테니까 내일 안심하고 학교 와!”',
      completedAt: '10:13'
    },
    q3: {
      habitScores: [10, 0, 0, 0, 0],
      batteryPercentage: 90,
      honestHabitToFix: '친구랑 메시지 주고받을 때 줄임말을 너무 많이 써서 오해가 생겼던 것',
      expBonusEarned: true,
      completedAt: '10:21'
    },
    q4: {
      guardianPledge: '온라인 대화에서도 상대방의 표정을 상상하며 고운 말과 바른 문장을 쓰겠습니다.',
      sentBuffs: [
        { id: 'b7', fromStudentNo: 7, fromStudentName: '한채원', toStudentNo: 8, sticker: '💖 따뜻한 마음', comment: '우진아 네 마법의 한마디 정말 따뜻했어', createdAt: '10:27' },
        { id: 'b8', fromStudentNo: 7, fromStudentName: '한채원', toStudentNo: 9, sticker: '🌟 황금별', comment: '하은아 우리 반 배터리 1등 되자!', createdAt: '10:29' }
      ],
      receivedBuffs: [],
      completedAt: '10:30'
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'high',
      overallRank: '도덕 가디언',
      isConfirmed: true
    },
    neisComment: ''
  },
  {
    studentNo: 8,
    name: '송우진',
    currentQuest: 3,
    progressPercent: 70,
    lastActiveAt: Date.now() - 80000,
    isStuck: false,
    needsHelp: false,
    exp: 310,
    level: 3,
    goldenStamps: 1,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '다 같이 비난하면 나중에 화해하기 어려워집니다.',
      friendshipDelta: 35,
      completedAt: '10:07'
    },
    q2: {
      emotionCards: ['억울함과 분함 😢'],
      magicSentence: '“민재야 속상하지? 내일 축구화 같이 닦으면서 이야기하자.”',
      completedAt: '10:16'
    },
    q3: {
      habitScores: [10, 10, 0, 0, 10],
      batteryPercentage: 70,
      honestHabitToFix: '게임 채팅창에 모르는 사람에게 거친 말을 내뱉었던 부끄러운 기억',
      expBonusEarned: true,
      completedAt: '10:24'
    },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'mid',
      moralReflection: 'high',
      actionCommunity: 'mid',
      overallRank: '견습 탐정',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 9,
    name: '윤하은',
    currentQuest: 2,
    progressPercent: 40,
    lastActiveAt: Date.now() - 70000,
    isStuck: false,
    needsHelp: false,
    exp: 190,
    level: 2,
    goldenStamps: 0,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '친구를 단톡방에서 내쫓는 건 사이버 왕따입니다.',
      friendshipDelta: 35,
      completedAt: '10:09'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔'],
      magicSentence: '“민재야 상처받지 마, 우리가 도울게.”'
    },
    q3: { habitScores: [], batteryPercentage: 80, honestHabitToFix: '', expBonusEarned: false },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'mid',
      moralReflection: 'low',
      actionCommunity: 'low',
      overallRank: '성장 중',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 10,
    name: '배준혁',
    currentQuest: 4,
    progressPercent: 85,
    lastActiveAt: Date.now() - 60000,
    isStuck: false,
    needsHelp: false,
    exp: 390,
    level: 4,
    goldenStamps: 1,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '민재 마음이 찢어질 것 같아요. 다 같이 반성해야 합니다.',
      friendshipDelta: 35,
      completedAt: '10:06'
    },
    q2: {
      emotionCards: ['억울함과 분함 😢', '자책감과 수치심 🥺'],
      magicSentence: '“민재야 수고했어. 우리 팀 수비가 못 막아준 것도 있으니 네 잘못만은 아니야.”',
      completedAt: '10:14'
    },
    q3: {
      habitScores: [10, 0, 0, 0, 10],
      batteryPercentage: 80,
      honestHabitToFix: '학원 숙제할 때 인터넷 챗봇한테 답 그대로 베껴 쓰던 습관',
      expBonusEarned: true,
      completedAt: '10:22'
    },
    q4: {
      guardianPledge: '인공지능과 디지털 정보를 사용할 때 정직하게 생각하고 스스로 공부하겠습니다!',
      sentBuffs: [
        { id: 'b10', fromStudentNo: 10, fromStudentName: '배준혁', toStudentNo: 11, sticker: '🌟 황금별', comment: '시우야 멋진 가디언 되자!', createdAt: '10:29' }
      ],
      receivedBuffs: []
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'mid',
      overallRank: '도덕 가디언',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 11,
    name: '임시우',
    currentQuest: 2,
    progressPercent: 35,
    lastActiveAt: Date.now() - 320000, // stuck!
    isStuck: true,
    needsHelp: false,
    helpMessage: '5분 이상 탐정 돋보기 퀘스트에 머무름',
    exp: 150,
    level: 2,
    goldenStamps: 0,
    q1: {
      choice: 'A',
      choiceTitle: '조용히 읽기만 하고 침묵하기',
      consequenceReason: '어떻게 해야 할지 망설이다가 가만히 있었어요.',
      friendshipDelta: -20,
      completedAt: '10:10'
    },
    q2: { emotionCards: ['억울함과 분함 😢'], magicSentence: '' },
    q3: { habitScores: [], batteryPercentage: 70, honestHabitToFix: '', expBonusEarned: false },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'low',
      moralReflection: 'low',
      actionCommunity: 'low',
      overallRank: '성장 중',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 12,
    name: '오지우',
    currentQuest: 3,
    progressPercent: 60,
    lastActiveAt: Date.now() - 95000,
    isStuck: false,
    needsHelp: false,
    exp: 260,
    level: 3,
    goldenStamps: 1,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '사이버 불링 피해자는 학교에 나오기 싫어집니다.',
      friendshipDelta: 35,
      completedAt: '10:07'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔'],
      magicSentence: '“민재야 우리 같이 떡볶이 먹으면서 기분 풀자!”',
      completedAt: '10:15'
    },
    q3: {
      habitScores: [10, 0, 10, 0, 0],
      batteryPercentage: 80,
      honestHabitToFix: '친구가 싫어하는 웃긴 엽기 사진을 단톡방에 보냈던 장난',
      expBonusEarned: true
    },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'mid',
      moralReflection: 'high',
      actionCommunity: 'mid',
      overallRank: '견습 탐정',
      isConfirmed: false
    },
    neisComment: ''
  },
  // Students 13~24
  {
    studentNo: 13,
    name: '권민서',
    currentQuest: 4,
    progressPercent: 92,
    lastActiveAt: Date.now() - 35000,
    isStuck: false,
    needsHelp: false,
    exp: 430,
    level: 4,
    goldenStamps: 2,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '친구의 실수를 조롱하는 단톡방 분위기를 끊어야 해요.',
      friendshipDelta: 35,
      completedAt: '10:05'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔', '배신감 😠'],
      magicSentence: '“민재야 오늘 골 막으려고 끝까지 다이빙한 거 정말 멋졌어!”',
      completedAt: '10:13'
    },
    q3: {
      habitScores: [0, 0, 0, 0, 10],
      batteryPercentage: 90,
      honestHabitToFix: '잠들기 전 유튜브 알고리즘에 빠져서 늦게 자던 버릇',
      expBonusEarned: true,
      completedAt: '10:21'
    },
    q4: {
      guardianPledge: '디지털 세상에서도 친구의 입장을 먼저 생각하고 따뜻한 칭찬의 말을 건네겠습니다.',
      sentBuffs: [
        { id: 'b13_1', fromStudentNo: 13, fromStudentName: '권민서', toStudentNo: 14, sticker: '🌟 황금별', comment: '현우야 다짐 꼭 실천하자!', createdAt: '10:28' },
        { id: 'b13_2', fromStudentNo: 13, fromStudentName: '권민서', toStudentNo: 15, sticker: '💖 따뜻한 마음', comment: '나윤아 너 마법 문장 최고야', createdAt: '10:29' }
      ],
      receivedBuffs: [],
      completedAt: '10:30'
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'high',
      overallRank: '도덕 가디언',
      isConfirmed: true
    },
    neisComment: ''
  },
  {
    studentNo: 14,
    name: '신현우',
    currentQuest: 3,
    progressPercent: 65,
    lastActiveAt: Date.now() - 110000,
    isStuck: false,
    needsHelp: false,
    exp: 290,
    level: 3,
    goldenStamps: 1,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '축구는 이길 때도 있고 질 때도 있으니까요.',
      friendshipDelta: 35,
      completedAt: '10:08'
    },
    q2: {
      emotionCards: ['자책감과 수치심 🥺'],
      magicSentence: '“민재야 자책하지 마! 내일 같이 연습하자.”',
      completedAt: '10:17'
    },
    q3: {
      habitScores: [20, 10, 0, 0, 10],
      batteryPercentage: 60,
      honestHabitToFix: '친구에게 기분 나쁜 별명으로 카톡 프로필을 저장했던 일',
      expBonusEarned: true
    },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'mid',
      moralReflection: 'mid',
      actionCommunity: 'mid',
      overallRank: '견습 탐정',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 15,
    name: '조나윤',
    currentQuest: 4,
    progressPercent: 88,
    lastActiveAt: Date.now() - 45000,
    isStuck: false,
    needsHelp: false,
    exp: 400,
    level: 4,
    goldenStamps: 2,
    q1: {
      choice: 'D',
      choiceTitle: '화면을 캡처하고 담임 선생님께 알리기',
      consequenceReason: '피해 학생이 혼자서 감당하기 어려운 폭력이기 때문입니다.',
      friendshipDelta: 30,
      completedAt: '10:06'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔', '학교 가기 두려움 😨'],
      magicSentence: '“민재야 걱정 마, 선생님과 친구들이 지켜줄 거야.”',
      completedAt: '10:14'
    },
    q3: {
      habitScores: [10, 0, 0, 0, 10],
      batteryPercentage: 80,
      honestHabitToFix: '인터넷 글을 읽고 출처 확인 없이 친구들에게 진짜인 것처럼 소문낸 것',
      expBonusEarned: true,
      completedAt: '10:23'
    },
    q4: {
      guardianPledge: '가짜 뉴스를 구별하고, 확실하지 않은 소문은 단톡방에 퍼뜨리지 않겠습니다!',
      sentBuffs: [
        { id: 'b15', fromStudentNo: 15, fromStudentName: '조나윤', toStudentNo: 16, sticker: '🛡️ 수호의 방패', comment: '태민아 파이팅!', createdAt: '10:29' }
      ],
      receivedBuffs: []
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'mid',
      overallRank: '도덕 가디언',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 16,
    name: '안태민',
    currentQuest: 3,
    progressPercent: 62,
    lastActiveAt: Date.now() - 85000,
    isStuck: false,
    needsHelp: false,
    exp: 270,
    level: 3,
    goldenStamps: 1,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '말리지 않으면 나도 똑같은 가해자가 되니까요.',
      friendshipDelta: 35,
      completedAt: '10:07'
    },
    q2: {
      emotionCards: ['억울함과 분함 😢'],
      magicSentence: '“민재야 기운 내, 다음에 이기면 돼!”',
      completedAt: '10:16'
    },
    q3: {
      habitScores: [10, 10, 0, 0, 0],
      batteryPercentage: 80,
      honestHabitToFix: '게임 채팅에서 도발하는 말에 흥분해서 욕설 쓴 것',
      expBonusEarned: true
    },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'mid',
      moralReflection: 'mid',
      actionCommunity: 'mid',
      overallRank: '견습 탐정',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 17,
    name: '황유나',
    currentQuest: 4,
    progressPercent: 100,
    lastActiveAt: Date.now() - 15000,
    isStuck: false,
    needsHelp: false,
    exp: 510,
    level: 5,
    goldenStamps: 3,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '말 한마디로 친구의 마음을 살릴 수도 있고 다치게 할 수도 있습니다.',
      friendshipDelta: 35,
      completedAt: '10:04'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔', '억울함과 분함 😢'],
      magicSentence: '“민재야 오늘 진짜 고생 많았어. 네가 있어서 우리 팀이 결승까지 간 거야!”',
      completedAt: '10:11'
    },
    q3: {
      habitScores: [0, 0, 0, 0, 0],
      batteryPercentage: 100,
      honestHabitToFix: '식사 시간에 스마트폰을 식탁에 올려두고 힐끔힐끔 보던 나쁜 버릇',
      expBonusEarned: true,
      completedAt: '10:19'
    },
    q4: {
      guardianPledge: '밥 먹을 때와 가족 대화 시간에는 스마트폰을 멀리하고 대화에 집중하겠습니다.',
      sentBuffs: [
        { id: 'b17_1', fromStudentNo: 17, fromStudentName: '황유나', toStudentNo: 18, sticker: '🌟 황금별', comment: '건우야 다짐 실천 응원해!', createdAt: '10:26' },
        { id: 'b17_2', fromStudentNo: 17, fromStudentName: '황유나', toStudentNo: 19, sticker: '💖 따뜻한 마음', comment: '서아 오늘 수고했어~', createdAt: '10:27' }
      ],
      receivedBuffs: [],
      completedAt: '10:29'
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'high',
      overallRank: '도덕 가디언',
      isConfirmed: true
    },
    neisComment: ''
  },
  {
    studentNo: 18,
    name: '송건우',
    currentQuest: 3,
    progressPercent: 70,
    lastActiveAt: Date.now() - 65000,
    isStuck: false,
    needsHelp: false,
    exp: 300,
    level: 3,
    goldenStamps: 1,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '우리는 같은 반 친구들이니까 지켜줘야 합니다.',
      friendshipDelta: 35,
      completedAt: '10:07'
    },
    q2: {
      emotionCards: ['자책감과 수치심 🥺'],
      magicSentence: '“민재야 힘내라! 내일 학교에서 축구 연습하자.”',
      completedAt: '10:15'
    },
    q3: {
      habitScores: [10, 10, 0, 0, 10],
      batteryPercentage: 70,
      honestHabitToFix: '동생이 컴퓨터 쓸 때 비키라고 소리 지르고 양보 안 했던 일',
      expBonusEarned: true
    },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'mid',
      moralReflection: 'mid',
      actionCommunity: 'mid',
      overallRank: '견습 탐정',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 19,
    name: '문서아',
    currentQuest: 4,
    progressPercent: 86,
    lastActiveAt: Date.now() - 55000,
    isStuck: false,
    needsHelp: false,
    exp: 380,
    level: 4,
    goldenStamps: 2,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '단체 대화방의 비난은 평생 남는 상처가 될 수 있어요.',
      friendshipDelta: 35,
      completedAt: '10:06'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔', '학교 가기 두려움 😨'],
      magicSentence: '“민재야 우리가 너 응원해. 상처받지 마!”',
      completedAt: '10:14'
    },
    q3: {
      habitScores: [10, 0, 0, 0, 0],
      batteryPercentage: 90,
      honestHabitToFix: '친구가 빌려준 태블릿으로 허락 없이 사진첩 열어본 것',
      expBonusEarned: true,
      completedAt: '10:22'
    },
    q4: {
      guardianPledge: '친구의 개인정보와 디지털 프라이버시를 내 것만큼 소중하게 지키겠습니다.',
      sentBuffs: [
        { id: 'b19', fromStudentNo: 19, fromStudentName: '문서아', toStudentNo: 20, sticker: '🌟 황금별', comment: '주원아 파이팅!', createdAt: '10:28' }
      ],
      receivedBuffs: []
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'mid',
      overallRank: '도덕 가디언',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 20,
    name: '남주원',
    currentQuest: 2,
    progressPercent: 45,
    lastActiveAt: Date.now() - 100000,
    isStuck: false,
    needsHelp: false,
    exp: 200,
    level: 2,
    goldenStamps: 1,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '말리지 않으면 점점 괴롭힘이 커져요.',
      friendshipDelta: 35,
      completedAt: '10:08'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔'],
      magicSentence: '“민재야 힘내! 우리 편이야.”'
    },
    q3: { habitScores: [], batteryPercentage: 75, honestHabitToFix: '', expBonusEarned: false },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'mid',
      moralReflection: 'low',
      actionCommunity: 'low',
      overallRank: '성장 중',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 21,
    name: '서다은',
    currentQuest: 4,
    progressPercent: 94,
    lastActiveAt: Date.now() - 20000,
    isStuck: false,
    needsHelp: false,
    exp: 440,
    level: 4,
    goldenStamps: 2,
    q1: {
      choice: 'D',
      choiceTitle: '화면을 캡처하고 담임 선생님께 알리기',
      consequenceReason: '선생님께서 지도해주셔야 가해 학생들도 반성하고 민재도 보호받을 수 있어요.',
      friendshipDelta: 30,
      completedAt: '10:05'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔', '억울함과 분함 😢'],
      magicSentence: '“민재야 네가 최선을 다한 거 모두 알아. 힘내!”',
      completedAt: '10:13'
    },
    q3: {
      habitScores: [10, 0, 0, 0, 0],
      batteryPercentage: 90,
      honestHabitToFix: '숙제 도중에 알림이 올 때마다 카톡 확인하느라 1시간 숙제를 3시간 걸린 것',
      expBonusEarned: true,
      completedAt: '10:20'
    },
    q4: {
      guardianPledge: '공부할 때는 스마트폰 방해금지 모드를 켜고 정해진 시간에만 집중하겠습니다.',
      sentBuffs: [
        { id: 'b21_1', fromStudentNo: 21, fromStudentName: '서다은', toStudentNo: 22, sticker: '🌟 황금별', comment: '준서야 너도 멋지다!', createdAt: '10:27' },
        { id: 'b21_2', fromStudentNo: 21, fromStudentName: '서다은', toStudentNo: 23, sticker: '💖 따뜻한 마음', comment: '하린아 네 다짐 응원할게!', createdAt: '10:28' }
      ],
      receivedBuffs: [],
      completedAt: '10:29'
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'high',
      overallRank: '도덕 가디언',
      isConfirmed: true
    },
    neisComment: ''
  },
  {
    studentNo: 22,
    name: '이준서',
    currentQuest: 3,
    progressPercent: 68,
    lastActiveAt: Date.now() - 75000,
    isStuck: false,
    needsHelp: false,
    exp: 290,
    level: 3,
    goldenStamps: 1,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '한 사람을 왕따시키는 건 범죄라고 생각합니다.',
      friendshipDelta: 35,
      completedAt: '10:07'
    },
    q2: {
      emotionCards: ['배신감 😠'],
      magicSentence: '“민재야 우리 같이 축구 연습 더 하자!”',
      completedAt: '10:16'
    },
    q3: {
      habitScores: [20, 0, 0, 0, 10],
      batteryPercentage: 70,
      honestHabitToFix: '주말에 침대에서 일어나자마자 폰부터 켜고 1시간 누워있던 버릇',
      expBonusEarned: true
    },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'mid',
      moralReflection: 'mid',
      actionCommunity: 'mid',
      overallRank: '견습 탐정',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 23,
    name: '장하린',
    currentQuest: 4,
    progressPercent: 88,
    lastActiveAt: Date.now() - 30000,
    isStuck: false,
    needsHelp: false,
    exp: 420,
    level: 4,
    goldenStamps: 2,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '피해자 입장이 되어보면 얼마나 무섭고 슬플지 느껴져서 가만히 있을 수 없었어요.',
      friendshipDelta: 35,
      completedAt: '10:06'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔', '자책감과 수치심 🥺'],
      magicSentence: '“민재야 괜찮아. 우리는 언제나 네 편이야!”',
      completedAt: '10:14'
    },
    q3: {
      habitScores: [10, 0, 0, 0, 10],
      batteryPercentage: 80,
      honestHabitToFix: '친구가 보낸 퀴즈에 장난으로 놀리는 답장을 보냈던 일',
      expBonusEarned: true,
      completedAt: '10:22'
    },
    q4: {
      guardianPledge: '친구에게 장난치기 전에 상대방의 기분을 세 번 먼저 생각하겠습니다.',
      sentBuffs: [
        { id: 'b23', fromStudentNo: 23, fromStudentName: '장하린', toStudentNo: 24, sticker: '🌟 황금별', comment: '도윤아 다짐 파이팅!', createdAt: '10:29' }
      ],
      receivedBuffs: []
    },
    rubric: {
      ethicalSensitivity: 'high',
      moralReflection: 'high',
      actionCommunity: 'mid',
      overallRank: '도덕 가디언',
      isConfirmed: false
    },
    neisComment: ''
  },
  {
    studentNo: 24,
    name: '류도윤',
    currentQuest: 2,
    progressPercent: 40,
    lastActiveAt: Date.now() - 150000,
    isStuck: false,
    needsHelp: false,
    exp: 180,
    level: 2,
    goldenStamps: 1,
    q1: {
      choice: 'C',
      choiceTitle: '단톡방에서 용기 내어 친구들을 말리기',
      consequenceReason: '방관하는 것도 잘못이라는 걸 알게 되었어요.',
      friendshipDelta: 35,
      completedAt: '10:09'
    },
    q2: {
      emotionCards: ['외로움과 고립감 💔'],
      magicSentence: '“민재야 내일 같이 축구하자 힘내!”'
    },
    q3: { habitScores: [], batteryPercentage: 70, honestHabitToFix: '', expBonusEarned: false },
    q4: { guardianPledge: '', sentBuffs: [], receivedBuffs: [] },
    rubric: {
      ethicalSensitivity: 'mid',
      moralReflection: 'low',
      actionCommunity: 'low',
      overallRank: '성장 중',
      isConfirmed: false
    },
    neisComment: ''
  }
];

// Calculate NEIS comments for initial students
INITIAL_STUDENTS.forEach(student => {
  student.neisComment = generateNeisComment(student);
});

export const INITIAL_SESSION: ClassroomSession = {
  roomCode: 'NEO-402',
  grade: 4,
  classNo: 2,
  className: '4학년 2반',
  totalStudents: 24,
  islandPurification: 78,
  students: INITIAL_STUDENTS,
  broadcasts: [
    {
      id: 'bc1',
      message: '🌟 4학년 2반 가디언즈 여러분, 환영합니다! 네오 아일랜드 정화 대작전을 시작합니다!',
      type: 'info',
      createdAt: Date.now() - 1800000
    }
  ],
  sessionStartedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
  isCompleted: false
};
