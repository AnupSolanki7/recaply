"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "../app/assets/recaply.png";
import {
  FileText,
  Users,
  BarChart,
  Globe,
  Mail,
  Shield,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-16">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex-col md:flex-row gap-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src={Logo} alt="logo" width={100} height={100} />
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="text-zinc-800"
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/sign-up")}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Revolutionize Your Offline Meetings
        </h1>
        <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
          Recaply bridges the gap in offline meeting documentation, ensuring no
          valuable insight is lost and every decision is tracked.
        </p>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-lg py-6 px-8">
          Start Capturing Meetings
        </Button>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-zinc-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FileText className="h-8 w-8 mb-4 text-indigo-500" />,
                title: "Accurate Transcription",
                description:
                  "Every discussion is accurately transcribed with speaker identification.",
              },
              {
                icon: <Zap className="h-8 w-8 mb-4 text-indigo-500" />,
                title: "AI-Powered Summaries",
                description:
                  "Actionable summaries are generated using advanced AI technology.",
              },
              {
                icon: <Users className="h-8 w-8 mb-4 text-indigo-500" />,
                title: "Speaker Engagement",
                description:
                  "Analyze talk time and participation levels for each participant.",
              },
              {
                icon: <BarChart className="h-8 w-8 mb-4 text-indigo-500" />,
                title: "Sentiment Analysis",
                description:
                  "Understand the tone and emotions of your discussions.",
              },
              {
                icon: <Globe className="h-8 w-8 mb-4 text-indigo-500" />,
                title: "Multilingual Support",
                description:
                  "Recognize multiple languages and provide English translations.",
              },
              {
                icon: <Mail className="h-8 w-8 mb-4 text-indigo-500" />,
                title: "Automated Follow-ups",
                description:
                  "Generate and send email summaries for quick action.",
              },
              {
                icon: <Shield className="h-8 w-8 mb-4 text-indigo-500" />,
                title: "Data Protection",
                description:
                  "Ensure no data loss with real-time recording issue detection.",
              },
              {
                icon: <Zap className="h-8 w-8 mb-4 text-indigo-500" />,
                title: "Instant Sharing",
                description:
                  "Share recaps instantly with all participants for accountability.",
              },
            ].map((feature, index) => (
              <Card key={index} className="p-6 bg-zinc-800 border-zinc-700">
                {feature.icon}
                <h3 className="text-xl text-zinc-50 font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Why Recaply Matters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Bridging the Gap in Offline Meeting Documentation
            </h3>
            <p className="text-zinc-300 mb-4">
              In today&apos;s fast-paced business world, offline meetings remain
              crucial for building trust and making strategic decisions.
              However, the lack of robust tracking tools creates a productivity
              blind spot that organizations can no longer afford to ignore.
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>
                Loss of critical information due to inadequate note-taking
              </li>
              <li>Inefficiencies in manual documentation and summarization</li>
              <li>Lack of accountability and clear responsibility tracking</li>
              <li>
                Missed opportunities for optimizing team dynamics and decision
                patterns
              </li>
            </ul>
          </div>
          <div className="bg-zinc-800 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">
              Impact on Organizations
            </h3>
            <ul className="space-y-4">
              {[
                {
                  title: "Decreased Productivity",
                  description:
                    "Time wasted trying to recollect discussions or clarify decisions post-meeting.",
                },
                {
                  title: "Reduced Transparency",
                  description:
                    "Lack of clear records makes it difficult to ensure accountability and follow-through.",
                },
                {
                  title: "Delayed Decision-Making",
                  description:
                    "Incomplete or inaccurate meeting summaries hinder timely execution of decisions.",
                },
                {
                  title: "Limited Insights",
                  description:
                    "Absence of structured data restricts organizations from optimizing processes and improving performance.",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-1">
                    <span className="text-white text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-zinc-300">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Meetings?
          </h2>
          <p className="text-xl mb-8">
            Join the revolution in offline meeting productivity with Recaply.
          </p>
          <Button className="bg-white text-indigo-600 hover:bg-zinc-100 text-lg py-6 px-8">
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image src={Logo} alt="logo" width={100} height={100} />
            </div>
            <nav className="flex flex-wrap justify-center space-x-4">
              <Link href="#" className="text-zinc-300 hover:text-white">
                About
              </Link>
              <Link href="#" className="text-zinc-300 hover:text-white">
                Features
              </Link>
              <Link href="#" className="text-zinc-300 hover:text-white">
                Pricing
              </Link>
              <Link href="#" className="text-zinc-300 hover:text-white">
                Contact
              </Link>
              <Link href="#" className="text-zinc-300 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-zinc-300 hover:text-white">
                Terms of Service
              </Link>
            </nav>
          </div>
          <div className="mt-8 text-center text-zinc-400">
            © {new Date().getFullYear()} Recaply. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
