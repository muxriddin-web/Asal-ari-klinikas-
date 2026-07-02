// Dark/Light toggle funksiyasi (O'zgartirilmagan qism)
const themeBtn = document.getElementById('theme-btn');

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    if (themeBtn) themeBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    if (themeBtn) themeBtn.textContent = '🌙';
  }
}

function toggleTheme() {
  const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
}

if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
});


// Contact js code //////////////////////////
let lastSubmit = 0;

const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", function(e){

    e.preventDefault();

    let now = Date.now();

    if(now - lastSubmit < 10000){
      alert("Iltimos 10 sekund kuting ⏳");
      return;
    }

    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let date = document.getElementById("date").value;
    let service = document.getElementById("service").value;

    let phoneRegex = /^\+998\d{9}$/;

    if(!phoneRegex.test(phone)){
      alert("Telefon raqamni +998 bilan to'g'ri kiriting");
      return;
    }

    if(name.length < 3){
      alert("Ism juda qisqa");
      return;
    }

    // Backend endpointga so'rov yuborish (Xavfsiz usul)
    fetch('/api/booking', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        date: date,
        service: service
      })
    })
    .then(res => {
      if(res.ok) {
        alert("So'rov yuborildi ✅");
        document.getElementById("bookingForm").reset();
        lastSubmit = now;
      } else {
        alert("Xatolik yuz berdi ❌");
      }
    })
    .catch(error => {
      alert("Xatolik yuz berdi ❌");
    });

  });
}