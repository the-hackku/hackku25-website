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
  id?: string;
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  sponsorTiers,
  sponsors,
  id,
}) => {
  // Function to determine logo size based on tier rank
  const getLogoSize = (tier: string) => {
    const tierIndex = sponsorTiers.indexOf(tier);
    if (tierIndex === -1) return { height: "h-20", maxWidth: "max-w-[180px]" }; // Default size if not found

    // Scale sizes: Higher tiers get larger images
    const sizeMap = [
      { height: "h-32", maxWidth: "max-w-[300px]" }, // Top tier (largest)
      { height: "h-28", maxWidth: "max-w-[260px]" }, // 2nd tier
      { height: "h-24", maxWidth: "max-w-[220px]" }, // 3rd tier
      { height: "h-20", maxWidth: "max-w-[180px]" }, // Lowest tier
    ];

    return sizeMap[tierIndex] || sizeMap[sizeMap.length - 1]; // Default to smallest size if out of range
  };

  return (
    <section
      id={id}
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

      {sponsorTiers
        .filter((tier) => tier !== "Partner")
        .map((tier, index) => (
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              delay: index * 0.1,
            }}
            className="w-full py-3 md:pt-10 md:pb-4 pb-10"
          >
            <h3 className="text-4xl md:text-4xl font-semibold mb-3 text-center font-dfvn">
              {tier} Tier
            </h3>
            <div className="flex flex-wrap justify-center gap-4 md:gap-12">
              {sponsors
                .filter((sponsor) => sponsor.tier === tier)
                .map((sponsor) => {
                  const { height, maxWidth } = getLogoSize(tier);
                  return (
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
                        width={300} // Required by Next.js
                        height={200}
                        className={`w-auto ${height} ${maxWidth} object-contain cursor-pointer transition-all duration-100`}
                      />
                    </motion.a>
                  );
                })}
            </div>
          </motion.div>
        ))}

      {/* Partners Section */}
      {sponsors.some((sponsor) => sponsor.tier === "Partner") && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center mt-16 mb-8 md:mb-12 px-4 md:px-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-center mb-8 md:mb-12 px-4 md:px-0"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-2 font-dfvn">
              Partners
            </h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-12">
            {sponsors
              .filter((sponsor) => sponsor.tier === "Partner")
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
                    width={300}
                    height={200}
                    className="h-24 md:h-28 w-auto max-w-[200px] md:max-w-[px] object-contain cursor-pointer transition-all duration-100"
                  />
                </motion.a>
              ))}
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default SponsorsSection;
