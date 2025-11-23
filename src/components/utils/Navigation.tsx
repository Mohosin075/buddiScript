import { navLinks } from "@/lib/navigation-data";
import { NavLink } from "react-router";

export const Navigation = () => {
  return (
    <>
      {navLinks.map((link, index) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) =>
            `group relative text-sm font-medium transition-colors hover:text-primary ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <div className="relative flex flex-col items-center">
              <div className="flex items-center justify-center">
                <link.icon className="w-5 h-5" />
              </div>
              {/* Badge for last 3 items */}
              {index > 0 && (
                <div className="absolute -top-2 -right-3 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {index === 1 && 3} {/* Friend requests */}
                  {index === 2 && 5} {/* Notifications */}
                  {index === 3 && 2} {/* Messages */}
                </div>
              )}
              {/* Hover bar */}
              <div
                className={`
                  absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary 
                  transition-all duration-200 ease-in-out 
                  group-hover:w-8
                  ${isActive ? "!w-8" : ""}
                `}
              />
            </div>
          )}
        </NavLink>
      ))}
    </>
  );
};

export default Navigation;
