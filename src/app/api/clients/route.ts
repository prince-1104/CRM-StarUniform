import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/auth";
import { createClientSchema } from "@/lib/validations/client";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  try {
    const tenant = await requireTenant();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const search = searchParams.get("search") ?? "";

    const where = {
      organizationId: tenant.organizationId,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.client.count({ where }),
    ]);

    return Response.json({
      data: clients,
      pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
    });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await requireTenant();
    const body = await req.json();
    const parsed = createClientSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Ensure organization exists (handles stale session or deleted org)
    const org = await prisma.organization.findFirst({
      where: { id: tenant.organizationId, deletedAt: null },
    });
    if (!org) {
      return Response.json(
        {
          error:
            "Your organization could not be found. Please log out and log in again.",
        },
        { status: 403 }
      );
    }

    const client = await prisma.client.create({
      data: {
        organizationId: tenant.organizationId,
        name: parsed.data.name,
        phone: parsed.data.phone ?? null,
        email: parsed.data.email || null,
        gstin: parsed.data.gstin ?? null,
        billingAddress: parsed.data.billingAddress ?? null,
        shippingAddress: parsed.data.shippingAddress ?? null,
      },
    });

    revalidateTag("clients");
    revalidateTag("dashboard-stats");

    return Response.json(client);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const err = e as Error;
    if (err.message?.includes("Foreign key constraint") && err.message?.includes("organizationId")) {
      return Response.json(
        {
          error:
            "Your organization could not be found. Please log out and log in again.",
        },
        { status: 403 }
      );
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}
