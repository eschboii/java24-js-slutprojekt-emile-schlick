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
