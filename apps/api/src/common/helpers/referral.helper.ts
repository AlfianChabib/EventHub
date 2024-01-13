export const generateReferral = (username: string): string => {
  let result: string = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 5) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  let referral: string = `${username}${result}`;
  return referral.toUpperCase();
};
