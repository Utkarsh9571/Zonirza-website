import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const isActive = searchParams.get("isActive") || "";
    const sort = searchParams.get("sort") || "newest";

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (isActive) filter.isActive = isActive === "true";

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ];
    }

    // Determine sort
    let sortObj: any = { createdAt: -1 };
    if (sort === "oldest") sortObj = { createdAt: 1 };
    else if (sort === "activity") sortObj = { lastLogin: -1 };
    // Spend and orders high sorting will be done in memory after enrichment for now
    // unless we use aggregation which is better for performance

    let users;
    let total;

    if (sort === "spend-high" || sort === "orders-high") {
      // For these we need aggregation to sort by computed fields
      const aggregationPipeline: any[] = [
        { $match: filter },
        {
          $lookup: {
            from: 'orders',
            localField: 'email',
            foreignField: 'shippingAddress.email',
            as: 'userOrders'
          }
        },
        {
          $addFields: {
            orderCount: { $size: '$userOrders' },
            totalSpent: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: '$userOrders',
                      as: 'order',
                      cond: { $eq: ['$$order.paymentStatus', 'paid'] }
                    }
                  },
                  as: 'paidOrder',
                  in: '$$paidOrder.totalAmount'
                }
              }
            }
          }
        }
      ];

      if (sort === "spend-high") {
        aggregationPipeline.push({ $sort: { totalSpent: -1 } });
      } else {
        aggregationPipeline.push({ $sort: { orderCount: -1 } });
      }

      aggregationPipeline.push({ $skip: skip });
      aggregationPipeline.push({ $limit: limit });

      users = await User.aggregate(aggregationPipeline);
      total = await User.countDocuments(filter);
    } else {
      users = await User.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit);

      total = await User.countDocuments(filter);

      // Enrich users with order stats
      users = await Promise.all(users.map(async (user) => {
        const orderCount = await Order.countDocuments({ "shippingAddress.email": user.email });
        const totalSpent = await Order.aggregate([
          { $match: { "shippingAddress.email": user.email, paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        return {
          ...user.toObject(),
          orderCount,
          totalSpent: totalSpent[0]?.total || 0
        };
      }));
    }

    return NextResponse.json({
      success: true,
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Admin Customers API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
