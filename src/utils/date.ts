export const formatOraRomaniei = (isoDate: string) => {
  return new Date(isoDate).toLocaleString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};