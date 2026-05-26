import dbConnect from "./db";
import User from "@/models/User";

export interface OTPResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Normalizes phone numbers into a strict canonical format: E.164-like numeric storage without spaces/symbols.
 * Examples:
 * +91 99999 88888 -> 919999988888
 * 919999988888 -> 919999988888
 * 09999988888 -> 919999988888
 * 9999988888 -> 919999988888
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Strip all spaces, dashes, brackets, plus signs, and non-numeric characters
  let clean = phone.replace(/[^\d]/g, '');

  // Handle leading zero for Indian numbers (e.g., 09999988888 -> 9999988888)
  if (clean.length === 11 && clean.startsWith('0')) {
    clean = clean.substring(1);
  }

  // If it's a 10-digit number, prepend India country code '91'
  if (clean.length === 10) {
    clean = '91' + clean;
  }

  return clean;
}

export const otpService = {
  /**
   * Sends OTP via MSG91.
   */
  async sendOTP(mobile: string): Promise<OTPResponse> {
    const normalized = normalizePhoneNumber(mobile);
    if (!normalized) {
      return { success: false, message: "Invalid phone number format" };
    }

    // Check for sandbox / test numbers
    const isTestNumber = normalized === '919999999999' || normalized === '918888888888';
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    // Use sandbox fallback if environment variables are not set or for test numbers
    if (!authKey || !templateId || isTestNumber) {
      console.log(`[SANDBOX OTP] Sent mock OTP '123456' to normalized number ${normalized}`);
      return { 
        success: true, 
        message: "OTP sent successfully (Sandbox Mode). Please enter 123456 to verify." 
      };
    }

    try {
      const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${normalized}&authkey=${authKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: process.env.MSG91_SENDER_ID || undefined
        })
      });

      const data = await response.json();
      if (data.type === "success" || data.message === "OTP sent successfully") {
        return { success: true, message: "OTP sent successfully" };
      } else {
        console.error("MSG91 Send API Failure response:", data);
        return { success: false, message: data.message || "Failed to send OTP via MSG91" };
      }
    } catch (error: any) {
      console.error("MSG91 Connection/HTTP Send Error:", error);
      return { success: false, message: "Failed to connect to OTP provider", error: error.message };
    }
  },

  /**
   * Verifies OTP via MSG91.
   */
  async verifyOTP(mobile: string, otp: string): Promise<OTPResponse> {
    const normalized = normalizePhoneNumber(mobile);
    if (!normalized) {
      return { success: false, message: "Invalid phone number format" };
    }

    const isTestNumber = normalized === '919999999999' || normalized === '918888888888';
    const authKey = process.env.MSG91_AUTH_KEY;

    // Validate sandbox OTP
    if (!authKey || isTestNumber) {
      if (otp === '123456') {
        return { success: true, message: "OTP verified successfully (Sandbox Mode)" };
      }
      return { success: false, message: "Invalid OTP" };
    }

    try {
      const url = `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${normalized}&authkey=${authKey}`;
      const response = await fetch(url, {
        method: 'POST'
      });

      const data = await response.json();
      if (data.type === "success" || data.message === "OTP verified successfully") {
        return { success: true, message: "OTP verified successfully" };
      } else {
        console.error("MSG91 Verify API Failure response:", data);
        return { success: false, message: data.message || "Invalid OTP" };
      }
    } catch (error: any) {
      console.error("MSG91 Connection/HTTP Verify Error:", error);
      return { success: false, message: "Failed to verify OTP with provider", error: error.message };
    }
  },

  /**
   * Resends OTP via MSG91.
   */
  async resendOTP(mobile: string): Promise<OTPResponse> {
    const normalized = normalizePhoneNumber(mobile);
    if (!normalized) {
      return { success: false, message: "Invalid phone number format" };
    }

    const isTestNumber = normalized === '919999999999' || normalized === '918888888888';
    const authKey = process.env.MSG91_AUTH_KEY;

    if (!authKey || isTestNumber) {
      console.log(`[SANDBOX OTP] Resent mock OTP '123456' to ${normalized}`);
      return { 
        success: true, 
        message: "OTP resent successfully (Sandbox Mode). Please enter 123456 to verify." 
      };
    }

    try {
      const url = `https://control.msg91.com/api/v5/otp/retry?authkey=${authKey}&mobile=${normalized}&retrytype=text`;
      const response = await fetch(url, {
        method: 'POST'
      });

      const data = await response.json();
      if (data.type === "success" || data.message === "OTP resent successfully") {
        return { success: true, message: "OTP resent successfully" };
      } else {
        console.error("MSG91 Retry API Failure response:", data);
        return { success: false, message: data.message || "Failed to resend OTP" };
      }
    } catch (error: any) {
      console.error("MSG91 Connection/HTTP Retry Error:", error);
      return { success: false, message: "Failed to resend OTP", error: error.message };
    }
  }
};
