let selectedCardIds = new Set();

function showCards(tag) {
    hideAllCards();

    restoreSelectedCards();

    const imagesContainer = document.getElementById('images');
    const selectedCards = imagesContainer.querySelector(`[data-tag="${tag}"]`);
    if (selectedCards) {

        const cardContainer = document.getElementById('cardContainer');
        selectedCards.querySelectorAll('img').forEach(img => {
            const card = createCard(img.src, img.alt, img.dataset.id);
            cardContainer.appendChild(card);

            markSelectedCards();
        });
    }
}


function createCard(src, alt, id) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = id;

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

function toggleCardSelection(card) {

    const id = card.dataset.id;  
    if (selectedCardIds.has(id)) {
        selectedCardIds.delete(id);
        card.classList.remove('selected');
    } else {
        selectedCardIds.add(id);
        card.classList.add('selected');
    }

    updateSelectedImagesDisplay();


    adjustPadding();
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
        selectedCardIds.delete(id);
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
    selectedCardIds.forEach(cardId => {
        const card = document.querySelector(`#cardContainer [data-id="${cardId}"]`);
        if (card) {
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

function submitSelection() {
    
    const employeeId = document.getElementById('employeeId').value;
    console.log('Employee ID:', employeeId);

   
    const selectedCards = document.querySelectorAll('#cardContainer .card.selected');
    selectedCards.forEach(card => {
        const cardId = card.dataset.id;  
        console.log(`Selected Card ID: ${cardId}`);
    });

}

window.addEventListener('resize', function() {
    updateSelectedImagesSize();
});

window.addEventListener('load', function() {
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

window.addEventListener('load', function() {
    adjustPadding();
});

function toggleCardSelection(card) {
    const id = card.dataset.id;

    if (selectedCardIds.has(id)) {
        selectedCardIds.delete(id);
        card.classList.remove('selected');
    } else {
        selectedCardIds.add(id);
        card.classList.add('selected');
    }

    updateSelectedImagesDisplay();

    adjustPadding();
}

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