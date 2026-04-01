// src/app/api/callback/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = body.Body.stkCallback;

    if (result.ResultCode === 0) {
      const items = result.CallbackMetadata.Item;
      
      // Extract values safely
      const getVal = (name: string) => items.find((i: any) => i.Name === name)?.Value;
      
      const receipt = getVal("MpesaReceiptNumber");
      const phone = getVal("PhoneNumber");
      const amount = getVal("Amount");

      console.log(`✅ Success: ${receipt} | ${phone} | KES ${amount}`);
      
      // Add your Database logic here (e.g., Prisma or Supabase)
    } else {
      console.log(`❌ Failed: ${result.ResultDesc}`);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Error" });
  }
}