import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  onClick?: () => void;
  className?: string;
}

const InfoCard = ({ title, onClick, className }: InfoCardProps) => {
  return (
    <div
      className={cn(
        "w-full sm:w-56 h-60 md:w-64 md:h-72 rounded-2xl p-1 bg-gradient-to-l from-app-gold to-red-500 shadow-card-main cursor-pointer relative overflow-hidden transition-all duration-300 ease-in-out hover:transform hover:-translate-y-2 hover:scale-103 hover:shadow-card-main-hover group",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="bg-card-content-bg rounded-[17px] w-full h-full flex justify-center items-center text-card-content-fg font-bold text-xl md:text-2xl text-center p-5 transition-all duration-300 ease-in-out group-hover:bg-card-content-bg-hover group-hover:text-card-content-hover-fg backdrop-blur-sm">
        {title}
      </div>
    </div>
  );
};

export default InfoCard;
