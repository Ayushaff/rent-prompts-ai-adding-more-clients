"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Square, SquareCheck } from "lucide-react";
import { Icons } from "@/components/ui/Icons";
import Link from "next/link";
import HeroHeader from "@/components/heroSection/HeroHeader";
import { signIn } from 'next-auth/react';
import {
  BottomGradient,
  containerVariants,
  itemVariants,
  MotionDiv,
  MotionH1,
} from "@/components/ui/MotionProps";
import Container from "@/components/ui/Container";
import Footer from "@/components/ui/Footer";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => email.includes("@");
  const validatePassword = (password) => password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setPasswordError("");

    let hasError = false;
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long.");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );
      const data = await req.json();
      console.log("data: " + data);
      if (req.ok) {
        toast.success("Signed in Successfully");
        setTimeout(() => {
          window.location.replace("/dashboard");
        }, 1500);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
      console.error("Login error:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <HeroHeader />
        <MotionDiv
          className=" mx-auto relative flex pt-20 flex-col gap-10 md:gap-6  md:flex-row items-center justify-start p-6 md:p-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left section: Logo and Heading */}
          <MotionDiv
            className="mx-auto w-full flex flex-col justify-center space-y-6  md:text-left md:items-center"
            variants={itemVariants}
          >
            <MotionDiv className="flex flex-col items-center md:items-center md:justify-start space-y-2 text-center">
              <MotionDiv
                className="h-20 md:h-32 w-20 md:w-32 flex justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { duration: 0.5 } }}
              >
                <Icons.logo className="fill-white" />
              </MotionDiv>
              <MotionH1
                className="text-2xl md:text-5xl font-semibold tracking-tight pt-8 pb-5"
                variants={itemVariants}
              >
                Sign in to your account
              </MotionH1>
              <MotionDiv variants={itemVariants}>
                Don&apos;t have an account?
                <ArrowRight className="h-4 w-4 inline" />
                <Link
                  href="/auth/signup"
                  className="border border-gray-300 px-2 md:px-3 py-[6px] md:py-2 rounded-lg ml-2 hover:bg-indigo-700 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </MotionDiv>
            </MotionDiv>
          </MotionDiv>

          {/* Right section: Sign In Form */}
          <MotionDiv
            className="grid grid-cols-1 gap-6 mx-auto w-full justify-center  bg-gradient-to-br from-black/[0.3] via-black/[0.1] to-black/[0.4] shadow-xl p-4 md:p-8 rounded-lg"
            variants={itemVariants}
          >
            <MotionDiv variants={itemVariants}>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                signIn("google");
              }}
              className="py-1 text-indigo-700 border border-indigo-700 w-full rounded-md font-semibold flex items-center justify-center space-x-2"
              
            >
              <FcGoogle className="w-6 h-6 " />
              <span>Continue with Google</span>
            </Button>
          </MotionDiv>
  
          <MotionDiv variants={itemVariants}>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                signIn("github");
              }}
              className="py-1 border border-indigo-700 w-full rounded-md font-semibold flex items-center justify-center space-x-2"
              
            >
              <FaGithub className="w-6 h-6 text-black" />
              <span className="text-indigo-700">Continue with Github</span>
            </Button>
          </MotionDiv>

          <MotionDiv className="relative flex justify-center text-xs uppercase" variants={itemVariants}>
          <span className=" px-2 text-white flex items-center"><p className="border border-white w-14 md:w-28 h-0 mr-1 md:mr-2"> </p> or Login with <p className="border border-white w-14 md:w-28 h-0 ml-1 md:ml-2"> </p></span>
          </MotionDiv>
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <MotionDiv className="grid w-full" variants={itemVariants}>
                <MotionDiv
                  className="grid gap-1 relative w-full"
                  variants={itemVariants}
                >
                  <div>
                    <Label className="inline text-sm font-medium">Email</Label>
                    <span className="text-red-500 inline">*</span>
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full text-white ${
                      emailError ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
                </MotionDiv>
                <MotionDiv
                  className="grid gap-1 py-2 relative w-full"
                  variants={itemVariants}
                >
                  <div>
                    <Label className="inline text-sm font-medium">
                      Password
                    </Label>
                    <span className="text-red-500 inline">*</span>
                  </div>
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full ring-2 relative text-white ${
                      passwordError ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <span
                    className="flex items-center cursor-pointer gap-1 text-sm select-none"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <SquareCheck size={20} className="text-white" />
                    ) : (
                      <Square size={20} className="text-gray-400" />
                    )}
                    Show Password
                  </span>
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                </MotionDiv>
              </MotionDiv>
              <Button
                type="submit"
                disabled={loading}
                className={`flex bg-gradient-to-br relative group/btn from-indigo-600 to-indigo-700 w-full text-white rounded-md h-10 font-medium select-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging in..." : "Login"}
                <BottomGradient />
              </Button>
            </form>

            
          </MotionDiv>
        </MotionDiv>
        <Footer />
      </Container>
    </>
  );
}

export default SignIn;
