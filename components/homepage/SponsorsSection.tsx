"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Sponsor {
  name: string;
  logo: string;
  website: string;
  tier: string;
}

interface SponsorsSectionProps {
  sponsorTiers: string[];
  sponsors: Sponsor[];
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  sponsorTiers,
  sponsors,
}) => {
  return (
    <section
      id="sponsors"
      className="w-full py-32 md:py-44 flex flex-col items-center justify-center bg-gray-50 text-black"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center mb-8 md:mb-12 px-4 md:px-0"
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-2 font-dfvn">
          2025 Sponsors
        </h2>
        <p className="text-lg md:text-2xl">
          HackKU is supported by an incredible group of sponsors who make this
          event possible.
        </p>
      </motion.div>

      {sponsorTiers.map((tier, index) => (
        <motion.div
          key={tier}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: index * 0.1, // Offset start times
          }}
          className="w-full py-3 md:pt-10 md:pb-4 pb-10"
        >
          <h3 className="text-4xl md:text-4xl font-semibold mb-3 text-center font-dfvn">
            {tier} Tier
          </h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-12">
            {sponsors
              .filter((sponsor) => sponsor.tier === tier)
              .map((sponsor) => (
                <motion.a
                  key={sponsor.name}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  aria-label={`View details of ${sponsor.name}`}
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={400 / (index * 0.5 + 1.5)}
                    height={400 / (index * 0.5 + 1.5)}
                    className="object-contain h-auto cursor-pointer transition-all duration-100"
                  />
                </motion.a>
              ))}
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default SponsorsSection;
