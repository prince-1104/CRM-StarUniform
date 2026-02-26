import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/auth";
import { createProductSchema } from "@/lib/validations/product";

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
      ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
    ]);

    return Response.json({
      data: products,
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
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success)
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    const product = await prisma.product.create({
      data: {
        organizationId: tenant.organizationId,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        defaultPrice: parsed.data.defaultPrice,
        gstPercent: parsed.data.gstPercent,
        unit: parsed.data.unit,
      },
    });

    revalidateTag("products");
    revalidateTag("dashboard-stats");

    return Response.json(product);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
