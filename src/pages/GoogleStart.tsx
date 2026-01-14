// // src/pages/GoogleStart.tsx
// import { useEffect } from "react";

// export default function GoogleStart() {
//   useEffect(() => {
//     window.location.href = "http://localhost:4000/auth/google";
//   }, []);

//   return <p>Redirecting to Google...</p>;
// }
// src/pages/GoogleStart.tsx
import { useEffect } from "react";

export default function GoogleStart() {
  useEffect(() => {
    window.location.href = "http://localhost:4000/api/auth/google";
  }, []);

  return <p>Redirecting to Google...</p>;
}
