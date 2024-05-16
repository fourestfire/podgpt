import { useState, useEffect } from 'react';
import { Group, Code } from '@mantine/core';
import {
  IconBellRinging,
  IconFingerprint,
  IconHome2,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconMoodSmileBeam,
  IconScanEye,
  IconSquareRotated,
  IconPacman,
  IconBooks,
  IconTool,
  IconBox,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const data = [
  { link: '/', label: 'Standard', icon: IconSquareRotated },
  { link: '/emoji', label: 'Emoji', icon: IconMoodSmileBeam },
  { link: '/vision', label: 'Vision', icon: IconScanEye },
  { link: '/imagegen', label: 'Image Gen', icon: IconBox },
  { link: '/learning', label: 'Learning', icon: IconBooks },
  { link: '/DIY', label: 'DIY Pro', icon: IconTool },
//   { link: '', label: 'Authentication', icon: Icon2fa },
//   { link: '', label: 'Other Settings', icon: IconSettings },
];

export function Navbar() {
  // This code ensures that using the back button still highlights the correct link
  const location = useLocation();

  useEffect(() => {
    const currentLabel = data.find(item => item.link === location.pathname)?.label;
    setActive(currentLabel || 'Standard');
  }, [location]);

  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={(event) => {
        // event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        {/* <Group className={classes.header} justify="space-between">
          <MantineLogo size={28} />
          <Code fw={700}>v3.1.2</Code>
        </Group> */}
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconPacman className={classes.linkIcon} stroke={1.5} />
          <span>Support</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}