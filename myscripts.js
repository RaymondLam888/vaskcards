let selectedCardIds = new Set();

let cardSelectionStatus = {};


function showCards(tag, showOnlyCurrentGroup = false) {
    hideAllCards(); // 隱藏所有卡片
    restoreSelectedCards(); // 恢復已選卡片的顯示

    const imagesContainer = document.getElementById('images');
    const selectedCards = imagesContainer.querySelector(`[data-tag="${tag}"]`);
    if (selectedCards) {
        clearSelectedImages(); // 清除已選圖像

        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = ''; // 清空卡片容器，準備顯示新組合的卡片

        selectedCards.querySelectorAll('img').forEach(img => {
            const card = createCard(img.src, img.alt, img.dataset.id, selectedCards.dataset.group);
            cardContainer.appendChild(card); // 添加新組合的卡片到容器中
        });

        markSelectedCardsByGroup(tag); // 標記當前組合的已選卡片

        if (showOnlyCurrentGroup) {
            hideNonCurrentGroupSelectedCards(tag); // 隱藏非當前組合的已選卡片
        }
    }
}






function markSelectedCardsByGroup(group) {
    const selectedImagesContainer = document.getElementById('selectedImagesContainer');
    selectedImagesContainer.innerHTML = ''; // 清除當前組合的已選卡片

    selectedCardIds.forEach(cardId => {
        const card = document.querySelector(`#cardContainer .card[data-id="${cardId}"]`);
        if (card && card.dataset.group === group) {
            const selectedImage = createSelectedImage(card.querySelector('img').src, cardId);
            selectedImagesContainer.appendChild(selectedImage); // 只新增當前組合的已選卡片
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
        const group = id.split('-')[0];
        if (selectedCardIds.has(id) && group !== groupId) {
            card.style.display = 'none';
        }
    });
}

function createCard(src, alt, id, group) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = id;
    card.dataset.group = group; 
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;

    card.appendChild(img);

    card.addEventListener('click', function () {
        toggleCardSelection(card);
    });

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

const maxSelectedCardsPerGroup = {
    'V': 4,
    'A': 4,
    'S': 4,
    'K': 4
};

let selectedCardCountsPerGroup = {
    'V': 0,
    'A': 0,
    'S': 0,
    'K': 0
};


function toggleCardSelection(card) {
    const id = card.dataset.id;
    const group = id.split('-')[0]; // 從卡片ID中獲取組別
    console.log(`Group: ${group}, Max limit: ${maxSelectedCardsPerGroup[group]}, Current count: ${selectedCardCountsPerGroup[group]}`);

    if (selectedCardIds.has(id)) {
        selectedCardIds.delete(id);
        card.classList.remove('selected');
        selectedCardCountsPerGroup[group]--;
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

    setActiveButton(group);
    markSelectedCardsByGroup(group); // 更新顯示當前組別的已選卡片
    hideNonCurrentGroupSelectedCards(group);
}





function setActiveButton(button) {
    const allButtons = document.querySelectorAll('.label');
    allButtons.forEach(btn => {
      btn.classList.remove('active');
    });
  
    button.classList.add('active');
  }
  

function clearCardContainer() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; 
}

function displayCardsByGroup(groupId) {
    const imagesContainer = document.getElementById('images');
    const selectedCards = imagesContainer.querySelector(`[data-tag="${groupId}"]`);
    if (selectedCards) {
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = ''; 
        selectedCards.querySelectorAll('img').forEach(img => {
            const card = createCard(img.src, img.alt, img.dataset.id, selectedCards.dataset.group); 
            cardContainer.appendChild(card);
        });
    }
}

function displaySelectedCardsForCurrentGroup() {
    const currentGroup = getCurrentGroup();

    // 清空已選卡片容器
    const selectedImagesContainer = document.getElementById('selectedImagesContainer');
    selectedImagesContainer.innerHTML = '';

    // 獲取當前組合下的已選卡片
    const selectedCards = Array.from(selectedCardIds).filter(cardId => {
        const [group] = cardId.split('-');
        return group === currentGroup;
    });

    // 顯示當前組合下的已選卡片
    selectedCards.forEach(cardId => {
        const card = document.querySelector(`#cardContainer .card[data-id="${cardId}"]`);
        if (card) {
            const selectedImage = createSelectedImage(card.querySelector('img').src, cardId);
            selectedImagesContainer.appendChild(selectedImage);
        }
    });
}




function switchGroup(groupId) {
    saveSelectedCardsState();

    clearCardContainer();

    showCards(groupId, true);

    reapplySelectedState();

    updateMaxSelectedCardsPerGroup();

    validateSelectedCount(groupId);

    displaySelectedCardsForCurrentGroup(); // Display selected cards for the current group

    hideNonCurrentGroupSelectedCards(groupId);
}





function resetSelectionStatus() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        const id = card.dataset.id;
        card.classList.remove('selected');
        cardSelectionStatus[id] = false; 
    });
}


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


function saveSelectedCardsState() {
    selectedCardIds.clear();

    const cardContainer = document.getElementById('cardContainer');
    const allCards = cardContainer.querySelectorAll('.card');
    allCards.forEach(card => {
        const id = card.dataset.id;
        if (card.classList.contains('selected')) {
            selectedCardIds.add(id);
            cardSelectionStatus[id] = true; 
        }
    });
}



function updateMaxSelectedCardsPerGroup() {
    for (const group in maxSelectedCardsPerGroup) {
        const selectedCount = selectedCardCountsPerGroup[group];
        maxSelectedCardsPerGroup[group] = 4 - selectedCount;
    }
}

function validateSelectedCount(groupId) {
    const selectedCount = selectedCardCountsPerGroup[groupId];
    if (selectedCount > maxSelectedCardsPerGroup[groupId]) {
        console.log(`组别 ${groupId} 已超过最大选择数量，请重新选择！`);
    }
}

function createCard(src, alt, id, group) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = id;
    card.dataset.group = group; 

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

function isAlphabetic(value) {
    return /^[a-zA-Z]+$/.test(value);
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function submitSelection() {
    let isValidSelection = true;

    // 檢查是否填寫了姓名
    const name = document.getElementById('employeeId').value.trim();
    if (name === '') {
        alert('請填寫您的姓名。');
        isValidSelection = false;
        return;
    }

    // 檢查是否填寫了職員編號
    const number = document.getElementById('employeeNumber').value.trim();
    if (number === '') {
        alert('請填寫您的職員編號。');
        isValidSelection = false;
        return;
    }

    // 檢查VASK組合中是否有選擇卡片
    const selectedCardIdsArray = Array.from(selectedCardIds);
    const selectedGroups = selectedCardIdsArray.map(id => id.split('-')[0]);
    const hasVASKSelection = selectedGroups.includes('V') && selectedGroups.includes('A') &&
        selectedGroups.includes('S') && selectedGroups.includes('K');

    if (!hasVASKSelection) {
        alert('在VASK組合中，每個分組至少需要選擇一張卡片。');
        isValidSelection = false;
        return;
    }

    // 檢查職員編號是否只包含數字
    if (!/^\d+$/.test(number)) {
        alert('職員編號只能包含數字。');
        isValidSelection = false;
        return;
    }

    if (!isValidSelection) {
        return;
    }

    console.log('姓名:', name);
    console.log('職員編號:', number);

    const dataToSave = {
        employeeId: name,
        employeeNumber: number,
        selectedCardIds: selectedCardIdsArray
    };

    const database = firebase.database();
    database.ref('selections').push(dataToSave)
        .then(() => {
            console.log('數據成功保存到Firebase。');
            resetPage();
        })
        .catch((error) => {
            console.error('保存數據到Firebase時出錯:', error);
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

function removeSelectedImage(id) {
    if (selectedCardIds.has(id)) {
        const group = id.split('-')[0]; 
        selectedCardIds.delete(id);
        selectedCardCountsPerGroup[group]--; 
        cardSelectionStatus[id] = false; 
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

    selectedCardIds.forEach(cardId => {
        const card = cardContainer.querySelector(`[data-id="${cardId}"]`);
        if (card) {
            card.classList.add('selected');
        }
    });
}


function clearGreenBorders() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.remove('selected');
    });

    selectedCardIds.clear();
}

function markSelectedCards() {
    const cardContainer = document.getElementById('cardContainer');

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

    XLSX.writeFile(wb, 'selection_data.xlsx');
}

window.onload = function() {
    resetPage();
    showCards('initialGroup');
};

function resetPage() {
    document.getElementById('employeeId').value = '';
    document.getElementById('employeeNumber').value = '';
    selectedCardIds.clear();
    selectedCardCountsPerGroup = {
        'V': 0,
        'A': 0,
        'S': 0,
        'K': 0
    };
    maxSelectedCardsPerGroup = {
        'V': 4,
        'A': 4,
        'S': 4,
        'K': 4
    };
    clearSelectedImages();
    hideAllCards();
}