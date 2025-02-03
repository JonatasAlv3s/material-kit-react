import React, { useState, useContext, useCallback, createContext, } from "react";

interface IDrawerOption {
    icon: string
    path: string
    label: string
}

interface IDrawerContextData {
    isDrawerOpen: boolean;
    drawerOptions: IDrawerOption[];
    toggleDrawerOpen: () => void;
    setDrawerOptions: (newDrawerOptions: IDrawerOption[]) => void;
}
const DrawerContext = createContext({} as IDrawerContextData);

export const useDrawerContext = () => useContext(DrawerContext);

interface IAppDrawerProviderProps {
    children: React.ReactNode;
}
export const DrawerProvider: React.FC<IAppDrawerProviderProps> = ({
    children,
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerOptions, setDrawerOptions] = useState<IDrawerOption[]>([]);

    const toggleDrawerOpen = useCallback(() => {
        setIsDrawerOpen(oldDrawerOpen => !oldDrawerOpen);
    }, []);

    const handleSetDrawerOptions = useCallback((newDrawerOptions: IDrawerOption[]) => {
        setDrawerOptions(newDrawerOptions);
    }, []);

    const contextValue = React.useMemo(() => ({
        isDrawerOpen,
        drawerOptions,
        toggleDrawerOpen,
        setDrawerOptions: handleSetDrawerOptions
    }), [isDrawerOpen, drawerOptions, toggleDrawerOpen, handleSetDrawerOptions]);

    return (
        <DrawerContext.Provider value={contextValue}>
            {children}
        </DrawerContext.Provider>
    );
};
