import bcrypt from "bcryptjs";

// Production: Use 12-14 rounds. 10 is minimum, higher = more secure but slower
// Can be overridden via BCRYPT_ROUNDS environment variable
const DEFAULT_SALT_ROUNDS = 12;
const getSaltRounds = (): number => {
  const envRounds = process.env.BCRYPT_ROUNDS;
  if (envRounds) {
    const rounds = parseInt(envRounds, 10);
    // Validate: between 10-15 (15+ can be too slow)
    if (rounds >= 10 && rounds <= 15) {
      return rounds;
    }
  }
  return DEFAULT_SALT_ROUNDS;
};

/**
 * Hash a plain text password using bcrypt
 * Production-grade: Uses configurable salt rounds (default 12, min 10, max 15)
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = getSaltRounds();
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * Timing-safe comparison to prevent timing attacks
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with isValid and error message
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  // Minimum length
  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters",
    };
  }

  // Maximum length to prevent DoS attacks
  if (password.length > 128) {
    return {
      isValid: false,
      error: "Password must be less than 128 characters",
    };
  }

  return { isValid: true };
}

