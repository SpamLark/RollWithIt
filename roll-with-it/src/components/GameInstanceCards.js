import React, { useEffect, useState } from 'react';
import {
  Text,
  Heading,
  Button,
  Flex
} from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
/*import { Logo } from './Logo';*/

const GameInstanceCards = ({gameNightId, gameInstancesUpdated, onGameInstanceChange, user, registerForGameInstance, toast}) => {

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