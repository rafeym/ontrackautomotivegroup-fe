"use client";

import { Button } from "./ui/button";
import { FileText } from "lucide-react";

// Define the props the component accepts
const CarfaxButton = ({ carfaxUrl }: { carfaxUrl?: string | null }) => {
  // Add a check to disable the button if carfaxUrl is not provided
  return (
    <Button
      variant="outline"
      size="default"
      className="flex items-center gap-2"
      // Only add the onClick handler if carfaxUrl exists
      onClick={carfaxUrl ? () => window.open(carfaxUrl, "_blank") : undefined}
      disabled={!carfaxUrl} // Disable if no URL is present
    >
      <FileText className="h-4 w-4" />
      View Carfax
    </Button>
  );
};

export default CarfaxButton;
