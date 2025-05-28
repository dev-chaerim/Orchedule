// lib/utils/validation.ts

export const isValidName = (name: string): boolean => {
  const trimmed = name.trim();
  return /^[가-힣]{2,10}$/.test(trimmed); // 공백 없이 한글 2~10자
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // 기본 이메일 정규식
};

export const isValidPassword = (password: string): boolean => {
  const lengthValid = password.length >= 10;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

  // 문자 + 숫자 / 문자 + 특수 / 숫자 + 특수 중 하나 이상 만족
  const validCombination =
    (hasLetter && hasNumber) ||
    (hasLetter && hasSymbol) ||
    (hasNumber && hasSymbol);

  return lengthValid && validCombination;
};
