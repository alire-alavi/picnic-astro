import type { Product } from "./product"

export type Offer = {
    id: string | number,
    title: string,
    url: string,
    discount?: string,
    cta: string,
    products?: Product[],
}