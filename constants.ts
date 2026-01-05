
import { DayPlan, EssentialItem } from './types';

export const INITIAL_ESSENTIALS: EssentialItem[] = [
  { id: 'e1', text: '換錢 (EUR)', checked: false },
  { id: 'e2', text: '確認天氣預報', checked: false },
  { id: 'e3', text: '辦旅平不便險', checked: false },
  { id: 'e4', text: '了解退稅流程', checked: false },
  { id: 'e5', text: '準備轉換插座', checked: false },
  { id: 'e6', text: '啟動 Esim/漫遊', checked: false },
];

export const INITIAL_ITINERARY: DayPlan[] = [
  {
    id: 'd1', day: 1, date: "5/22", title: "啟程法國：台北 -> 莉莉家",
    description: "5/21 23:30 從桃園機場出發，5/22 早上抵達巴黎，銜接 TGV 直接前往 La Rochelle。",
    spots: [
      { id: 's1-1', name: "桃園國際機場 (TPE)", feature: "23:30 起飛 (長榮 BR87)", mapUrl: "" },
      { id: 's1-2', name: "巴黎 CDG 航站", feature: "07:35 抵達，預計 10:00 完成通關領行李", mapUrl: "" },
      { id: 's1-3', name: "莉莉家 (La Rochelle)", feature: "預計 14:00 抵達莉莉家，下午慢活休息", mapUrl: "https://www.google.com/maps/search/?api=1&query=La+Rochelle" }
    ],
    transports: [
      { id: 't1-1', type: 'Flight', details: "BR87 (TPE 23:30 -> CDG 07:35)", duration: "14h 05m", price: "NT$ 45,000", mapUrl: "", bookingUrl: "https://www.evaair.com" },
      { id: 't1-2', type: 'Train', details: "TGV (CDG 10:15 -> La Rochelle 13:45)", duration: "3h 30m", price: "€60 - €120", mapUrl: "", bookingUrl: "https://www.sncf-connect.com" }
    ],
    checklist: [], startTime: "23:30 (5/21)", budget: "約 €150", precautions: ["注意 TGV 時間"]
  },
  {
    id: 'd2', day: 2, date: "5/23", title: "莉莉家：La Rochelle 悠閒時光",
    description: "全日待在 La Rochelle。海鮮午餐與舊港漫步。",
    spots: [{ id: 's2-1', name: "Vieux Port 舊港", feature: "與莉莉一起散步看夕陽", mapUrl: "" }],
    transports: [{ id: 't2-1', type: 'Walk', details: "慢活移動", duration: "全日", price: "€0", mapUrl: "" }],
    checklist: [], startTime: "09:00", budget: "約 €50", precautions: ["注意海邊防曬"]
  },
  {
    id: 'd3', day: 3, date: "5/24", title: "沙丘奇景：阿卡雄比拉沙丘",
    description: "今日從莉莉家提早出發，先前往阿卡雄看歐洲最高的比拉沙丘，晚上再回波爾多入住。",
    spots: [
      { id: 's3-1', name: "比拉沙丘 (Dune du Pilat)", feature: "爬上沙丘眺望大西洋", mapUrl: "" },
      { id: 's3-2', name: "波爾多市區", feature: "18:00 前進飯店 Check-in", mapUrl: "" }
    ],
    transports: [
      { id: 't3-1', type: 'Train', details: "Intercités + TER (LR 08:30 -> Arcachon 12:00)", duration: "3h 30m", price: "€35", mapUrl: "", bookingUrl: "https://www.sncf-connect.com" }
    ],
    checklist: [], startTime: "08:30", budget: "約 €80", precautions: ["沙丘風大注意帽子"]
  },
  {
    id: 'd4', day: 4, date: "5/25", title: "波爾多慢遊 -> 飛往巴塞爾",
    description: "早上在波爾多逛水鏡廣場，下午準時前往機場飛往巴塞爾與常郁會合。",
    spots: [
      { id: 's4-1', name: "波爾多水鏡廣場", feature: "10:00 散步拍照", mapUrl: "" },
      { id: 's4-2', name: "波爾多機場 (BOD)", feature: "13:55 抵達機場", mapUrl: "" }
    ],
    transports: [
      { id: 't4-1', type: 'Flight', details: "EasyJet (BOD 16:55 -> BSL 18:25)", duration: "1h 30m", price: "€75", mapUrl: "", bookingUrl: "https://www.easyjet.com" }
    ],
    checklist: [], startTime: "09:30", budget: "約 €100", precautions: ["嚴格遵守行李限制"]
  },
  {
    id: 'd5', day: 5, date: "5/26", title: "常郁家：德法瑞士邊境生活",
    description: "在 10 Rue du Chalet 享受阿爾薩斯鄉間寧靜。",
    spots: [{ id: 's5-1', name: "Kœstlach 莊園", feature: "10 Rue du Chalet, 68480", mapUrl: "" }],
    transports: [], checklist: [], startTime: "自由", budget: "€0", precautions: ["享受寧靜"]
  },
  {
    id: 'd6', day: 6, date: "5/27", title: "常郁家：三國交界深度遊",
    description: "拜訪巴塞爾市區與鄰近德法小鎮。",
    spots: [{ id: 's6-1', name: "Basel 市中心", feature: "跨越萊茵河、參觀巴塞爾大教堂", mapUrl: "" }],
    transports: [], checklist: [], startTime: "10:00", budget: "約 €60", precautions: ["注意瑞士物價"]
  },
  {
    id: 'd7', day: 7, date: "5/28", title: "常郁家最後一日：準備回巴黎",
    description: "採買阿爾薩斯葡萄酒與在地食材，準備明日移動。",
    spots: [{ id: 's7-1', name: "科瑪 Colmar", feature: "如童話般的小鎮漫步", mapUrl: "" }],
    transports: [], checklist: [], startTime: "10:00", budget: "隨意", precautions: ["檢查行李重量"]
  },
  {
    id: 'd8', day: 8, date: "5/29", title: "返回花都巴黎",
    description: "搭乘 TGV Lyria 高鐵從瑞士巴塞爾返回巴黎里昂車站 (Gare de Lyon)。",
    spots: [{ id: 's8-1', name: "巴黎市區", feature: "抵達後入住飯店，享受巴黎首晚", mapUrl: "" }],
    transports: [{ 
      id: 't8-1', type: 'Train', details: "TGV Lyria (Basel SBB -> Paris Gare de Lyon)", duration: "3h 04m", 
      price: "€95 - €160", mapUrl: "", bookingUrl: "https://www.sncf-connect.com" 
    }],
    checklist: [], startTime: "10:00", budget: "約 €150", precautions: ["提早抵達火車站"]
  },
  {
    id: 'd9', day: 9, date: "5/30", title: "巴黎：藝術洗禮",
    description: "羅浮宮、杜樂麗花園、協和廣場。",
    spots: [{ id: 's9-1', name: "羅浮宮", feature: "預約 09:30 入場", mapUrl: "" }],
    transports: [], checklist: [], startTime: "09:00", budget: "約 €80", precautions: ["注意財物安全"]
  },
  {
    id: 'd10', day: 10, date: "5/31", title: "巴黎：法式經典浪漫",
    description: "巴黎鐵塔、凱旋門、香榭麗舍大道。",
    spots: [{ id: 's10-1', name: "戰神廣場", feature: "野餐看鐵塔亮燈", mapUrl: "" }],
    transports: [], checklist: [], startTime: "10:00", budget: "約 €70", precautions: ["野餐注意保暖"]
  },
  {
    id: 'd11', day: 11, date: "6/1", title: "巴黎：精品購物日",
    description: "拉法葉百貨或 La Vallée Village。",
    spots: [{ id: 's11-1', name: "La Vallée Village", feature: "折扣村補貨日", mapUrl: "" }],
    transports: [{ id: 't11-1', type: 'Train', details: "RER A", duration: "45m", price: "€5", mapUrl: "" }],
    checklist: [], startTime: "09:30", budget: "隨意", precautions: ["注意退稅時限"]
  },
  {
    id: 'd12', day: 12, date: "6/2", title: "巴黎最後慢步",
    description: "蒙馬特、聖心堂，俯瞰最後的巴黎全景。",
    spots: [{ id: 's12-1', name: "聖心堂", feature: "階梯上看夕陽", mapUrl: "" }],
    transports: [], checklist: [], startTime: "10:00", budget: "約 €60", precautions: ["注意蒙馬特區安全"]
  },
  {
    id: 'd13', day: 13, date: "6/3", title: "再見法國：平安歸家",
    description: "整理行李，前往 CDG 辦理退稅手續。",
    spots: [{ id: 's13-1', name: "CDG 航站 2E", feature: "19:30 辦理退稅", mapUrl: "" }],
    transports: [
      { id: 't13-1', type: 'Flight', details: "BR88 (CDG 23:30 -> TPE 17:50+1)", duration: "12h 20m", price: "歸國班機", mapUrl: "", bookingUrl: "https://www.evaair.com" }
    ],
    checklist: [], startTime: "12:00", budget: "約 €40", precautions: ["預留退稅時間"]
  }
];
