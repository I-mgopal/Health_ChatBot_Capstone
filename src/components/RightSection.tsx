"use client";
import React, { useState } from "react";
import styles from "@/styles/RightSection.module.css";
import healtbotlogo from "@/assets/Healtbot.png";
import nouserlogo from "@/assets/nouserlogo.png";
import Image from "next/image";
import { HashLoader } from "react-spinners";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API as string;
if (!apiKey) {
  throw new Error("Gemini API key is missing!");
}
const ai = new GoogleGenerativeAI(apiKey);
const RightSection = () => {
  const trainingPrompt = [
    {
      role: "user",
      parts: [
        {
          text: "This is Introductory dialogue for any prompt :  'Hello, my dear friend, I am the HealBot AI. Ask me anything regarding health, wellness, fitness, or medical advice. I will be happy to help you.'",
        },
      ],
    },
    { role: "model", parts: [{ text: "okay" }] },

    {
      role: "user",
      parts: [
        {
          text: "Special Dialogue 1 : if any prompt mentions 'Shashi Shahi' word :  'Ofcourse! Dr. Shashi Shahi is one of the prominent professors at UWindsor! He is an IIT-D alumni with year of invaluable experience and a fun way of engaging in lectures!' 'Likes: Analytics and Research and Case Studies ''Dislikes: Students near riverside.'",
        },
      ],
    },
    { role: "model", parts: [{ text: "okay" }] },

    {
      role: "user",
      parts: [
        {
          text: "Special Dialogue 2 : Any prompt that mentions CHATGPT class / classroom  A : ' The CHATGPT Batch of 2023 is by far the best the university has ever seen by all sets of standards. Students from different come together to form a truly diverse and culturally rich classroom experience. I believe that all students are highly capable and will achieve all great things in their professional career!' ",
        },
      ],
    },
    { role: "model", parts: [{ text: "okay" }] },
  ];

  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(true);
  const [allMessages, setAllMessages] = useState<any[]>([]);

  const sendMessage = async () => {
    try {
      setIsSent(false);

      const messagesToSend = [
        ...trainingPrompt,
        ...allMessages,
        {
          role: "user",
          parts: [{ text: message }],
        },
      ];


      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent({ contents: messagesToSend });
      const responseMessage = result.response.candidates[0].content.parts[0].text;

      let newAllMessages = [
        ...allMessages,
        {
          role: "user",
          parts: [{ text: message }],
        },
        {
          role: "model",
          parts: [{ text: responseMessage }],
        },
      ];

      setAllMessages(newAllMessages);
      setMessage("");
      setIsSent(true);
    } catch (err) {
      console.error("Error:", err);
      setIsSent(true);
    }
  };

  return (
    <div className={styles.rightSection}>
      <div className={styles.rightin}>
        <div className={styles.chatgptversion}>
          <p className={styles.text1}>Chat</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>

        {allMessages.length > 0 ? (
          <div className={styles.messages}>
            {allMessages.map((msg, index) => (
              <div key={index} className={styles.message}>
                <Image
                  src={msg.role === "user" ? nouserlogo : healtbotlogo}
                  width={50}
                  height={50}
                  alt=""
                />
                <div className={styles.details}>
                  <h2>{msg.role === "user" ? "You" : "HealBot AI"}</h2>
                  <p>{msg.parts[0].text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.nochat}>
            <div className={styles.s1}>
              <h1>How can I help you today?</h1>
            </div>
            <div className={styles.s2}>
              <div className={styles.suggestioncard}>
                <h2>🟢 Recommend activities</h2>
                <p>Exercise Daily</p>
              </div>
              <div className={styles.suggestioncard}>
                <h2>✨ Today's Health Quote</h2>
                <p>Take care of your body. It’s the only place you have to live</p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.bottomsection}>
          <div className={styles.messagebar}>
            <input
              type="text"
              placeholder="Message HealBotAI..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />

            {isSent ? (
              <svg
                onClick={sendMessage}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
              </svg>
            ) : (
              <HashLoader size={30} />
            )}
          </div>
          <p>HealBot AI can make mistakes. Consider checking important information and consult with a doctor.</p>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
