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

// function myFunction() {
//     // 获取 buttonGroups2 元素
//     const buttonGroups2 = document.getElementById("buttonGroups2");

//     // 判断当前的 display 状态
//     if (buttonGroups2.style.display === "none" || buttonGroups2.style.display === "") {
//         // 如果是隐藏的，则显示
//         buttonGroups2.style.display = "block";
//     } 
// }


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

        // 移除相應的 .selected class
        const selectedImage = document.querySelector(`.selectedImage[data-id="${id}"]`);
        if (selectedImage) {
            selectedImage.remove();
        }
    } else {
        // 如果不存在，表示新增選擇
        selectedCardIds.add(id);
        card.classList.add('selected');
        const selectedImage = createSelectedImage(card.querySelector('img').src, id);
        document.getElementById('selectedImagesContainer').appendChild(selectedImage);
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
    const selectedImage = document.querySelector(`.selectedImage[data-id="${id}"]`);
    if (selectedImage) {
        selectedImage.parentNode.removeChild(selectedImage);
        console.log(`Successfully removed selected image with ID: ${id}`);

        const selectedCard = document.querySelector(`#cardContainer .card[data-id="${id}"]`);
        if (selectedCard) {
            selectedCard.classList.remove('selected');
        }

        // 使用 Set 的 delete 方法來刪除 ID
        selectedCardIds.delete(id);
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
    const employeeId = document.getElementById('employeeId').value;
    console.log('Employee ID:', employeeId);

    // 使用 map 函數簡化獲取選擇的卡片 ID
    const selectedCardIds = Array.from(document.querySelectorAll('#cardContainer .card.selected')).map(card => card.dataset.id);
    console.log('Selected Card IDs:', selectedCardIds);

    // 在這裡添加實際的提交邏輯
}

let isTagOpen = false;
const header = document.querySelector('.header');
const headerHeight = header.clientHeight; // 獲取 .header 的高度

function toggleTag() {
    isTagOpen = !isTagOpen;

    var contentContainer = document.querySelector('.content-container');

    if (isTagOpen) {
        header.style.top = `-${headerHeight}px`;
        contentContainer.style.marginTop = `${headerHeight}px`;
    } else {
        header.style.top = '0';
        contentContainer.style.marginTop = '0';
    }
}

window.addEventListener('scroll', function() {
    var scrollPosition = window.scrollY;

    if (!isTagOpen) {
        header.style.top = `-${Math.min(scrollPosition, headerHeight)}px`;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // 頁面載入完成後不再隱藏選取圖片的區域，而是在需要時再切換顯示與隱藏
    const toggleButton = document.getElementById('toggleSelectedImagesButton');

    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSelectedImagesArea);
    }
});

function toggleSelectedImagesArea() {
    // 切換選取圖片的區域的顯示與隱藏
    const selectedImagesArea = document.querySelector('.selectedImagesArea');
    selectedImagesArea.style.display = selectedImagesArea.style.display === 'none' ? 'block' : 'none';
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