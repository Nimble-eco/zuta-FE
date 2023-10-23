export const formatAmount = (number: number | string, currency: string='NGN') => {
    const options = {style: 'currency', currency: currency};
    const amount = number?.toLocaleString('en-US', options);
    return amount?.replace('.00', '')
}