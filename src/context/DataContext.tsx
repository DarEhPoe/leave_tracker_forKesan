"use client"
import { createContext, ReactNode, useState } from "react";

// Define the context type
interface DataContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;

}

// Create context with an initial value of `undefined`
const DataContext = createContext<DataContextType | undefined>(undefined);

// Define the provider's props type
interface DataProviderProps {
  children: ReactNode;
}

// Context Provider with TypeScript
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Define state inside the provider
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <DataContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

