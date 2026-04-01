// src/app/api/stkpush/route.ts
import { NextResponse } from "next/server";
import { getAccessToken, getTimestamp } from "@/lib/mpesa";

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json({ error: "Phone and Amount are required" }, { status: 400 });
    }

    // Format phone: 0712... -> 254712...
    const formattedPhone = phone.startsWith("0") 
      ? "254" + phone.substring(1) 
      : phone.replace("+", "");

    const token = await getAccessToken();
    const timestamp = getTimestamp();
    const shortCode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`,
      AccountReference: "VercelMicroservice",
      TransactionDesc: "Payment",
    };

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}