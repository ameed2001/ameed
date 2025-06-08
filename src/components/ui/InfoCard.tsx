
import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from 'react';
// ArrowLeft is passed as backCtaIcon prop now

interface InfoCardProps {
  title: string;
  description?: string; // For front
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: ReactNode;
  iconWrapperClass?: string;
  iconColorClass?: string;
  dataAiHint?: string;
  cardHeightClass?: string; // e.g., "h-72"
  backTitle?: string; // Title for the back
  backDescription?: string; // Description for the back
  backCtaText?: string; // Call to action text for the back
  backCtaIcon?: ReactNode; // Icon for the back CTA
  applyFlipEffect?: boolean; // To conditionally apply flip
}

const InfoCard = (props: InfoCardProps) => {
  const {
    title,
    description,
    onClick: onClickProp,
    href,
    className,
    icon,
    iconWrapperClass,
    iconColorClass,
    dataAiHint,
    cardHeightClass = "h-auto min-h-[260px]", // Default height
    backTitle,
    backDescription,
    backCtaText = "اضغط للدخول",
    backCtaIcon, // Use this prop for the back CTA icon
    applyFlipEffect = false, // Default to no flip
  } = props;

  const isInteractive = !!href || !!onClickProp;

  const baseCardContainerClasses = cn(
    "w-full rounded-lg",
    cardHeightClass,
    isInteractive && applyFlipEffect && "card-container-3d", // Applies perspective for flip
    isInteractive && "group/card", // General group for hover effects
    // Non-flip card specific hover (if needed, can be simpler or match flip's lift)
    isInteractive && !applyFlipEffect && "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out",
    // Flip card specific hover (lift and shadow)
    applyFlipEffect && "group-hover/card:translate-y-[-10px] group-hover/card:shadow-2xl transition-transform duration-600 ease-card-container",
    className
  );

  const frontFaceContent = (
    <div className={cn(
      "card-face card-front-3d bg-card text-card-foreground p-6 sm:p-8 flex flex-col justify-center items-center text-center",
      cardHeightClass, // ensure face takes height
      !applyFlipEffect && "shadow-lg" // Apply shadow if not flipping
    )}>
      {icon && (
        <div className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-5 sm:mb-6 shrink-0 transition-transform duration-500 ease-card-flip", // Used card-flip timing
          iconWrapperClass,
          // Icon animation on hover (applies to both flip and non-flip cards if group/card is used)
          (isInteractive) && "group-hover/card:scale-110 group-hover/card:rotate-[5deg]"
        )}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { className: cn("h-7 w-7 sm:h-8 sm:w-8", iconColorClass) }) : icon}
        </div>
      )}
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{title}</h3>
      {description && <p className="text-sm sm:text-base text-muted-foreground flex-grow">{description}</p>}
    </div>
  );

  const backFaceContent = (
    <div className={cn(
        "card-face card-back-3d p-5 flex flex-col justify-center items-center text-center", 
        cardHeightClass
      )}>
      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">{backTitle || title}</h3>
      {backDescription && <p className="text-sm sm:text-base mb-3 sm:mb-4 text-white/90 flex-grow">{backDescription}</p>}
      {(href || onClickProp) && (
        <div className="mt-auto bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
          {backCtaIcon}
          <span className="font-semibold">{backCtaText}</span>
        </div>
      )}
    </div>
  );

  const cardStructure = applyFlipEffect ? (
    <div className={cn("card-inner-3d transition-transform duration-800 ease-card-flip", cardHeightClass)} data-ai-hint={dataAiHint}>
      {frontFaceContent}
      {backFaceContent}
    </div>
  ) : (
    <div className={cn("relative w-full h-full bg-card rounded-lg", cardHeightClass)} data-ai-hint={dataAiHint}>
     {frontFaceContent}
    </div>
  );


  if (href && applyFlipEffect) { // Flip cards are links
    return (
      <Link href={href} passHref legacyBehavior>
        <a
          className={cn("outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg block", baseCardContainerClasses)}
          // onClickProp can still be used for analytics or other non-navigation tasks if needed
          onClick={onClickProp} 
        >
          {cardStructure}
        </a>
      </Link>
    );
  }
  
  // For non-flip cards (or cards that shouldn't navigate via href directly)
  return (
    <div
      className={cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg block", 
        baseCardContainerClasses,
        onClickProp && "cursor-pointer" // Add cursor pointer only if onClick is defined
      )}
      onClick={onClickProp} // onClick for non-flip cards (e.g., scrolling)
      role={onClickProp ? "button" : undefined}
      tabIndex={onClickProp ? 0 : undefined}
      onKeyDown={onClickProp ? (e) => (e.key === 'Enter' || e.key === ' ') && onClickProp?.() : undefined}
    >
      {cardStructure}
    </div>
  );
};

export default InfoCard;
