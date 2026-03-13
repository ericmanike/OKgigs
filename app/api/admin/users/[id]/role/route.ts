import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { role } = await req.json();

    if (!['user', 'agent', 'moderator'].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === 'admin' && id !== session.user.id) {
       // Cannot modify other admins unless you are the super admin? 
       // For now let's just allow it if the requester is an admin
    }

    user.role = role as any;
    await user.save();

    return NextResponse.json({
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json({ message: "Error updating user role" }, { status: 500 });
  }
}
