let allProducts = [];

/* =========================
   LOAD DATA KATALOG
========================= */
fetch("catalog.json")
  .then(response => response.json())
  .then(data => {
    allProducts = data;
    renderProducts(allProducts);
  })
  .catch(error => console.error("Error loading catalog:", error));


/* =========================
   RENDER PRODUK
========================= */
function renderProducts(products){
  const grid = document.querySelector(".grid");
  grid.innerHTML = "";

  products.forEach(item => {
    grid.innerHTML += `
      <div class="card">
        <img src="assets/images/${item.image}" alt="${item.name}">
        <div class="card-body">
          <h4 class="card-title">${item.name}</h4>
          <p class="card-desc">${item.desc}</p>
          <div class="card-price">${item.priceText}</div>

          <button class="btn" onclick="addToCart('${item.id}')">
            Tambah ke Keranjang
          </button>

        </div>
      </div>
    `;
  });
}



/* =========================
   FILTER KATEGORI
========================= */
document.querySelectorAll(".cat-btn").forEach(button => {
  button.addEventListener("click", () => {

    // aktifkan tombol
    document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.category;

    if(category === "all"){
      renderProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter(
        product => product.category === category
      );
      renderProducts(filteredProducts);
    }
  });
});
let cart = [];

/* =========================
   ADD TO CART
========================= */
function addToCart(productId){
  const product = allProducts.find(p => p.id === productId);

  const existing = cart.find(item => item.id === productId);
  if(existing){
    existing.qty += 1;
  } else {
    cart.push({
      ...product,
      qty: 1,
      note: ""
    });
  }

  updateCartCount();
  showNotification(product.name);
}

function updateCartCount(){
  document.getElementById("cartCount").innerText =
    cart.reduce((sum, item) => sum + item.qty, 0);
}

/* =========================
   NOTIFICATION
========================= */
function showNotification(productName){
  const notif = document.createElement("div");
  notif.className = "notif";
  notif.innerText = `✔ ${productName} ditambahkan ke keranjang`;
  document.body.appendChild(notif);

  setTimeout(() => notif.remove(), 2500);
}
document.getElementById("cartBtn").onclick = toggleCart;

function toggleCart(){
  document.getElementById("cartModal").classList.toggle("hidden");
  renderCart();
}

function renderCart(){
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  if(cart.length === 0){
    container.innerHTML = "<p>Keranjang masih kosong</p>";
    updateCartCount();
    return;
  }

  cart.forEach((item, index) => {
    container.innerHTML += `
      <div class="cart-item">
        <img src="assets/images/${item.image}" class="cart-img">

        <div class="cart-info">
          <strong>${item.name}</strong>

          <div class="qty-control">
            <button onclick="changeQty(${index}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>

          <textarea 
            placeholder="Pesan custom..."
            onchange="cart[${index}].note = this.value"
          >${item.note || ""}</textarea>

          <button class="remove-btn" onclick="removeItem(${index})">
            Hapus
          </button>
        </div>
      </div>
      <hr>
    `;
  });

  updateCartCount();
}

function checkout(){
  if(cart.length === 0){
    alert("Keranjang masih kosong");
    return;
  }

  let message = "Halo Pooly Bloom, saya ingin memesan:\n\n";

  cart.forEach(item => {
    message += `• ${item.name}\n`;
    message += `  Jumlah: ${item.qty}\n`;
    if(item.note){
      message += `  Catatan: ${item.note}\n`;
    }
    message += "\n";
  });

  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "62895352962123"; // GANTI NOMOR WA

  window.open(
    `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
    "_blank"
  );
}
function changeQty(index, change){
  cart[index].qty += change;
  if(cart[index].qty <= 0){
    cart.splice(index, 1);
  }
  renderCart();
}

function removeItem(index){
  cart.splice(index, 1);
  renderCart();
}
