
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode; // Optional icon
}

const InfoCard = ({ title, onClick, className, icon }: InfoCardProps) => {
  return (
    <div
      className={cn(
        "w-full sm:w-[200px] h-[260px] md:w-[220px] md:h-[280px] rounded-2xl p-0.5 shadow-card-main cursor-pointer relative overflow-hidden transition-all duration-300 ease-in-out hover:transform hover:-translate-y-2 hover:scale-103 hover:shadow-card-main-hover group",
        "bg-gradient-to-l from-[#f7ba2b] to-[#ea5358]", // Gradient from HTML .card
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
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
};

export default InfoCard;

    