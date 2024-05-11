import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Navbar } from '../components/Navbar/Navbar';
import { GridLayout } from '../components/GridLayout/GridLayout';
import { AppGrid } from '../components/AppGrid/AppGrid';
import ChatWrapper from '../components/ChatWrapper/ChatWrapper';
// import { DropzoneButton } from '../components/DropzoneButton/DropzoneButton';
import { HeroContent } from '../components/HeroContent/HeroContent';
import GPT from '../components/GPT/GPT';
import '@mantine/carousel/styles.css';
interface HomePageProps {
  modelType?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ modelType }) => {
  return (
    <>
      <AppGrid mainContent={<ChatWrapper modelType={modelType}/>} />
      {/* <ColorSchemeToggle /> */}
    </>
  );
}


