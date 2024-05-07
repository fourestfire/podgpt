import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Navbar } from '../components/Navbar/Navbar';
import { GridLayout } from '../components/GridLayout/GridLayout';
import { AppGrid } from '@/src/components';
import { ChatWrapper } from '@/src/components';
// import { DropzoneButton } from '../components/DropzoneButton/DropzoneButton';
import { HeroContent } from '../components/HeroContent/HeroContent';
import '@mantine/carousel/styles.css';

export function HomePage() {
  return (
    <>
      <AppGrid mainContent={<ChatWrapper />} />
      {/* <ColorSchemeToggle /> */}
    </>
  );
}


