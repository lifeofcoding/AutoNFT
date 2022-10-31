export const shortenAddress = (address: string) => {
  const firstPart = address.slice(0, 5);
  const lastPart = address.slice(address.length - 4);

  return `${firstPart}...${lastPart}`;
};
