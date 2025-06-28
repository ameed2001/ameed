
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

interface InfoCardProps {
  title: string;
  description?: string; 
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: ReactNode;
  iconWrapperClass?: string;
  iconColorClass?: string;
  dataAiHint?: string;
  cardHeightClass?: string; 
  backTitle?: string; 
  backDescription?: string; 
  backCtaText?: string; 
  backCtaIcon?: ReactNode; 
  applyFlipEffect?: boolean; 
  backCustomContent?: ReactNode;
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
    cardHeightClass = "h-72",
    backTitle,
    backDescription,
    backCtaText = "اضغط للدخول",
    backCtaIcon,
    applyFlipEffect = false,
    backCustomContent,
  } = props;

  const isInteractive = !!href || !!onClickProp || !!backCustomContent;

  const baseCardContainerClasses = cn(
    "w-full rounded-xl",
    cardHeightClass,
    isInteractive && applyFlipEffect && "card-container-3d",
    isInteractive && "group/card",
    isInteractive && !applyFlipEffect && "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out",
    applyFlipEffect && "group-hover/card:translate-y-[-10px] group-hover/card:shadow-2xl transition-transform duration-600 ease-card-container",
    className
  );

  const frontFaceContent = (
    <div className={cn(
      "card-face card-front-3d bg-card text-card-foreground p-6 sm:p-8 flex flex-col justify-center items-center text-center border border-border shadow-lg",
      cardHeightClass
    )}>
      {icon && (
        <div className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-5 sm:mb-6 shrink-0 card-icon",
          iconWrapperClass
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
        {backCustomContent ? (
          <div className="w-full h-full flex flex-col justify-center items-center">{backCustomContent}</div>
        ) : (
          <>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">{backTitle || title}</h3>
            {backDescription && <p className="text-sm sm:text-base mb-3 sm:mb-4 text-white/90 flex-grow">{backDescription}</p>}
            
            {(href || onClickProp) && backCtaText && (
              <div className="mt-auto bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors text-white">
                {backCtaIcon || <ArrowLeft className="h-4 w-4" />}
                <span className="font-semibold">{backCtaText}</span>
              </div>
            )}
          </>
        )}
    </div>
  );

  const cardStructure = applyFlipEffect ? (
    <div className={cn("card-inner-3d transition-transform duration-800 ease-card-flip", cardHeightClass)} data-ai-hint={dataAiHint}>
      {frontFaceContent}
      {backFaceContent}
    </div>
  ) : (
    <div className={cn("relative w-full h-full bg-card rounded-xl", cardHeightClass, !applyFlipEffect && "border border-border shadow-lg")} data-ai-hint={dataAiHint}>
     {frontFaceContent}
    </div>
  );

  if (href && !applyFlipEffect) {
    return (
      <Link
        href={href}
        className={cn("outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl block", baseCardContainerClasses)}
      >
        {cardStructure}
      </Link>
    );
  }
  
  return (
    <div
      className={cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl block", 
        baseCardContainerClasses,
        (onClickProp || applyFlipEffect) && "cursor-pointer" 
      )}
      onClick={onClickProp} 
      role={(onClickProp || applyFlipEffect) ? "button" : undefined}
      tabIndex={(onClickProp || applyFlipEffect) ? 0 : undefined}
      onKeyDown={(onClickProp || applyFlipEffect) ? (e) => (e.key === 'Enter' || e.key === ' ') && onClickProp?.() : undefined}
    >
      {cardStructure}
    </div>
  );
};

export default InfoCard;
