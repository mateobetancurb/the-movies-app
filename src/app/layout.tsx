import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { FavoritesProvider } from "../context/FavoritesContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "The movies app",
	description:
		"An app to search, watch trailers, and save your favorite movies",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<FavoritesProvider>
					<Navbar />
					{children}
					<Footer />
				</FavoritesProvider>
				<Analytics />
			</body>
		</html>
	);
}
