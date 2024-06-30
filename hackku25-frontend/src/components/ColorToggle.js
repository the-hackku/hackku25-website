import {
  useMantineColorScheme,
  useComputedColorScheme,
  Group,
  ActionIcon,
} from "@mantine/core";

import { IconSun, IconMoon } from "@tabler/icons-react";

function ColorToggle() {
  const { setColorScheme } = useMantineColorScheme();

  const computedColorScheme = useComputedColorScheme("light");

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  return (
    <Group>
      <ActionIcon onClick={toggleColorScheme} size={30} variant="subtle">
        {computedColorScheme === "dark" ? <IconSun /> : <IconMoon />}
      </ActionIcon>
    </Group>
  );
}

export default ColorToggle;
