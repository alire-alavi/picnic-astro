// Global type definitions for cart functionality

declare global {
    interface Window {
        handleAddToCart: (productId: string, quantity?: number) => Promise<void>;
    }
}

export { };
