
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InfoCardProps {
  title: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: React.ReactNode; // Optional icon
  dataAiHint?: string; // For placeholder images if used within card content
}

const InfoCard = ({ title, onClick, href, className, icon, dataAiHint }: InfoCardProps) => {
  const cardContent = (
    <div
      className={cn(
        "w-full sm:w-[200px] h-[260px] md:w-[220px] md:h-[280px] rounded-2xl p-0.5 shadow-card-main cursor-pointer relative overflow-hidden transition-all duration-300 ease-in-out hover:transform hover:-translate-y-2 hover:scale-103 hover:shadow-card-main-hover group",
        "bg-gradient-to-l from-[#f7ba2b] to-[#ea5358]", // Gradient from HTML .card
        className
      )}
      onClick={!href ? onClick : undefined} // Only use onClick if href is not provided
      role={href ? undefined : "button"} // Role is button only if it's not a link
      tabIndex={href ? undefined : 0} // TabIndex for non-link cards
      onKeyDown={!href ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick?.() : undefined}
      data-ai-hint={dataAiHint}
    >
      <div className={cn(
        "rounded-[15px] w-full h-full flex flex-col justify-center items-center text-white font-bold text-xl md:text-2xl text-center p-4 transition-all duration-300 ease-in-out backdrop-blur-sm",
        "bg-[rgba(5,6,45,0.9)] group-hover:bg-[rgba(5,6,45,0.95)] group-hover:text-[#f7ba2b]" // Styles from HTML .card__content
      )}>
        {icon && <div className="mb-3 text-app-gold group-hover:text-white transition-colors">{icon}</div>}
        {title}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a className="outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-2xl">
          {cardContent}
        </a>
      </Link>
    );
  }

  return cardContent;
};

export default InfoCard;
