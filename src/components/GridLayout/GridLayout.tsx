import { Grid } from '@mantine/core';
import { Navbar } from '../Navbar/Navbar';
import { Welcome } from '../Welcome/Welcome';

export function GridLayout() {
  return (
    <Grid>
      <Grid.Col span={3}> <Navbar/> </Grid.Col>
      <Grid.Col span={9}> <Welcome/> </Grid.Col>
    </Grid>
  );
}