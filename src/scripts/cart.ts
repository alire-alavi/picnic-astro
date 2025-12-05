import { getCart, getCartItemCount, getCartTotal, formatPrice, removeFromCart, type Cart } from '../lib/cart';

let currentCart: Cart | null = null;

const updateCartUI = (cart: Cart | null) => {
    currentCart = cart;
    const itemCount = getCartItemCount(cart);
    const total = getCartTotal(cart);

    const badges = document.querySelectorAll('[data-cart-badge]');
    badges.forEach(badge => {
        badge.textContent = itemCount.toString();
        if (itemCount === 0) {
            badge.classList.add('hidden');
        } else {
            badge.classList.remove('hidden');
        }
    });

    const itemCountElements = document.querySelectorAll('[data-cart-count]');
    itemCountElements.forEach(el => {
        el.textContent = `${itemCount} مورد`;
    });

    const totalElements = document.querySelectorAll('[data-cart-total]');
    totalElements.forEach(el => {
        el.innerHTML = `
            <span class="text-lg font-bold">${formatPrice(total)}</span>
            <span class="text-sm">تومان</span>
        `;
    });

    const cartItemsContainer = document.querySelector('[data-cart-items]');
    if (cartItemsContainer && cart?.orderItems) {
        if (cart.orderItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center py-8 text-text/60">
                    <div class="i-lucide-shopping-cart h-16 w-16 mb-4"></div>
                    <p>سبد خرید شما خالی است</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cart.orderItems.map(item => {
                const thumbnailUrl = item.item.thumbnail?.sm || item.item.thumbnail?.url || '/src/assets/images/product-1.webp';
                const altText = item.item.thumbnail?.altText || item.item.name;

                return `
                    <li class="flex gap-x-3 pb-5 pt-8">
                        <div class="relative min-w-fit">
                            <button
                                data-remove-item="${item.item.id}"
                                class="absolute -top-2 right-0 rounded-lg border bg-muted duration-200 hover:bg-background p-1"
                            >
                                <span class="i-lucide-x h-4 w-4 text-warning"></span>
                            </button>
                            <a href="/products/${item.item.slug}">
                                <img
                                    src="${thumbnailUrl}"
                                    alt="${altText}"
                                    class="h-20 w-20 rounded-lg object-cover"
                                />
                            </a>
                        </div>
                        <div class="flex w-full flex-col">
                            <a href="/products/${item.item.slug}" class="line-clamp-2 h-10">
                                ${item.item.name}
                            </a>
                            <div class="flex items-center justify-between pt-3 text-text/80">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm">تعداد:</span>
                                    <span class="font-bold">${item.quantity}</span>
                                </div>
                                <div class="flex items-center gap-1 text-primary">
                                    <span class="font-bold">${formatPrice(parseFloat(item.price))}</span>
                                    <span class="text-xs">تومان</span>
                                </div>
                            </div>
                        </div>
                    </li>
                `;
            }).join('');

            attachRemoveHandlers();
        }
    }
};

const attachRemoveHandlers = () => {
    const removeButtons = document.querySelectorAll('[data-remove-item]');
    removeButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = (button as HTMLElement).getAttribute('data-remove-item');
            if (!productId) return;

            try {
                await removeFromCart(productId);
                await refreshCart();
                showNotification('محصول از سبد خرید حذف شد', 'success');
            } catch (error) {
                console.error('Failed to remove item from cart:', error);
                showNotification('خطا در حذف محصول از سبد خرید', 'error');
            }
        });
    });
};

const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-success text-white' : 'bg-warning text-white'
        } transition-all duration-300`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
};

export const initializeCart = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        updateCartUI(null);
        return;
    }

    try {
        const cart = await getCart();
        updateCartUI(cart);
    } catch (error) {
        console.error('Failed to initialize cart:', error);
        updateCartUI(null);
    }
};

export const refreshCart = async () => {
    await initializeCart();
};

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeCart();
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'accessToken') {
            initializeCart();
        }
    });
}
