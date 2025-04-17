export function showError(message) {
    const errorDiv = document.querySelector('#error-message');
    errorDiv.innerText = `${message}`;
    errorDiv.style.display = 'block';
  }
  
  export function hideError() {
    const errorDiv = document.querySelector('#error-message');
    errorDiv.innerText = '';
    errorDiv.style.display = 'none';
  }