// src/data.js

export const config = {
    totalYears: 10,          // 總遊戲時間：10年 (10圈)
    targetSavings: 3000000,  // 目標頭期款 300萬
    growth: {
        salary: 0.02,    // 薪資年漲幅 +2%
        rent: 0.03,      // 房租年漲幅 +3%
        assets: 0.10     // 資產年漲幅 +10%
    }
};

// 角色資料
export const roles = [
    {
        id: 'player',
        name: "社會新鮮人",
        money: 300000,      // 初始存款 30萬
        salary: 540000,     // 初始年薪 54萬
        state: "active",
        position: 0,
        stopCount: 0        // 暫停回合數
    },
    // NPC 設定 (只用於顯示，位置在 -1)
    { id: 'npc_zhang', name: "房東張姐", assets: 10500000, rentIncome: 480000, color: "#e67e22" },
    { id: 'npc_lin', name: "房東林媽媽", assets: 66600000, rentIncome: 6400000, color: "#9b59b6" }
    
];

// 地圖資料：20格 (index 0-19)
export const mapData = [
    { index: 0, name: "起點 (發薪日)", type: "start", rent: 0 },
    { index: 1, name: "板橋套房A", type: "land", owner: "npc_zhang", rent: 18000, price: 10000000 },
    { index: 2, name: "板橋套房B", type: "land", owner: "npc_zhang", rent: 18000, price: 10000000 },
    { index: 3, name: "中和公寓A", type: "land", owner: "npc_zhang", rent: 24000, price: 7000000 },
    { index: 4, name: "汐止套房", type: "land", owner: "npc_zhang", rent: 45000, price: 8000000 },
    { index: 5, name: "命運事件", type: "chance", rent: 0 },
    { index: 6, name: "板橋套房C", type: "land", owner: "npc_zhang", rent: 18000, price: 10000000 },
    { index: 7, name: "板橋套房D", type: "land", owner: "npc_zhang", rent: 18000, price: 10000000 },
    
   
    { index: 8, name: "忠和公寓B", type: "land", owner: "npc_zhang", rent: 24000, price: 7000000 },
    { index: 9, name: "忠和公寓C", type: "land", owner: "npc_zhang", rent: 24000, price: 7000000 },
    
    { index: 10, name: "命運事件", type: "chance", rent: 0 },
    { index: 11, name: "忠孝敦化", type: "land", owner: "npc_lin", rent: 42000, price: 8000000 },
    { index: 12, name: "大安捷運旁", type: "land", owner: "npc_lin", rent: 69000, price: 15000000 },
    { index: 13, name: "南京復興", type: "land", owner: "npc_lin", rent: 66000, price: 23000000 },
    { index: 14, name: "信義區套房", type: "land", owner: "npc_lin", rent: 66000, price: 15000000 },
    { index: 15, name: "命運事件", type: "chance", rent: 0 },
    { index: 16, name: "松山小套房", type: "land", owner: "npc_lin", rent: 45000, price: 10000000 },
    { index: 17, name: "光復北路", type: "land", owner: "npc_lin", rent: 48000, price: 12000000 },
    { index: 18, name: "象山美寓", type: "land", owner: "npc_lin", rent: 69000, price: 23000000 },
    { index: 19, name: "大安小豪宅", type: "land", owner: "npc_lin", rent: 96000, price: 30000000 }
];

// 事件卡
// type: lost(扣錢), gain(加錢), rent_double(下次房租加倍), stop(失業/住院)
export const eventCards = [
    { text: "公司無預警裁員，失業3個月", type: "lost_salary_ratio", value: 0.25 }, // 3個月 = 年薪的25%
    { text: "機車修理費嗚嗚 (自摔)", type: "lost", value: 20000 },
    { text: "爸媽突然需要幫忙！", type: "lost", value: 50000 },
    { text: "盲腸炎住院，醫療費好貴", type: "lost", value: 20000 },
    { text: "砸壞房東電視，扣留保證金", type: "special_rent_double" },
    { text: "手機掉水裡壞了，要換新的", type: "lost", value: 30000 },
    { text: "借錢給朋友但他一直不還", type: "lost", value: 30000 },
    { text: "報稅發現算錯要補繳", type: "lost_salary_ratio", value: 0.10 },
    { text: "網路上罵人被告，和解金", type: "lost", value: 50000 },
    { text: "誤信詐騙投資群組，積蓄蒸發", type: "lost", value: 300000 },
    { text: "買了黃牛票看演唱會", type: "lost", value: 20000 },
    { text: "聽信朋友買到爛股票", type: "lost", value: 100000 },
    { text: "還好今天沒事，平安就好", type: "none", value: 0 },
    { text: "接到案子賺外快", type: "gain", value: 30000 },
    { text: "發票中獎耶，運氣不錯！", type: "gain", value: 10000 },
    { text: "公司尾牙頭獎就是我！", type: "gain", value: 50000 },
    { text: "定期定額 ETF 發股利了", type: "gain", value: 20000 },
    { text: "撿到的錢沒人領，領回去了", type: "gain", value: 10000 },
    { text: "刮刮樂回本還倒賺", type: "gain", value: 10000 },
    { text: "跟富二代分手，獲得分手費", type: "gain", value: 100000 }
];
