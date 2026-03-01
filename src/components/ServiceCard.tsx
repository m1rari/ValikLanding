"use client";

import { motion } from "framer-motion";
import { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      className="group relative flex flex-col gap-4 p-6 rounded-2xl bg-surface border border-foreground/10 hover:border-primary/50 transition-colors duration-300 cursor-default"
      whileHover={{
        scale: 1.03,
        boxShadow: "0 8px 32px rgba(245, 166, 35, 0.15)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
        <span
          className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: service.icon }}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed">{service.description}</p>
      </div>

      <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
