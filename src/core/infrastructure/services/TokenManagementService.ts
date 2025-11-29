/**
 * Secure Token Management Service
 *
 * Uses COOKIES for token storage with security best practices:
 * - Secure flag (HTTPS only in production)
 * - SameSite=Strict (CSRF protection)
 * - Path restriction
 * - Expiration handling
 *
 * SECURITY NOTES:
 * - Cookies set via JavaScript are NOT httpOnly (still accessible to JS)
 * - For maximum security, use httpOnly cookies set by the server
 * - This implementation is more secure than localStorage/sessionStorage
 *   because cookies have SameSite and Secure flags
 *
 * ADVANTAGES OVER localStorage/sessionStorage:
 * - SameSite=Strict prevents CSRF attacks
 * - Secure flag ensures HTTPS-only transmission
 * - Automatic expiration handling
 * - Not accessible via Storage API (different attack surface)
 */

const TOKEN_KEY = "hms_auth_token";
const TOKEN_EXPIRY_KEY = "hms_token_expiry";
const USER_KEY = "hms_user";

/**
 * Cookie options for secure storage
 */
interface CookieOptions {
  maxAge?: number; // seconds
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

/**
 * Default secure cookie options
 */
const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  path: "/",
  sameSite: "Strict", // CSRF protection
  secure: window.location.protocol === "https:", // Secure in production
};

/**
 * Set a cookie with security options
 */
function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  const opts = { ...DEFAULT_COOKIE_OPTIONS, ...options };

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (opts.maxAge !== undefined) {
    cookieString += `; max-age=${opts.maxAge}`;
  }

  if (opts.expires) {
    cookieString += `; expires=${opts.expires.toUTCString()}`;
  }

  if (opts.path) {
    cookieString += `; path=${opts.path}`;
  }

  if (opts.domain) {
    cookieString += `; domain=${opts.domain}`;
  }

  if (opts.secure) {
    cookieString += "; secure";
  }

  if (opts.sameSite) {
    cookieString += `; samesite=${opts.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Remove a cookie
 */
function removeCookie(name: string, path: string = "/"): void {
  document.cookie = `${encodeURIComponent(
    name
  )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; samesite=Strict`;
}

/**
 * Check if cookies are enabled
 */
function areCookiesEnabled(): boolean {
  try {
    const testKey = "__cookie_test__";
    setCookie(testKey, "test", { maxAge: 1 });
    const exists = getCookie(testKey) !== null;
    removeCookie(testKey);
    return exists;
  } catch {
    return false;
  }
}

/**
 * Obfuscation function (NOT encryption)
 * Provides minimal protection against casual inspection
 */
function obfuscate(data: string): string {
  try {
    return btoa(encodeURIComponent(data));
  } catch {
    return data;
  }
}

function deobfuscate(data: string): string {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return data;
  }
}

/**
 * Validate token format (Laravel Sanctum format: "id|token")
 */
function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  if (token.length < 10) return false;

  // Laravel Sanctum token format: "id|randomstring"
  // Basic validation: should contain pipe and alphanumeric characters
  return /^\d+\|[a-zA-Z0-9]+$/.test(token);
}

/**
 * Secure Token Management Service using Cookies
 *
 * SECURITY FEATURES:
 * ✅ SameSite=Strict (CSRF protection)
 * ✅ Secure flag (HTTPS only)
 * ✅ Path restriction
 * ✅ Automatic expiration
 * ✅ In-memory caching
 * ✅ Token format validation
 * ⚠️ Not httpOnly (requires server-side cookies for that)
 *
 * This is MORE SECURE than localStorage/sessionStorage because:
 * 1. SameSite prevents cross-site request forgery
 * 2. Secure flag prevents transmission over HTTP
 * 3. Cookies are not accessible via Storage API
 */
export class TokenManagementService {
  private cookiesEnabled: boolean;

  // In-memory cache to minimize cookie access
  private tokenCache: string | null = null;
  private tokenExpiryCache: Date | null = null;

  constructor() {
    this.cookiesEnabled = areCookiesEnabled();

    if (!this.cookiesEnabled) {
      console.warn(
        "[TokenService] Cookies are disabled. Authentication may not work properly."
      );
    }

    // Clear cache on initialization
    this.clearCache();
  }

  /**
   * Store authentication token in cookie
   */
  setToken(token: string): void {
    try {
      // Validate token format
      if (!isValidTokenFormat(token)) {
        console.warn("[TokenService] Invalid token format");
        return;
      }

      // Store obfuscated token in cookie
      // Max age: 24 hours (matches Laravel Sanctum default)
      setCookie(TOKEN_KEY, obfuscate(token), {
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        sameSite: "Strict",
        secure: window.location.protocol === "https:",
      });

      // Update cache
      this.tokenCache = token;
    } catch (error) {
      console.error("[TokenService] Failed to store token");
      this.tokenCache = null;
    }
  }

  /**
   * Retrieve stored token from cookie
   */
  getToken(): string | null {
    try {
      // Check cache first
      if (this.tokenCache) {
        if (this.isTokenExpired()) {
          this.clearAll();
          return null;
        }
        return this.tokenCache;
      }

      // Get from cookie
      const stored = getCookie(TOKEN_KEY);
      if (!stored) return null;

      const token = deobfuscate(stored);

      // Validate token format
      if (!isValidTokenFormat(token)) {
        this.clearAll();
        return null;
      }

      // Check if token is expired
      if (this.isTokenExpired()) {
        this.clearAll();
        return null;
      }

      // Update cache
      this.tokenCache = token;
      return token;
    } catch {
      return null;
    }
  }

  /**
   * Store token expiration time
   */
  setTokenExpiry(expiresAt: string): void {
    try {
      const expiryDate = new Date(expiresAt);

      if (isNaN(expiryDate.getTime())) {
        console.warn("[TokenService] Invalid expiry date");
        return;
      }

      // Calculate max-age from expiry
      const maxAge = Math.floor((expiryDate.getTime() - Date.now()) / 1000);

      if (maxAge > 0) {
        setCookie(TOKEN_EXPIRY_KEY, expiresAt, {
          maxAge,
          sameSite: "Strict",
          secure: window.location.protocol === "https:",
        });
      }

      this.tokenExpiryCache = expiryDate;
    } catch (error) {
      console.error("[TokenService] Failed to store token expiry");
      this.tokenExpiryCache = null;
    }
  }

  /**
   * Get token expiration date
   */
  getTokenExpiry(): Date | null {
    try {
      // Check cache first
      if (this.tokenExpiryCache) {
        return this.tokenExpiryCache;
      }

      const expiry = getCookie(TOKEN_EXPIRY_KEY);
      if (!expiry) return null;

      const expiryDate = new Date(expiry);
      if (isNaN(expiryDate.getTime())) {
        return null;
      }

      this.tokenExpiryCache = expiryDate;
      return expiryDate;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;

    // Add 30 second buffer for clock skew
    const buffer = 30 * 1000;
    return Date.now() >= expiry.getTime() - buffer;
  }

  /**
   * Check if token will expire within specified minutes
   */
  isTokenExpiringSoon(minutesThreshold: number = 5): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;

    const warningTime = Date.now() + minutesThreshold * 60 * 1000;
    return warningTime >= expiry.getTime();
  }

  /**
   * Get time until token expires in seconds
   */
  getTimeUntilExpiry(): number {
    const expiry = this.getTokenExpiry();
    if (!expiry) return 0;

    const diff = expiry.getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }

  /**
   * Store user data (non-sensitive only)
   */
  setUser(userData: string): void {
    try {
      // Validate JSON
      JSON.parse(userData);

      setCookie(USER_KEY, obfuscate(userData), {
        maxAge: 24 * 60 * 60, // 24 hours
        sameSite: "Strict",
        secure: window.location.protocol === "https:",
      });
    } catch (error) {
      console.error("[TokenService] Failed to store user data: Invalid JSON");
    }
  }

  /**
   * Get stored user data
   */
  getUser(): string | null {
    try {
      const stored = getCookie(USER_KEY);
      if (!stored) return null;
      return deobfuscate(stored);
    } catch {
      return null;
    }
  }

  /**
   * Clear token cookies
   */
  clearToken(): void {
    try {
      removeCookie(TOKEN_KEY);
      removeCookie(TOKEN_EXPIRY_KEY);
      this.clearCache();
    } catch (error) {
      console.error("[TokenService] Failed to clear token");
    }
  }

  /**
   * Clear all auth cookies
   */
  clearAll(): void {
    try {
      removeCookie(TOKEN_KEY);
      removeCookie(TOKEN_EXPIRY_KEY);
      removeCookie(USER_KEY);
      this.clearCache();
    } catch (error) {
      console.error("[TokenService] Failed to clear auth data");
    }
  }

  /**
   * Clear in-memory cache
   */
  private clearCache(): void {
    this.tokenCache = null;
    this.tokenExpiryCache = null;
  }

  /**
   * Check if user has a stored token (may be expired)
   */
  hasToken(): boolean {
    return getCookie(TOKEN_KEY) !== null;
  }

  /**
   * Check if cookies are enabled in the browser
   */
  isCookiesEnabled(): boolean {
    return this.cookiesEnabled;
  }
}
