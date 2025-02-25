import "./globals.css";

import { Providers } from "@/provider";

export const metadata = {
  title: "SIP The Owl",
  description: "Somm-in-Palm (SIP) is a wine pairing analysis tool.",
};

const polygon =
  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)";

const base =
  "relative aspect-[1155/678] sm:w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden">
        <main className="h-screen bg-pink-900 text-white isolate overflow-hidden">
          {/* Upper left gradient */}
          <div className="absolute top-0 left-0 -z-10 transform-gpu overflow-hidden blur-3xl">
            <div
              className={`${base} left-[calc(50%-11rem)] w-[36.125rem] -translate-x-1/2`}
              style={{
                clipPath: polygon,
              }}
            />
          </div>

          {/* Center gradient */}
          <div className="absolute top-[calc(50%-30rem)] left-[calc(50%-30rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(50%-30rem)] sm:left-[calc(50%-30rem)]">
            <div
              className={base}
              style={{
                clipPath: polygon,
              }}
            />
          </div>

          {/* Lower right gradient */}
          <div className="absolute bottom-0 right-[calc(50%-30rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:right-[calc(50%-30rem)]">
            <div
              className={base}
              style={{
                clipPath: polygon,
              }}
            />
          </div>

          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
