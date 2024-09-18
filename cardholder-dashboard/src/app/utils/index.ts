export const classNames = (...classes: any) =>
  classes.filter(Boolean).join(" ");

export const currencyFormatter = (number: number, displayFractions = true) => {
  return (
    "$" +
    Intl.NumberFormat(
      "us",
      displayFractions
        ? {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }
        : {}
    )
      .format(number)
      .toString()
  );
};
