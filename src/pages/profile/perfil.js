const passwordLine = document.getElementById('password-line');
const passwordOffline = document.getElementById('password-offline');

passwordOffline.style.display = 'none';

function goTo(screen){
  if (!screen) return;
  document.getElementById('screen-perfil').classList.remove('active');
  document.getElementById('screen-editar').classList.remove('active');
  const target = document.getElementById('screen-' + screen);
  if (target) target.classList.add('active');
}

function showToast(msg){
  const active = document.querySelector('.screen.active');
  const toast = active.querySelector('.toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(()=> toast.classList.remove('show'), 1800);
}

function togglePw(){
  if (passwordOffline.style.display === 'none') {
    passwordOffline.style.display = 'block';
    passwordLine.style.display = 'none';
  } else {
    passwordOffline.style.display = 'none';
    passwordLine.style.display = 'block';
  }

  const input = document.getElementById('senha');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function saveProfile(){
  const btn = document.getElementById('save-btn');
  const original = btn.textContent;
  btn.textContent = 'Salvo ✓';
  btn.classList.add('saved');
  showToast('Perfil atualizado com sucesso');
  setTimeout(()=>{
    btn.textContent = original;
    btn.classList.remove('saved');
  }, 1600);
}