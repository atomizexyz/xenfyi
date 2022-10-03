export const daysRemaining = (timestamp?: number) => {
  if (timestamp && timestamp > 0) {
    return (Number(timestamp) - Date.now() / 1000) / 86400;
  } else {
    return 0;
  }
};

export const percentComplete = (daysRemaining: number, term?: number) => {
  if (term && term > 0) {
    return term - daysRemaining;
  } else {
    return 0;
  }
};
