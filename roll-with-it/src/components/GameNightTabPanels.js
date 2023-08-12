import React, { useState } from 'react';
import { TabPanels, TabPanel } from '@chakra-ui/react';
import { SimpleGrid } from '@chakra-ui/react';
import GameInstanceForm from './GameInstanceForm';
import GameInstanceCards from './GameInstanceCards';
import apiConfig from '../apiConfig';

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
        const url = apiConfig.playerRegistrationsRoute;
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
          toast={toast}
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

  export default GameNightTabPanels;