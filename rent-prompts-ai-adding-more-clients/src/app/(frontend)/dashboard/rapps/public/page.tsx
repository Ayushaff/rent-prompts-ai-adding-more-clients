"use client";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import Popup from "@/components/ui/PopoverCard";
import RappListing from "@/components/ui/rappListing";
import { useUser } from "@/providers/User";
import { useRouter } from "next/navigation";
interface RappData {
  title: string;
  description: string;
  price: string;
  image: File | null;
}

const Public: React.FC = () => {
  const user = useUser();
  const router = useRouter();

  const rappData: RappData[] = [
    {
      title: "AI Chat Assistant",
      description: "An advanced AI-driven chatbot that helps with daily tasks.",
      price: "$15.00",
      image: null, // Replace with a File object or image URL if available
    },
    {
      title: "Image Recognition Tool",
      description:
        "A powerful tool for recognizing objects and scenes in images.",
      price: "$25.00",
      image: null, // Replace with a File object or image URL if available
    },
    {
      title: "Text Summarizer",
      description:
        "Summarize long articles or documents into short, concise summaries.",
      price: "$10.00",
      image: null, // Replace with a File object or image URL if available
    },
    {
      title: "Code Generator",
      description:
        "An AI-powered code generation tool that supports multiple languages.",
      price: "$20.00",
      image: null, // Replace with a File object or image URL if available
    },
    {
      title: "Language Translator",
      description: "Instantly translate text between multiple languages.",
      price: "$12.00",
      image: null, // Replace with a File object or image URL if available
    },
  ];

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // Popup state
  const [email, setEmail] = useState<string>(""); // Email state for popup

  const handlePopupOpen = () => setIsPopupOpen(true);
  const handlePopupClose = () => setIsPopupOpen(false);

  useEffect(() => {
    if (!user) {
      return router.push("/auth/signIn");
      }
  },[user])

  const handleSend = () => {
    // Implement the share logic using the email
    alert(`Form shared with ${email}`);
    handlePopupClose(); // Close the popup after sharing
  };

  return (
    <Container>
      <div className="mb-6">
        <h2 className="text-xl font-bold mt-6 mb-6">Rapp Listing Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rappData.map((rapp, index) => (
            <RappListing
              key={index}
              privateRapp={{
                id: index.toString(), // You may want to replace this with a unique ID
                name: rapp.title,
                description: rapp.description,
                totalCost: rapp.price,
                images: rapp.image ? [{ image: URL.createObjectURL(rapp.image) }] : [],
                modelType: "AI Tool", // Example; modify according to your needs
                likes_length: 0, // Default value, adjust as necessary
                likes_user_id: [], // Example; modify according to your needs
                isFeatured: false, // Example; modify according to your needs
              }}
              index={index}
              user={null} // Adjust as per your user management logic
            />
          ))}
        </div>
      </div>
      {/* Popup component for sharing */}
      {isPopupOpen && (
        <Popup onClose={handlePopupClose}>
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleSend}>Send</Button>
        </Popup>
      )}
    </Container>
  );
};

export default Public;
