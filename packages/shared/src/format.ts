import type { Unit } from './types';

const MM_PER_INCH = 25.4;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function formatFractionalInches(mm: number): string {
  const totalSixteenths = Math.round((mm / MM_PER_INCH) * 16);
  const whole = Math.floor(totalSixteenths / 16);
  const sixteenths = totalSixteenths % 16;
  if (sixteenths === 0) {
    return `${whole}"`;
  }
  const divisor = gcd(sixteenths, 16);
  const fraction = `${sixteenths / divisor}/${16 / divisor}`;
  return whole === 0 ? `${fraction}"` : `${whole} ${fraction}"`;
}

export function formatDecimalInches(mm: number): string {
  return `${(mm / MM_PER_INCH).toFixed(2)}"`;
}

export function formatMetric(mm: number): string {
  return `${mm} mm`;
}

export function formatValue(mm: number, unit: Unit): string {
  switch (unit) {
    case 'fractional':
      return formatFractionalInches(mm);
    case 'decimal':
      return formatDecimalInches(mm);
    case 'metric':
      return formatMetric(mm);
  }
}

export const UNIT_LABELS: Record<Unit, string> = {
  fractional: 'Inches (1/16")',
  decimal: 'Inches (decimal)',
  metric: 'Millimeters',
};
