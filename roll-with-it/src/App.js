import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Grid,
  theme,
  Heading,
  Button,
  Center
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { SimpleGrid } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
/*import { Logo } from './Logo';*/

function Header() {
  return(
    <>
      <ColorModeSwitcher justifySelf='flex-end' />
      <Heading>Oxa Board Game Club</Heading>
      <Center>
        <Button maxWidth='100px'>My Account</Button>
      </Center>
    </>
  );
}

function GameCard({game_name, host, num_players, max_players}) {
  return (
      <Card>
        <CardHeader>
          <Heading>{game_name}</Heading>
        </CardHeader>
        <CardBody>
          <Text>{host}</Text>
          <Text>{num_players} / {max_players}</Text>
        </CardBody>
        <CardFooter justifyContent="center">
          <Button>Register to play</Button>
        </CardFooter>
      </Card>
  );
}

function GameNight(){
  return (
    <TabPanel>
      <Button>Create Game Instance</Button>
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'  alignItems='center'>
        <GameCard game_name={'Scythe'} host={'Sam'} num_players={'4'} max_players={'6'}/>
      </SimpleGrid>
    </TabPanel>
  );
}

function GameNightTab ({date_time, venue}){
  return (
    <Tabs>
      <TabList alignItems='center' justifyContent='center'>
        <Tab>{date_time} {venue}</Tab>
      </TabList>
      <TabPanels>
        <GameNight />
      </TabPanels>
    </Tabs>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign='center' fontSize='xl'>
        <Grid p={3}>
          <Header />
          <GameNightTab date_time={'01/05/2023 8.00pm'} venue={'Room 101'}/>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
