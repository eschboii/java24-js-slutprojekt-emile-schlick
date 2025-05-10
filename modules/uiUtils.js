/** 
 * Innehåller ui-hjälpmetoder för att visa och dölja felmeddelande och loader-overlay
 * Anropas av dom för att öppna modal för trailern, hantera stängning av modal
 * 
 * Exporterar alla sina metoder
 **/
const errorElement = document.getElementById('error-message');

export function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

export function hideError() {
    errorElement.style.display = 'none';
}

const modal = document.getElementById('trailer-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const backdrop = modal.querySelector('.modal-backdrop');

export function openModalWithContent(content = 'Laddar…') {
    modalBody.innerHTML = `<p>${content}</p>`;
    modal.classList.remove('hidden');
    return modalBody;
}

export function closeModal() {
    modal.classList.add('hidden');
    modalBody.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
