import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Heading,
  Center,
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { SimpleGrid } from '@chakra-ui/react';
import LogInModal from './components/LogInModal';
import GameInstanceForm from './components/GameInstanceForm';
import GameInstanceCards from './components/GameInstanceCards';
import PageHeader from './components/PageHeader';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { useToast } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
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
      const data = await response.json();
      if (response.status === 200) {
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
        console.error('Player registration failed');
        if (data.message.includes('Duplicate entry')) {
          toast({
            title: 'Already Registered.',
            description: 'It looks like you are already registered for this game.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        } else if (data.message.includes('full')) {
          toast({
            title: 'Game Full.',
            description: 'It looks like this game is at capacity.',
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

  const [loading, setLoading] = useState(true);
  const [gameNights, setGameNights] = useState([]);
  const [user, setUser] = useState();
  const [account, setAccount] = useState({username: '', isAdmin: ''});
  const toast = useToast();
  const [gameNightsUpdated, setGameNightsUpdated] = useState(false);

  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false)
  });

  useEffect(() => {
    if (user) {
      fetchAccountInfoFromDatabase();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
  }, [gameNightsUpdated])

  //NEED TO ADD ERROR HANDLING HERE
  const fetchAccountInfoFromDatabase = () => {
    fetch(`http://localhost:8000/users/${user.uid}`)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        setAccount({
          username: data.accountInfo[0].username,
          isAdmin: data.accountInfo[0].is_admin,
        })
      })
  }

  const handleGameNightChange = () => {
    // Set gameNightsUpdated to True to trigger the re-rendering of the Tab Headings
    setGameNightsUpdated(true);
    // Set back to False to allow for further form submissions
    setTimeout(() => {
      setGameNightsUpdated(false);
    }, 1000);
  }

  if (loading) {
    // While loading, don't render anything (you can also display a loading spinner)
    return (
      <ChakraProvider theme={theme}>
        <Center h="100vh">
          <Stack>
            <Box textAlign='center'>
          <Spinner size='xl' />
          </Box>
          <Heading>Fun times ahead</Heading>
          </Stack>
        </Center>
     </ChakraProvider>
    )
  }

  return (
    <ChakraProvider theme={theme}>
      {!user && <LogInModal isOpen={true} onClose={() => {}} auth={auth} />}
      <Box textAlign='center' fontSize='xl'>
        <Grid p={3}>
          <PageHeader 
            handleGameNightChange={handleGameNightChange} 
            user={user} 
            account={account} 
            fetchAccountInfoFromDatabase={fetchAccountInfoFromDatabase} 
            auth={auth} 
            toast={toast}
          />
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
