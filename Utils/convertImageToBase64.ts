
export const convertToBase64 = (blob: any): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        return resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
};