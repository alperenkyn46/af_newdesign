import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const isAuthRoute = req.nextUrl.pathname.startsWith("/panel");
      const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

      // Giriş yapmamış kullanıcılar panel ve admin'e giremez
      if ((isAuthRoute || isAdminRoute) && !token) {
        return false;
      }

      // Admin sayfası için isAdmin kontrolü - şimdilik devre dışı
      // Token'daki isAdmin değeri güncellenmediği için admin kontrolünü
      // admin layout'ta yapacağız
      
      return true;
    },
  },
  pages: {
    signIn: "/giris",
  },
});

export const config = {
  matcher: ["/panel/:path*", "/admin/:path*"],
};
