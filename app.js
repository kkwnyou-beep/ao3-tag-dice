// ==================== 全局状态 ====================
let tagsData = null;
let currentTags = {};

// ==================== 初始化 ====================
async function init() {
    try {
        const response = await fetch('tags.json');
        tagsData = await response.json();
        console.log('%cAO3 Tag Dice 已加载', 'color:#a44a3f; font-size:14px; font-weight:bold');
        console.log('维度数:', Object.keys(tagsData.dimensions).length);
        console.log('预设模式:', Object.keys(tagsData.presets).length);
    } catch (error) {
        console.error('加载 tags.json 失败:', error);
        alert('无法加载 tag 数据，请确保 tags.json 与 index.html 在同一目录');
    }
}

// ==================== 核心逻辑 ====================

/**
 * 从数组中随机获取一个元素
 */
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 完整 Roll - 从每个维度随机抽取一个 tag
 */
function rollAll() {
    if (!tagsData) {
        alert('tag ���据未加载');
        return;
    }

    currentTags = {};
    const container = document.getElementById('tagsContainer');
    container.innerHTML = '';

    // 遍历所有维度
    Object.keys(tagsData.dimensions).forEach(dimension => {
        const tags = tagsData.dimensions[dimension];
        const selectedTag = getRandom(tags);
        currentTags[dimension] = selectedTag;

        // 创建维度块
        const block = document.createElement('div');
        block.className = 'dimension-block';
        block.innerHTML = `
            <div class="dimension-label">${dimension}</div>
            <div class="tag-text">${selectedTag}</div>
        `;
        container.appendChild(block);
    });

    document.getElementById('resultCard').classList.remove('empty');
    updateOutput();
}

/**
 * 加载预设模式
 */
function loadPreset(presetName) {
    if (!tagsData || !tagsData.presets[presetName]) {
        alert('预设不存在');
        return;
    }

    currentTags = { ...tagsData.presets[presetName] };
    const container = document.getElementById('tagsContainer');
    container.innerHTML = '';

    Object.keys(currentTags).forEach(dimension => {
        const block = document.createElement('div');
        block.className = 'dimension-block';
        block.innerHTML = `
            <div class="dimension-label">${dimension}</div>
            <div class="tag-text">${currentTags[dimension]}</div>
        `;
        container.appendChild(block);
    });

    document.getElementById('resultCard').classList.remove('empty');
    updateOutput();
}

/**
 * 清空卡片和输出
 */
function clearCard() {
    currentTags = {};
    document.getElementById('tagsContainer').innerHTML = '';
    document.getElementById('output').value = '';
    document.getElementById('resultCard').classList.add('empty');
}

/**
 * 更新输出文本框 - 格式为 #tag1 #tag2 ...
 */
function updateOutput() {
    const lines = [];
    Object.keys(currentTags).forEach(dimension => {
        lines.push(`#${currentTags[dimension]}`);
    });
    document.getElementById('output').value = lines.join(' ');
}

/**
 * 复制到剪贴板
 */
function copyToClipboard() {
    const text = document.getElementById('output').value;
    if (!text) {
        alert('没有内容可复制');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.actions button:first-child');
        const originalText = btn.textContent;
        btn.textContent = '✅ 已复制';
        btn.style.background = '#4a7c59';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    });
}

/**
 * 重新 Roll（相当于再按一次完整 Roll）
 */
function reroll() {
    rollAll();
}

/**
 * 初始化 UI - 生成预设按钮
 */
function initPresetButtons() {
    if (!tagsData) return;

    const presetsContainer = document.getElementById('presets');

    Object.keys(tagsData.presets).forEach(presetName => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn';
        btn.textContent = `📌 ${presetName}`;
        btn.onclick = () => loadPreset(presetName);
        presetsContainer.appendChild(btn);
    });
}

// ==================== 页面加载 ====================
window.addEventListener('DOMContentLoaded', () => {
    init().then(() => {
        initPresetButtons();
        document.getElementById('resultCard').classList.add('empty');
    });
});
