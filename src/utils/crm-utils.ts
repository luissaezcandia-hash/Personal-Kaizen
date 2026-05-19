export type ContactFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'none';

export const isContactOverdue = (
  lastInteractionDate: string,
  frequency: ContactFrequency,
  referenceDate: Date = new Date()
): boolean => {
  if (frequency === 'none') return false;

  const lastDate = new Date(lastInteractionDate);
  const diffTime = referenceDate.getTime() - lastDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const thresholds: Record<Exclude<ContactFrequency, 'none'>, number> = {
    weekly: 7,
    monthly: 30,
    quarterly: 90,
    yearly: 365,
  };

  return diffDays > thresholds[frequency];
};
