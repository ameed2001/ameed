
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from 'react';

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
  applyFlipEffect?: boolean; 
  backCustomContent?: ReactNode;
  backCustomClass?: string;
}

const InfoCard = (props: InfoCardProps) => {
  const {
    title,
    description,
    onClick,
    href,
    className,
    icon,
    iconWrapperClass,
    iconColorClass,
    dataAiHint,
    cardHeightClass = "h-72",
    applyFlipEffect = false,
    backCustomContent,
    backCustomClass,
  } = props;

  const isInteractive = !!href || !!onClick;

  const FrontContent = () => (
    <div className={cn(
      "card-flipper-front bg-card text-card-foreground p-6 sm:p-8 flex flex-col justify-center items-center text-center",
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

  const BackContent = () => (
     <div className={cn(
        "card-flipper-back p-4",
        cardHeightClass,
        backCustomClass
      )}>
        {backCustomContent}
    </div>
  );

  if (applyFlipEffect) {
    return (
      <div 
        className={cn("card-flipper", cardHeightClass, className)} 
        data-ai-hint={dataAiHint}
      >
        <div className="card-flipper-inner">
          <FrontContent />
          <BackContent />
        </div>
      </div>
    );
  }

  // Fallback for non-flipping cards
  const Tag = isInteractive && href ? Link : 'div';
  const interactiveProps = isInteractive && href ? { href } : { onClick };

  return (
    <Tag
      {...interactiveProps}
      className={cn(
        "bg-card text-card-foreground p-6 sm:p-8 flex flex-col justify-center items-center text-center border border-border shadow-lg rounded-xl",
        "transition-all duration-300 ease-in-out",
        isInteractive && "hover:shadow-xl hover:-translate-y-2 cursor-pointer",
        cardHeightClass,
        className
      )}
      data-ai-hint={dataAiHint}
    >
      {icon && (
        <div className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-5 sm:mb-6 shrink-0",
          iconWrapperClass
        )}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { className: cn("h-7 w-7 sm:h-8 sm:w-8", iconColorClass) }) : icon}
        </div>
      )}
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{title}</h3>
      {description && <p className="text-sm sm:text-base text-muted-foreground flex-grow">{description}</p>}
    </Tag>
  );
};

export default InfoCard;
