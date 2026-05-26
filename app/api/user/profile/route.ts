import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { normalizePhoneNumber } from "@/lib/otpService";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!session || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, phone, mobileNumber, gender, addresses, cart, wishlist, orderHistory, recentlyViewed, preferences } = data;

    await dbConnect();
    
    // Construct update object dynamically
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone ? normalizePhoneNumber(phone) : phone;
    if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber ? normalizePhoneNumber(mobileNumber) : mobileNumber;
    if (gender !== undefined) updateData.gender = gender;
    if (addresses !== undefined) {
      updateData.addresses = addresses.map((addr: any) => ({
        ...addr,
        phone: addr.phone ? normalizePhoneNumber(addr.phone) : addr.phone
      }));
    }
    if (cart !== undefined) updateData.cart = cart;
    if (wishlist !== undefined) updateData.wishlist = wishlist;
    if (orderHistory !== undefined) updateData.orderHistory = orderHistory;
    if (recentlyViewed !== undefined) updateData.recentlyViewed = recentlyViewed;
    if (preferences !== undefined) updateData.preferences = preferences;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        addresses: updatedUser.addresses,
        cart: updatedUser.cart,
        wishlist: updatedUser.wishlist,
        orderHistory: updatedUser.orderHistory,
        recentlyViewed: updatedUser.recentlyViewed,
        preferences: {
          ...updatedUser.preferences,
          preferredCurrency: updatedUser.preferences?.preferredCurrency
        }
      }
    });
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      const userId = (session?.user as any)?.id;
      
      if (!session || !userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      await dbConnect();
      
      const user = await User.findById(userId);
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json({ 
        success: true, 
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          addresses: user.addresses,
          cart: user.cart,
          wishlist: user.wishlist,
          orderHistory: user.orderHistory,
          recentlyViewed: user.recentlyViewed,
          preferences: {
            ...user.preferences,
            preferredCurrency: user.preferences?.preferredCurrency
          }
        }
      });
    } catch (error: any) {
      console.error("Profile Fetch Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
