import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function usePolling(ms: number = 600, searchParam: string | null) {
  const router = useRouter();

  useEffect(() => {
    const interfalId = setInterval(() => {
      console.log("interval running");
      if (!searchParam) {
        console.log("refreshing data");
        router.refresh();
      }
    }, ms);
    return () => clearInterval(interfalId);
  }, [searchParam, ms, router]); // ✅ All necessary deps
}
