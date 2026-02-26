import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success)
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing)
      return Response.json({ error: "Email already registered" }, { status: 409 });
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: parsed.data.email,
          name: parsed.data.name,
          passwordHash,
        },
      });
      const org = await tx.organization.create({
        data: {
          name: parsed.data.businessName,
        },
      });
      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: "owner",
        },
      });
      return { user, org };
    });
    return Response.json({
      userId: result.user.id,
      organizationId: result.org.id,
      email: result.user.email,
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
