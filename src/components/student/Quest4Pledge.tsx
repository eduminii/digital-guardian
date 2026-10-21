import React, { useState } from 'react';
import { Student, ClassroomSession } from '../../types';
import { BUFF_STICKERS } from '../../data/initialData';
import {
  ShieldCheck,
  Send,
  Sparkles,
  Heart,
  Trophy,
  CheckCircle2,
  Users,
  HelpCircle,
  MessageSquareHeart,
  Flame
} from 'lucide-react';
import { fireGoldenStampConfetti, fireIslandPurifiedConfetti } from '../../utils/soundEffects';

interface Props {
  student: Student;
  session: ClassroomSession;
  onUpdatePledge: (pledge: string) => void;
  onSendBuff: (toStudentNo: number, sticker: string, comment: string) => boolean;
  onPrev: () => void;
}

export const Quest4Pledge: React.FC<Props> = ({
  student,
  session,
  onUpdatePledge,
  onSendBuff,
  onPrev
}) => {
  const [pledge, setPledge] = useState<string>(student.q4.guardianPledge || '');
  const [isPledgeSaved, setIsPledgeSaved] = useState<boolean>(
    Boolean(student.q4.guardianPledge && student.q4.guardianPledge.trim().length > 5)
  );

  // Friend encouragement state
  const [selectedTargetNo, setSelectedTargetNo] = useState<number | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<string>(BUFF_STICKERS[0].name);
  const [buffComment, setBuffComment] = useState<string>('');
  const [sendSuccessNotice, setSendSuccessNotice] = useState<string | null>(null);

  // Other classmates
  const classmates = session.students.filter(s => s.studentNo !== student.studentNo);
  const selectedFriend = classmates.find(s => s.studentNo === selectedTargetNo);

  const handleSavePledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (pledge.trim().length < 5) return;
    onUpdatePledge(pledge.trim());
    setIsPledgeSaved(true);
    fireGoldenStampConfetti();
  };

  const handleSendBuffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetNo || buffComment.trim().length < 2) return;

    const targetStudent = classmates.find(s => s.studentNo === selectedTargetNo);
    const success = onSendBuff(selectedTargetNo, selectedSticker, buffComment.trim());
    if (success) {
      setSendSuccessNotice(`${targetStudent?.name || '친구'}의 다짐에 따뜻한 응원을 보냈습니다! 💖`);
      setBuffComment('');
      setSelectedTargetNo(null);
      fireGoldenStampConfetti();

      // Check if this achieved 2 buffs sent
      if (student.q4.sentBuffs.length + 1 >= 2) {
        fireIslandPurifiedConfetti();
      }

      setTimeout(() => {
        setSendSuccessNotice(null);
      }, 3500);
    }
  };

  const sentCount = student.q4.sentBuffs.length;
  const isFinalCleared = isPledgeSaved && sentCount >= 2;

  const samplePledges = [
    '밤 10시 이후에는 스마트폰을 거실 충전 바구니에 두고 자겠습니다!',
    '화가 나거나 서운할 때는 엔터키를 누르기 전에 세 번 심호흡하겠습니다!',
    '친구의 사진이나 글을 올릴 때는 반드시 미리 허락을 구하겠습니다!',
    '단톡방에서 힘들어하는 친구가 보이면 모른 척하지 않고 먼저 위로하겠습니다!'
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-lg border border-purple-700/50">
        <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold mb-1">
          <ShieldCheck className="w-5 h-5 text-amber-300" />
          <span>Quest 4: 수호자 다짐 & 우정의 연대 응원</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          침묵을 깨는 용기: 나의 다짐 선언 & 친구 다짐 지지하기
        </h2>
        <p className="text-purple-100 text-sm leading-relaxed">
          나만의 디지털 실천 다짐을 선언하고, 친구들의 다짐 카드를 읽어보며 “내가 네 편이 되어줄게!”, “같이 지키자!”라는 따뜻한 지지와 응원을 보내주세요.
        </p>
      </div>

      {/* Final Celebration Card if completed */}
      {isFinalCleared && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 p-1 rounded-3xl shadow-xl animate-fade-in">
          <div className="bg-slate-950 text-white rounded-[22px] p-6 text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/40">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>최종 퀘스트 완전 클리어!</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              🎉 축하합니다! {student.name} 가디언, 네오 아일랜드를 구출했습니다!
            </h3>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              정직한 성찰과 용기 있는 실천 다짐, 그리고 친구의 다짐을 응원하는 따뜻한 연대의 마음이 모여 네오 아일랜드의 어둠을 완전히 걷어냈습니다!
            </p>
          </div>
        </div>
      )}

      {/* Part 1: Guardian Pledge Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full">
              STEP 1
            </span>
            <h3 className="text-base font-bold text-slate-900">
              나의 디지털 수호자 실천 다짐 서약서
            </h3>
          </div>
          {isPledgeSaved && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 서약 완료
            </span>
          )}
        </div>

        <form onSubmit={handleSavePledge} className="space-y-3">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-5 relative">
            <div className="text-xs font-bold text-purple-700 mb-2">
              [ 2022 개정 초등 4학년 디지털 시민 선언 ]
            </div>
            <div className="text-slate-800 font-semibold text-sm mb-2">
              “앞으로 나는 건강한 디지털 세상을 만들기 위해 아래와 같이 실천하겠습니다.”
            </div>
            <textarea
              value={pledge}
              onChange={(e) => setPledge(e.target.value)}
              placeholder="예: 밤 10시 이후에는 스마트폰을 거실 충전 바구니에 두고 자겠습니다!"
              rows={2}
              className="w-full text-sm p-3 rounded-xl border border-purple-300 bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none resize-none font-medium text-slate-900 placeholder:text-slate-400"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-purple-600 font-medium">추천 다짐:</span>
                {samplePledges.slice(0, 2).map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setPledge(p)}
                    className="text-[11px] bg-white hover:bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full border border-purple-200 transition-colors cursor-pointer"
                  >
                    {p.length > 20 ? p.substring(0, 20) + '…' : p}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={pledge.trim().length < 5}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pledge.trim().length >= 5
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isPledgeSaved ? '다짐 서약 수정하기' : '서약서 각인하기 ✨'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Part 2: Friend Pledge Solidarity & Encouragement */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full">
              STEP 2
            </span>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-purple-600" />
              <span>친구의 다짐을 읽고 지지와 응원 보내기 (필수 2명 이상)</span>
            </h3>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            sentCount >= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            보낸 응원: {sentCount} / 2명
          </span>
        </div>

        {/* Educational Purpose Box */}
        <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-indigo-900">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>왜 친구에게 응원과 지지를 보낼까요?</span>
          </div>
          <p className="text-indigo-800/90 leading-relaxed text-[11px]">
            단톡방에서 사이버 불링이나 갈등이 멈추지 않는 가장 큰 이유는 <b>“주변 친구들의 침묵과 방관”</b> 때문입니다. 혼자만의 다짐에 머무르지 않고, 친구들의 다짐을 직접 읽어보며 <b>“내가 네 편이 되어줄게!”, “우리 같이 지키자!”</b>라고 응원할 때 교실에 진정한 우정과 안전한 울타리가 생겨납니다.
          </p>
        </div>

        {sendSuccessNotice && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{sendSuccessNotice}</span>
          </div>
        )}

        {/* Friend Selection & Live Pledge Preview Form */}
        <form onSubmit={handleSendBuffSubmit} className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              1. 다짐을 읽고 응원할 친구 선택
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1">
              {classmates.map((c) => {
                const isSelected = selectedTargetNo === c.studentNo;
                return (
                  <button
                    type="button"
                    key={c.studentNo}
                    onClick={() => setSelectedTargetNo(c.studentNo)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-100 font-bold text-purple-900 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{c.studentNo}번 {c.name}</span>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Friend's Pledge Live Preview */}
          {selectedFriend && (
            <div className="bg-purple-50/70 border-2 border-purple-200 rounded-2xl p-3.5 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-1">
                <span>📖 {selectedFriend.name} 가디언의 실천 다짐 카드:</span>
                <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                  Lv.{selectedFriend.level}
                </span>
              </div>
              <p className="text-slate-800 text-xs font-semibold bg-white p-2.5 rounded-xl border border-purple-100 leading-relaxed">
                {selectedFriend.q4.guardianPledge
                  ? `“${selectedFriend.q4.guardianPledge}”`
                  : '“현재 멋진 실천 다짐을 작성하고 있는 중입니다.”'}
              </p>
              <div className="text-[10px] text-purple-600 mt-1">
                👉 친구의 다짐을 읽고, 실천할 수 있도록 힘이 되는 응원 스티커와 격려 댓글을 보내주세요!
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              2. 친구에게 전할 우정 지킴이 스티커
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BUFF_STICKERS.map((s) => {
                const isSelected = selectedSticker === s.name;
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSelectedSticker(s.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 font-bold text-slate-900 ring-2 ring-amber-300'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{s.name}</div>
                    <div className="text-[10px] text-slate-500">{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              3. 친구를 향한 따뜻한 격려 1줄 댓글 작성
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={buffComment}
                onChange={(e) => setBuffComment(e.target.value)}
                placeholder={
                  selectedFriend
                    ? `예: ${selectedFriend.name}야 네 다짐 진짜 멋지다! 나도 같이 지킬게 힘내!`
                    : '친구를 선택한 후 따뜻한 격려 댓글을 적어보세요.'
                }
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none text-slate-800"
              />
              <button
                type="submit"
                disabled={!selectedTargetNo || buffComment.trim().length < 2}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                  selectedTargetNo && buffComment.trim().length >= 2
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>응원 보내기</span>
              </button>
            </div>
          </div>
        </form>

        {/* History tabs (Sent & Received) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Sent */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-purple-600" />
                내가 보낸 응원 한마디 ({student.q4.sentBuffs.length}개)
              </span>
            </div>
            {student.q4.sentBuffs.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                아직 보낸 응원이 없습니다. 친구의 다짐을 읽고 응원해보세요!
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {student.q4.sentBuffs.map((b) => (
                  <div key={b.id} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                      <span className="font-bold text-purple-700">TO: {b.toStudentNo}번 친구</span>
                      <span>{b.sticker}</span>
                    </div>
                    <div className="text-slate-800 font-medium">“{b.comment}”</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Received */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                친구들이 내게 보낸 응원 한마디 ({student.q4.receivedBuffs.length}개)
              </span>
            </div>
            {student.q4.receivedBuffs.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                친구들의 따뜻한 응원이 도착하면 여기에 표시됩니다!
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {student.q4.receivedBuffs.map((b) => (
                  <div key={b.id} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                      <span className="font-bold text-rose-600">FROM: {b.fromStudentName}</span>
                      <span>{b.sticker}</span>
                    </div>
                    <div className="text-slate-800 font-medium">“{b.comment}”</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onPrev}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ← 이전 퀘스트로
          </button>

          <div className="text-xs text-slate-500">
            {isFinalCleared
              ? '🎉 모든 퀘스트 완료! 네오 아일랜드 구출 대작전을 완수했습니다.'
              : '다짐 서약과 친구 응원 2명을 전송하면 최종 클리어됩니다.'}
          </div>
        </div>
      </div>
    </div>
  );
};
