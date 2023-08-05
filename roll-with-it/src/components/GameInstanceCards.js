// Import React elements
import React, { useEffect, useState } from 'react';

// Import Chakra UI components
import {
  Text,
  Heading,
  Button,
  Flex,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton
} from '@chakra-ui/react';

// Import Chakra UI icons
import { DeleteIcon } from '@chakra-ui/icons'

// Import API config
import apiConfig from '../apiConfig';

const GameInstanceCards = ({gameNightId, gameInstancesUpdated, onGameInstanceChange, user, registerForGameInstance, toast}) => {

  const [gameInstances, setGameInstances] = useState([]);

  // API call for game instances using game night id
  const fetchGameInstances = async () => {
    const url = apiConfig.gameInstancesRoute + '?game_night_id=' + gameNightId;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setGameInstances(data);
    } catch (error) {
      console.log ('Error retrieving game instances: ', error);
    }
  };
  
  // API call to delete a game instance
  const deleteGameInstance = async ({gameInstanceId}) => {
    try {
      const url = apiConfig.gameInstancesRoute + '/' + gameInstanceId;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.uid
        },
      });
      const data = await response.json();
      if (data.message.includes('do not have permission')) {
          toast({
            title: 'Cannot Delete',
            description: 'Only the host or an admin can delete a game',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          console.log('You do not have permission to perform that action');
      }
      else if (response.ok) {
        console.log('Game instance successfully deleted.');
        //Re-render the current game night tab
        onGameInstanceChange();
        toast({
          title: 'Game Deleted',
          description: 'Game and all associated registrations successfully deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        console.error('Game instance removal failed.');
        //Add error handling
      }
    } catch (error) {
      console.error('Error removing game instance:', error);
      //Add error handling
    }
  }

  // React hook to fetch game instances when game night id or game instances updated change
  useEffect(() => {
    fetchGameInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameNightId, gameInstancesUpdated])
  
  return (
    gameInstances.data && gameInstances.data.map(gameInstance => (
      <Card key={gameInstance.game_instance_id}>
      <CardHeader>
        <Flex justifyContent="flex-end">
          <IconButton
            aria-label="Delete game instance"
            icon={<DeleteIcon />}
            alignSelf="flex-end"
            onClick={()=>deleteGameInstance({gameInstanceId: gameInstance.game_instance_id})}
          />
        </Flex>
          <Heading>{gameInstance.game_name}</Heading>
      </CardHeader>
        <CardBody>
          <Text>{gameInstance.host_id}</Text>
          <Text>{gameInstance.num_players} / {gameInstance.max_players}</Text>
          <Text>Min. players: {gameInstance.min_players}</Text>
        </CardBody>
        <CardFooter justifyContent="center">
          <Button onClick={()=>registerForGameInstance({gameInstanceId: gameInstance.game_instance_id, user: user})}>Register to play</Button>
        </CardFooter>
      </Card>
    ))
  );
}

export default GameInstanceCards;