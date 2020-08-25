type Amount = string | number | null;
type NumberFormatOptions = Omit<Intl.NumberFormatOptions, "style" | "currency">;

function parseNumberAndCurrency(amount: Amount, currencyCode: string) {
  const moneyFieldRegExp = /([0-9.]+) (\w+)/;

  let number = 0;
  let currency = currencyCode;

  if (typeof amount === "number") {
    number = amount;
  } else if (amount === null) {
    number = 0;
  } else if (typeof amount === "string") {
    const result = moneyFieldRegExp.exec(amount);
    if (result && result.length >= 3) {
      number = Number(result[1]);
      // eslint-disable-next-line prefer-destructuring
      currency = result[2];
    } else {
      number = Number(amount);
    }
  }

  return { number, currency };
}

export function formatCurrency(
  amount: Amount,
  currencyCode: string = "USD",
  options: NumberFormatOptions | null = null,
  optionsCallback?: (number: number, currency: string) => NumberFormatOptions
) {
  const { number, currency } = parseNumberAndCurrency(amount, currencyCode);

  const formatterOptions = {
    style: "currency",
    currency,
    ...options,
  };

  if (optionsCallback) {
    Object.assign(formatterOptions, optionsCallback(number, currency));
  }

  const formatter = new Intl.NumberFormat("bestfit", formatterOptions);

  return formatter.format(number);
}

export function formatCurrencyZero(amount: Amount, currencyCode: string = "USD") {
  return formatCurrency(amount, currencyCode, null, (number) => {
    if (number === 0) {
      return { minimumFractionDigits: 0 };
    }
    return {};
  });
}

export function formatCurrencyInteger(amount: Amount, currencyCode: string = "USD") {
  return formatCurrency(amount, currencyCode, null, (number) => {
    if (Number.isInteger(number)) {
      return { minimumFractionDigits: 0 };
    }
    return {};
  });
}
