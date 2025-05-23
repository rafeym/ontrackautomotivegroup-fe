import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const ref = `OT-${uuidv4().slice(0, 8).toUpperCase()}`; // e.g., OT-3F2504E8

    const { error } = await resend.emails.send({
      from: "OnTrackAutomotiveGroup <noreply@resend.dev>",
      to: [process.env.DEALERSHIP_EMAIL!],
      replyTo: email,
      subject: `[Contact Form] - ${name} (Ref #${ref})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; color: #333;">
          <h2 style="color: #0B0B45;">(Ref #${ref})</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">${message}</div>
          <hr style="margin: 30px 0;">
          <footer style="font-size: 12px; color: #777;">
            Ref #${ref} – This inquiry was submitted via the OnTrackAutomotiveGroup website contact form.
          </footer>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ message: "Failed to send email" }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Server error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
