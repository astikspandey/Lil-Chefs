// Navigation handling
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(page).classList.add('active');
                history.pushState(null, null, `#${page}`);
            });
        });

        // Initial page load
        window.addEventListener('load', () => {
            const hash = window.location.hash.substring(1);
            const validPages = ['our-story', 'menu', 'active-days'];
            const defaultPage = validPages.includes(hash) ? hash : 'our-story';
            
            document.querySelector(`[data-page="${defaultPage}"]`).classList.add('active');
            document.getElementById(defaultPage).classList.add('active');
        });

        // Cart functionality
        let cart = [];
        
        function addToCart(itemName, price) {
            const existingItem = cart.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: itemName, price: price, quantity: 1 });
            }
            updateCartDisplay();
        }

        function adjustQuantity(index, change) {
            cart[index].quantity += change;
            if (cart[index].quantity < 1) {
                cart.splice(index, 1);
            }
            updateCartDisplay();
        }

        function removeItem(index) {
            cart.splice(index, 1);
            updateCartDisplay();
        }

        function updateCartDisplay() {
            const cartItems = document.getElementById('cartItems');
            const cartCount = document.getElementById('cartCount');
            const cartTotal = document.getElementById('cartTotal');
            
            if (cartItems && cartCount && cartTotal) {
                cartItems.innerHTML = '';
                let total = 0;
                
                cart.forEach((item, index) => {
                    total += item.price * item.quantity;
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'cart-item';
                    itemDiv.innerHTML = `
                        <div style="flex-grow: 1;">
                            <div>${item.name}</div>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="adjustQuantity(${index}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn" onclick="adjustQuantity(${index}, 1)">+</button>
                                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                            </div>
                        </div>
                        <div>₹${(item.price * item.quantity).toFixed(2)}</div>
                    `;
                    cartItems.appendChild(itemDiv);
                });

                cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartTotal.textContent = total.toFixed(2);
            }
        }

        function toggleCart() {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.classList.toggle('active');
            }
        }

        function sendOrder() {
            const orderDetails = cart.map(item => 
                `${item.quantity}x ${item.name} - ₹${(item.price * item.quantity).toFixed(2)}`
            ).join('\n');

            const subject = encodeURIComponent('Little Chefs Order');
            const body = encodeURIComponent(
                `Order Details:\n${orderDetails}\n\nTotal: ₹${document.getElementById('cartTotal').textContent}`
            );

            window.open(`mailto:lumerskywalker@gmail.com?subject=${subject}&body=${body}`, '_blank');
            
            cart = [];
            updateCartDisplay();
            toggleCart();
        }
