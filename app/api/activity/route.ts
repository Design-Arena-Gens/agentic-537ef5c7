import { NextResponse } from "next/server";
import { collectActivitySnapshot } from "@/lib/github";

const schema = {
  verify(body: any) {
    if (!body || typeof body !== "object") {
      throw new Error("Payload inválido.");
    }
    const org = typeof body.organization === "string" ? body.organization.trim() : "";
    if (!org) {
      throw new Error("Informe o nome da organização do GitHub.");
    }
    const lookbackDays =
      typeof body.lookbackDays === "number" && body.lookbackDays > 0
        ? Math.min(body.lookbackDays, 90)
        : 14;
    const usernames =
      Array.isArray(body.usernames) && body.usernames.length
        ? body.usernames
            .map((user: unknown) =>
              typeof user === "string" ? user.trim() : ""
            )
            .filter(Boolean)
        : undefined;
    return { organization: org, lookbackDays, usernames };
  }
};

export async function POST(request: Request) {
  try {
    const payload = schema.verify(await request.json());
    const snapshot = await collectActivitySnapshot(
      payload.organization,
      payload.lookbackDays,
      payload.usernames
    );
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("[activity] error", error);
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao gerar relatório.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
