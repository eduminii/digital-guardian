import React, { useState } from 'react';
import { Bell, Clock, Sparkles, X, Send } from 'lucide-react';

interface Props {
  onClose: () => void;
  onBroadcast: (message: string, type: 'alert' | 'timer' | 'info', timerSeconds?: number) => void;
}

export const TeacherBroadcastModal: React.FC<Props> = ({ onClose, onBroadcast }) => {
  const [customText, setCustomText] = useState('');

  const presets = [
    {
      title: '⏱️ 전체 3분 카운트다운 타이머',
      desc: '학생 화면에 3분 잔여 시간 알림 및 카운트다운 배너 푸시',
      type: 'timer' as const,
      seconds: 180,
      text: '⏱️ 탐구 시간 3분 남았습니다! 작성 중인 내용을 마무리하고 다음 퀘스트로 이동해주세요.'
    },
    {
      title: '⚡ 모두 Q3 배터리 점검으로 이동하세요!',
      desc: '전체 학생에게 3단계 습관 점검 퀘스트 진입 권고',
      type: 'alert' as const,
      text: '⚡ [안내] 모두 Quest 3 나의 디지털 배터리 점검표로 이동해주세요!'
    },
    {
      title: '💖 친구 다짐에 응원 버프를 2개 보내주세요!',
      desc: '다짐 서약 후 친구 격려 버프 교환 독려',
      type: 'info' as const,
      text: '💖 친구들의 다짐 카드를 읽고 따뜻한 응원 버프를 2개 이상 발송해주세요!'
    },
    {
      title: '🌟 아일랜드 정화율 80% 돌파! 조금만 더 힘내요!',
      desc: '학급 전체 단합 및 성취감 고취',
      type: 'info' as const,
      text: '🌟 우리 4학년 2반의 정화율이 80%를 넘었습니다! 네오 아일랜드가 거의 다 구출되었어요!'
    }
  ];

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onBroadcast(customText.trim(), 'alert');
    onClose();
  };

  const handleSelectPreset = (p: typeof presets[0]) => {
    onBroadcast(p.text, p.type, p.seconds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>학급 전체 돌발 방송 (GM 브로드캐스트)</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          버튼을 누르면 현재 접속 중인 모든 학생의 화면에 소리/애니메이션과 함께 공지 팝업이 즉각 표시됩니다.
        </p>

        {/* Presets */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-700">원클릭 프리셋 방송:</label>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-start justify-between cursor-pointer group"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                  {p.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{p.desc}</div>
              </div>
              <Send className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 mt-1" />
            </button>
          ))}
        </div>

        {/* Custom text */}
        <form onSubmit={handleSendCustom} className="pt-3 border-t border-slate-200 space-y-2">
          <label className="text-xs font-bold text-slate-700">직접 메시지 입력하기:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="예: 5분 뒤에 함께 결과 나눔을 시작합니다."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none text-slate-800"
            />
            <button
              type="submit"
              disabled={!customText.trim()}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                customText.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              전송
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
