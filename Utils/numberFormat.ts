export const numberFormat = (val: any) =>
  Number.isInteger(val) ? val : val.toFixed(2);
