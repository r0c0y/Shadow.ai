
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [
        // GitHub Provider (Requires env vars)
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        // Mock Provider for "Try It Now" experience without keys
        CredentialsProvider({
            name: 'Demo Account',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "demo" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Any login works for demo
                if (credentials?.username) {
                    return { id: "1", name: "Agent Zero User", email: "user@agentzero.dev", image: "https://github.com/agent-zero.png" }
                }
                return null
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async session({ session, token }: any) {
            session.user.id = token.sub
            return session
        }
    }
}
