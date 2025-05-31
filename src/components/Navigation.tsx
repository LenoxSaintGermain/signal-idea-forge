
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userPoints: number;
}

const Navigation = ({ activeView, setActiveView, userPoints }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { id: "explore", label: "Explore" },
    { id: "dashboard", label: "Dashboard" },
    { id: "simulator", label: "ROI Simulator" },
    { id: "submit", label: "Submit Idea" }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Signal Vault
            </div>
            <Badge variant="secondary" className="text-xs">MVP</Badge>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                onClick={() => setActiveView(item.id)}
                className="text-sm"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">{userPoints}</span> Signal Points
            </div>
            <Button size="sm" className="hidden md:block bg-gradient-to-r from-blue-600 to-indigo-600">
              Login
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Mobile Navigation */}
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  onClick={() => {
                    setActiveView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  {item.label}
                </Button>
              ))}
              
              <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
