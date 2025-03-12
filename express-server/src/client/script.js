const socket = io();
const updatesList = document.getElementById('updates');

socket.on('update', (data) => {
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>${new Date(data.timestamp).toLocaleTimeString()}:</strong>
    ${data.message}
  `;
  updatesList.appendChild(li);
  
  // Auto-scroll to bottom
  window.scrollTo(0, document.body.scrollHeight);
});