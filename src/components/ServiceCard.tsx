"use client";

import { motion } from "framer-motion";
import { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      className="group relative flex min-h-[240px] flex-col gap-4 rounded-3xl border border-foreground/10 bg-dark p-6 shadow-sm transition-colors duration-200 hover:border-primary/50"
      whileHover={{
        y: -4,
        boxShadow: "0 14px 34px rgba(31, 28, 25, 0.10)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20 transition-colors duration-200 group-hover:bg-primary group-hover:text-onPrimary">
        <span
          className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: service.icon }}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
          {service.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed">{service.description}</p>
      </div>

      <div className="mt-auto h-px w-12 bg-primary/70 transition-all duration-200 group-hover:w-20" />
    </motion.div>
  );
}
