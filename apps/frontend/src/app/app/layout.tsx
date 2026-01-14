import { Navbar } from "@/components/Navbar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {/* Add padding-top to account for fixed navbar */}
            <main className="pt-24">
                {children}
            </main>
        </>
    );
}
