import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mapsly — AI Workflow Map for Developers & Students",
  description:
    "Tell Mapsly what you want to build and get a personalized step-by-step workflow map with the best free and paid AI tools for every stage of your project.",
  keywords: [
    "AI tools",
    "workflow",
    "developer tools",
    "student tools",
    "AI agent",
    "project planning",
  ],
  openGraph: {
    title: "Mapsly — AI Workflow Map",
    description:
      "Get a personalized AI-powered workflow map for your next project.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-mesh">{children}</body>
    </html>
  );
}
