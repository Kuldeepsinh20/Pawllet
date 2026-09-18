export function calculateAge(dobString) {
  if (!dobString) return "";

  const normalized = dobString.trim();
  let birthDate;

  if (normalized.includes('/')) {
    const [d, m, y] = normalized.split('/');
    birthDate = new Date(`${y}-${m}-${d}`);
  } else {
    birthDate = new Date(normalized);
  }

  if (isNaN(birthDate.getTime())) return "Invalid Date";

  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();

  if (now.getDate() < birthDate.getDate()) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 0) return "0 Months";
  if (years === 0 && months === 0) return "Less than 1 Month";
  if (years === 0) return `${months} ${months === 1 ? 'Month' : 'Months'}`;
  return `${years} ${years === 1 ? 'Year' : 'Years'} ${months} ${months === 1 ? 'Month' : 'Months'}`;
}

export function formatDateToDisplay(isoDate) {
  if (!isoDate) return "";
  if (isoDate.includes('/')) return isoDate;
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

export function formatDisplayToISO(displayDate) {
  if (!displayDate) return "";
  if (displayDate.includes('-')) return displayDate;
  const [d, m, y] = displayDate.split('/');
  if (!d || !m || !y) return displayDate;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}
