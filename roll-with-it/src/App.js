// Import React elements
import React, { useEffect, useState } from 'react';

// Import Chakra UI components
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Heading,
  Center,
  Tabs,
  useToast,
  Spinner,
  Stack
} from '@chakra-ui/react';

// Import Firebase elements
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged} from 'firebase/auth';

// Import app components
import LogInModal from './components/LogInModal';
import GameNightTabPanels from './components/GameNightTabPanels';
import PageHeader from './components/PageHeader';
import GameNightTabHeadings from './components/GameNightTabHeadings';
import TermsOfService from './components/TermsOfServiceModal';

// Import API config
import apiConfig from './apiConfig';

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

const App = () => {

  const [loading, setLoading] = useState(true);
  const [gameNights, setGameNights] = useState([]);
  const [user, setUser] = useState();
  const [account, setAccount] = useState({username: '', isAdmin: ''});
  const toast = useToast();
  const [gameNightsUpdated, setGameNightsUpdated] = useState(false);

  // When user is authenticated, set the user and turn off the loading screen
  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });

  // When user is updated by Firebase, retrieve users information from Roll With It database
  useEffect(() => {
    if (user) {
      fetchAccountInfoFromDatabase();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // When game nights are updated, retrieve game nights from Roll With It database
  useEffect(() => {
    fetchGameNights();
  }, [gameNightsUpdated]);

  // Fetch game nights via API
  const fetchGameNights = async () => {
    try {
      const response = await fetch(apiConfig.gameNightsRoute)
      const data = await response.json();
      setGameNights(data);
    } catch (error) {
      console.log('Error fetching game night: ', error);
    }
  }

  // Called to trigger fresh fetch of Game Nights from the Roll With It database
  const handleGameNightChange = () => {
    // Set gameNightsUpdated to True to trigger the re-rendering of the Tab Headings
    setGameNightsUpdated(true);
    // Set back to False to allow for further form submissions
    setTimeout(() => {
      setGameNightsUpdated(false);
    }, 1000);
  }

  // Fetch account info via API
  const fetchAccountInfoFromDatabase = async () => {
    try {
      const fetchURL = apiConfig.usersRoute + '/' + user.uid;
      const response = await fetch(fetchURL);
      const data = await response.json();
      setAccount({
        username: data.accountInfo[0].username,
        isAdmin: data.accountInfo[0].is_admin,
      })
    } catch (error) {
      console.log('Error identifying account details');
    }
  }

  // While loading, render loading spinner and message
  if (loading) {
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
      { // If user has not been set (i.e. user is not logged in), display the log in modal
        !user && 
          <LogInModal 
            isOpen={true} 
            onClose={() => {}} 
            auth={auth} 
            toast={toast}
          />}
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
            <GameNightTabHeadings 
              gameNights={gameNights} 
            />
            <GameNightTabPanels 
              gameNights={gameNights} 
              user={user} 
              toast={toast}
            />
          </Tabs>
        </Grid>
        <TermsOfService />
      </Box>
    </ChakraProvider>
  );
}

export default App;
