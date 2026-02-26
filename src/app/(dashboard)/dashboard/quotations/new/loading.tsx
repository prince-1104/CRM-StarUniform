import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function NewQuotationLoading() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        <div className="h-8 w-44 bg-muted animate-pulse rounded mt-2" />
      </div>
      <Card>
        <CardHeader>
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-16 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
