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
  Center,
  FormControl,
  useDisclosure
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { SimpleGrid } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import {Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter} from '@chakra-ui/react';
import {FormLabel, Input} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
/*import { Logo } from './Logo';*/

function Header() {
  return(
    <>
      <ColorModeSwitcher justifySelf='flex-end' />
      <Heading>Roll With It</Heading>
      <Center>
        <Button maxWidth='100px'>My Account</Button>
      </Center>
    </>
  );
}

const CreateGameInstanceButton = ({onOpen}) => {
  return (
    <Button onClick={onOpen}>Create Game Instance</Button>
  );
};

const GameInstanceForm = ({isOpen, onClose, gameNightId}) => {
  return (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Create Game Instance</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
      <FormControl>
          <FormLabel>User ID</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Game Name</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Minimum Players</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Maximum Players</FormLabel>
          <Input />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} mr={5}>Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

const GameInstanceCards = ({gameNightId}) => {

  const [gameInstances, setGameInstances] = useState([]);

  useEffect(() => {
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

    fetchGameInstances()
  }, [gameNightId])

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

    const {isOpen, onOpen, onClose} = useDisclosure();

    return(
    <TabPanels>
      {gameNights.data && gameNights.data.map(gameNight => (
      <TabPanel key={gameNight.game_night_id}>
        <CreateGameInstanceButton onOpen={onOpen} />
        <GameInstanceForm isOpen={isOpen} onClose={onClose} />
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

  useEffect(() => {
    const fetchGameNights = () => {
      fetch("http://localhost:8000/game-nights")
        .then(response => {
          return response.json()
        })
        .then(data => {
          setGameNights(data)
        })
    }

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
