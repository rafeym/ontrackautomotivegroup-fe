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
import { useState, useEffect, useRef, useCallback } from "react";
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
  const [allBookedSlots, setAllBookedSlots] = useState<
    Record<string, string[]>
  >({}); // Date -> booked slots mapping
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    timeSlot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New state variables for enhanced polling
  const [isPolling, setIsPolling] = useState(false);
  const [originalTitle, setOriginalTitle] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const hasFetchedAllSlotsRef = useRef<boolean>(false);

  // Safety measures
  const maxPollingDuration = 5 * 60 * 1000; // 5 minutes max polling
  const pollingStartTimeRef = useRef<number>(0);
  const lastApiCallRef = useRef<number>(0);
  const consecutiveErrorsRef = useRef<number>(0);
  const maxConsecutiveErrors = 3;
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const hasTimedOutRef = useRef(false);

  const { toast } = useToast();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Always keep the ref in sync with the state
  useEffect(() => {
    hasTimedOutRef.current = hasTimedOut;
  }, [hasTimedOut]);

  const resetForm = (clearContact = false) => {
    setSelectedDate(undefined);
    setFormData((prev) => ({
      ...prev,
      timeSlot: "",
      ...(clearContact ? { name: "", email: "", phone: "" } : {}),
    }));
  };

  // Function to get all available dates in the range
  const getAvailableDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i <= 14; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  };

  // Function to fetch all booked slots for the entire date range
  const fetchAllBookedSlots = async () => {
    if (!car?.vin || hasFetchedAllSlotsRef.current) return;

    hasFetchedAllSlotsRef.current = true;

    try {
      const dates = getAvailableDates();
      const dateStrings = dates.map((date) => date.toISOString().split("T")[0]);

      const response = await fetch(
        `/api/book-appointment/bulk?dates=${dateStrings.join(",")}&vin=${car.vin}`,
        {
          signal: AbortSignal.timeout(10000),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAllBookedSlots(data.bookedSlots || {});
    } catch (error) {
      console.error("Failed to fetch all booked slots:", error);
      // Reset the flag so we can retry
      hasFetchedAllSlotsRef.current = false;
    }
  };

  // Wrap fetchBookedSlotsWithSafety, startPolling, stopPolling, getBookedSlotsForDate in useCallback
  const fetchBookedSlotsWithSafety = useCallback(
    async (selectedDate: Date, carVin: string) => {
      // Don't make API calls if session has timed out
      if (hasTimedOutRef.current) {
        return;
      }

      const now = Date.now();

      // Rate limiting: minimum 5 seconds between API calls (increased from 2)
      if (now - lastApiCallRef.current < 5000) {
        return;
      }

      // Check if polling has exceeded maximum duration
      if (
        pollingStartTimeRef.current &&
        now - pollingStartTimeRef.current > maxPollingDuration
      ) {
        setHasTimedOut(true);
        stopPolling();
        return;
      }

      lastApiCallRef.current = now;

      try {
        const response = await fetch(
          `/api/book-appointment?date=${selectedDate.toISOString()}&vin=${carVin}`,
          {
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(5000),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBookedSlots(data.bookedSlots || []);

        // Reset error counter on successful request
        consecutiveErrorsRef.current = 0;
      } catch (error) {
        consecutiveErrorsRef.current++;
        console.error("Failed to fetch booked slots:", error);

        // Stop polling after too many consecutive errors
        if (consecutiveErrorsRef.current >= maxConsecutiveErrors) {
          toast({
            title: "Connection Error",
            description:
              "Unable to fetch booking updates. Please refresh the page to continue.",
            variant: "destructive",
          });
          stopPolling();
          return;
        }

        // Show warning after first error
        if (consecutiveErrorsRef.current === 1) {
          toast({
            title: "Connection Issue",
            description:
              "Having trouble fetching updates. Will retry automatically.",
            variant: "default",
          });
        }
      }
    },
    []
  );

  const startPolling = useCallback((fetchBookedSlots: () => Promise<void>) => {
    // Don't start polling if session has timed out
    if (hasTimedOutRef.current) {
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Record polling start time
    pollingStartTimeRef.current = Date.now();

    // Increased interval to 2.5 minutes to reduce API calls
    intervalRef.current = setInterval(fetchBookedSlots, 150000);
    setIsPolling(true);

    // Use setTimeout to ensure the title change happens after state updates
    setTimeout(() => {
      if (originalTitle) {
        document.title = `🟢 Live Booking - ${originalTitle}`;
      } else {
        document.title = "🟢 Live Booking";
      }
    }, 200);
  }, []);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
    pollingStartTimeRef.current = 0;
    consecutiveErrorsRef.current = 0;

    // If session is expired, do not set the tab title here
    if (hasTimedOutRef.current) {
      return;
    }

    setTimeout(() => {
      if (originalTitle) {
        document.title = `⏸️ Booking Paused - ${originalTitle}`;
      } else {
        document.title = "⏸️ Booking Paused";
      }
    }, 200);
  }, []);

  const getBookedSlotsForDate = useCallback(
    (date: Date): string[] => {
      const dateString = date.toISOString().split("T")[0];
      return allBookedSlots[dateString] || [];
    },
    [allBookedSlots]
  );

  // Handle modal open/close
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    if (!newOpen) {
      // Modal is closing - reset date and time slot
      resetForm();
      // Reset timeout state when modal closes
      setHasTimedOut(false);
      // Reset fetch flag when modal closes
      hasFetchedAllSlotsRef.current = false;
      // Restore original title when modal closes
      if (originalTitle) {
        document.title = originalTitle;
      }
    } else {
      // Modal is opening - store original title and fetch all availability
      if (!originalTitle) {
        const currentTitle = document.title;
        setOriginalTitle(currentTitle);
      }
      // Preselect the first available date (today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDate(today);
      setBookedSlots(getBookedSlotsForDate(today));
      // Fetch all booked slots for the entire date range
      fetchAllBookedSlots();
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // Update booked slots for the selected date from our cached data
      const dateBookedSlots = getBookedSlotsForDate(date);
      setBookedSlots(dateBookedSlots);
    } else {
      setBookedSlots([]);
    }
  };

  // Consolidated polling logic
  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPolling(false);
      pollingStartTimeRef.current = 0;
      consecutiveErrorsRef.current = 0;
      if (originalTitle) {
        document.title = originalTitle;
      }
    };

    // If modal is closed, cleanup and return
    if (!open) {
      cleanup();
      return cleanup;
    }

    // If required conditions are not met, cleanup and return
    if (!selectedDate || !car?.vin) {
      cleanup();
      return cleanup;
    }

    // Only start polling if time slot is also selected
    if (!formData.timeSlot) {
      return cleanup;
    }

    // Check if tab is visible and start polling if conditions are met
    const isVisible = document.visibilityState === "visible";
    isVisibleRef.current = isVisible;

    if (isVisible) {
      // Tab is visible - start polling
      startPolling(() => fetchBookedSlotsWithSafety(selectedDate, car.vin));
    } else {
      // Tab is not visible - stop polling
      stopPolling();
    }

    return cleanup;
  }, [
    open,
    selectedDate,
    car?.vin,
    formData.timeSlot,
    originalTitle,
    fetchBookedSlotsWithSafety,
    startPolling,
    stopPolling,
  ]);

  // Visibility change listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only handle if modal is open and date is selected
      if (!open || !selectedDate || !car?.vin) {
        return;
      }

      const isVisible = document.visibilityState === "visible";
      isVisibleRef.current = isVisible;

      // Only start/stop polling if time slot is also selected
      if (!formData.timeSlot) {
        return;
      }

      if (isVisible && !isPolling) {
        // User returned to tab - start polling
        startPolling(() => fetchBookedSlotsWithSafety(selectedDate, car.vin));
      } else if (!isVisible && isPolling) {
        // User left tab - stop polling
        stopPolling();
      }
    };

    // Handle window focus/blur for switching between browser windows
    const handleWindowFocus = () => {
      // Only handle if modal is open and date is selected
      if (!open || !selectedDate || !car?.vin) {
        return;
      }

      // Only start polling if time slot is also selected
      if (!formData.timeSlot) {
        return;
      }

      // Window gained focus - start polling if not already polling
      if (!isPolling) {
        startPolling(() => fetchBookedSlotsWithSafety(selectedDate, car.vin));
      }
    };

    const handleWindowBlur = () => {
      // Only handle if modal is open and date is selected
      if (!open || !selectedDate || !car?.vin) {
        return;
      }

      // Window lost focus - stop polling
      if (isPolling) {
        stopPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [
    open,
    selectedDate,
    car?.vin,
    formData.timeSlot,
    isPolling,
    originalTitle,
    fetchBookedSlotsWithSafety,
    startPolling,
    stopPolling,
  ]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
        `/api/book-appointment?date=${selectedDate.toISOString()}&vin=${car.vin}`,
        {
          signal: AbortSignal.timeout(10000), // 10 second timeout
        }
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
        // Immediately refresh slots so UI updates
        await fetchBookedSlotsWithSafety(selectedDate, car.vin);
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
        signal: AbortSignal.timeout(15000), // 15 second timeout for booking
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Booking Confirmed",
          description: "Your booking has been successfully confirmed!",
          variant: "default",
        });
        setOpen(false);
        resetForm(true); // Clear contact info after successful booking
      } else {
        toast({
          title: "Error",
          description: "Error: " + result.error,
          variant: "destructive",
        });
        // If the error is about the slot being booked, refresh slots
        if (
          result.error &&
          result.error.toLowerCase().includes("already booked")
        ) {
          await fetchBookedSlotsWithSafety(selectedDate, car.vin);
        }
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

  // Countdown timer effect
  useEffect(() => {
    if (!open || hasTimedOut) {
      setTimeLeft(null);
      return;
    }
    if (!formData.timeSlot || !selectedDate) {
      setTimeLeft(null);
      return;
    }
    // Calculate initial time left
    const start = pollingStartTimeRef.current || Date.now();
    const end = start + maxPollingDuration;
    const update = () => {
      const now = Date.now();
      const left = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        setTimeLeft(0);
        setHasTimedOut(true); // Immediately expire session
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [open, formData.timeSlot, selectedDate, hasTimedOut]);

  // Update bookedSlots for the selectedDate whenever allBookedSlots or selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setBookedSlots(getBookedSlotsForDate(selectedDate));
    } else {
      setBookedSlots([]);
    }
  }, [allBookedSlots, selectedDate]);

  // Show toast and update tab title when booking session expires
  useEffect(() => {
    if (hasTimedOut) {
      toast({
        title: "Booking Session Expired",
        description:
          "Your booking session has expired. Please refresh the page to continue.",
        variant: "destructive",
      });
      // Set tab title to Booking Expired
      if (originalTitle) {
        document.title = `Booking Expired - ${originalTitle}`;
      } else {
        document.title = "Booking Expired";
      }
    }
  }, [hasTimedOut, toast, originalTitle]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

        {/* Session Expired Warning */}
        {hasTimedOut && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="text-red-800 font-medium">
                Booking Session Expired
              </div>
            </div>
            <p className="text-red-600 text-sm mt-1">
              Your booking session has expired. Please refresh the page to
              continue booking.
            </p>
          </div>
        )}

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
              disabled={disabled || hasTimedOut}
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
              disabled={disabled || hasTimedOut}
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
              disabled={disabled || hasTimedOut}
            />
          </div>

          <div>
            <Label htmlFor="date">Select Date</Label>
            <div className="w-full flex justify-center items-center rounded-md border p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={new Date()} // Force current month view
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // Start of today
                  const maxDate = addDays(today, 14);
                  maxDate.setHours(23, 59, 59, 999); // End of max date

                  // Disable dates outside our range
                  const isOutsideRange =
                    isBefore(date, today) || isAfter(date, maxDate);

                  return disabled || hasTimedOut || isOutsideRange;
                }}
                initialFocus
              />
            </div>
          </div>

          <div className="w-full">
            <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
              <Label htmlFor="timeSlot">Select Time Slot</Label>
              {formData.timeSlot && !hasTimedOut && (
                <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-2 text-xs ml-auto">
                  <div className="flex items-center gap-1">
                    {isPolling ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Live
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Paused
                      </div>
                    )}
                  </div>
                  {typeof timeLeft === "number" && timeLeft > 0 && (
                    <span className="text-gray-500 font-medium text-right sm:text-left">
                      Booking expires in {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, "0")}
                    </span>
                  )}
                </div>
              )}
              {hasTimedOut && (
                <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-2 text-xs ml-auto">
                  <div className="flex items-center gap-1 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Expired
                  </div>
                </div>
              )}
            </div>
            <Select
              value={formData.timeSlot}
              onValueChange={(value) => handleChange("timeSlot", value)}
              required
              disabled={disabled || hasTimedOut}
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
                      disabled={isBooked || disabled || hasTimedOut}
                      className={
                        isBooked || disabled || hasTimedOut
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
            disabled={isSubmitting || disabled || hasTimedOut}
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
            ) : hasTimedOut ? (
              "Session Expired"
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
