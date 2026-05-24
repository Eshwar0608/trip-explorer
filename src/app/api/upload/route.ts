import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { validateImageFiles } from "@/lib/images";
import { uploadImageFiles } from "@/lib/storage";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File);

    const validationError = validateImageFiles(files);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (files.length === 0) {
      return NextResponse.json({ urls: [] });
    }

    const urls = await uploadImageFiles(files, session.user.id);
    return NextResponse.json({ urls });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload images";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
