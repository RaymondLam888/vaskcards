let selectedCardIds = new Set();

let cardSelectionStatus = {};


function showCards(tag, showOnlyCurrentGroup = false) {
    hideAllCards();
    restoreSelectedCards();

    const imagesContainer = document.getElementById('images');
    const selectedCards = imagesContainer.querySelector(`[data-tag="${tag}"]`);
    if (selectedCards) {
        clearSelectedImages(); 

        const cardContainer = document.getElementById('cardContainer');
        selectedCards.querySelectorAll('img').forEach(img => {
            const card = createCard(img.src, img.alt, img.dataset.id, selectedCards.dataset.group);
            cardContainer.appendChild(card);
        });

   
        markSelectedCardsByGroup(tag);

        if (showOnlyCurrentGroup) {
            const currentGroup = selectedCards.dataset.group;
            hideNonCurrentGroupSelectedCards(currentGroup);
        }
    }
}


function markSelectedCardsByGroup(group) {

    clearSelectedImages();

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
    const group = id.split('-')[0]; 
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
    markSelectedCardsByGroup(group); 
    
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


function switchGroup(groupId) {
    saveSelectedCardsState();

    clearCardContainer();

    showCards(groupId, true);

    reapplySelectedState();

    updateMaxSelectedCardsPerGroup();

    validateSelectedCount(groupId);

    markSelectedCards();

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


function submitSelection() {
    let isValidSelection = true;

    for (const group in selectedCardCountsPerGroup) {
        if (selectedCardCountsPerGroup[group] > maxSelectedCardsPerGroup[group]) {
            console.log(`组别 ${group} 已超过最大选择数量，请重新选择！`);
            isValidSelection = false;
            break;
        }
    }

    const employeeId = document.getElementById('employeeId').value.trim();
    if (employeeId === '' || /\d/.test(employeeId) || /[^\w\s]/.test(employeeId)) {
        console.log('Employee ID cannot be empty or contain numbers or symbols.');
        isValidSelection = false;
    }

    if (!isValidSelection) {
        alert('請填寫正確的姓名，不能留白或填寫數字符號');
        return;
    }

    console.log('Employee ID:', employeeId);

    const selectedCardIdsArray = Array.from(selectedCardIds);
    const dataToSave = {
        employeeId: employeeId,
        selectedCardIds: selectedCardIdsArray
    };

    const database = firebase.database();
    database.ref('selections').push(dataToSave)
        .then(() => {
            console.log('Data successfully saved to Firebase.');
            resetPage(); 
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
    selectedCardIds.clear();
    cardSelectionStatus = {};

    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.remove('selected');
    });

    document.getElementById('employeeId').value = '';

    updateSelectedImagesDisplay();
    adjustPadding();
}

