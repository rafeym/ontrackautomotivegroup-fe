"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { addDays, isBefore, isAfter } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type Car = {
  vin: string;
  make: string;
  model: string;
  year: string;
  mileage?: number;
  price: number;
};

export default function BookAppointmentModal({
  car,
  disabled = false,
}: {
  car: Car;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    timeSlot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast(); // Get toast function from useToast

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      timeSlot: "",
    });
    setSelectedDate(undefined);
  };

  useEffect(() => {
    if (!open || !selectedDate || !car?.vin) return;

    const fetchBookedSlots = async () => {
      try {
        const response = await fetch(
          `/api/book-appointment?date=${selectedDate.toISOString()}&vin=${car.vin}`
        );
        const data = await response.json();
        setBookedSlots(data.bookedSlots || []);
      } catch (error) {
        console.error("Failed to fetch booked slots:", error);
      }
    };

    // Initial fetch
    fetchBookedSlots();

    // Only poll if the modal is open and a time slot is selected
    if (formData.timeSlot) {
      const interval = setInterval(fetchBookedSlots, 10000);
      return () => clearInterval(interval);
    }
  }, [open, selectedDate, car?.vin, formData.timeSlot]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !formData.timeSlot) {
      toast({
        title: "Missing Information",
        description: !selectedDate
          ? "Please select a date."
          : "Please select a timeslot",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Final availability check before booking
      const slotCheck = await fetch(
        `/api/book-appointment?date=${selectedDate.toISOString()}&vin=${car.vin}`
      );
      const slotData = await slotCheck.json();

      if (!slotData.success) {
        toast({
          title: "Error",
          description:
            "Error checking availability: " +
            (slotData.error || "Please try again."),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const latestBookedSlots: string[] = slotData.bookedSlots;

      if (latestBookedSlots.includes(formData.timeSlot)) {
        toast({
          title: "Error",
          description:
            "Time slot just got booked by someone else. Please select a different one.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          vin: car.vin,
          make: car.make,
          model: car.model,
          year: car.year,
          mileage: car.mileage,
          price: car.price,
          date: selectedDate.toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Booking Confirmed",
          description: "Your booking has been successfully confirmed!",
          variant: "default",
        });
        setOpen(false);
        resetForm();
      } else {
        toast({
          title: "Error",
          description: "Error: " + result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Booking Failed",
        description: "Booking failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = Array.from({ length: 10 }, (_, i) => `${9 + i}:00`);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          disabled={disabled}
          aria-disabled={disabled}
          className={disabled ? "cursor-not-allowed opacity-50" : ""}
        >
          Book an Appointment
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-sm md:max-w-lg lg:max-w-xl border border-gray-300 rounded-lg shadow-lg px-4 sm:px-6 overflow-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book Appointment</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex justify-between items-start gap-4 w-full">
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="font-semibold text-black">
              {car.year} {car.make} {car.model}
            </div>
            <div>VIN: {car.vin}</div>
            {car.mileage !== undefined && (
              <div>
                Mileage:{" "}
                <span className="font-medium text-black">
                  {car.mileage.toLocaleString()} km
                </span>
              </div>
            )}
          </div>
          <div className="bg-black border border-black text-white font-semibold rounded-lg px-4 py-2 text-right shadow-sm whitespace-nowrap">
            <div className="text-xs uppercase tracking-wide">Price</div>
            <div className="text-lg font-bold">{formatCurrency(car.price)}</div>
          </div>
        </div>

        <form className="mt-6 space-y-4 w-full" onSubmit={handleSubmit}>
          <div className="w-full">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              className="w-full"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              disabled={disabled}
            />
          </div>

          <div className="w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="w-full"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={disabled}
            />
          </div>

          <div className="w-full">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              className="w-full"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
              disabled={disabled}
            />
          </div>

          <div>
            <Label htmlFor="date">Select Date</Label>
            <div className="w-full flex justify-center items-center rounded-md border p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  const today = new Date();
                  const maxDate = addDays(today, 14);
                  return (
                    disabled || isBefore(date, today) || isAfter(date, maxDate)
                  );
                }}
              />
            </div>
          </div>

          <div className="w-full">
            <Label htmlFor="timeSlot">Select Time Slot</Label>
            <Select
              value={formData.timeSlot}
              onValueChange={(value) => handleChange("timeSlot", value)}
              required
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  return (
                    <SelectItem
                      key={slot}
                      value={slot}
                      disabled={isBooked || disabled}
                      className={
                        isBooked || disabled
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    >
                      {slot} {isBooked ? "(Booked)" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isSubmitting || disabled}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
