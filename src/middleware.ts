import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/clients/:path*",
    "/api/products/:path*",
    "/api/invoices/:path*",
    "/api/payments/:path*",
    "/api/organization",
  ],
};
