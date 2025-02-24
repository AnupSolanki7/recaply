"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Logo from "../assets/recaply.png";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    signIn("credentials", { ...formData, redirect: false }).then((res) => {
      console.log(res);
      if (res?.ok) {
        toast.success("Logged in successfully");
        router.push("/home");
      } else {
        toast.error("Invalid credentials");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzBCMTEyMCI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IiMxQTIzM0EiPjwvY2lyY2xlPgo8L3N2Zz4=')] opacity-10"></div>

      <div className="flex-1 flex container mx-auto px-4  py-4 md:py-12 flex-col lg:flex-row items-center justify-center relative z-10">
        {/* Left column: Branding */}
        <Link
          href={"/"}
          className="flex md:hidden items-center justify-center lg:justify-start mb-8"
        >
          <Image src={Logo} alt="logo" width={100} height={100} />
        </Link>
        <div className="lg:w-1/2 lg:pr-16 hidden md:block h-max mb-12 lg:mb-0 text-center lg:text-left">
          <Link
            href={"/"}
            className="flex items-center justify-center lg:justify-start mb-8"
          >
            <Image src={Logo} alt="logo" width={100} height={100} />
          </Link>
          <p className="text-2xl font-light text-gray-300 mb-10 leading-relaxed">
            Transform your meetings with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-medium">
              AI-powered
            </span>{" "}
            assistance
          </p>
          <div className="bg-gradient-to-b from-[#1A2337] to-[#151B2B] p-8 rounded-xl shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border border-indigo-500/10">
            <h2 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              Why choose MeetSmart?
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3 hover:text-indigo-300 transition-colors">
                <span className="text-indigo-400">✓</span> Real-time
                transcription
              </li>
              <li className="flex items-center gap-3 hover:text-indigo-300 transition-colors">
                <span className="text-indigo-400">✓</span> AI-generated
                summaries
              </li>
              <li className="flex items-center gap-3 hover:text-indigo-300 transition-colors">
                <span className="text-indigo-400">✓</span> Speaker recognition
              </li>
              <li className="flex items-center gap-3 hover:text-indigo-300 transition-colors">
                <span className="text-indigo-400">✓</span> Seamless integration
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-zinc-400">Sign in to your Recaply account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                placeholder="hello@example.com"
                type="email"
                required
                className="bg-zinc-700 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-zinc-700 border-zinc-800 text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-zinc-800 bg-zinc-900 text-indigo-600"
                />
                <label htmlFor="remember" className="text-sm text-zinc-400">
                  Remember me
                </label>
              </div>
              <Link
                href="/reset-password"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </Link> */}
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Sign in
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-400">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
