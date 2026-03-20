import { NextRequest, NextResponse } from "next/server";
import { getBanks } from "@/lib/actions/user.actions";
import { getBanksForTestUser } from "@/lib/actions/mock-data.actions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Handle test user with mock data
    if (userId === 'test-user-demo') {
      const banks = await getBanksForTestUser({ userId });
      return NextResponse.json(banks);
    }

    const banks = await getBanks({ userId });
    return NextResponse.json(banks);
  } catch (error) {
    console.error("Error fetching banks:", error);
    return NextResponse.json(
      { error: "Failed to fetch banks" },
      { status: 500 }
    );
  }
}
