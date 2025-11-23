import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { logout } from "@/redux/slices/authSlice";
import { DialogTitle } from "@radix-ui/react-dialog";
import Cookie from "js-cookie";
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  HomeIcon,
  LogOut,
  Menu,
  MessageCircleQuestionMark,
  Search,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import Navigation from "../utils/Navigation";
import { navLinks } from "@/lib/navigation-data";
import { Dialog } from "../ui/dialog";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const isUser = localStorage.getItem("userRole");
  const { data } = useGetProfileQuery();
  const user = data?.data;

  const isAuthenticated =
    Cookie.get("isAuthenticated") || localStorage.getItem("isAuthenticated");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    Cookie.remove("token");
    Cookie.remove("userRole");
    Cookie.remove("isAuthenticated");
    Cookie.remove("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");

    toast.info("You have been logged out successfully");
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchText);
  };

  const clearInput = () => {
    setSearchText("");
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 mx-auto flex h-16 items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-20">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <img src="/images/logo.svg" alt="logo" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-1 w-full">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="relative w-full">
                  {/* Left Search Icon */}
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  {/* Input Field */}
                  <input
                    type="text"
                    placeholder="input search text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-border rounded-4xl bg-muted text-sm
                         hover:border-primary
                         focus:border-primary
                         focus:outline-none focus:ring-1 focus:ring-ring
                         transition-colors duration-200 ease-in-out"
                  />

                  {/* Right Clear (X) Icon */}
                  {searchText && (
                    <X
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                      onClick={clearInput}
                    />
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right side - User section */}
          <div className="flex items-center space-x-4">
            {/* Search icon for mobile */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Desktop Navigation */}
            {/* <Navigation /> */}
            <div className="hidden lg:flex items-center space-x-12 mr-10">
              <Navigation />
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-1">
              {isAuthenticated === "true" && user ? (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user?.image ||
                        "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png"
                      }
                      alt={user?.name}
                    />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span className="font-medium capitalize">
                      {user.name || "User"}
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-64 p-4 space-y-3"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex space-x-3 items-center">
                          <Avatar className="h-14 w-14">
                            <AvatarImage
                              src={
                                user?.image ||
                                "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png"
                              }
                              alt={user?.name}
                            />
                            <AvatarFallback>
                              {user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="font-medium text-lg uppercase">
                              {user?.name}
                            </p>
                            <p className="text-sm text-primary font-medium">
                              <NavLink to={"/dashboard/user/profile"}>
                                View Profile
                              </NavLink>
                            </p>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Dashboard Link */}
                      <DropdownMenuItem asChild className="flex">
                        <Link
                          to="/settings"
                          className="flex items-center my-2 hover:text-primary! text-lg!"
                        >
                          <div className="mr-2 h-10 w-10 bg-primary-tiny rounded-full flex items-center justify-center">
                            <HomeIcon className="rounded-full  text-primary" />
                          </div>
                          Settings
                          <div className="ml-auto">
                            <ChevronRight />
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="flex">
                        <Link
                          to="/settings"
                          className="flex items-center my-2 hover:text-primary! text-lg!"
                        >
                          <div className="mr-2 h-10 w-10 bg-primary-tiny rounded-full flex items-center justify-center">
                            <MessageCircleQuestionMark className="rounded-full text-primary h-6 w-6" />
                          </div>
                          Help & Support
                          <div className="ml-auto">
                            <ChevronRight />
                          </div>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-lg! flex items-center my-2 hover:text-primary!"
                      >
                        <div className="mr-2 h-10 w-10 bg-primary-tiny rounded-full flex items-center justify-center">
                          <LogOut className="rounded-full text-primary h-6 w-6" />
                        </div>
                        Log out
                        <div className="ml-auto">
                          <ChevronRight />
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" asChild>
                    <Link to="/auth/login">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-around py-3">
          <Navigation />
          <Dialog>
            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <DialogTitle className="sr-only">Mobile Navigation</DialogTitle>

                <div className="flex flex-col space-y-4 mt-4 ml-5">
                  {/* Mobile Search */}
                  <div className="flex items-center space-x-2 pb-4 border-b border-border">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="input search text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                    />
                  </div>

                  {navLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      className={({ isActive }) =>
                        `text-sm font-medium transition-colors hover:text-primary ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  ))}

                  {isAuthenticated && user && (
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2 text-sm text-muted-foreground">
                        <span>
                          @
                          {user.name?.replace(/\s+/g, "").toLowerCase() ||
                            "user"}{" "}
                          ~
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <NavLink
                          to={
                            isUser === "USER"
                              ? "/dashboard/user/profile"
                              : "/dashboard/admin/transactions"
                          }
                          className="flex items-center"
                        >
                          {isUser === "USER" ? (
                            <User className="mr-2 h-4 w-4" />
                          ) : (
                            <CreditCard className="mr-2 h-4 w-4" />
                          )}
                          {isUser === "USER" ? "Profile" : "Transactions"}
                        </NavLink>
                      </div>
                    </div>
                  )}

                  {!isAuthenticated ? (
                    <div className="border-t border-border pt-4 space-y-2">
                      <Button variant="ghost" className="w-full" asChild>
                        <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link
                          to="/auth/signup"
                          onClick={() => setIsOpen(false)}
                        >
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-0 h-auto"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </Dialog>
        </div>
      </div>
    </>
  );
}
