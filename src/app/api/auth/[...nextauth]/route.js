import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createConnection } from "../../../../../lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email dan password wajib diisi!");
        }
      
        try {
          // Cek user di database
          const db = await createConnection();
          const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [credentials.email]);
          
          if (rows.length === 0) {
            throw new Error("User tidak ditemukan!");
          }
      
          const user = rows[0];
      
          // Validasi password
          if (credentials.password !== user.password) {
            throw new Error("Password salah!");
          }
      
          // **Mengembalikan seluruh data user dari DB**
          return user; 
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Terjadi kesalahan saat login!");
        }
      }      
    }),
  ],
  pages: {
    signIn: "/login", 
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Simpan seluruh data user di token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user; // Pastikan session berisi seluruh data user
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
