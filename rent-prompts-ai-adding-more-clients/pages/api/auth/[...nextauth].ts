
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import payload from "payload";




export default NextAuth({ 
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account}:any) {
      const {docs: users} = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: user.email,
          },
        },
      });

      if (users.length > 0) {
        const credentials = {
          email: user.email,
          InputCred: 'R8f$2nZx&9pQ@6jT!mD',
        };
        const encodedCredentials = encodeURIComponent(JSON.stringify(credentials));

        // Add it to the URL
        return `/dashboard`;
       
      }
      else{
        await payload.create({
          collection: "users",
          data: {
            email:user.email,
            password: 'R8f$2nZx&9pQ@6jT!mD',
            role: "user",
            coinBalance: 25,
            user_name: user.name,
            tokens: 0,
          },
        });

        console.log("user created success")
        
        const credentials = {
          email: user.email,
          InputCred: 'R8f$2nZx&9pQ@6jT!mD',
          UserJourney:true,
          authprovider: account.provider,
        };
        const encodedCredentials = encodeURIComponent(JSON.stringify(credentials));

        // Add it to the URL
        return `/dashboard`;
      }
      
    },
    // async session({ session, token, user, }) {
    // user.id = token.sub;
    //   return session;
    // },
    },
  },
);