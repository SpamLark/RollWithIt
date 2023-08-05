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
import { Tabs, TabList, Tab } from '@chakra-ui/react';
import LogInModal from './components/LogInModal';
import GameNightTabPanels from './components/GameNightTabPanels';
import PageHeader from './components/PageHeader';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { useToast } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react';
import apiConfig from './apiConfig';
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
      fetch(apiConfig.gameNightsRoute)
        .then(response => {
          return response.json()
        })
        .then(data => {
          setGameNights(data)
        })
    }

    fetchGameNights()
  }, [gameNightsUpdated])


  const fetchAccountInfoFromDatabase = async () => {
    try {
      const fetchURL = apiConfig.usersRoute + '/' + user.uid;
      const response = await fetch(fetchURL);
      const data = await response.json();
      console.log(data);
      setAccount({
        username: data.accountInfo[0].username,
        isAdmin: data.accountInfo[0].is_admin,
      })
    } catch (error) {
      console.log('Error identifying account details');
    }
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
      {!user && <LogInModal isOpen={true} onClose={() => {}} auth={auth} toast={toast}/>}
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
