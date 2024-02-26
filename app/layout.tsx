import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";

const inter = Inter({ subsets: ["latin"] });
const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PulsePad",
  description: "PulsePad is a versatile productivity and note-taking application that allows users to create and organize notes, documents, databases, and more. It's known for its flexibility, collaborative features, and the ability to handle various types of content within a single platform. Users can structure their information in a way that suits their needs, making it a popular choice for both personal and professional use. ",
  icons: {
    icon: [{
      media: '(prefers-color-scheme-light)',
      url: '/logo.svg',
      href: '/logo.svg',
    },
    {
      media: '(prefers-color-scheme: dark)',
      url: '/logo-dark.svg',
      href: '/logo-dark.svg',
    }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={nunito.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              enableSystem
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              storageKey="pulsepad-theme"
            >
              <Toaster position="top-right" />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
