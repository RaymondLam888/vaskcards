let selectedCardIds = new Set();

function showCards(tag) {
    // 隱藏所有卡片
    hideAllCards();

    // 恢復先前選取的卡片狀態
    restoreSelectedCards();

    // 根據選擇的標籤顯示相應的卡片
    const imagesContainer = document.getElementById('images');
    const selectedCards = imagesContainer.querySelector(`[data-tag="${tag}"]`);
    if (selectedCards) {
        // 將選擇的卡片複製到卡片容器中
        const cardContainer = document.getElementById('cardContainer');
        selectedCards.querySelectorAll('img').forEach(img => {
            const card = createCard(img.src, img.alt, img.dataset.id);
            cardContainer.appendChild(card);

            // 將先前選取的卡片重新標記
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

    // 添加點擊事件
    card.addEventListener('click', function () {
        toggleCardSelection(card);
    });

    return card;
}

function hideAllCards() {
    // 隱藏所有卡片
    const allCards = document.querySelectorAll('#cardContainer .card');
    allCards.forEach(card => {
        card.style.display = 'none';
    });
}

function toggleCardSelection(card) {
    const id = card.dataset.id;  // 獲取卡片的 ID

    // 檢查 ID 是否已經存在於集合中
    if (selectedCardIds.has(id)) {
        // 如果已經存在，表示取消選擇
        selectedCardIds.delete(id);
        card.classList.remove('selected');
    } else {
        // 如果不存在，表示新增選擇
        selectedCardIds.add(id);
        card.classList.add('selected');
    }

    updateSelectedImagesDisplay();
}

function updateSelectedImagesDisplay() {
    const selectedImagesContainer = document.getElementById('selectedImagesContainer');
    selectedImagesContainer.innerHTML = '';

    // 使用 Set 的 forEach 來處理每個選取的 ID
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

    // 添加點擊事件
    selectedImage.addEventListener('click', function () {
        removeSelectedImage(id);
    });

    return selectedImage;
}

function removeSelectedImage(id) {
    // 在這裡處理移除選擇的邏輯
    // 你可以根據需要進行相應的操作

    // 在這個範例中，我們從 selectedCardIds 中刪除該 ID
    if (selectedCardIds.has(id)) {
        selectedCardIds.delete(id);
    }

    // 移除選擇圖片的 DOM 元素
    const selectedImage = document.querySelector(`.selectedImage[data-id="${id}"]`);
    if (selectedImage) {
        selectedImage.remove();
        console.log(`Successfully removed selected image with ID: ${id}`);

        // 移除相應的 .selected class
        const selectedCard = document.querySelector(`#cardContainer .card[data-id="${id}"]`);
        if (selectedCard) {
            selectedCard.classList.remove('selected');
        }
    } else {
        console.log(`Could not find element with ID ${id} to remove.`);
    }
}

function restoreSelectedCards() {
    // 使用 Set 的 forEach 來處理每個選取的 ID
    selectedCardIds.forEach(cardId => {
        const card = document.querySelector(`#cardContainer [data-id="${cardId}"]`);
        if (card) {
            card.classList.add('selected');
        }
    });
}

function markSelectedCards() {
    const cardContainer = document.getElementById('cardContainer');

    // 使用 Set 的 forEach 來處理每個選取的 ID
    selectedCardIds.forEach(cardId => {
        const card = cardContainer.querySelector(`[data-id="${cardId}"]`);
        if (card) {
            card.classList.add('selected');
        }
    });
}

function submitSelection() {
    // 在這裡處理提交選擇的邏輯
    // 可以獲取同工編號和選擇的卡片資訊，然後進行後續操作
    const employeeId = document.getElementById('employeeId').value;
    console.log('Employee ID:', employeeId);

    // 獲取選擇的卡片資訊，這裡只是一個範例
    const selectedCards = document.querySelectorAll('#cardContainer .card.selected');
    selectedCards.forEach(card => {
        const cardId = card.dataset.id;  // 這裡的 dataset.id 根據實際情況修改
        console.log(`Selected Card ID: ${cardId}`);
    });

    // 在這裡添加實際的提交邏輯
}


  function downloadExcel() {
    const employeeId = document.getElementById('employeeId').value;
    const selectedCardIdsArray = Array.from(selectedCardIds); // Convert Set to Array

    // 將資料組織為 Excel 可接受的格式
    const data = [['Employee ID', 'Selected Image IDs'], [employeeId, selectedCardIdsArray.join(',')]];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 下載 Excel 檔案
    XLSX.writeFile(wb, 'selection_data.xlsx');
}
