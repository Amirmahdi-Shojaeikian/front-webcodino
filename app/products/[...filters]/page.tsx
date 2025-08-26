"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductsFilteredPage({ params }: { params: { filters: string[] } }) {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to base products page to reset filters
    router.replace('/products');
  }, [router]);

  // Return nothing or a loading state while redirecting
  return null;
}


