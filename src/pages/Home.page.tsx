import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Navbar } from '../components/Navbar/Navbar';
import { GridLayout } from '../components/GridLayout/GridLayout';
// import { DropzoneButton } from '../components/DropzoneButton/DropzoneButton';

export function HomePage() {
  return (
    <>
      <GridLayout />
      <ColorSchemeToggle />

    </>
  );
}
