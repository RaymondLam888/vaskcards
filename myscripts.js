// 定义全局变量，用于保存已选卡片的 ID 集合
let selectedCardIds = new Set();

// 定义全局对象，用于保存卡片的选取状态
let cardSelectionStatus = {};


function showCards(tag, showOnlyCurrentGroup = false) {
    hideAllCards();
    restoreSelectedCards();

    const imagesContainer = document.getElementById('images');
    const selectedCards = imagesContainer.querySelector(`[data-tag="${tag}"]`);
    if (selectedCards) {
        clearSelectedImages(); // 清空已選取的圖片展示區域

        const cardContainer = document.getElementById('cardContainer');
        selectedCards.querySelectorAll('img').forEach(img => {
            const card = createCard(img.src, img.alt, img.dataset.id, selectedCards.dataset.group);
            cardContainer.appendChild(card);
        });

        // 自动为已选卡片添加绿框标记
        markSelectedCardsByGroup(tag);

        // 如果 showOnlyCurrentGroup 参数为 true，则隐藏非当前组别的已选择卡片
        if (showOnlyCurrentGroup) {
            const currentGroup = selectedCards.dataset.group;
            hideNonCurrentGroupSelectedCards(currentGroup);
        }
    }
}


function markSelectedCardsByGroup(group) {
    // 移除所有已選取的圖片
    clearSelectedImages();

    // 根據組別顯示已選取的圖片
    selectedCardIds.forEach(cardId => {
        const card = document.querySelector(`#cardContainer .card[data-id="${cardId}"]`);
        if (card && card.dataset.group === group) {
            const selectedImage = createSelectedImage(card.querySelector('img').src, cardId);
            document.getElementById('selectedImagesContainer').appendChild(selectedImage);
        }
    });
}

function clearSelectedImages() {
    const selectedImagesContainer = document.getElementById('selectedImagesContainer');
    selectedImagesContainer.innerHTML = '';
}

function hideNonCurrentGroupSelectedCards(groupId) {
    const cardContainer = document.getElementById('cardContainer');
    const allCards = cardContainer.querySelectorAll('.card');
    allCards.forEach(card => {
        const id = card.dataset.id;
        const group = id.split('-')[0]; // 从 data-id 中解析出组别信息
        if (selectedCardIds.has(id) && group !== groupId) {
            card.style.display = 'none'; // 将非当前组别的已选卡片隐藏
        }
    });
}


// 创建卡片函数，修改 toggleCardSelection 函数，保存和使用卡片选取状态
function createCard(src, alt, id, group) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = id;
    card.dataset.group = group; // 将组别信息添加到卡片的HTML结构中

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;

    card.appendChild(img);

    // 添加 click 事件处理函数
    card.addEventListener('click', function () {
        toggleCardSelection(card);
    });

    // 检查卡片的选取状态，并添加绿色框标记
    if (cardSelectionStatus[id]) {
        card.classList.add('selected');
    }

    return card;
}

function hideAllCards() {
    const allCards = document.querySelectorAll('#cardContainer .card');
    allCards.forEach(card => {
        card.style.display = 'none';
    });
}




// 定义每个组别最大可选择的卡片数量
const maxSelectedCardsPerGroup = {
    'V': 4,
    'A': 4,
    'S': 4,
    'K': 4
};

// 跟踪每个组别用户已选择的卡片数量
let selectedCardCountsPerGroup = {
    'V': 0,
    'A': 0,
    'S': 0,
    'K': 0
};


function toggleCardSelection(card) {
    const id = card.dataset.id;
    const group = id.split('-')[0]; // 从 data-id 中解析出组别信息

    console.log(`Group: ${group}, Max limit: ${maxSelectedCardsPerGroup[group]}, Current count: ${selectedCardCountsPerGroup[group]}`);

    if (selectedCardIds.has(id)) {
        selectedCardIds.delete(id);
        card.classList.remove('selected');
        selectedCardCountsPerGroup[group]--; // 取消选取时，相应组别的计数减少
    } else {
        if (selectedCardCountsPerGroup[group] < maxSelectedCardsPerGroup[group]) {
            selectedCardIds.add(id);
            card.classList.add('selected');
            selectedCardCountsPerGroup[group]++;
        } else {
            console.log(`Group ${group} has reached the maximum selection limit.`);
            return;
        }
    }

    console.log(`Selected card IDs: ${Array.from(selectedCardIds).join(', ')}`);

    updateSelectedImagesDisplay();
    adjustPadding();

    // 根据当前选中的组别设置活动按钮样式
    setActiveButton(group);
    // 更新选中状态后，重新标记已选卡片
    markSelectedCardsByGroup(group); // 修改为只标记当前组别的已选卡片
    
    // 隱藏所有非當前組別的已選取卡片
    hideNonCurrentGroupSelectedCards(group); // 添加这行代码
}




function setActiveButton(button) {
    // 首先移除所有按钮的 .active 类
    const allButtons = document.querySelectorAll('.label');
    allButtons.forEach(btn => {
      btn.classList.remove('active');
    });
  
    // 然后给当前点击的按钮添加 .active 类
    button.classList.add('active');
  }
  


// 清除 cardContainer 中的卡片
function clearCardContainer() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; // 清空之前显示的卡片
}

// 根据新组别显示卡片
function displayCardsByGroup(groupId) {
    const imagesContainer = document.getElementById('images');
    const selectedCards = imagesContainer.querySelector(`[data-tag="${groupId}"]`);
    if (selectedCards) {
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = ''; // 清空之前显示的卡片
        selectedCards.querySelectorAll('img').forEach(img => {
            const card = createCard(img.src, img.alt, img.dataset.id, selectedCards.dataset.group); // 将组别信息传递给 createCard 函数
            cardContainer.appendChild(card);
        });
    }
}


// 切换组别函数
function switchGroup(groupId) {
    // 保存当前组别的已选取卡片状态
    saveSelectedCardsState();

    // 清空 cardContainer 中的卡片
    clearCardContainer();

    // 根据新组别显示卡片，并只显示当前组别内已选择的卡片
    showCards(groupId, true);

    // 重新应用选取状态
    reapplySelectedState();

    // 更新每个组别的最大可选择卡片数量
    updateMaxSelectedCardsPerGroup();

    // 检查当前选取数量是否超过限制数量
    validateSelectedCount(groupId);

    // 更新选中状态后，重新标记已选卡片
    markSelectedCards();

    // 隱藏所有非當前組別的已選取卡片
    hideNonCurrentGroupSelectedCards(groupId);
}



// 重置选取状态函数
function resetSelectionStatus() {
    // 清除所有卡片的选取状态
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        const id = card.dataset.id;
        card.classList.remove('selected');
        cardSelectionStatus[id] = false; // 更新卡片选取状态对象
    });
}


// 重新标记当前仍是被选取状态的卡片
function reapplySelectedState() {
    const cardContainer = document.getElementById('cardContainer');
    const allCards = cardContainer.querySelectorAll('.card');
    allCards.forEach(card => {
        const id = card.dataset.id;
        if (selectedCardIds.has(id)) {
            card.classList.add('selected');
        }
    });
}


// 保存当前组别的已选取卡片状态函数
function saveSelectedCardsState() {
    // 清空之前保存的已选卡片 ID 集合
    selectedCardIds.clear();

    // 标记当前已选卡片并保存到 selectedCardIds 集合和 cardSelectionStatus 对象中
    const cardContainer = document.getElementById('cardContainer');
    const allCards = cardContainer.querySelectorAll('.card');
    allCards.forEach(card => {
        const id = card.dataset.id;
        if (card.classList.contains('selected')) {
            selectedCardIds.add(id);
            cardSelectionStatus[id] = true; // 更新卡片选取状态对象
        }
    });
}



function updateMaxSelectedCardsPerGroup() {
    for (const group in maxSelectedCardsPerGroup) {
        // 计算当前组别已选卡片数量
        const selectedCount = selectedCardCountsPerGroup[group];
        // 更新最大可选择卡片数量为原始限制减去已选数量
        maxSelectedCardsPerGroup[group] = 4 - selectedCount;
    }
}

function validateSelectedCount(groupId) {
    // 检查当前组别已选择的卡片数量是否超过限制
    const selectedCount = selectedCardCountsPerGroup[groupId];
    if (selectedCount > maxSelectedCardsPerGroup[groupId]) {
        console.log(`组别 ${groupId} 已超过最大选择数量，请重新选择！`);
    }
}

// 创建卡片函数
function createCard(src, alt, id, group) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = id;
    card.dataset.group = group; // 将组别信息添加到卡片的HTML结构中

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;

    card.appendChild(img);

    card.addEventListener('click', function () {
        toggleCardSelection(card);
    });

    return card;
}

function hideAllCards() {
    const allCards = document.querySelectorAll('#cardContainer .card');
    allCards.forEach(card => {
        card.style.display = 'none';
    });
}


// 提交选择时的处理函数
function submitSelection() {
    let isValidSelection = true;

    // 检查每个组别的已选择卡片数量是否超过限制
    for (const group in selectedCardCountsPerGroup) {
        if (selectedCardCountsPerGroup[group] > maxSelectedCardsPerGroup[group]) {
            console.log(`组别 ${group} 已超过最大选择数量，请重新选择！`);
            isValidSelection = false;
            break;
        }
    }

    // 检查员工ID是否为空或包含数字或符号
    const employeeId = document.getElementById('employeeId').value.trim();
    if (employeeId === '' || /\d/.test(employeeId) || /[^\w\s]/.test(employeeId)) {
        console.log('Employee ID cannot be empty or contain numbers or symbols.');
        isValidSelection = false;
    }

    if (!isValidSelection) {
        // 提示用户填写正确的信息
        alert('請填寫正確的姓名，不能留白或填寫數字符號');
        return;
    }

    console.log('Employee ID:', employeeId);

    const selectedCardIdsArray = Array.from(selectedCardIds);
    // 建立要储存到 Firebase 的物件
    const dataToSave = {
        employeeId: employeeId,
        selectedCardIds: selectedCardIdsArray
    };

    // 将数据储存到 Firebase 数据库中
    const database = firebase.database();
    database.ref('selections').push(dataToSave)
        .then(() => {
            console.log('Data successfully saved to Firebase.');
            resetPage(); // 提交后重置页面
        })
        .catch((error) => {
            console.error('Error saving data to Firebase:', error);
        });
}




function adjustPadding() {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const distance = 20;
    document.getElementById('cardContainer').style.paddingTop = `${headerHeight + distance}px`;
}

function updateSelectedImagesDisplay() {
    const selectedImagesContainer = document.getElementById('selectedImagesContainer');
    selectedImagesContainer.innerHTML = '';

    selectedCardIds.forEach(cardId => {
        const card = document.querySelector(`#cardContainer [data-id="${cardId}"]`);
        if (card) {
            const selectedImage = createSelectedImage(card.querySelector('img').src, cardId);
            selectedImagesContainer.appendChild(selectedImage);
        }
    });
}

// 创建已选图片展示
function createSelectedImage(src, id) {
    const selectedImage = document.createElement('div');
    selectedImage.classList.add('selectedImage');
    selectedImage.dataset.id = id;

    const imageElement = document.createElement('img');
    imageElement.src = src;
    imageElement.alt = 'Selected Image';

    selectedImage.appendChild(imageElement);

    selectedImage.addEventListener('click', function () {
        removeSelectedImage(id);
    });

    return selectedImage;
}

// 移除已选图片
function removeSelectedImage(id) {
    if (selectedCardIds.has(id)) {
        const group = id.split('-')[0]; // 从 data-id 中解析出组别信息
        selectedCardIds.delete(id);
        selectedCardCountsPerGroup[group]--; // 取消选取时，相应组别的计数减少
        cardSelectionStatus[id] = false; // 更新 cardSelectionStatus 对象
    }

    const selectedImage = document.querySelector(`.selectedImage[data-id="${id}"]`);
    if (selectedImage) {
        selectedImage.remove();
        console.log(`Successfully removed selected image with ID: ${id}`);

        const selectedCard = document.querySelector(`#cardContainer .card[data-id="${id}"]`);
        if (selectedCard) {
            selectedCard.classList.remove('selected');
        }

        adjustPadding();
    } else {
        console.log(`Could not find element with ID ${id} to remove.`);
    }
}


// 调整 padding
function adjustPadding() {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const desiredDistance = 40; 
    const currentDistance = parseInt(document.getElementById('cardContainer').style.paddingTop, 10);
    const distanceDifference = currentDistance - desiredDistance;
    const newPaddingTop = headerHeight + desiredDistance; 
    document.getElementById('cardContainer').style.paddingTop = `${newPaddingTop}px`;

    if (distanceDifference !== 0) {
        const selectedImagesContainer = document.getElementById('selectedImagesContainer');
        const currentHeight = parseInt(window.getComputedStyle(selectedImagesContainer).height, 10);
        selectedImagesContainer.style.height = `${currentHeight - distanceDifference}px`;
    }
}


function restoreSelectedCards() {
    const cardContainer = document.getElementById('cardContainer');
    const allCards = cardContainer.querySelectorAll('.card');
    allCards.forEach(card => {
        const id = card.dataset.id;
        if (selectedCardIds.has(id)) {
            card.classList.add('selected');
        }
    });
}


function markSelectedCards() {
    const cardContainer = document.getElementById('cardContainer');

    // 根据 selectedCardIds 集合中的卡片ID重新标记已选卡片并添加绿色框
    selectedCardIds.forEach(cardId => {
        const card = cardContainer.querySelector(`[data-id="${cardId}"]`);
        if (card) {
            card.classList.add('selected');
        }
    });
}


function clearGreenBorders() {
    // 移除所有卡片的绿色框标记
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.remove('selected');
    });

    // 清空 selectedCardIds 集合
    selectedCardIds.clear();
}

function markSelectedCards() {
    const cardContainer = document.getElementById('cardContainer');

    // 根据 selectedCardIds 集合中的卡片ID重新标记已选卡片并添加绿色框
    selectedCardIds.forEach(cardId => {
        const card = cardContainer.querySelector(`[data-id="${cardId}"]`);
        if (card) {
            card.classList.add('selected');
        }
    });
}


window.addEventListener('resize', function () {
    updateSelectedImagesSize();
});

window.addEventListener('load', function () {
    updateSelectedImagesSize();
});

function updateSelectedImagesSize() {
    const containerWidth = document.getElementById('selectedImagesContainer').offsetWidth;
    const totalImagesWidth = getTotalImagesWidth();
    const images = document.querySelectorAll('.selectedImage img');

    const scaleFactor = containerWidth / totalImagesWidth;
    images.forEach(image => {
        image.style.width = `${scaleFactor * 100}%`;
    });
}

function getTotalImagesWidth() {
    const images = document.querySelectorAll('.selectedImage');
    let totalWidth = 0;
    images.forEach(image => {
        totalWidth += image.offsetWidth;
    });
    return totalWidth;
}

window.addEventListener('load', function () {
    adjustPadding();
});

function adjustPadding() {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const distance = 20; 
    document.getElementById('cardContainer').style.paddingTop = `${headerHeight + distance}px`;
}


function downloadExcel() {
    const employeeId = document.getElementById('employeeId').value;
    const selectedCardIdsArray = Array.from(selectedCardIds);

    const data = [['Employee ID', 'Selected Image IDs'], [employeeId, selectedCardIdsArray.join(',')]];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 下載 Excel 檔案
    XLSX.writeFile(wb, 'selection_data.xlsx');
}

window.onload = function() {
    // 在頁面重新載入時，重置所有數據和狀態
    resetPage();
    // 在页面加载时，调用显示初始组别的卡片
    showCards('initialGroup');
};

// 重置页面函数
function resetPage() {
    // 清空已选卡片的 ID 集合和卡片选取状态对象
    selectedCardIds.clear();
    cardSelectionStatus = {};

    // 清除所有卡片的选取状态样式
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.remove('selected');
    });

    // 清空输入框内容等其他重置操作
    document.getElementById('employeeId').value = '';

    // 重新调整页面元素等其他操作
    updateSelectedImagesDisplay();
    adjustPadding();
}

