import { NextAuthOptions, getServerSession } from "next-auth";
import Discord from "next-auth/providers/discord";
export const authOptions: NextAuthOptions = {
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        const p: any = profile;
        token.did = p.id; token.username = p.username; token.display = p.global_name || p.username;
        token.avatar = p.avatar ? `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png";
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user = { id: token.did, username: token.username, name: token.display, image: token.avatar };
      return session;
    },
  },
};
export const getUser = async (): Promise<any> => (await getServerSession(authOptions))?.user;
export const isAdmin = (u: any) => !!u?.id && u.id === (process.env.ADMIN_DISCORD_ID || "1191367983466033252");
