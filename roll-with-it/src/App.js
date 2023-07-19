import React, { useEffect, useState } from 'react';
import moment from 'moment';
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

const GameInstanceCards = ({gameNightId}) => {

  const [gameInstances, setGameInstances] = useState([]);

  const fetchGameInstances = () => {
    const url = `http://localhost:8000/game-instances?game_night_id='${gameNightId}'`;
    fetch(url)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setGameInstances(data)
      })
  }

  useEffect(() => {
    fetchGameInstances()
  }, [])

  return (
    gameInstances.data && gameInstances.data.map(gameInstance => (
      <Card key={gameInstance.game_instance_id}>
        <CardHeader>
          <Heading>{gameInstance.game_name}</Heading>
        </CardHeader>
        <CardBody>
          <Text>{gameInstance.host_id}</Text>
          <Text>{gameInstance.num_players} / {gameInstance.max_players}</Text>
          <Text>Min. players: {gameInstance.min_players}</Text>
        </CardBody>
        <CardFooter justifyContent="center">
          <Button>Register to play</Button>
        </CardFooter>
      </Card>
    ))
  );
}

const GameNightTabPanels = ({gameNights}) => {
    return(
    <TabPanels>
      {gameNights.data && gameNights.data.map(gameNight => (
      <TabPanel key={gameNight.game_night_id}>
        <Button>Create Game Instance</Button>
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'  alignItems='center'>
          <GameInstanceCards gameNightId = {gameNight.game_night_id} />
        </SimpleGrid>
      </TabPanel>
      ))}
    </TabPanels>
    )
};

const GameNightTabHeadings = ({gameNights}) => {
  return (
      <TabList alignItems='center' justifyContent='center'>
        {gameNights.data && gameNights.data.map(gameNight => (
        <Tab key={gameNight.game_night_id}>{gameNight.game_night_location} <br></br> {
          moment(gameNight.game_night_datetime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('dddd Do MMMM, h:mm a')
          }</Tab>
        ))}
      </TabList>
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
          <Tabs>
            <GameNightTabHeadings gameNights={gameNights} />
            <GameNightTabPanels gameNights={gameNights}/>
          </Tabs>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
