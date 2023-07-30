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
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { FormLabel, Input } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import LogInModal from './components/LogInModal';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
/*import { Logo } from './Logo';*/

//Firebase configuration settings
const firebaseConfig = {
  apiKey: "AIzaSyA48x4aQTrFL9_x-BKmiIIwlWWKm2heI9U",
  authDomain: "rollwithit-481b5.firebaseapp.com",
  projectId: "rollwithit-481b5",
  storageBucket: "rollwithit-481b5.appspot.com",
  messagingSenderId: "417094467342",
  appId: "1:417094467342:web:aaff1aa4b84cc212c6e15f",
  measurementId: "G-9JCL2CQ9TH"
};

//Initialise Firebase app
const app = initializeApp(firebaseConfig);

//Initialise Firebase Authentication and get a reference to the service
const auth = getAuth(app);

//State observer for authenticated users
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log('User ID is: ', uid);
    // ...
  } else {
    // User is signed out
    // ...
  }
});

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

const GameInstanceForm = ({gameNightId, onGameInstanceAdded}) => {

  const {isOpen, onOpen, onClose} = useDisclosure();

  const initialFormData = {
    host_id: '',
    game_night_id: gameNightId,
    game_name: '',
    min_players: '',
    max_players: '',
  }

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:8000/game-instances';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        console.log('Game Instance Data submitted successfully.');
        //Close modal form
        onClose(true);
        //Re-render the current game night tab
        onGameInstanceAdded();
        //Reset the form
        setFormData(initialFormData);
        //Add success steps
      } else {
        console.error('Game Instance creation failed.');
        //Add error handling
      }
    } catch (error) {
      console.error('Error submnitting form data:', error);
      //Add error handling
    }
  };

  const handleCancel = () => {
    //Reset the form
    setFormData(initialFormData);    
    onClose(true);
  }

  return (
  <>
  <Button onClick={onOpen}>Create Game Instance</Button>
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Create Game Instance</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <form key={gameNightId} onSubmit={handleSubmit}>
          <FormControl>
              <FormLabel>User ID</FormLabel>
              <Input name="host_id" value={formData.host_id} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Game Name</FormLabel>
              <Input name="game_name" value ={formData.game_name} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Minimum Players</FormLabel>
              <Input name="min_players" value={formData.min_players} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Maximum Players</FormLabel>
              <Input name="max_players" value={formData.max_players} onChange={handleChange} />
            </FormControl>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" onClick={handleSubmit} mr={5}>Save</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  </>
  )
}

const GameInstanceCards = ({gameNightId, gameInstancesUpdated, onGameInstanceDeleted}) => {

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
  }, [gameNightId, gameInstancesUpdated])

  const deleteGameInstance = async ({gameInstanceId}) => {
    try {
      const url = `http://localhost:8000/game-instances/${gameInstanceId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Game instance successfully deleted.');
        //Re-render the current game night tab
        onGameInstanceDeleted();
      } else {
        console.error('Game instance removal failed.');
        //Add error handling
      }
    } catch (error) {
      console.error('Error removing game instance:', error);
      //Add error handling
    }
  }

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
          <Button onClick={()=>deleteGameInstance({gameInstanceId: gameInstance.game_instance_id})}>Delete</Button>
        </CardFooter>
      </Card>
    ))
  );
}

const GameNightTabPanels = ({gameNights}) => {
  const [gameInstancesUpdated, setGameInstancesUpdated] = useState(false);

  const handleGameInstanceChange = () => {
    // Set gameInstancesUpdated to True to trigger the re-rendering of the Tab Panel
    setGameInstancesUpdated(true);
    // Set back to False to allow for further form submissions
    setTimeout(() => {
      setGameInstancesUpdated(false);
    }, 1000);
  };

  return(
  <TabPanels>
    {gameNights.data && gameNights.data.map(gameNight => (
    <TabPanel key={gameNight.game_night_id}>
      <GameInstanceForm gameNightId={gameNight.game_night_id} onGameInstanceAdded={handleGameInstanceChange}/>
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'  alignItems='center'>
        <GameInstanceCards gameNightId = {gameNight.game_night_id} gameInstancesUpdated={gameInstancesUpdated} onGameInstanceDeleted={handleGameInstanceChange}/>
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

const App = () => {

  const [showLoginModal, setShowLoginModal] = useState(true);
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
      <LogInModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} auth={auth} />
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
