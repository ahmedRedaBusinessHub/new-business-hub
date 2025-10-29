import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  Textarea,
  Checkbox,
} from "@/components/ui";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
      <div className="text-center space-y-6 mb-8">
        <h1 className="text-4xl font-bold text-(--color-foreground)">
          Next.js Enterprise Application
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
          A scalable, secure application with multi-theme support, role-based
          authentication, and internationalization built with Next.js 16.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select id="subject" defaultValue="">
                <option value="" disabled>
                  Select a subject
                </option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Your message here..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="subscribe" />
              <Label htmlFor="subscribe" className="cursor-pointer">
                Subscribe to newsletter
              </Label>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="flex-1">
                Send Message
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
