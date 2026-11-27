export const ALLOWED_SERVICES = [
  'Blouse Stitching',
  'Suit Stitching',
  'Kurti Stitching',
  'Bridal Wear',
  'Party Wear',
  'Dress Designing',
  'Alteration Services',
  'Custom Tailoring',
];

export const BUDGET_RANGES = [
  'Under ₹1,500',
  '₹1,500 – ₹3,500',
  '₹3,500 – ₹8,000',
  '₹8,000 – ₹20,000',
  '₹20,000+',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Normalize and validate mobile phone number.
 * Accepts formats like +91 98765 43210, 9876543210, 098765-43210, etc.
 */
export function validateMobileNumber(raw) {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) {
    return { valid: false, error: 'Please enter your mobile number.' };
  }
  if (!/^[+\d\s()-]+$/.test(value)) {
    return { valid: false, error: 'Mobile number can only contain digits, +, spaces, or dashes.' };
  }
  const digits = value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    return { valid: false, error: 'Please enter a valid 10 to 15 digit mobile number.' };
  }
  return { valid: true, value };
}

/**
 * Validate and sanitize customer enquiry payload.
 */
export function validateEnquiryPayload(body = {}) {
  const errors = {};

  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  if (!customerName) {
    errors.customerName = 'Please enter your full name.';
  } else if (customerName.length < 2 || customerName.length > 100) {
    errors.customerName = 'Name must be between 2 and 100 characters.';
  }

  const mobileCheck = validateMobileNumber(body.mobileNumber);
  if (!mobileCheck.valid) {
    errors.mobileNumber = mobileCheck.error;
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (email && (!EMAIL_REGEX.test(email) || email.length > 150)) {
    errors.email = 'Please enter a valid email address.';
  }

  const service = typeof body.service === 'string' ? body.service.trim() : '';
  if (!service) {
    errors.service = 'Please select the service you are looking for.';
  } else if (!ALLOWED_SERVICES.includes(service)) {
    errors.service = 'Please choose a valid tailoring or boutique service.';
  }

  const appointmentDate =
    typeof body.appointmentDate === 'string' ? body.appointmentDate.trim() : '';
  if (appointmentDate) {
    if (!DATE_REGEX.test(appointmentDate)) {
      errors.appointmentDate = 'Please select a valid preferred appointment date.';
    } else {
      const parsed = new Date(`${appointmentDate}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) {
        errors.appointmentDate = 'Please select a valid preferred appointment date.';
      }
    }
  }

  const budget = typeof body.budget === 'string' ? body.budget.trim() : '';
  if (budget && budget.length > 80) {
    errors.budget = 'Budget selection is invalid.';
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (message.length > 2000) {
    errors.message = 'Message must be 2000 characters or fewer.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      customerName,
      mobileNumber: mobileCheck.value,
      email,
      service,
      appointmentDate,
      budget,
      message,
    },
  };
}
