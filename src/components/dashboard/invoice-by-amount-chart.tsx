"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const BAR_COLORS = [
  "hsl(142 71% 75%)",   // Draft — light green
  "hsl(142 71% 65%)",   // Sent
  "hsl(142 71% 45%)",   // Paid — primary green
  "hsl(142 71% 55%)",   // Overdue
];

type Point = { status: string; amount: number };

export function InvoiceByAmountChart({ data }: { data: Point[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
          <XAxis dataKey="status" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <YAxis
            tickFormatter={(v) => (v >= 1e5 ? `${(v / 1e5).toFixed(1)}L` : `${v / 1000}k`)}
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Amount"]}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((_, index) => (
              <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
