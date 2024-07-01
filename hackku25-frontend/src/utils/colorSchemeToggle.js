import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";

export const useColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  return {
    toggleColorScheme,
    currentColorScheme: computedColorScheme,
  };
};
