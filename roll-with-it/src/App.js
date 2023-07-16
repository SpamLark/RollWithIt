import React, { useEffect, useState } from 'react';
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

function GameNightTabs ({gameNights}){
  return (
    <Tabs>
      <TabList alignItems='center' justifyContent='center'>
      {gameNights.data && gameNights.data.map(gameNight => (
            <Tab key={gameNight.game_night_id}>{gameNight.game_night_location} {gameNight.game_night_datetime}</Tab>
          ))}
      </TabList>
      <TabPanels>
        <GameNight />
      </TabPanels>
    </Tabs>
  );
}

function App() {

  const [gameNights, setGameNights] = useState([]);

  const fetchGameNights = () => {
    fetch("http://localhost:8000/game-nights")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setGameNights(data)
      })
  }

  useEffect(() => {
    fetchGameNights()
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign='center' fontSize='xl'>
        <Grid p={3}>
          <Header />
            <GameNightTabs gameNights={gameNights} />
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
