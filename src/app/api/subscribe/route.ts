import { NextRequest, NextResponse } from "next/server";

// In production, replace this with a proper email service (Resend, Mailchimp, etc.)
// For now, log to Vercel function logs and return success

export async function POST(request: NextRequest) {
  try {
    const { email, context } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    // Log the subscriber (visible in Vercel function logs)
    console.log(
      `[SUBSCRIBE] ${email} | context: ${context || "general"} | ${new Date().toISOString()}`
    );

    // TODO: Integrate with email service
    // Options: Resend, Mailchimp, ConvertKit, Buttondown
    // await resend.contacts.create({ email, audienceId: "..." });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
