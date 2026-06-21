import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import nodemailer from "nodemailer";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
import dbConnect from "./db";
import User from "@/models/User";
import { verifyAdminCredentials, hashPassword } from "./adminAuth";
import { verifyPassword as verifyUserPassword } from "./userAuth";
import { otpService, normalizePhoneNumber } from "./otpService";

// Custom transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
  providers: [
    CredentialsProvider({
      id: "otp",
      name: "OTP Verification",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.otp) return null;
        
        await dbConnect();
        
        const isMobile = /^\+?\d{8,15}$/.test(credentials.identifier.replace(/[^\d+]/g, ''));
        let existingUser;
        
        if (isMobile) {
          const normalizedMobile = normalizePhoneNumber(credentials.identifier);
          
          // Verify OTP with MSG91
          const verification = await otpService.verifyOTP(normalizedMobile, credentials.otp);
          if (!verification.success) {
            throw new Error(verification.message || "Invalid OTP");
          }
          
          // Find user by normalized mobileNumber or existing normalized phone
          existingUser = await User.findOne({
            $or: [
              { mobileNumber: normalizedMobile },
              { phone: normalizedMobile }
            ]
          });
          
          if (existingUser) {
            if (!existingUser.mobileNumber) {
              existingUser.mobileNumber = normalizedMobile;
            }
            existingUser.mobileVerified = true;
            existingUser.lastLogin = new Date();
            await existingUser.save();
          } else {
            existingUser = await User.create({
              mobileNumber: normalizedMobile,
              mobileVerified: true,
              authProvider: 'otp',
              onboardingCompleted: false,
              lastLogin: new Date(),
            });
          }
        } else {
          // Email OTP fallback / testing
          if (credentials.otp !== "123456") {
            throw new Error("Invalid OTP");
          }
          
          const emailLower = credentials.identifier.toLowerCase();
          existingUser = await User.findOne({ email: emailLower });
          
          if (!existingUser) {
            existingUser = await User.create({
              email: emailLower,
              authProvider: 'email',
              onboardingCompleted: false,
              lastLogin: new Date(),
            });
          } else {
            existingUser.lastLogin = new Date();
            await existingUser.save();
          }
        }
        
        return {
          id: existingUser._id.toString(),
          email: existingUser.email || undefined,
          name: existingUser.name || undefined,
        };
      }
    }),
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Access",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const inputHash = hashPassword(credentials.password);
        const isValid = verifyAdminCredentials(credentials.email, inputHash);

        if (isValid) {
          return {
            id: "admin-user",
            email: credentials.email,
            name: "Zoniraz Admin",
            role: "admin"
          };
        }
        return null;
      }
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();
        const emailLower = credentials.email.toLowerCase();
        const user = await User.findOne({ email: emailLower });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("This account does not have a password set. Please use password recovery.");
        }

        const isPasswordValid = verifyUserPassword(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        if (!user.isActive || user.status !== 'active') {
          throw new Error("Your account has been suspended or banned");
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "admin-credentials") return true;
      if (account?.provider === "otp") return true; // OTP handles creation in authorize()
      if (account?.provider === "credentials") return true;
      if (!user.email) return false;
      
      await dbConnect();
      const existingUser = await User.findOne({ email: user.email });
      
      if (!existingUser) {
        // Create new user if they don't exist
        await User.create({
          email: user.email,
          onboardingCompleted: false,
          lastLogin: new Date(),
        });
      } else {
        // Update last login
        existingUser.lastLogin = new Date();
        await existingUser.save();
      }
      
      return true;
    },
    async session({ session, token }) {
      await dbConnect();
      
      // @ts-ignore
      session.user.role = token.role;
      
      if (token.role === "admin") {
        return session;
      }

      const dbUser = await User.findById(token.id || token.sub);
      if (dbUser && session.user) {
        session.user.name = dbUser.name;
        // @ts-ignore
        session.user.id = dbUser._id.toString();
        // @ts-ignore
        session.user.email = dbUser.email;
        // @ts-ignore
        session.user.mobileNumber = dbUser.mobileNumber;
        // @ts-ignore
        session.user.onboardingCompleted = dbUser.onboardingCompleted;
      }
      
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role || "user";
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/signin',
    verifyRequest: '/signin?step=verify', // Custom path for "Check Email" state
  },
  secret: process.env.NEXTAUTH_SECRET,
};
