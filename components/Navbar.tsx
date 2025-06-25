"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/70 backdrop-blur border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight text-primary hover:opacity-90 transition-opacity"
        >
          OnTrack<span className="text-muted-foreground">AutomotiveGroup</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-md font-medium transition-colors ${
                pathname === href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link href="/favorites" aria-label="Favorites">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Favourites"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Button>
          </Link>
        </nav>

        {/* Mobile / Tablet Navigation */}
        <div className="md:hidden flex items-center">
          {/* Heart icon visible from >375px up to md */}
          <div className="hidden min-[376px]:block sm:block">
            <Link href="/favorites" aria-label="Favorites">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Favourites"
              >
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Hamburger menu and mobile sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Mobile Navigation</SheetTitle>
                </VisuallyHidden>
              </SheetHeader>
              <nav className="mt-8 flex flex-col space-y-4">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`text-base font-medium transition-colors ${
                      pathname === href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                {/* Show 'Favorites' link in mobile nav only for <=375px */}
                <Link
                  href="/favorites"
                  aria-label="Favorites"
                  onClick={() => setIsOpen(false)}
                  className="max-[375px]:block hidden text-base font-medium transition-colors text-muted-foreground hover:text-primary"
                >
                  Favorites
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
