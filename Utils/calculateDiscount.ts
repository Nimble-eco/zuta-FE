export const calculateDiscount = (discount: number, amount: number) => {
    return Number(((discount/100) * amount).toFixed(2));
}

export const calculateNextDiscount = (step: number, discount: number, amount: number) => {
    return Number((((discount/step)/100) * amount).toFixed(2));
}