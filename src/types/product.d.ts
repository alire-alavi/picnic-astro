export type Image = {
    url: string,
    alt?: string,
}

export type Product = {
    id: string,
    image: Image,
    name?: string,
    price?: string,
    discountPrice?: string,
    discount?: string,
    url: string,
    slug?: string,
    startDate?: string,
    expireDate?: string,
}