export const formatAmount = (number: number | string) => {
    const options = {style: 'currency', currency: 'NGN'};
    const amount = number?.toLocaleString('en-US', options);
    return amount?.replace('.00', '')
}