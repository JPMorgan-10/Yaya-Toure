const products = [
	{ id: "soft-touch-case", name: "Soft Touch Case", subtitle: "Everyday protection, made lovely", category: "Cases", price: 32, rating: 4.9, reviews: 128, badge: "Bestseller", image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=720&q=82", color: "Soft coral" },
	{ id: "clear-day-case", name: "Clear Day Case", subtitle: "Crystal clear. Yellowing never.", category: "Cases", price: 28, rating: 4.8, reviews: 86, badge: "A good classic", image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=720&q=82", color: "Crystal clear" },
	{ id: "everyday-charger", name: "Everyday Charger", subtitle: "A little power, right where you need it", category: "Charging", price: 38, rating: 4.9, reviews: 74, badge: "Good things", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=720&q=82", color: "Olive" },
	{ id: "soft-loop-cable", name: "Soft Loop Cable", subtitle: "Tangle-free, 6 feet of happy", category: "Cables", price: 18, rating: 4.7, reviews: 62, badge: "New color", image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=720&q=82", color: "Clay" },
	{ id: "glass-kind", name: "Glass, Kindly", subtitle: "Invisible screen protection", category: "Screen protectors", price: 22, rating: 4.8, reviews: 109, badge: "Easy to fit", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=720&q=82", color: "Clear" },
	{ id: "pocket-buds", name: "Pocket Buds", subtitle: "Little buds. Big listening energy.", category: "Audio", price: 48, rating: 4.9, reviews: 91, badge: "People's pick", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=720&q=82", color: "Cream" },
	{ id: "power-on", name: "Power On, Anywhere", subtitle: "A lighter kind of power bank", category: "Charging", price: 46, rating: 4.7, reviews: 53, badge: "Travel ready", image: "https://images.unsplash.com/photo-1609592806596-b43bada2f6d2?auto=format&fit=crop&w=720&q=82", color: "Stone" },
	{ id: "weekend-case", name: "The Weekend Case", subtitle: "A little extra grip for big days", category: "Cases", price: 36, rating: 4.8, reviews: 47, badge: "Just right", image: "https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=720&q=82", color: "Citrus" },
	{ id: "daily-cable", name: "Daily Driver Cable", subtitle: "Braided to last, lovely to look at", category: "Cables", price: 16, rating: 4.6, reviews: 41, badge: "Small favorite", image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=720&q=82", color: "Moss" },
	{ id: "screen-kindly", name: "Screen, Kindly", subtitle: "A second layer of peace of mind", category: "Screen protectors", price: 19, rating: 4.7, reviews: 58, badge: "Easy to fit", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=720&q=82", color: "Clear" },
	{ id: "over-ear", name: "Soft Sound Headphones", subtitle: "A quieter corner, wherever you are", category: "Audio", price: 72, rating: 4.9, reviews: 39, badge: "Good sound", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=720&q=82", color: "Forest" },
	{ id: "everyday-case", name: "The Everyday Case", subtitle: "A just-right fit for daily life", category: "Cases", price: 30, rating: 4.8, reviews: 68, badge: "A favorite", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=720&q=82", color: "Sky" }
];

const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#product-search");
const sortSelect = document.querySelector("#product-sort");
const resultsStatus = document.querySelector("#results-status");
const emptyState = document.querySelector("#empty-state");
const cartPanel = document.querySelector("#cart-panel");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartFooter = document.querySelector("#cart-footer");
const overlay = document.querySelector("#overlay");
const toast = document.querySelector("#toast");
const cart = new Map();
const favorites = new Set();
let activeCategory = "All";
let toastTimer;
let returnFocus;

function renderProducts() {
	const query = searchInput.value.trim().toLowerCase();
	let visibleProducts = products.filter((product) => {
		const matchesCategory = activeCategory === "All" || product.category === activeCategory;
		const matchesSearch = `${product.name} ${product.subtitle} ${product.category} ${product.color}`.toLowerCase().includes(query);
		return matchesCategory && matchesSearch;
	});

	if (sortSelect.value === "price-low") visibleProducts.sort((a, b) => a.price - b.price);
	if (sortSelect.value === "price-high") visibleProducts.sort((a, b) => b.price - a.price);
	if (sortSelect.value === "rating") visibleProducts.sort((a, b) => b.rating - a.rating);

	productGrid.innerHTML = visibleProducts.map((product, index) => `
		<article class="product-card" style="animation-delay:${Math.min(index, 7) * 35}ms">
			<div class="product-visual">
				<img src="${product.image}" alt="${product.name} in ${product.color}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=720&q=82'">
				<span class="product-badge">${product.badge}</span>
				<button class="product-heart ${favorites.has(product.id) ? "is-favorite" : ""}" type="button" data-favorite="${product.id}" aria-label="${favorites.has(product.id) ? "Remove" : "Add"} ${product.name} ${favorites.has(product.id) ? "from" : "to"} favorites" aria-pressed="${favorites.has(product.id)}">${favorites.has(product.id) ? "♥" : "♡"}</button>
			</div>
			<div class="product-meta"><h3 class="product-name">${product.name}</h3><span class="product-rating" aria-label="Rated ${product.rating} out of 5 stars">★ ${product.rating}<span>(${product.reviews})</span></span></div>
			<p class="product-subtitle">${product.subtitle}</p>
			<div class="product-buy-row"><span class="product-price">$${product.price.toFixed(2)}</span><button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name} to bag">Add to bag <span aria-hidden="true">+</span></button></div>
		</article>`).join("");

	productGrid.hidden = visibleProducts.length === 0;
	emptyState.hidden = visibleProducts.length !== 0;
	resultsStatus.textContent = `${visibleProducts.length} good ${visibleProducts.length === 1 ? "thing" : "things"} to choose from`;
}

function setCategory(category) {
	activeCategory = category;
	document.querySelectorAll(".filter-tab").forEach((tab) => {
		const selected = tab.dataset.filter === category;
		tab.classList.toggle("is-active", selected);
		tab.setAttribute("aria-pressed", String(selected));
	});
	renderProducts();
}

function renderCart() {
	const entries = [...cart.entries()];
	const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
	const subtotal = entries.reduce((sum, [id, quantity]) => sum + products.find((product) => product.id === id).price * quantity, 0);
	document.querySelectorAll(".cart-count").forEach((count) => { count.textContent = itemCount; });
	document.querySelector(".cart-trigger").setAttribute("aria-label", `Open shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`);
	document.querySelector(".cart-title-count").textContent = `(${itemCount})`;
	document.querySelector("#cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;

	cartItems.innerHTML = entries.map(([id, quantity]) => {
		const product = products.find((item) => item.id === id);
		return `<article class="cart-item">
			<img class="cart-item-image" src="${product.image}" alt="" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=720&q=82'">
			<div class="cart-item-details"><span class="cart-item-name">${product.name}</span><span class="cart-item-description">${product.color}</span><div class="quantity-control" aria-label="Quantity for ${product.name}"><button type="button" data-quantity="${id}" data-change="-1" aria-label="Decrease ${product.name} quantity">−</button><span>${quantity}</span><button type="button" data-quantity="${id}" data-change="1" aria-label="Increase ${product.name} quantity">+</button></div></div>
			<div class="cart-item-end"><span class="cart-item-price">$${(product.price * quantity).toFixed(2)}</span><button class="remove-item" type="button" data-remove="${id}">Remove</button></div>
		</article>`;
	}).join("");

	cartEmpty.classList.toggle("is-visible", itemCount === 0);
	cartFooter.classList.toggle("is-hidden", itemCount === 0);
	const shippingRemaining = Math.max(0, 50 - subtotal);
	document.querySelector(".shipping-remaining").textContent = shippingRemaining > 0 ? `$${shippingRemaining.toFixed(2)}` : "all set";
	document.querySelector(".shipping-progress > span:first-child").innerHTML = shippingRemaining > 0 ? `You're <strong class="shipping-remaining">$${shippingRemaining.toFixed(2)}</strong> away from free shipping` : "You've got free shipping. Nice one!";
	document.querySelector(".shipping-track i").style.width = `${Math.min(subtotal / 50, 1) * 100}%`;
}

function openCart() {
	returnFocus = document.activeElement;
	overlay.hidden = false;
	cartPanel.inert = false;
	cartPanel.setAttribute("aria-hidden", "false");
	document.body.classList.add("panel-open");
	requestAnimationFrame(() => {
		overlay.classList.add("is-visible");
		cartPanel.classList.add("is-open");
		cartPanel.querySelector(".cart-close").focus();
	});
}

function closeCart() {
	overlay.classList.remove("is-visible");
	cartPanel.classList.remove("is-open");
	cartPanel.setAttribute("aria-hidden", "true");
	cartPanel.inert = true;
	document.body.classList.remove("panel-open");
	window.setTimeout(() => { overlay.hidden = true; }, 250);
	if (returnFocus instanceof HTMLElement) returnFocus.focus();
}

function showToast(message) {
	window.clearTimeout(toastTimer);
	toast.textContent = message;
	toast.classList.add("is-visible");
	toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

document.querySelector(".filter-tabs").addEventListener("click", (event) => {
	const button = event.target.closest("[data-filter]");
	if (button) setCategory(button.dataset.filter);
});

document.querySelector(".category-list").addEventListener("click", (event) => {
	const button = event.target.closest("[data-category]");
	if (!button) return;
	setCategory(button.dataset.category);
	document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll("[data-nav-category], [data-footer-category]").forEach((link) => {
	link.addEventListener("click", () => {
		setCategory(link.dataset.navCategory || link.dataset.footerCategory);
		document.querySelector(".main-nav").classList.remove("is-open");
		document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
	});
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
document.querySelector(".clear-filters").addEventListener("click", () => {
	searchInput.value = "";
	sortSelect.value = "featured";
	setCategory("All");
});
document.querySelector(".search-toggle").addEventListener("click", () => {
	document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
	window.setTimeout(() => searchInput.focus(), 450);
});

productGrid.addEventListener("click", (event) => {
	const addButton = event.target.closest("[data-add]");
	const favoriteButton = event.target.closest("[data-favorite]");
	if (addButton) {
		const product = products.find((item) => item.id === addButton.dataset.add);
		cart.set(product.id, (cart.get(product.id) || 0) + 1);
		renderCart();
		showToast(`${product.name} added to your bag`);
	}
	if (favoriteButton) {
		const id = favoriteButton.dataset.favorite;
		favorites.has(id) ? favorites.delete(id) : favorites.add(id);
		renderProducts();
	}
});

cartItems.addEventListener("click", (event) => {
	const quantityButton = event.target.closest("[data-quantity]");
	const removeButton = event.target.closest("[data-remove]");
	if (quantityButton) {
		const id = quantityButton.dataset.quantity;
		const quantity = cart.get(id) + Number(quantityButton.dataset.change);
		quantity > 0 ? cart.set(id, quantity) : cart.delete(id);
		renderCart();
	}
	if (removeButton) {
		cart.delete(removeButton.dataset.remove);
		renderCart();
	}
});

document.querySelector(".cart-trigger").addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", closeCart);
document.querySelector(".continue-shopping").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && cartPanel.classList.contains("is-open")) closeCart();
});

document.querySelector(".checkout-button").addEventListener("click", () => showToast("Checkout is ready for your shop setup."));

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
	event.preventDefault();
	const email = document.querySelector("#newsletter-email");
	if (!email.reportValidity()) return;
	document.querySelector("#newsletter-feedback").textContent = "You're on the list. Check your inbox for something good.";
	email.value = "";
});

document.querySelector(".review-next").addEventListener("click", () => {
	const heading = document.querySelector(".review-copy h2");
	const quote = heading.textContent.startsWith("“It feels")
		? { text: "“The little details make such a difference. I finally stopped borrowing everyone's charger.”", author: "— Morgan L." }
		: { text: "“It feels like someone actually thought about how I use my phone.”", author: "— Jamie R." };
	heading.textContent = quote.text;
	document.querySelector(".review-author").firstChild.textContent = `${quote.author} `;
});

document.querySelector(".menu-toggle").addEventListener("click", (event) => {
	const menu = document.querySelector(".main-nav");
	const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
	event.currentTarget.setAttribute("aria-expanded", String(!expanded));
	menu.classList.toggle("is-open", !expanded);
});

document.querySelector(".filter-total").textContent = products.length;
renderCart();
renderProducts();
