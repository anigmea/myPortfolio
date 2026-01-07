"use client";

import { useState } from 'react';

export function ContactForm() {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Please type a message first.");
      return;
    }

    const subject = "Message from Portfolio Contact Form";
    const mailtoLink = `mailto:jobs.divyansh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
  };

  return (
    <form onSubmit={handleSendMessage} className="w-full mt-4">
      <textarea
        className="w-full h-32 p-2 bg-gray-900 border border-green-500 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md transition-all duration-300 ease-in-out"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-green-600 text-black font-bold rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300"
      >
        Send Message
      </button>
    </form>
  );
}
