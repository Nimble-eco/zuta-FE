var crypto = require("crypto");

const generateRandomKey = (number: number ): string => {
    return crypto.randomBytes(number).toString('hex');
}

export default generateRandomKey;