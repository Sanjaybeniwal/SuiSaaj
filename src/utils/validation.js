import { SERVICES } from '../data/boutiqueData.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_SERVICE_NAMES = SERVICES.map((item) => item.title);

export function validateField(name, value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  switch (name) {
    case 'customerName':
      if (!trimmed) return 'Please enter your full name.';
      if (trimmed.length < 2 || trimmed.length > 100) {
        return 'Name must be between 2 and 100 characters.';
      }
      return '';

    case 'mobileNumber': {
      if (!trimmed) return 'Please enter your mobile number.';
      if (!/^[+\d\s()-]+$/.test(trimmed)) {
        return 'Mobile number can only contain digits, +, spaces, or dashes.';
      }
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        return 'Please enter a valid 10 to 15 digit mobile number.';
      }
      return '';
    }

    case 'email':
      if (trimmed && (!EMAIL_REGEX.test(trimmed) || trimmed.length > 150)) {
        return 'Please enter a valid email address.';
      }
      return '';

    case 'service':
      if (!trimmed) return 'Please select a tailoring or boutique service.';
      if (!VALID_SERVICE_NAMES.includes(trimmed)) {
        return 'Please select a valid service from the list.';
      }
      return '';

    case 'appointmentDate':
      if (trimmed && !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return 'Please select a valid appointment date.';
      }
      return '';

    case 'message':
      if (trimmed.length > 2000) {
        return 'Message must be 2000 characters or fewer.';
      }
      return '';

    default:
      return '';
  }
}

export function validateForm(values) {
  const fields = ['customerName', 'mobileNumber', 'email', 'service', 'appointmentDate', 'message'];
  const errors = {};

  for (const field of fields) {
    const error = validateField(field, values[field]);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}
