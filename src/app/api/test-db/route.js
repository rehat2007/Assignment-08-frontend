import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
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