import { addToCart } from '../lib/cart';
import { refreshCart } from './cart';

export const handleAddToCart = async (productId: string, quantity: number = 1) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        window.location.href = '/auth';
        return;
    }

    try {
        await addToCart(productId, quantity);
        await refreshCart();

        showNotification('محصول با موفقیت به سبد خرید اضافه شد', 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('خطا در افزودن به سبد خرید', 'error');
    }
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

if (typeof window !== 'undefined') {
    (window as any).handleAddToCart = handleAddToCart;
}
