import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/actions/bank.actions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appwriteItemId = searchParams.get("appwriteItemId");

    if (!appwriteItemId) {
      return NextResponse.json(
        { error: "Appwrite Item ID is required" },
        { status: 400 }
      );
    }

    const account = await getAccount({ appwriteItemId });
    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}
