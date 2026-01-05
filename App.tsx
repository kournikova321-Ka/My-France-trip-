
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { INITIAL_ITINERARY, INITIAL_ESSENTIALS } from './constants';
import GeminiChat from './components/GeminiChat';
import { 
  Compass, Plus, Calculator, Home, 
  Calendar, Briefcase, X, Navigation, Search, Ticket, Plane, Car,
  Trash2, Edit2, Circle, Save, CreditCard, ChevronRight, ChevronDown,
  Clock, Banknote, CheckCircle2, AlertCircle, PlusCircle, MinusCircle, ChevronUp,
  ExternalLink, Info
} from 'lucide-react';
import { DayPlan, Expense, Spot, Transport, EssentialItem } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'plan' | 'expense' | 'essentials'>('home');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [itinerary, setItinerary] = useState<DayPlan[]>(INITIAL_ITINERARY);
  const [essentials, setEssentials] = useState<EssentialItem[]>(INITIAL_ESSENTIALS);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  // UI States
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isEditingEssentials, setIsEditingEssentials] = useState(false);
  const [showQuickCalc, setShowQuickCalc] = useState(false);
  const [calcValue, setCalcValue] = useState('0');
  const [newItemText, setNewItemText] = useState('');
  const [expenseDayIdx, setExpenseDayIdx] = useState(0);
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  const [aiExpanded, setAiExpanded] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  const EUR_TO_TWD = 35;

  // 自動對齊選中的日期
  useEffect(() => {
    if (view === 'plan' && scrollRef.current) {
      const activeBtn = scrollRef.current.children[selectedDayIdx] as HTMLElement;
      if (activeBtn) {
        scrollRef.current.scrollTo({
          left: activeBtn.offsetLeft - 80,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedDayIdx, view]);

  // --- Helpers ---
  const toggleDate = (date: string) => {
    setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, { total: number, items: Expense[], dayNum?: number }> = {};
    expenses.forEach(exp => {
      if (!groups[exp.date]) {
        const dayInfo = itinerary.find(d => d.date === exp.date);
        groups[exp.date] = { total: 0, items: [], dayNum: dayInfo?.day };
      }
      groups[exp.date].items.push(exp);
      groups[exp.date].total += exp.amount;
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses, itinerary]);

  const totalExpenseEur = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  // --- Handlers ---
  const toggleEssential = (id: string) => {
    setEssentials(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const addEssential = () => {
    if (!newItemText.trim()) return;
    const newItem: EssentialItem = {
      id: Date.now().toString(),
      text: newItemText,
      checked: false
    };
    setEssentials([...essentials, newItem]);
    setNewItemText('');
  };

  const removeEssential = (id: string) => {
    setEssentials(essentials.filter(item => item.id !== id));
  };

  const updateEssentialText = (id: string, text: string) => {
    setEssentials(essentials.map(item => item.id === id ? { ...item, text } : item));
  };

  const addSpot = (dayIdx: number) => {
    const newSpot: Spot = {
      id: Math.random().toString(36).substr(2, 9),
      name: "新行程項目",
      feature: "在此加入行程特色備註...",
      mapUrl: ""
    };
    const updated = [...itinerary];
    updated[dayIdx].spots.push(newSpot);
    setItinerary(updated);
  };

  const removeSpot = (dayIdx: number, spotId: string) => {
    const updated = [...itinerary];
    updated[dayIdx].spots = updated[dayIdx].spots.filter(s => s.id !== spotId);
    setItinerary(updated);
  };

  const updateSpot = (dayIdx: number, spotId: string, field: keyof Spot, value: string) => {
    const updated = [...itinerary];
    const spot = updated[dayIdx].spots.find(s => s.id === spotId);
    if (spot) {
      (spot as any)[field] = value;
      setItinerary(updated);
    }
  };

  const addExpense = (amount: number, note: string, dayIdx: number) => {
    const targetDate = itinerary[dayIdx].date;
    const newExp: Expense = {
      id: Date.now().toString(),
      amount,
      note: note || "未命名支出",
      category: "Travel",
      date: targetDate
    };
    setExpenses([newExp, ...expenses]);
    setExpandedDates(prev => ({ ...prev, [targetDate]: true }));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'Flight': return <Plane className="w-4 h-4" />;
      case 'Train': return <Ticket className="w-4 h-4" />;
      case 'Bus': return <Info className="w-4 h-4" />;
      case 'Car': return <Car className="w-4 h-4" />;
      default: return <Navigation className="w-4 h-4" />;
    }
  };

  // --- Renders ---
  const renderHome = () => {
    const finishedEssentials = essentials.filter(e => e.checked).length;
    return (
      <div className="px-6 py-8 space-y-6 animate-fadeIn safe-area-top">
        <header className="flex justify-between items-center mb-2">
          <div>
            <p className="text-[10px] font-bold text-custom-brown uppercase tracking-[0.2em] opacity-60">France 2024</p>
            <h1 className="text-3xl serif font-bold text-custom-blue">帶馬克出去玩</h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center">
            <span className="text-[10px] font-bold text-stone-400">匯率</span>
            <span className="text-sm font-bold text-custom-brown">€1=35</span>
          </div>
        </header>

        <section className="space-y-4">
          <div 
            onClick={() => setView('plan')}
            className="group relative bg-custom-blue rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="relative z-10">
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm mb-4 inline-block">5/22 - 6/03</span>
              <h3 className="text-2xl font-bold mb-1 text-white">主行程表</h3>
              <p className="text-sm opacity-70 mb-6">目前查看：Day {itinerary[selectedDayIdx].day}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
                <span>查看詳細行程</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setView('expense')}
              className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm active:bg-stone-50 transition-colors flex flex-col items-center"
            >
              <div className="bg-orange-50 p-4 rounded-2xl mb-4">
                <Calculator className="w-6 h-6 text-orange-600" />
              </div>
              <span className="font-bold text-stone-800">歐元記帳</span>
            </button>
            <button 
              onClick={() => setView('essentials')}
              className="bg-stone-800 p-6 rounded-[2rem] shadow-sm active:opacity-90 transition-opacity flex flex-col items-center text-white"
            >
              <div className="bg-white/10 p-4 rounded-2xl mb-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold">行前準備</span>
              <span className="text-[10px] opacity-50 mt-1">{finishedEssentials}/{essentials.length} 已完成</span>
            </button>
          </div>
        </section>
      </div>
    );
  };

  const renderTimeline = () => (
    <div className="animate-fadeIn pb-32 flex flex-col h-screen overflow-hidden">
      {/* 強化後的日期導覽列 */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-stone-200 pt-4 pb-4">
        <div 
          ref={scrollRef}
          className="px-6 flex gap-4 overflow-x-auto scrollbar-hide snap-x touch-pan-x"
        >
          {itinerary.map((day, idx) => (
            <button 
              key={day.id}
              onClick={() => { setSelectedDayIdx(idx); setIsEditingPlan(false); }}
              className={`flex-none w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all snap-center shadow-sm relative ${selectedDayIdx === idx ? 'bg-custom-blue text-white shadow-blue-200/50 -translate-y-1' : 'bg-white text-stone-400 border border-stone-100 active:bg-stone-50'}`}
            >
              <span className="text-[9px] font-black opacity-60 uppercase tracking-tighter mb-0.5">Day {day.day}</span>
              <span className="text-lg font-black">{day.date.split('/')[1]}</span>
            </button>
          ))}
          <div className="flex-none w-12 h-1"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 行程標題 */}
        <div className="flex justify-between items-start">
          <div className="animate-slideUp flex-1 pr-4">
            <p className="text-[10px] font-black text-custom-brown uppercase tracking-[0.2em] mb-1">Day {itinerary[selectedDayIdx].day} · {itinerary[selectedDayIdx].date}</p>
            <h2 className="text-2xl font-bold text-custom-blue serif leading-tight text-black mb-2">{itinerary[selectedDayIdx].title}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setIsEditingPlan(!isEditingPlan)}
              className={`flex-none p-3 rounded-2xl shadow-sm transition-all active:scale-90 ${isEditingPlan ? 'bg-custom-blue text-white' : 'bg-white border border-stone-200 text-stone-400'}`}
            >
              {isEditingPlan ? <Save className="w-5 h-5 text-white" /> : <Edit2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => {
                setAiQuery(`請幫我查詢法國 ${itinerary[selectedDayIdx].title.split('：')[1]?.split(' ')[0] || itinerary[selectedDayIdx].title} 相關的旅遊建議。`);
                setAiExpanded(true);
              }}
              className="p-3 bg-white border border-stone-200 text-custom-brown rounded-2xl shadow-sm active:scale-90 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 交通資訊 */}
        {itinerary[selectedDayIdx].transports.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <Ticket className="w-3 h-3" /> 交通與接駁
            </h3>
            <div className="space-y-3">
              {itinerary[selectedDayIdx].transports.map((t) => (
                <div key={t.id} className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-custom-blue">
                      {getTransportIcon(t.type)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">{t.details}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-stone-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {t.duration}</span>
                        {t.price && <span className="text-[9px] font-bold text-custom-brown">| {t.price}</span>}
                      </div>
                    </div>
                  </div>
                  {t.bookingUrl && (
                    <a href={t.bookingUrl} target="_blank" className="p-2.5 bg-white text-custom-blue rounded-xl shadow-sm active:scale-90">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 景點區塊 */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
            <Compass className="w-3 h-3" /> 景點規劃
          </h3>
          <div className="relative space-y-6">
            <div className="absolute left-[19px] top-4 bottom-0 w-[2px] bg-stone-200/50"></div>
            
            {itinerary[selectedDayIdx].spots.map((spot) => (
              <div key={spot.id} className="relative pl-12 group animate-fadeIn">
                <div className="absolute left-0 top-1 w-10 h-10 bg-white border-2 border-custom-blue rounded-full shadow-md flex items-center justify-center z-10">
                  <Compass className="w-5 h-5 text-custom-blue" />
                </div>
                <div className="bg-white p-5 rounded-[1.5rem] border border-stone-100 shadow-sm relative active:bg-stone-50 transition-colors">
                  {isEditingPlan && (
                    <button onClick={() => removeSpot(selectedDayIdx, spot.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg z-20">
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  )}
                  {isEditingPlan ? (
                    <div className="space-y-2">
                      <input 
                        value={spot.name} 
                        onChange={(e) => updateSpot(selectedDayIdx, spot.id, 'name', e.target.value)}
                        className="w-full text-base font-bold border-b border-stone-200 focus:outline-none p-1 text-black"
                      />
                      <textarea 
                        value={spot.feature} 
                        onChange={(e) => updateSpot(selectedDayIdx, spot.id, 'feature', e.target.value)}
                        className="w-full text-xs text-stone-500 bg-stone-50 p-3 rounded-xl focus:outline-none h-20"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-bold text-base text-stone-800 mb-1">{spot.name}</h4>
                      <p className="text-xs text-stone-500 mb-2 leading-relaxed whitespace-pre-wrap">{spot.feature}</p>
                      {spot.mapUrl && (
                        <a href={spot.mapUrl} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-bold text-custom-blue bg-blue-50 px-3 py-1.5 rounded-full">
                          <Navigation className="w-3 h-3" /> 導航
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {isEditingPlan && (
              <button onClick={() => addSpot(selectedDayIdx)} className="ml-12 flex items-center gap-2 text-custom-brown font-bold text-xs py-2 px-4 border border-dashed border-custom-brown/30 rounded-full">
                <Plus className="w-4 h-4" /> 增加註記
              </button>
            )}
          </div>
        </div>

        {/* 底部摘要 */}
        <div className="grid grid-cols-2 gap-4 pb-10">
          <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100">
            <h4 className="text-[10px] font-black text-orange-400 uppercase mb-2">預估預算</h4>
            <p className="text-xs font-bold text-stone-700">{itinerary[selectedDayIdx].budget}</p>
          </div>
          <div className="bg-red-50/50 p-4 rounded-3xl border border-red-100">
            <h4 className="text-[10px] font-black text-red-400 uppercase mb-2">注意事項</h4>
            <div className="text-[10px] font-bold text-stone-600 line-clamp-2">
              {itinerary[selectedDayIdx].precautions.join('、')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpense = () => {
    return (
      <div className="p-6 animate-fadeIn pb-32 overflow-y-auto h-screen">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-custom-blue serif">支出帳本</h2>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Travel Wallet</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 text-right">
            <p className="text-[10px] font-black text-stone-400 uppercase">總支出額</p>
            <p className="text-xl font-bold text-custom-blue">€{totalExpenseEur.toFixed(1)}</p>
            <p className="text-[10px] text-custom-brown font-bold">≈ NT${Math.round(totalExpenseEur * EUR_TO_TWD)}</p>
          </div>
        </header>

        <button 
          onClick={() => { setExpenseDayIdx(selectedDayIdx); setShowQuickCalc(true); }}
          className="w-full bg-custom-blue text-white rounded-[2rem] p-6 mb-8 shadow-xl flex items-center justify-between active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><PlusCircle className="w-6 h-6 text-white" /></div>
            <div className="text-left">
              <p className="font-bold text-lg text-white">新增一筆支出</p>
              <p className="text-xs opacity-60 text-white">預設對應 Day {itinerary[selectedDayIdx].day}</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 opacity-30 text-white" />
        </button>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest px-2">每日花費統計</h3>
          {groupedExpenses.length === 0 ? (
            <div className="text-center py-12 text-stone-300">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">尚未開始記帳</p>
            </div>
          ) : (
            groupedExpenses.map(([date, group]) => {
              const isExpanded = expandedDates[date];
              return (
                <div key={date} className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden transition-all">
                  <div 
                    onClick={() => toggleDate(date)}
                    className="p-5 flex justify-between items-center cursor-pointer active:bg-stone-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-custom-blue text-white' : 'bg-stone-100 text-stone-400'}`}>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Day {group.dayNum} · {date}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-stone-800">€{group.total.toFixed(1)}</span>
                          <span className="text-[10px] text-custom-brown font-bold">NT${Math.round(group.total * EUR_TO_TWD)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-3 animate-fadeIn border-t border-stone-50">
                      {group.items.map(exp => (
                        <div key={exp.id} className="flex justify-between items-center py-3 border-b border-stone-50 last:border-0">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-stone-700 leading-tight">{exp.note}</p>
                            <p className="text-[9px] text-stone-300 font-bold uppercase tracking-widest">Travel Expense</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-bold text-custom-blue">€{exp.amount}</p>
                              <p className="text-[9px] text-stone-300 font-bold">NT${Math.round(exp.amount * EUR_TO_TWD)}</p>
                            </div>
                            <button onClick={() => deleteExpense(exp.id)} className="p-2 text-stone-200 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderEssentials = () => {
    const progress = Math.round((essentials.filter(e => e.checked).length / essentials.length) * 100);
    return (
      <div className="p-6 animate-fadeIn pb-32 h-screen overflow-y-auto">
        <header className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-custom-blue serif leading-tight text-black">準備清單</h2>
            <div className="mt-4 mr-10">
              <div className="flex justify-between text-[10px] font-bold text-stone-400 mb-1">
                <span>PREPARATION</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-custom-brown transition-all duration-700" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsEditingEssentials(!isEditingEssentials)}
            className={`p-3 rounded-2xl shadow-sm active:scale-90 ${isEditingEssentials ? 'bg-custom-blue text-white' : 'bg-white border border-stone-200 text-stone-400'}`}
          >
            {isEditingEssentials ? <Save className="w-5 h-5 text-white" /> : <Edit2 className="w-5 h-5" />}
          </button>
        </header>

        <div className="mb-6 flex gap-2">
          <input 
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="新增必辦項目..."
            className="flex-1 bg-white border border-stone-200 rounded-2xl px-5 py-4 text-sm focus:outline-none shadow-sm text-black placeholder:text-stone-300"
            onKeyDown={(e) => e.key === 'Enter' && addEssential()}
          />
          <button onClick={addEssential} className="bg-stone-800 text-white p-4 rounded-2xl shadow-lg active:scale-90 transition-transform">
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="space-y-3">
          {essentials.map(item => (
            <div 
              key={item.id} 
              className={`p-5 rounded-2xl border flex items-center transition-all active:scale-[0.98] ${item.checked ? 'bg-stone-50 border-stone-100' : 'bg-white border-stone-200 shadow-sm'}`}
            >
              <button onClick={() => toggleEssential(item.id)} className="flex-none mr-4">
                {item.checked ? <CheckCircle2 className="w-7 h-7 text-custom-brown" /> : <Circle className="w-7 h-7 text-stone-200" />}
              </button>
              
              {isEditingEssentials ? (
                <input 
                  value={item.text}
                  onChange={(e) => updateEssentialText(item.id, e.target.value)}
                  className="flex-1 bg-transparent text-sm font-bold text-stone-700 outline-none"
                />
              ) : (
                <span className={`flex-1 text-sm font-bold ${item.checked ? 'text-stone-300 line-through' : 'text-stone-700'}`}>
                  {item.text}
                </span>
              )}

              {isEditingEssentials && (
                <button onClick={() => removeEssential(item.id)} className="ml-2 text-red-300 active:text-red-500"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen font-sans antialiased relative overflow-x-hidden selection:bg-custom-blue selection:text-white">
      {/* 快捷計算機與記帳 */}
      {showQuickCalc && (
        <div className="fixed inset-0 bg-stone-900/98 backdrop-blur-2xl z-[200] animate-fadeIn p-8 flex flex-col">
          <div className="flex justify-between items-center text-white mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 tracking-widest opacity-80 serif text-white">歐元快速記帳</h2>
            <button onClick={() => { setShowQuickCalc(false); setCalcValue('0'); }} className="p-3 bg-white/10 rounded-full active:scale-90 transition-transform"><X className="w-6 h-6 text-white" /></button>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide py-2">
            {itinerary.map((day, idx) => (
              <button 
                key={day.id}
                onClick={() => setExpenseDayIdx(idx)}
                className={`flex-none px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${expenseDayIdx === idx ? 'bg-custom-brown text-white shadow-lg' : 'bg-white/5 text-white/30'}`}
              >
                Day {day.day}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <div className="text-center mb-10">
              <div className="text-[10px] font-bold text-custom-brown mb-2 uppercase tracking-[0.3em]">{itinerary[expenseDayIdx].date} 行程開支</div>
              <div className="text-7xl font-bold text-white mb-2 tabular-nums">€{calcValue}</div>
              <div className="text-2xl font-bold text-custom-brown opacity-80 tabular-nums">≈ NT$ {Math.round(parseFloat(calcValue) * EUR_TO_TWD)}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {['1','2','3','4','5','6','7','8','9','.', '0','DEL'].map(val => (
                <button 
                  key={val} 
                  onClick={() => {
                    if (val === 'DEL') setCalcValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
                    else if (calcValue === '0' && val !== '.') setCalcValue(val);
                    else if (calcValue.length < 7) setCalcValue(prev => prev + val);
                  }}
                  className="h-16 bg-white/10 text-white rounded-2xl text-2xl font-bold active:bg-white/30 flex items-center justify-center transition-colors shadow-sm"
                >
                  {val === 'DEL' ? <X className="w-6 h-6 text-white" /> : val}
                </button>
              ))}
              <button 
                onClick={() => {
                  const note = prompt(`Day ${itinerary[expenseDayIdx].day} 的支出項目？ (如: 午餐, 車票)`, itinerary[expenseDayIdx].title.split('：')[1] || itinerary[expenseDayIdx].title);
                  if (note !== null) {
                    addExpense(parseFloat(calcValue), note, expenseDayIdx);
                    setShowQuickCalc(false);
                    setCalcValue('0');
                    setView('expense');
                  }
                }} 
                className="col-span-3 h-20 bg-custom-brown text-white rounded-[1.5rem] text-xl font-bold flex items-center justify-center gap-3 active:opacity-90 transition-all shadow-xl"
              >
                <Save className="w-6 h-6 text-white" /> 儲存此筆支出
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'home' && renderHome()}
      {view === 'plan' && renderTimeline()}
      {view === 'expense' && renderExpense()}
      {view === 'essentials' && renderEssentials()}

      <GeminiChat initialQuery={aiQuery} expanded={aiExpanded} onExpand={setAiExpanded} />

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-100 px-6 py-6 flex justify-around items-center z-50 max-w-md mx-auto shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] safe-area-bottom">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${view === 'home' ? 'text-custom-blue' : 'text-stone-300'}`}>
          <Home className={`w-6 h-6 ${view === 'home' ? 'fill-custom-blue' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-widest">首頁</span>
        </button>
        <button onClick={() => setView('plan')} className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${view === 'plan' ? 'text-custom-blue' : 'text-stone-300'}`}>
          <Calendar className={`w-6 h-6 ${view === 'plan' ? 'fill-custom-blue' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-widest">行程</span>
        </button>
        <button onClick={() => setView('expense')} className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${view === 'expense' ? 'text-custom-blue' : 'text-stone-300'}`}>
          <Calculator className={`w-6 h-6 ${view === 'expense' ? 'fill-custom-blue' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-widest">記帳</span>
        </button>
        <button onClick={() => setView('essentials')} className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${view === 'essentials' ? 'text-custom-blue' : 'text-stone-300'}`}>
          <Briefcase className={`w-6 h-6 ${view === 'essentials' ? 'fill-custom-blue' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-widest">準備</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
