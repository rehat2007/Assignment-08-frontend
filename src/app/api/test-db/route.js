import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export async function GET() {
  try {
    const auth = getAuth();
    const db = auth.options.database;

    return NextResponse.json({
      success: true,
      message: "Better Auth is configured with a database!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
