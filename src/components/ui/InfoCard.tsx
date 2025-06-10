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
  backCustomContent?: ReactNode; // New prop for custom back content
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
    backCustomContent, // Destructure new prop
  } = props;

  const isInteractive = !!href || !!onClickProp || !!backCustomContent;

  const baseCardContainerClasses = cn(
    "w-full rounded-lg",
    cardHeightClass,
    isInteractive && applyFlipEffect && "card-container-3d",
    isInteractive && "group/card",
    isInteractive && !applyFlipEffect && "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out",
    applyFlipEffect && "group-hover/card:translate-y-[-10px] group-hover/card:shadow-2xl transition-transform duration-600 ease-card-container",
    className
  );

  const frontFaceContent = (
    <div className={cn(
      "card-face card-front-3d bg-card text-card-foreground p-6 sm:p-8 flex flex-col justify-center items-center text-center border border-border",
      cardHeightClass,
      !applyFlipEffect && "shadow-lg"
    )}>
      {icon && (
        <div className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-5 sm:mb-6 shrink-0 transition-transform duration-500 ease-card-flip card-icon",
          iconWrapperClass,
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
        "card-face card-back-3d p-5 flex flex-col justify-center items-center text-center border border-primary-dark-flip",
        cardHeightClass
      )}>
      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">{backTitle || title}</h3>
      {backDescription && <p className="text-sm sm:text-base mb-3 sm:mb-4 text-white/90 flex-grow">{backDescription}</p>}
      
      {backCustomContent ? ( // Render custom back content if provided
        <div className="mt-auto w-full">{backCustomContent}</div>
      ) : (href || onClickProp) && backCtaText ? ( // Else, render default CTA button
        <div className="mt-auto bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
          {backCtaIcon || <ArrowLeft className="h-4 w-4" />}
          <span className="font-semibold">{backCtaText}</span>
        </div>
      ) : null}
    </div>
  );

  const cardStructure = applyFlipEffect ? (
    <div className={cn("card-inner-3d transition-transform duration-800 ease-card-flip", cardHeightClass)} data-ai-hint={dataAiHint}>
      {frontFaceContent}
      {backFaceContent}
    </div>
  ) : (
    <div className={cn("relative w-full h-full bg-card rounded-lg", cardHeightClass, !applyFlipEffect && "border border-border shadow-lg")} data-ai-hint={dataAiHint}>
     {frontFaceContent}
    </div>
  );

  if (href && !onClickProp && !backCustomContent) {
    return (
      <Link
        href={href}
        className={cn("outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg block", baseCardContainerClasses)}
      >
        {cardStructure}
      </Link>
    );
  }
  
  return (
    <div
      className={cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg block", 
        baseCardContainerClasses,
        (onClickProp || (applyFlipEffect && backCustomContent)) && "cursor-pointer" 
      )}
      onClick={onClickProp} 
      role={(onClickProp || (applyFlipEffect && backCustomContent)) ? "button" : undefined}
      tabIndex={(onClickProp || (applyFlipEffect && backCustomContent)) ? 0 : undefined}
      onKeyDown={(onClickProp || (applyFlipEffect && backCustomContent)) ? (e) => (e.key === 'Enter' || e.key === ' ') && onClickProp?.() : undefined}
    >
      {cardStructure}
    </div>
  );
};

export default InfoCard;