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
import LogInModal from './components/LogInModal';
import CreateGameNightModal from './components/CreateGameNightModal';
import GameInstanceForm from './components/GameInstanceForm';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useToast } from '@chakra-ui/react'
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

function Header() {

  const [showCreateGameNightModal, setShowCreateGameNightModal] = useState();
  
  return(
    <>
      <ColorModeSwitcher justifySelf='flex-end' />
      <Heading>Roll With It</Heading>
      <Center>
        <Button maxWidth='100px'>My Account</Button>
        <Button maxWidth='200px' onClick={() => setShowCreateGameNightModal(true)}>Create Game Night</Button>
        <CreateGameNightModal isOpen={showCreateGameNightModal} onClose={() => setShowCreateGameNightModal(false)}/>
      </Center>
    </>
  );
}

const GameInstanceCards = ({gameNightId, gameInstancesUpdated, onGameInstanceChange, user, registerForGameInstance}) => {

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
        onGameInstanceChange();
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
          <Button onClick={()=>registerForGameInstance({gameInstanceId: gameInstance.game_instance_id, user: user})}>Register to play</Button>
          <Button onClick={()=>deleteGameInstance({gameInstanceId: gameInstance.game_instance_id})}>Delete</Button>
        </CardFooter>
      </Card>
    ))
  );
}

const GameNightTabPanels = ({gameNights, user, toast}) => {
  const [gameInstancesUpdated, setGameInstancesUpdated] = useState(false);

  const registerForGameInstance = async ({gameInstanceId, user}) => {
    //Define message body
    const registrationInformation = {
      uid: user.uid,
      game_instance_id: gameInstanceId,
    }
    //API call
    try {
      const url = `http://localhost:8000/player-registrations`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(registrationInformation).toString(),
      });

      if (response.ok) {
        console.log('Player registration submitted successfully.')
        //re-render game cards
        handleGameInstanceChange();
        //toast the success
        toast({
          title: 'Registration Successful.',
          description: 'You are registered for this game.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        const data = await response.json();
        console.log(data);
        console.error('Player registration failed');
        if (data.message.includes('Duplicate entry')) {
          toast({
            title: 'Already Registered.',
            description: 'It looks like you are already registered for this game.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'System Error',
            description: 'Please contact the system administrator',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }
    } catch (error) {
      console.error('Error submitting player registration: ', error);
      //Add error handling
    }
  }

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
      <GameInstanceForm 
        user={user}
        gameNightId={gameNight.game_night_id} 
        onGameInstanceAdded={handleGameInstanceChange} 
        registerForGameInstance={registerForGameInstance}
      />
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'  alignItems='center'>
        <GameInstanceCards 
          gameNightId = {gameNight.game_night_id} 
          gameInstancesUpdated={gameInstancesUpdated} 
          onGameInstanceChange={handleGameInstanceChange}
          registerForGameInstance={registerForGameInstance}
          user={user} 
          toast={toast}
        />
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
  const [user, setUser] = useState();
  const toast = useToast();

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

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
            <GameNightTabPanels gameNights={gameNights} user={user} toast={toast}/>
          </Tabs>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
