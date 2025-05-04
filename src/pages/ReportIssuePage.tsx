import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReportIssuePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/support/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, description }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit an issue!");
      }

      await res.json();
      toast.success("Issue submitted successfully");

      setName("");
      setEmail("");
      setDescription("");
    } catch (err) {
      console.log("Error submitting this issue:", err);
      toast.error("There was a mistake submitting your issue.");
    }
  };

  return (
    <Tabs defaultValue="form">
      <TabsList>
        <TabsTrigger value="form">Report an Issue</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
      </TabsList>

      <TabsContent
        value="form"
        className="space-y-5 bg-gray-50 p-10 rounded-lg max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-bold">Something not working?</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Textarea
            placeholder="Describe the issue you're facing"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Submit Issue
          </Button>
        </form>
      </TabsContent>

      <TabsContent
        value="faq"
        className="bg-gray-50 p-10 rounded-lg max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
          <li>Make sure your internet connection is active.</li>
          <li>Try refreshing the page or logging out and back in.</li>
          <li>If the problem persists, use the form to contact support.</li>
        </ul>
      </TabsContent>
    </Tabs>
  );
};

export default ReportIssuePage;
