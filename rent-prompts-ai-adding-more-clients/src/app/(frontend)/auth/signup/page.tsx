"use client";
import HeroHeader from "@/components/heroSection/HeroHeader";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import Footer from "@/components/ui/Footer";
import { Icons } from "@/components/ui/Icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BottomGradient,
  containerVariants,
  itemVariants,
  MotionDiv,
  MotionH1,
} from "@/components/ui/MotionProps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Square, SquareCheck } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from 'next-auth/react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    domain: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: value.includes("@") ? "" : "Email must include '@'.",
      }));
    } else if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password:
          value.length >= 8 ? "" : "Password must be at least 8 characters.",
      }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    if (!formData.email.includes("@")) {
      setErrors((prev) => ({
        ...prev,
        email: "Email must include '@'.",
      }));
      return;
    }

    if (formData.password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters.",
      }));
      return;
    }

    setLoading(true);
    const nameFromEmail = formData.email.split("@")[0];

    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: formData.role,
            coinBalance: 25,
            domain: formData.role === "entAdmin" ? formData.domain : "",
            user_name: nameFromEmail,
            _verified: true,
          }),
        }
      );

      const data = await req.json();
      if (req.ok) {
        toast.success("Signup Successfully");
        setFormData({ email: "", password: "", role: "", domain: "" });
        setTimeout(() => {
          window.location.replace("/auth/signIn");
        }, 1500);
      } else {
        toast.error(data.errors[0]?.data.errors[0]?.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <HeroHeader />
        <div className="overflow-y-auto whitespace-nowrap no-scrollbar">
          <MotionDiv
            className=" mx-auto relative flex pt-20 flex-col gap-10 md:gap-6  md:flex-row items-center justify-start p-6 md:p-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Side: Animation and Logo */}
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
                  Create an account
                </MotionH1>
                <MotionDiv variants={itemVariants}>
                  Already have an account?
                  <ArrowRight className="h-4 w-4 inline" />
                  <Link
                    href="/auth/signIn"
                    className="border border-gray-300 px-2 md:px-3 py-[6px] md:py-2 rounded-lg ml-2 hover:bg-indigo-700 transition-all duration-200"
                  >
                    Sign In
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
                          <span className=" px-2 text-white flex items-center"><p className="border border-white w-14 md:w-28 h-0 mr-1 md:mr-2"> </p> or SignUp with <p className="border border-white w-14 md:w-28 h-0 ml-1 md:ml-2"> </p></span>
                        </MotionDiv>
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <MotionDiv className="grid w-full" variants={itemVariants}>
                  <MotionDiv
                    className="grid gap-1 relative w-full"
                    variants={itemVariants}
                  >
                    <div>
                      <Label
                        htmlFor="email"
                        className="inline text-sm font-medium"
                      >
                        Email
                      </Label>
                      <span className="text-danger inline">*</span>
                    </div>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-2 py-2 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.email ? "border-danger" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-danger mt-1">{errors.email}</p>
                    )}
                  </MotionDiv>
                  <MotionDiv
                    className="grid gap-1 py-2 relative w-full"
                    variants={itemVariants}
                  >
                    <div>
                      <Label
                        htmlFor="password"
                        className="inline text-sm font-medium"
                      >
                        Password
                      </Label>
                      <span className="text-danger inline">*</span>
                    </div>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full px-2 py-2 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.password ? "border-danger" : ""
                      }`}
                    />
                    <span
                      className="flex items-center cursor-pointer gap-1 text-sm select-none"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? (
                        <SquareCheck size={20} className="text-white" />
                      ) : (
                        <Square size={20} className="text-gray-400" />
                      )}
                      Show Password
                    </span>
                    {errors.password && (
                      <p className="text-sm text-danger">{errors.password}</p>
                    )}
                  </MotionDiv>
                  <MotionDiv
                    className="grid gap-1 py-2 relative w-full"
                    variants={itemVariants}
                  >
                    <div>
                      <Label
                        htmlFor="role"
                        className="inline text-sm font-medium"
                      >
                        Role
                      </Label>
                      <span className="text-danger inline">*</span>
                    </div>
                    <Select
                      value={formData.role}
                      onValueChange={handleRoleChange}
                    >
                      <SelectTrigger className="w-full px-3 py-2 border text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entAdmin">Enterprise</SelectItem>
                        {/* <SelectItem value="professional">
                          Professional
                        </SelectItem> */}
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </MotionDiv>
                  {formData.role === "entAdmin" && (
                    <MotionDiv
                      className="grid gap-1 py-2 relative w-full"
                      variants={itemVariants}
                    >
                      <div>
                        <Label
                          htmlFor="domain"
                          className="inline text-sm font-medium"
                        >
                          Domain
                        </Label>
                        <span className="text-danger inline">*</span>
                      </div>
                      <Input
                        type="text"
                        id="domain"
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        required
                        placeholder="ex- google.com, chatgpt.com, rentprompts.com, rentprompts.ai, huggingface.co"
                        className="w-full px-2 py-2 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </MotionDiv>
                  )}
                </MotionDiv>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex bg-gradient-to-br relative group/btn from-indigo-600 to-indigo-700 w-full text-white rounded-md h-10 font-medium select-none"
                >
                  {loading ? "Signing up..." : "Sign Up"}
                  <BottomGradient />
                </Button>
              </form>
            </MotionDiv>
          </MotionDiv>
        </div>
        <Footer />
      </Container>
    </>
  );
};

export default SignupPage;
