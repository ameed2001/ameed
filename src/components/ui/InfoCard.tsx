
import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  description: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: ReactNode;
  iconWrapperClass?: string;
  iconColorClass?: string;
  dataAiHint?: string;
}

const InfoCard = (props: InfoCardProps) => {
  const { title, description, onClick: onClickProp, href, className, icon, iconWrapperClass, iconColorClass, dataAiHint } = props;

  const cardContent = (
    <div
      className={cn(
        "w-full bg-card rounded-xl shadow-lg p-6 text-center transition-all duration-300 ease-in-out flex flex-col items-center h-full",
        onClickProp && !href && "cursor-pointer",
        className
      )}
      onClick={!href ? onClickProp : undefined}
      role={!href && onClickProp ? "button" : undefined}
      tabIndex={!href && onClickProp ? 0 : undefined}
      onKeyDown={!href && onClickProp ? (e) => (e.key === 'Enter' || e.key === ' ') && onClickProp?.() : undefined}
      data-ai-hint={dataAiHint}
    >
      {icon && (
        <div className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-5 shrink-0",
          iconWrapperClass
        )}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { className: cn("h-7 w-7", iconColorClass) }) : icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground flex-grow">{description}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a className="outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl block h-full">
          {cardContent}
        </a>
      </Link>
    );
  }

  return cardContent;
};

export default InfoCard;
