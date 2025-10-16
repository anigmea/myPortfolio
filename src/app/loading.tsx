"use client";

import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-black text-green-400 font-mono">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TypeAnimation
          sequence={[
            "Initializing DK-01 Systems...",
            800,
            "Loading neural modules...",
            800,
            "Calibrating sensors...",
            800,
            "Establishing cognitive link...",
            800,
            "Boot sequence complete.",
          ]}
          speed={50}
          style={{
            whiteSpace: "pre-line",
            display: "inline-block",
          }}
          cursor={true}
          repeat={0} // only runs once
        />
      </motion.div>
    </div>
  );
}
