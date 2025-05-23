"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Car } from "@/lib/types";

interface FavoritesContextType {
  favorites: Car[];
  addToFavorites: (car: Car) => void;
  removeFromFavorites: (carId: string) => void;
  isFavorite: (carId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Car[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (car: Car) => {
    setFavorites((prev) => [...prev, car]);
  };

  const removeFromFavorites = (carId: string) => {
    setFavorites((prev) => prev.filter((car) => car._id !== carId));
  };

  const isFavorite = (carId: string) => {
    return favorites.some((car) => car._id === carId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
