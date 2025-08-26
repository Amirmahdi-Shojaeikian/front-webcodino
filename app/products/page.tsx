"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProductsClient from "./ProductsClient";
import { allProducts } from "./data";

export default function ProductsPage() {
  const pathname = usePathname();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Parse filters from URL on mount - only for client-side
  useEffect(() => {
    try {
      // Use setTimeout to avoid React render timing issues
      setTimeout(() => {
        if (pathname !== '/products') {
          const segments = pathname.replace('/products/', '').split('/');
          setActiveFilters(segments);
        } else {
          setActiveFilters([]);
        }
      }, 0);
    } catch (error) {
      console.error('Error parsing filters:', error);
    }
  }, [pathname]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      try {
        const currentPath = window.location.pathname;
        if (currentPath === '/products') {
          setActiveFilters([]);
        } else {
          const segments = currentPath.replace('/products/', '').split('/');
          setActiveFilters(segments);
        }
      } catch (error) {
        console.error('Error handling popstate:', error);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Function to update filters and URL
  const updateFilters = (newFilters: string[]) => {
    try {
      setActiveFilters(newFilters);
      const newPath = newFilters.length > 0 ? `/products/${newFilters.join('/')}` : '/products';
      window.history.pushState({}, '', newPath);
    } catch (error) {
      console.error('Error updating filters:', error);
    }
  };

  // Function to reset filters
  const resetFilters = () => {
    try {
      setActiveFilters([]);
      window.history.pushState({}, '', '/products');
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  };

  return (
    <ProductsClient 
      items={allProducts} 
      activeFilters={activeFilters}
      onFilterChange={updateFilters}
      onResetFilters={resetFilters}
    />
  );
}
