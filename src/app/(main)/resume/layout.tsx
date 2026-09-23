import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download Resume",
  description: "Download Prahlad's Software Engineer resume to review his professional experience, technical skills, and projects.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    title: "Download Resume | Prahlad",
    description: "Download Prahlad's Software Engineer resume.",
    url: "https://prahladinala.in/resume",
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
