// src/index.js
import { config, roles, mapData, eventCards } from './data.js';
import { initGame, updateDashboard } from './initializing.js';

let currentYear = 0;
let isAnimating = false;
let rentMultiplier = 1; // 房租倍率 (用於砸壞電視事件)

// 啟動遊戲
initGame();

// DOM 元素
const rollBtn = document.getElementById('roll-btn');
const msgBox = document.getElementById('message-box');
const playerPiece = document.getElementById('player-piece');

// 監聽擲骰
rollBtn.addEventListener('click', async () => {
    if (isAnimating) return;
    
    // 擲骰子邏輯 (2顆)
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const steps = d1 + d2;

    showMsg(`🎲 你擲出了 ${d1} + ${d2} = ${steps} 點`);
    
    await movePlayer(steps);
});

// 移動玩家動畫
function movePlayer(steps) {
    return new Promise(resolve => {
        isAnimating = true;
        rollBtn.disabled = true;
        
        const player = roles[0];
        let stepsLeft = steps;

        const timer = setInterval(() => {
            // 移除舊位置
            playerPiece.remove();

            // 更新邏輯位置
            player.position = (player.position + 1) % mapData.length;
            
            // 經過起點判定 (過年)
            if (player.position === 0) {
                passStartLogic();
            }

            // 更新畫面位置
            const targetTile = document.getElementById(`tile-${player.position}`);
            targetTile.appendChild(playerPiece);

            stepsLeft--;

            if (stepsLeft <= 0) {
                clearInterval(timer);
                isAnimating = false;
                rollBtn.disabled = false;
                
                // 停止後的事件處理
                setTimeout(() => {
                    handleTileEvent(player.position);
                    resolve();
                }, 300);
            }
        }, 200); // 移動速度
    });
}

// 經過起點邏輯 (通貨膨脹核心)
function passStartLogic() {
    currentYear++;
    const player = roles[0];

    // 1. 領年薪
    player.money += player.salary;
    showMsg(`💰 過年了！領到年薪 $${Math.floor(player.salary).toLocaleString()}`);

    // 2. 通膨計算
    // 玩家薪水 +2%
    player.salary = player.salary * (1 + config.growth.salary);
    
    // 房租 +3% (更新地圖)
    mapData.forEach(tile => {
        if (tile.type === 'land') {
            tile.rent = tile.rent * (1 + config.growth.rent);
            // 更新 UI 上的數字
            const dom = document.getElementById(`tile-${tile.index}`);
            dom.querySelector('.tile-price').innerText = `$${Math.floor(tile.rent).toLocaleString()}`;
        }
    });

    // NPC 資產 +10%, 收入 +3%
    roles.forEach(role => {
        if (role.id !== 'player') {
            role.assets = role.assets * (1 + config.growth.assets);
            role.rentIncome = role.rentIncome * (1 + config.growth.rent);
            // 每年將租金收入加入總資產
            role.assets += role.rentIncome;
        }
    });

    updateDashboard(currentYear);

    // 檢查是否結束 (10年)
    if (currentYear >= config.totalYears) {
        endGame();
    }
}

// 處理格子事件
function handleTileEvent(index) {
    const tile = mapData[index];
    const player = roles[0];

    // A. 踩到地產
    if (tile.type === 'land') {
        // 計算實際房租 (含倍率)
        const finalRent = tile.rent * rentMultiplier;
        
        // 玩家扣款
        player.money -= finalRent;
        
        // 房東賺錢
        const landlord = roles.find(r => r.id === tile.owner);
        if (landlord) landlord.assets += finalRent;

        let msg = `🏠 住在${tile.name}，付給${landlord.name} 租金 $${Math.floor(finalRent).toLocaleString()}`;
        if (rentMultiplier > 1) {
            msg += ` (含違約金)`;
            rentMultiplier = 1; // 重置
        }
        
        showMsg(msg, 'red');

    // B. 踩到機會
    } else if (tile.type === 'chance') {
        const card = eventCards[Math.floor(Math.random() * eventCards.length)];
        showMsg(`⚡ 事件：${card.text}`, card.type.includes('gain') ? 'green' : 'red');
        
        processEventEffect(player, card);

    // C. 起點
    } else if (tile.type === 'start') {
        showMsg("📍 回到起點，新的一年開始！");
    }

    updateDashboard(currentYear);
}

// 處理事件卡效果
function processEventEffect(player, card) {
    if (card.type === 'lost') {
        player.money -= card.value;
    } else if (card.type === 'gain') {
        player.money += card.value;
    } else if (card.type === 'lost_salary_ratio') {
        const lostAmount = player.salary * card.value;
        player.money -= lostAmount;
        showMsg(`💸 損失了 $${Math.floor(lostAmount).toLocaleString()}`);
    } else if (card.type === 'special_rent_double') {
        rentMultiplier = 2;
        showMsg(`⚠️ 下次付房租時金額加倍！`);
    }
}

// 遊戲結束
function endGame() {
    isAnimating = true; // 鎖住操作
    const player = roles[0];
    const success = player.money >= config.targetSavings;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h1>遊戲結束 (第10年)</h1>
            <h2 style="color:${success ? 'green' : 'red'}">
                ${success ? '🎉 挑戰成功！' : '💀 挑戰失敗'}
            </h2>
            <p>${success ? '你奇蹟般地存到了頭期款！' : '無情的房價增長擊垮了你的夢想。'}</p>
            <hr>
            <p>你的最終存款: <b>$${Math.floor(player.money).toLocaleString()}</b></p>
            <p>頭期款目標: $${config.targetSavings.toLocaleString()}</p>
            <p style="font-size:0.8em; color:#666; margin-top:20px">這十年來...</p>
            <p>房東張姐資產成長至: $${Math.floor(roles[1].assets).toLocaleString()}</p>
            <p>房東林媽媽資產成長至: $${Math.floor(roles[2].assets).toLocaleString()}</p>
            <button class="modal-btn" onclick="location.reload()">重新體驗人生</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// 輔助函式：顯示訊息
function showMsg(text, type = 'normal') {
    msgBox.innerText = text;
    msgBox.style.color = type === 'red' ? '#e74c3c' : (type === 'green' ? '#2ecc71' : 'white');
    msgBox.style.borderColor = type === 'red' ? '#e74c3c' : (type === 'green' ? '#2ecc71' : '#f1c40f');
}
