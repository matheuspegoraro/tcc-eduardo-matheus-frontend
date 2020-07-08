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

export const formatShowDate = tempDate => {
  if (!tempDate)
    tempDate = new Date();
  else
    tempDate = new Date(tempDate);

  tempDate.setHours(tempDate.getHours() + 3);

  return `${tempDate.getDate().toString().padStart(2, '0')}/${(tempDate.getMonth() + 1).toString().padStart(2, '0')}/${tempDate.getFullYear().toString().padStart(2, '0')}`;
}