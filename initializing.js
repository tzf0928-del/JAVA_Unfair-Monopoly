// src/initializing.js
import { mapData, roles, config } from './data.js';

export function initGame() {
    renderBoard();
    updateDashboard(0); // 初始第 0 年
    spawnPlayer();
}

// 根據 Grid 位置繪製 20 個格子
function renderBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; // 清空

    // 定義 0-19 格子在 6x6 Grid 中的座標 (row, col)
    // 順序：上排(左至右) -> 右排(上至下) -> 下排(右至左) -> 左排(下至上)
    const coordinates = [
        {r:1, c:1}, {r:1, c:2}, {r:1, c:3}, {r:1, c:4}, {r:1, c:5}, {r:1, c:6}, // 0-5
        {r:2, c:6}, {r:3, c:6}, {r:4, c:6}, {r:5, c:6},                         // 6-9
        {r:6, c:6}, {r:6, c:5}, {r:6, c:4}, {r:6, c:3}, {r:6, c:2}, {r:6, c:1}, // 10-15
        {r:5, c:1}, {r:4, c:1}, {r:3, c:1}, {r:2, c:1}                          // 16-19
    ];

    mapData.forEach((tile) => {
        const div = document.createElement('div');
        div.className = `tile tile-${tile.type}`;
        div.id = `tile-${tile.index}`;
        
        // 設定 CSS Grid 位置
        const pos = coordinates[tile.index];
        div.style.gridRow = pos.r;
        div.style.gridColumn = pos.c;

        // 內容
        let htmlContent = `<div class="name">${tile.name}</div>`;
        
        if (tile.type === 'land') {
            const owner = roles.find(r => r.id === tile.owner);
            // 標示房東
            htmlContent += `<div class="owner-badge" style="background:${owner.color}">${owner.name.substring(2)}</div>`;
            // 標示租金
            htmlContent += `<div class="tile-price">$${tile.rent.toLocaleString()}</div>`;
        } else if (tile.type === 'start') {
            htmlContent += `<div style="font-size:20px">🎉</div>`;
        } else {
            htmlContent += `<div style="font-size:20px">❓</div>`;
        }

        div.innerHTML = htmlContent;
        board.appendChild(div);
    });
    
    // 中間的裝飾區 (可選)
    const center = document.createElement('div');
    center.style.gridArea = "2 / 2 / 6 / 6";
    center.style.background = "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=60') center/cover";
    center.style.opacity = "0.2";
    center.style.borderRadius = "10px";
    center.style.pointerEvents = "none";
    board.appendChild(center);
}

function spawnPlayer() {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-piece';
    playerDiv.id = 'player-piece';
    // 放置在起點 (Tile 0)
    document.getElementById('tile-0').appendChild(playerDiv);
}

// 更新左側儀表板
export function updateDashboard(currentYear) {
    const player = roles[0];
    const dashboard = document.getElementById('dashboard');
    
    // 計算頭期款百分比
    const percentage = Math.min(100, Math.floor((player.money / config.targetSavings) * 100));
    
    let html = `
        <div class="stats-group">
            <h3>⏳ 第 ${currentYear} 年 (剩餘 ${config.totalYears - currentYear} 年)</h3>
            <div>當前房價通膨: <span class="danger">+${Math.round((Math.pow(1+config.growth.assets, currentYear)-1)*100)}%</span></div>
            <div>房租漲幅: <span class="danger">+${Math.round((Math.pow(1+config.growth.rent, currentYear)-1)*100)}%</span></div>
        </div>

        <div class="stats-group">
            <h3>👤 ${player.name}</h3>
            <div>存款: <span class="highlight">$${Math.floor(player.money).toLocaleString()}</span></div>
            <div>目前年薪: $${Math.floor(player.salary).toLocaleString()}</div>
            <div style="margin-top:10px; font-size:12px">買房頭期款進度 (${percentage}%)</div>
            <progress value="${player.money}" max="${config.targetSavings}"></progress>
            <div style="text-align:right; font-size:10px; color:#aaa">$300萬 目標</div>
        </div>
        
        <div class="stats-group npc-stats">
            <h3>👹 房東與資本家</h3>
    `;

    // 顯示 NPC 列表
    roles.forEach(role => {
        if (role.id === 'player') return;
        html += `
            <div style="margin-bottom:8px; border-left:3px solid ${role.color}; padding-left:5px">
                <div>${role.name}</div>
                <div>資產: $${Math.floor(role.assets).toLocaleString()}</div>
                <div style="font-size:10px; color:#7f8c8d">年租金收入: $${Math.floor(role.rentIncome).toLocaleString()}</div>
            </div>
        `;
    });

    html += `</div>`;
    dashboard.innerHTML = html;
}