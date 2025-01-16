"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../input";
import { Copy } from "lucide-react";
import { Label } from "../label";

const ApiKeyFetch = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiEnabled, setIsApiEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApiKey = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/getApiKey`);
      if (!response.ok) throw new Error("Failed to fetch API key");

      const data = await response.json();

      // Determine if API key is enabled based on the response type
      if (data.message === "API key is not enabled") {
        setIsApiEnabled(false);
        setApiKey(null);
      } else {
        setIsApiEnabled(true);
        setApiKey(data);
      }
    } catch (err) {
      toast.error(err.message || "Error fetching API key");
    } finally {
      setIsLoading(false);
    }
  };

  const enableApiKey = async () => {
    try {
      if (isApiEnabled) {
        toast.error("API key is already enabled");
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/enableApikey`);
      if (!response.ok) throw new Error("Failed to enable API key");

      const data = await response.json();
      setApiKey(data || null);
      setIsApiEnabled(true);
      toast.success("API Key enabled successfully");
    } catch (err) {
      toast.error(err.message || "Error enabling API key");
    }
  };

  const disableApiKey = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/disableApikey`);
      if (!response.ok) throw new Error("Failed to disable API key");

      setIsApiEnabled(false);
      setApiKey(null);
      toast.success("API Key disabled successfully");
    } catch (err) {
      toast.error(err.message || "Error disabling API key");
    }
  };

  const generateNewApiKey = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/newApiKey`);
      if (!response.ok) throw new Error("Failed to generate a new API key");

      const data = await response.json();
      setApiKey(data || null);
      toast.success("New API Key generated successfully");
    } catch (err) {
      toast.error(err.message || "Error generating new API key");
    }
  };

  const copyApiKey = async () => {
    if (!apiKey) {
      toast.error("No API key to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success("API key copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy API key");
    }
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-4 text-gray-500">Loading...</div>;
  }

  return (
    <div className="py-2">
      {isApiEnabled ? (
        <div>
          <div className="mb-2 w-full flex flex-row gap-2 items-center">
            <Label htmlFor="apiKey">API Key:</Label>
            <Input id="apiKey" type="text" value={apiKey || ""} readOnly />
            <div
              onClick={copyApiKey}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md cursor-pointer"
            >
              <Copy className="w-5 h-5" />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={generateNewApiKey}
              className="text-xs font-medium bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
            >
              Generate New API Key
            </button>
            <button
              onClick={disableApiKey}
              className="text-xs font-medium bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
            >
              Disable API Key
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={enableApiKey}
          className="text-xs font-medium bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
        >
          Enable API Key
        </button>
      )}
    </div>
  );
};

export default ApiKeyFetch;
