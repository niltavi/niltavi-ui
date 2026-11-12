export const DEMO_CODE = "123456";
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const isPhone = (v: string) => /^\+?\d[\d\s-]{6,}$/.test(v.trim());

/** 0 for empty, otherwise 1–4: length ≥ 8, mixed case, digits, symbols. */
export function passwordStrength(value: string) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return value ? Math.max(score, 1) : 0;
}
