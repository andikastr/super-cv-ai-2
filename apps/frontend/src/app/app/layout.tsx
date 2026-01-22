import { Navbar } from "@/components/Navbar";
import { DifyChatbot } from "@/components/DifyChatbot";

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
            {/* Dify AI Career Coach Chatbot */}
            <DifyChatbot />
        </>
    );
}
