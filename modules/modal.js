const modal      = document.getElementById('trailer-modal');
const modalBody  = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const backdrop   = modal.querySelector('.modal-backdrop');

export function openModalWithContent(html = '<p>Laddar…</p>') {
  modalBody.innerHTML = html;
  modal.classList.remove('hidden');
  return modalBody; 
}

export function closeModal() {
  modal.classList.add('hidden');
  modalBody.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);