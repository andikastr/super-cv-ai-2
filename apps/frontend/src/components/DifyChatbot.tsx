"use client";

import { useEffect } from "react";

export function DifyChatbot() {
    useEffect(() => {
        // Enable chatbot by adding class to body
        // This removes the global "display: none" constraint
        document.body.classList.add("dify-chat-enabled");

        // Add custom theme styles (colors/size)
        const themeStyle = document.createElement("style");
        themeStyle.id = "dify-chatbot-theme";
        themeStyle.textContent = `
            #dify-chatbot-bubble-button {
                background-color: #1C64F2 !important;
            }
            #dify-chatbot-bubble-window {
                width: 24rem !important;
                height: 40rem !important;
            }
        `;
        document.head.appendChild(themeStyle);

        // Cleanup: Remove class and styles when component unmounts
        return () => {
            document.body.classList.remove("dify-chat-enabled");
            const themeStyleEl = document.getElementById("dify-chatbot-theme");
            if (themeStyleEl) themeStyleEl.remove();
        };
    }, []);

    return null;
}
