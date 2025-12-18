let activeCategory = 'all';
let searchText = '';
let cart = [];

// ------------------- Фильтры -------------------
function filterProducts(category, button) {
    activeCategory = category;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    applyFilters();
}

function searchProducts(text) {
    searchText = text.toLowerCase();
    applyFilters();
}

function applyFilters() {
    document.querySelectorAll('.card').forEach(card => {
        const category = card.dataset.category;
        const title = card.querySelector('h2').textContent.toLowerCase();
        card.style.display = (activeCategory === 'all' || category === activeCategory) && title.includes(searchText) ? 'flex' : 'none';
    });
}

// ------------------- Корзина -------------------
function addToCart(name, price, button) {
    cart.push({ name, price });
    updateCart();
    flyToCart(button.closest('.card').querySelector('img'));
    playCartSound();
    jumpCartCounter();
}

function updateCart() {
    const list = document.getElementById('cart-items');
    const count = document.getElementById('cart-count');
    const total = document.getElementById('cart-total');

    list.innerHTML = '';
    let sum = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} — ${item.price} ₽ <button onclick="removeFromCart(${index})">×</button>`;
        list.appendChild(li);
        sum += item.price;
    });

    count.textContent = cart.length;
    total.textContent = `Итого: ${sum} ₽`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.classList.toggle('show');
}

function clearCart() {
    cart = [];
    updateCart();
}

// ------------------- Модалка заказа -------------------
function openOrder() {
    document.getElementById('orderModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeOrder() {
    document.getElementById('orderModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// ------------------- Отправка заказа в Telegram -------------------
function sendOrder() {
    const contact = document.getElementById('contact').value;
    const address = document.getElementById('address').value;

    if (!contact || !address) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    // --- Настройки Telegram ---
    const token = '8570588089:AAGFz0T1cuOm1XlXfsI6RE5g5nhwtNbf4hE';      // вставьте токен бота
    const chat_id = -4995539849;           // chat_id группы, обязательно число, отрицательное

    // Формируем текст сообщения
    let text = '📦 Новый заказ:\n';
    text += `Контакт: ${contact}\nАдрес: ${address}\nТовары:\n`;
    cart.forEach(item => {
        text += `- ${item.name} — ${item.price} ₽\n`;
    });

    // Отправка в Telegram
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat_id, text: text })
    })
    .then(res => res.json())
    .then(data => console.log('Сообщение отправлено в Telegram', data))
    .catch(err => {
        console.error('Ошибка отправки в Telegram', err);
        alert('Ошибка при отправке заказа. Попробуйте позже.');
    });

    alert('Заказ отправлен!');
    closeOrder();
    clearCart();
}

// ------------------- Анимация и звук -------------------
function flyToCart(img) {
    const flyingImg = img.cloneNode(true);
    flyingImg.classList.add('flying-img');
    document.body.appendChild(flyingImg);

    const imgRect = img.getBoundingClientRect();
    flyingImg.style.top = imgRect.top + 'px';
    flyingImg.style.left = imgRect.left + 'px';

    const cartBtn = document.getElementById('cart-btn');
    const cartRect = cartBtn.getBoundingClientRect();

    setTimeout(() => {
        flyingImg.style.transform = `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) scale(0.1)`;
        flyingImg.style.opacity = '0';
    }, 10);

    flyingImg.addEventListener('transitionend', () => flyingImg.remove());
}

function playCartSound() {
    const audio = document.getElementById('cart-sound');
    audio.currentTime = 0;
    audio.play();
}

function jumpCartCounter() {
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.classList.add('jump');
    setTimeout(() => cartBtn.classList.remove('jump'), 300);
}