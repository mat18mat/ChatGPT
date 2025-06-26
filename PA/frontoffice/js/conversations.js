// frontoffice/js/conversations.js

// Sécurité : rediriger si non connecté
if (!AuthService.isAuthenticated()) {
  window.location.href = 'login.html';
}

const currentUser = AuthService.getCurrentUser();
const token = localStorage.getItem('token');
let currentConvId = null;

// Charger la liste des conversations
async function loadConversations() {
  const list = document.getElementById('conversations-list');
  list.innerHTML = '<div class="text-gray-400 text-center py-8">Chargement...</div>';
  try {
    const res = await fetch(`/api/conversations/user/${currentUser.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur API');
    const conversations = await res.json();
    if (!conversations.length) {
      list.innerHTML = '<div class="text-gray-400 text-center py-8">Aucune conversation</div>';
      return;
    }
    list.innerHTML = '';
    conversations.forEach(conv => {
      list.innerHTML += renderConversationItem(conv);
    });
    // Sélection
    list.querySelectorAll('.conv-item').forEach(item => {
      item.addEventListener('click', () => {
        selectConversation(item.dataset.id, item.dataset.name, item.dataset.role, item.dataset.avatar);
      });
    });
  } catch (err) {
    list.innerHTML = '<div class="text-danger text-center py-8">Erreur lors du chargement</div>';
  }
}

function renderConversationItem(conv) {
  return `<div class="conv-item flex items-center space-x-3 p-3 rounded-xl cursor-pointer hover:bg-primary/10 transition"
    data-id="${conv.id}" data-name="${conv.nom}" data-role="${conv.role}" data-avatar="${conv.avatar || ''}">
    <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg">
      ${conv.avatar ? `<img src="${conv.avatar}" class="w-10 h-10 rounded-full">` : `<i class="fas fa-user"></i>`}
    </div>
    <div class="flex-1">
      <div class="font-semibold text-gray-900">${conv.nom}</div>
      <div class="text-xs text-gray-500 truncate">${conv.lastMessage || ''}</div>
    </div>
    <div class="text-xs text-gray-400">${conv.lastDate ? formatDate(conv.lastDate) : ''}</div>
  </div>`;
}

// Sélection d'une conversation
function selectConversation(id, name, role, avatar) {
  currentConvId = id;
  document.getElementById('conv-user-name').textContent = name;
  document.getElementById('conv-user-role').textContent = role || '';
  document.getElementById('conv-user-avatar').innerHTML = avatar ? `<img src="${avatar}" class="w-10 h-10 rounded-full">` : '<i class="fas fa-user"></i>';
  loadMessages(id);
}

// Charger les messages d'une conversation
async function loadMessages(convId) {
  const list = document.getElementById('messages-list');
  list.innerHTML = '<div class="text-gray-400 text-center py-8">Chargement...</div>';
  try {
    const res = await fetch(`/api/conversations/${convId}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur API');
    const messages = await res.json();
    if (!messages.length) {
      list.innerHTML = '<div class="text-gray-400 text-center py-8">Aucun message</div>';
      return;
    }
    list.innerHTML = '';
    messages.forEach(msg => {
      list.innerHTML += renderMessageItem(msg);
    });
    // Scroll en bas
    list.scrollTop = list.scrollHeight;
  } catch (err) {
    list.innerHTML = '<div class="text-danger text-center py-8">Erreur lors du chargement</div>';
  }
}

function renderMessageItem(msg) {
  const isMe = msg.senderId === currentUser.id;
  return `<div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
    <div class="max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow ${isMe ? 'bg-primary text-white' : 'bg-gray-200 text-gray-900'}">
      <div class="text-sm">${msg.content}</div>
      <div class="text-xs mt-1 ${isMe ? 'text-indigo-100' : 'text-gray-500'}">${formatDate(msg.date)}</div>
    </div>
  </div>`;
}

// Envoi d'un message
const form = document.getElementById('send-message-form');
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const input = document.getElementById('message-input');
  const content = input.value.trim();
  if (!content || !currentConvId) return;
  try {
    await fetch(`/api/conversations/${currentConvId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    input.value = '';
    loadMessages(currentConvId);
  } catch (err) {
    alert('Erreur lors de l\'envoi du message');
  }
});

document.getElementById('refresh-conv').addEventListener('click', loadConversations);

// Format date utilitaire
function formatDate(date) {
  return new Date(date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// Initialisation
loadConversations(); 