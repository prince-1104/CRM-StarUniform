"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentInfoDisplayProps = {
  bankDetails: string | null;
  upiId: string | null;
  settingsUrl?: string;
};

export function PaymentInfoDisplay({
  bankDetails,
  upiId,
  settingsUrl = "/dashboard/settings",
}: PaymentInfoDisplayProps) {
  const [hideBank, setHideBank] = useState(false);
  const [hideUpi, setHideUpi] = useState(false);

  if (!bankDetails && !upiId) return null;

  const parseBankLines = (text: string) =>
    text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^([^:]+):\s*(.*)$/);
        return match ? { label: match[1].trim(), value: match[2].trim() } : { label: "", value: line.trim() };
      });

  return (
    <div className="mt-6 rounded-xl border border-violet-200/50 bg-violet-50/80 p-5 dark:border-violet-800/40 dark:bg-violet-950/25">
      <div className="grid gap-6 sm:grid-cols-2">
        {bankDetails && (
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-violet-700 dark:text-violet-300">
              <input
                type="checkbox"
                checked={hideBank}
                onChange={(e) => setHideBank(e.target.checked)}
                className="h-4 w-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500 dark:border-violet-600 dark:text-violet-500"
              />
              Hide Bank Details
            </label>
            {!hideBank && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-violet-800 dark:text-violet-200">Bank Details</h3>
                  <Link
                    href={settingsUrl}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-violet-200/50 hover:text-violet-700 dark:hover:bg-violet-800/50 dark:hover:text-violet-200"
                    aria-label="Edit bank details"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </div>
                <table className="w-full border-collapse text-sm" style={{ tableLayout: "fixed" }}>
                  <tbody>
                    {parseBankLines(bankDetails).map(({ label, value }, i) =>
                      label ? (
                        <tr key={i}>
                          <td className="py-1 pr-4 align-baseline text-muted-foreground" style={{ width: "11rem" }}>
                            {label}:
                          </td>
                          <td className="align-baseline font-medium tabular-nums text-foreground">
                            {value}
                          </td>
                        </tr>
                      ) : (
                        <tr key={i}>
                          <td colSpan={2} className="py-1 text-foreground">
                            {value}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        {upiId && (
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-violet-700 dark:text-violet-300">
              <input
                type="checkbox"
                checked={hideUpi}
                onChange={(e) => setHideUpi(e.target.checked)}
                className="h-4 w-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500 dark:border-violet-600 dark:text-violet-500"
              />
              Hide UPI Details
            </label>
            {!hideUpi && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-violet-800 dark:text-violet-200">Scan to pay via UPI</h3>
                  <Link
                    href={settingsUrl}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-violet-200/50 hover:text-violet-700 dark:hover:bg-violet-800/50 dark:hover:text-violet-200"
                    aria-label="Edit UPI details"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </div>
                <p className="font-mono text-base font-semibold tabular-nums text-foreground">{upiId}</p>
                <p className="text-xs text-muted-foreground">Scan or transfer via UPI app</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
