import { NextResponse } from "next/server";
import { isValidSecretPhrase, issueMagicToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const phrase = String(form.get("phrase") ?? "");
  const next = String(form.get("next") ?? "/admin");

  if (!isValidSecretPhrase(phrase)) {
    return NextResponse.redirect(
      new URL("/admin/login?error=phrase", request.url),
      { status: 303 },
    );
  }

  const token = issueMagicToken();
  const redirectUrl = new URL("/admin/login", request.url);
  redirectUrl.searchParams.set("magic", token);
  redirectUrl.searchParams.set("next", next);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
