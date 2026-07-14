"use client";

import { useState } from 'react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSent(false);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and a message.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const subject = "Message from Portfolio Contact Form";
    const body = `From: ${name} <${email}>\n\n${message}`;
    const mailtoLink = `mailto:jobs.divyansh@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="w-full mt-4 space-y-3"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          className="w-full p-2 bg-gray-900 border border-green-500 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md transition-all duration-300 ease-in-out"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-2 bg-gray-900 border border-green-500 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md transition-all duration-300 ease-in-out"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <textarea
        className="w-full h-32 p-2 bg-gray-900 border border-green-500 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md transition-all duration-300 ease-in-out"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
      {sent && !error && (
        <p className="text-sm text-green-400">
          Opening your email client — feel free to edit and send.
        </p>
      )}
      <button
        type="submit"
        className="mt-2 px-6 py-2 bg-green-600 text-black font-bold rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300"
      >
        Send Message
      </button>
    </form>
  );
}
