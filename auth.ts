import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { api } from "@/lib/api";
import { verifyLoginResponseSchema, verifyLoginSchema } from "@/lib/zod";

declare module "next-auth" {
  interface AdapterUser {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    access_token?: string | null;
    // events?: null | Array<{ id: string; name: string }>;
    events?: null | Array<string>;
  }

  interface Session {
    user: AdapterUser;
    expires: Date & string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          // logic to verify if the user exists
          const data = await verifyLoginSchema.parseAsync(credentials);

          const res = await api(verifyLoginResponseSchema, {
            url: "/login/verify",
            method: "post",
            data,
          });

          console.log('test-error:',res.data)

          if (!res.data?.token) {
            // No user found, so this is their first attempt to login
            throw new Error("AccessDenied");
          }

          // return user object with their profile data
          return {
            name: res.data.user.first_name + " " + res.data.user.last_name,
            email: res.data.user.email,
            image: null,
            events: res.data.user.events,
            access_token: res.data.token,
            role: res.data.user.role ?? null,
          };
        } catch (e) {
          console.error(e);
          if (e instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }

          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/dashboard") return !!auth;
      return true;
    },
    jwt(params) {
      // console.log("jwt data:", params);
      if (params.user) {
        return {
          ...params.token,
          user: params.user,
        };
      }

      if (params.trigger === "update" && params.session) {
        // console.log("jwt data:", params);

        params.token = {
          ...params.token,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          user: { ...(params.token as any), ...params.session.user },
        };
        return params.token;
      }

      return params.token;
    },
    session(params) {
      params.session.user = {
        ...params.session.user,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(params.token.user as unknown as any),
      };

      return params.session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 86400,
  },
  trustHost: true,
});
