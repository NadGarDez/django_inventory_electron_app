const vesFormatter = new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const toNumber = (value) => {
    if (value === null || value === undefined || value === '') {
        return 0;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

export const formatCurrency = (value) => vesFormatter.format(toNumber(value));

export const formatCurrencyDisplay = (value, options = {}) => {
    const amount = toNumber(value);
    const {
        showUsdConversion = false,
        exchangeRate = 1,
    } = options;

    const vesValue = formatCurrency(amount);

    if (!showUsdConversion) {
        return vesValue;
    }

    const safeRate = toNumber(exchangeRate);
    const usdValue = safeRate > 0 ? usdFormatter.format(amount / safeRate) : usdFormatter.format(0);
    return `${usdValue} / ${vesValue}`;
};

export const formatDateTime = (value) => {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString('es-VE');
};
