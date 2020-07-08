export const getAllDays = () => {
  let days = [];

  for (let i = 1; i <= 31; i++) {
    days[i] = i;
  }

  return days;
}

export const formatSaveMoney = tempMoney => {
  if(Number.isInteger(tempMoney)) return tempMoney;

  tempMoney = tempMoney.split(".");
  tempMoney = tempMoney.join("");
  tempMoney = tempMoney.split(",");
  tempMoney = tempMoney.join(".");

  return tempMoney;
}

export const formatShowMoney = tempMoney => {
  if (!tempMoney)
    tempMoney = 0;

  return tempMoney.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}