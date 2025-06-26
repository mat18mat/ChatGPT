function showToast(message, type = 'success', duration = 3000) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.style.position = 'fixed';
    toast.style.top = '2rem';
    toast.style.right = '2rem';
    toast.style.zIndex = 9999;
    toast.style.minWidth = '220px';
    toast.style.maxWidth = '350px';
    toast.style.padding = '1rem 1.5rem';
    toast.style.borderRadius = '0.75rem';
    toast.style.fontWeight = 'bold';
    toast.style.boxShadow = '0 2px 16px #0002';
    toast.style.fontSize = '1rem';
    toast.style.display = 'none';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = 'block';
  toast.style.background = type === 'success' ? '#dcfce7' : type === 'error' ? '#fee2e2' : '#dbeafe';
  toast.style.color = type === 'success' ? '#15803d' : type === 'error' ? '#b91c1c' : '#2563eb';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.display = 'none';
  }, duration);
}

// Loader global
function showLoader() {
  let loader = document.getElementById('global-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.style.position = 'fixed';
    loader.style.top = 0;
    loader.style.left = 0;
    loader.style.width = '100vw';
    loader.style.height = '100vh';
    loader.style.background = 'rgba(255,255,255,0.7)';
    loader.style.display = 'flex';
    loader.style.alignItems = 'center';
    loader.style.justifyContent = 'center';
    loader.style.zIndex = 9998;
    loader.innerHTML = '<div class="loader-spinner" style="border: 6px solid #e5e7eb; border-top: 6px solid #2563eb; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite;"></div>';
    document.body.appendChild(loader);
    const style = document.createElement('style');
    style.innerHTML = '@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }';
    document.head.appendChild(style);
  }
  loader.style.display = 'flex';
}

function hideLoader() {
  const loader = document.getElementById('global-loader');
  if (loader) loader.style.display = 'none';
} 