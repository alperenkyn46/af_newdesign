import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    isAdmin: boolean;
    referralCode: string;
    totalPoints: number;
    vipLevel: string;
  }

  interface Session {
    user: User & {
      id: string;
      isAdmin: boolean;
      referralCode: string;
      totalPoints: number;
      vipLevel: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin: boolean;
    referralCode: string;
    totalPoints: number;
    vipLevel: string;
  }
}
