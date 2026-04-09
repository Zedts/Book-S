export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateTrendPercentage(current: number, previous: number): { value: string, isPositive: boolean } {
  if (previous === 0) {
    if (current === 0) return { value: "0%", isPositive: true };
    return { value: "+100%", isPositive: true };
  }
  const diff = ((current - previous) / previous) * 100;
  return {
    value: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`,
    isPositive: diff >= 0
  };
}

