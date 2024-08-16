export const calculateRatio = (value: number, total: number) =>`${(value/100) * total} %`;

const cutText = (text: string, length: number) => {
	if (text.split(' ').length > 1) {
		const string = text.substring(0, length);
		const splitText = string.split(' ');
		splitText.pop();
		return splitText.join(' ') + '...';
	} else {
		return text;
	}
};

const capitalizeFirstLetter = (string: string) => {
	if (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	} else {
		return '';
	}
};

const onlyNumber = (string: string) => {
	if (string) {
		return string.replace(/\D/g, '');
	} else {
		return '';
	}
};

const formatCurrency = (number: number) => {
	if (number) {
		const formattedNumber = number.toString().replace(/\D/g, '');
		const rest = formattedNumber.length % 3;
		let currency = formattedNumber.substr(0, rest);
		const thousand = formattedNumber.substr(rest).match(/\d{3}/g);
		let separator;

		if (thousand) {
			separator = rest ? '.' : '';
			currency += separator + thousand.join('.');
		}

		return currency;
	} else {
		return '';
	}
};

const isset = (obj: object | string) => {
	if (obj !== null && obj !== undefined) {
		if (typeof obj === 'object' || Array.isArray(obj)) {
			return Object.keys(obj).length;
		} else {
			return obj.toString().length;
		}
	}

	return false;
};

const toRaw = (obj: object) => {
	return JSON.parse(JSON.stringify(obj));
};

const randomNumbers = (from: number, to: number, length: number) => {
	const numbers = [0];
	for (let i = 1; i < length; i++) {
		numbers.push(Math.ceil(Math.random() * (from - to) + to));
	}

	return numbers;
};


const stringToHTML = (arg: string) => {
	const parser = new DOMParser(),
		DOM = parser.parseFromString(arg, 'text/html');
	return DOM.body.childNodes[0] as HTMLElement;
};

const slideUp = (el: HTMLElement, duration = 300, callback?: Function) => {
	el.style.transitionProperty = 'height, margin, padding';
	el.style.transitionDuration = duration + 'ms';
	el.style.height = el.offsetHeight + 'px';
	el.offsetHeight;
	el.style.overflow = 'hidden';
	el.style.height = '0';
	el.style.paddingTop = '0';
	el.style.paddingBottom = '0';
	el.style.marginTop = '0';
	el.style.marginBottom = '0';
	window.setTimeout(() => {
		el.style.display = 'none';
		el.style.removeProperty('height');
		el.style.removeProperty('padding-top');
		el.style.removeProperty('padding-bottom');
		el.style.removeProperty('margin-top');
		el.style.removeProperty('margin-bottom');
		el.style.removeProperty('overflow');
		el.style.removeProperty('transition-duration');
		el.style.removeProperty('transition-property');
		if (callback) {
			callback(el);
		}
	}, duration);
};

const slideDown = (el: HTMLElement, duration = 300, callback?: Function) => {
	el.style.removeProperty('display');
	let display = window.getComputedStyle(el).display;
	if (display === 'none') display = 'block';
	el.style.display = display;
	const height = el.offsetHeight;
	el.style.overflow = 'hidden';
	el.style.height = '0';
	el.style.paddingTop = '0';
	el.style.paddingBottom = '0';
	el.style.marginTop = '0';
	el.style.marginBottom = '0';
	el.offsetHeight;
	el.style.transitionProperty = 'height, margin, padding';
	el.style.transitionDuration = duration + 'ms';
	el.style.height = height + 'px';
	el.style.removeProperty('padding-top');
	el.style.removeProperty('padding-bottom');
	el.style.removeProperty('margin-top');
	el.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		el.style.removeProperty('height');
		el.style.removeProperty('overflow');
		el.style.removeProperty('transition-duration');
		el.style.removeProperty('transition-property');
		if (callback) {
			callback(el);
		}
	}, duration);
};

function hasEmptyValues(obj: any) {
	for (const key of Object.keys(obj)) {
		const value = obj[key];
		if (
			value === '' ||
			value === null ||
			value === undefined ||
			(Array.isArray(value) && value.length === 0)
		) {
			return true;
		}
	}
	return false;
}

function createObjectWithTruthyValues(keyValuePairs: Object) {
	const result: any = {};
	for (const [key, value] of Object.entries(keyValuePairs)) {
		if (value) {
			result[key] = value;
		}
	}
	return result;
}

function formatDateTime(dateTimeString: string): string {
	const date = new Date(dateTimeString);
	const options: Intl.DateTimeFormatOptions = {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	};
	return date.toLocaleString('en-US', options);
}

function toIntNumberFormat(value: number) {
	return Intl.NumberFormat('en-US').format(Math.round(value ?? 0));
}

function toIntNumberFormatWithoutRoundingUp(value: number) {
	return Intl.NumberFormat('en-US').format(value ?? 0);
}

function obfuscateString(
	input: string,
	startPercentage: number,
	endPercentage: number
) {
	if (typeof input !== 'string' || input.length === 0) {
		return input;
	}

	const length = input.length;

	// Calculate the number of characters to keep at the beginning and end
	let keepStartCount = Math.round((startPercentage / 100) * length);
	let keepEndCount = Math.round((endPercentage / 100) * length);

	// Ensure that keepStartCount and keepEndCount are within bounds
	keepStartCount = Math.max(0, Math.min(keepStartCount, length));
	keepEndCount = Math.max(0, Math.min(keepEndCount, length));

	// Calculate the number of '*' characters needed in between
	const numStars = length - keepStartCount - keepEndCount;

	// Create the obfuscated string by combining the kept characters and '*'
	const obfuscated =
		input.substring(0, keepStartCount) +
		'*'.repeat(numStars) +
		input.substring(length - keepEndCount, length);

	return obfuscated;
}

function obfuscateEmail(
	input: string,
	startPercentage: number,
	endPercentage: number
) {
	if (typeof input !== 'string' || input.length === 0) {
		return input;
	}
	const parts = input?.split('@');
	const username = parts[0] ?? input;
	const obfuscatedString = obfuscateString(
		username,
		startPercentage,
		endPercentage
	);
	return obfuscatedString + '@' + parts[1];
}

function formatNumber(num: number) {
	if (num >= 1000000000) {
		return (num / 1000000000).toFixed(1) + 'B';
	} else if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M';
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'k';
	} else {
		return num.toString();
	}
}

function getDayOfYear(dateString: string) {
	const parts = dateString.split('-');
	if (parts.length !== 3) {
		return null; // Invalid date format
	}

	const day = parseInt(parts[0]);
	const month = parseInt(parts[1]) - 1; // Month is zero-based
	const year = parseInt(parts[2]);

	const date: any = new Date(year, month, day);
	const startOfYear: any = new Date(year, 0, 1); // January 1st of the same year

	const timeDiff = date - startOfYear;
	const dayOfYear = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Adding 1 to account for the 1-based day of the year

	return dayOfYear;
}

function getDatesInRange(startDate: string, endDate: string) {
	const dateArray = [];
	const currentDate = new Date(startDate);
	const lastDate = new Date(endDate);

	while (currentDate <= lastDate) {
		const day = currentDate.getDate();
		const month = currentDate.getMonth() + 1; // Month is zero-based
		const year = currentDate.getFullYear();

		const formattedDate = `${day.toString().padStart(2, '0')}-${month
			.toString()
			.padStart(2, '0')}-${year}`;
		dateArray.push(formattedDate);

		currentDate.setDate(currentDate.getDate() + 1); // Increment the date by one day
	}

	return dateArray;
}

function formatTrendsDate(inputDate: any) {
	const parts = inputDate.split('-');
	if (parts.length !== 3) {
		return 'Invalid Date';
	}

	const day = parseInt(parts[0]);
	const month = parseInt(parts[1]);
	// const year = parseInt(parts[2]);

	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const formattedDate = `${months[month - 1]} ${day}`;
	return formattedDate;
}

const filterTruthyProps = <T extends Record<string, any>>(params: T) => {
	const truthyObj = Object.entries(params)
	.filter(([_, value]) => !!value)
	.reduce((acc: Partial<T>, [key, value]) => {
		acc[key as keyof T] = value;
		return acc;
	}, {});

	return truthyObj;
}

const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
	window.alert('Text copied to clipboard');
}

export {
	getDayOfYear,
	getDatesInRange,
	formatTrendsDate,
	formatNumber,
	cutText,
	capitalizeFirstLetter,
	onlyNumber,
	formatCurrency,
	isset,
	toRaw,
	randomNumbers,
	stringToHTML,
	slideUp,
	slideDown,
	hasEmptyValues,
	createObjectWithTruthyValues,
	formatDateTime,
	toIntNumberFormat,
	toIntNumberFormatWithoutRoundingUp,
	obfuscateString,
	obfuscateEmail,
	filterTruthyProps,
	copyToClipboard
};
