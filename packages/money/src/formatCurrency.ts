type Amount = null | number | string;
type NumberFormatOptions = Omit<Intl.NumberFormatOptions, "currency" | "style">;

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
      currency = result[2];
    } else {
      number = Number(amount);
    }
  }

  return { currency, number };
}

// NOTE: The args should stay in the current order for backwards compatibility reasons.
// Another option to silence this error would be to add a noop default fn for optionsCallback
//
export function formatCurrency(
  amount: Amount,
  currencyCode = "USD",
  options: NumberFormatOptions | null = null,
  optionsCallback?: (number: number, currency: string) => NumberFormatOptions
) {
  const { currency, number } = parseNumberAndCurrency(amount, currencyCode);

  const formatterOptions: Intl.NumberFormatOptions = {
    currency,
    style: "currency",
    ...options,
  };

  if (optionsCallback) {
    Object.assign(formatterOptions, optionsCallback(number, currency));
  }

  const formatter = new Intl.NumberFormat("bestfit", formatterOptions);

  return formatter.format(number);
}

export function formatCurrencyZero(amount: Amount, currencyCode = "USD") {
  return formatCurrency(amount, currencyCode, null, (number) => {
    if (number === 0) {
      return { minimumFractionDigits: 0 };
    }
    return {};
  });
}

export function formatCurrencyInteger(amount: Amount, currencyCode = "USD") {
  return formatCurrency(amount, currencyCode, null, (number) => {
    if (Number.isInteger(number)) {
      return { minimumFractionDigits: 0 };
    }
    return {};
  });
}
