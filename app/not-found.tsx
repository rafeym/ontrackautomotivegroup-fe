import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-4 space-y-8">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary tracking-tight">
            404
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            The requested page could not be found. Please return to our
            homepage.
          </p>
        </div>
      </div>
      <Button asChild size="lg" className="mt-4">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
