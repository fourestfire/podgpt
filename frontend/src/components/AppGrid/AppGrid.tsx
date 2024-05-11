import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import { Navbar } from '../Navbar/Navbar';
import { Text } from '@mantine/core';
import { HeroContent } from '../HeroContent/HeroContent';

export function AppGrid({ mainContent }: { mainContent: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 40 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          {/* <MantineLogo size={30} /> */}
          <Text fw={700}>PodGPT</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        {mainContent}
      </AppShell.Main>
    </AppShell>
  );
}

// function useDisclosure(
//     initialState: boolean,
//     callbacks?: {
//       onOpen?(): void;
//       onClose?(): void;
//     }
//   ): [
//     boolean,
//     {
//       open: () => void;
//       close: () => void;
//       toggle: () => void;
//     },
//   ];