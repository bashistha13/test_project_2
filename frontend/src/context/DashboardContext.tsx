import { createContext, useContext, useState, } from 'react';
import type { ReactNode } from 'react';

interface DashboardContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  triggerAddModal: boolean;
  setTriggerAddModal: (trigger: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [triggerAddModal, setTriggerAddModal] = useState(false);

  return (
    <DashboardContext.Provider value={{ 
      searchTerm, setSearchTerm, 
      selectedCategory, setSelectedCategory,
      triggerAddModal, setTriggerAddModal
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};