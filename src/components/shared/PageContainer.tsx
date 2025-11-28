import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  centered?: boolean;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  centered = false,
  className = "",
}) => {
  const base = "container mx-auto px-4 py-6 min-h-screen";
  const centeredClass = centered
    ? "bg-gradient-to-br from-background to-muted flex items-center justify-center p-4"
    : "";

  return (
    <div className={`${base} ${centeredClass} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default PageContainer;
