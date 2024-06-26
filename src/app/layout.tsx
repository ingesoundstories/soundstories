import React from "react";
import "./globals.scss";
import localFont from "next/font/local";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { AuthProvider } from "../auth-context";
import {Analytics} from "@vercel/analytics/react";
import PostsProvider from "../components/posts-provider/postsProvider";
import SiteContentProvider from "../components/site-content-provider/siteContentProvider";

export const metadata = {
  title: "SoundStories",
  description: "SoundStories",
};

export const font = localFont({
  src: [
    {
      path: "../../public/font/FuturaCyrillicBook.ttf",
      weight: "300",
    },
    {
      path: "../../public/font/FuturaCyrillicMedium.ttf",
      weight: "400",
    },
    {
      path: "../../public/font/FuturaCyrillicDemi.ttf",
      weight: "500",
    },
    {
      path: "../../public/font/FuturaCyrillicBold.ttf",
      weight: "600",
    },
  ],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AuthProvider>
          <SiteContentProvider>
            <PostsProvider>
              <Header />
              {children}
              <Footer />
              <Analytics/>
            </PostsProvider>
          </SiteContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
