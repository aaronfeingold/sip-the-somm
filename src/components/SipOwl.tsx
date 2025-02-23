'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import sipTheOwl from "@/public/sipTheOwl.svg";

interface SipOwlProps {
  isExpanded?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SipOwl({ isExpanded = true, onClick, className = '' }: SipOwlProps) {
  return (
    <motion.div
      layout
      className={`cursor-pointer ${className}`}
      initial={false}
      animate={{
        width: isExpanded ? 192 : 48,
        height: isExpanded ? 192 : 48
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={onClick}
    >
      <Image
        src={sipTheOwl}
        alt="SIP the Owl"
        width={isExpanded ? 192 : 48}
        height={isExpanded ? 192 : 48}
        className="w-full h-full object-contain hover:opacity-90 transition-opacity duration-300"
      />
    </motion.div>
  );
}
