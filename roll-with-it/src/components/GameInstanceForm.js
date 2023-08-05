// Import React elements
import React, { useState, useEffect } from 'react';

// Import Chakra UI components
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter,
  FormControl,
  Button,
  FormLabel,
  Input,
  useDisclosure
} from '@chakra-ui/react';

// Import API config
import apiConfig from '../apiConfig';


const GameInstanceForm = ({user, gameNightId, onGameInstanceAdded, registerForGameInstance, toast}) => {

  const {isOpen, onOpen, onClose} = useDisclosure();

  const [initialFormData, setInitialFormData] = useState ({
    host_id: '',
    game_night_id: gameNightId,
    game_name: '',
    min_players: '',
    max_players: '',
  });
  
  const [formData, setFormData] = useState(initialFormData);

  // Update form data
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Reset the form on cancel
  const handleCancel = () => {
    // Reset the form
    setFormData(initialFormData);    
    onClose(true);
  }

  // Validate form data
  const validateGameInstanceForm = () => {
    // Regex for minimum players
    const minPlayersRegex = new RegExp(/^(1?[0-9]|20)$/);
    // Regex for maximum players
    const maxPlayersRegex = new RegExp(/^(?:[1-9]|[1-3][0-9]|40)$/);
    // Check for empty game name
    if (formData.game_name === '') {
      toast({
        title: 'Invalid game name',
        description: 'Please enter a valid game name.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return false;
    }
    // Check for valid min players
    if (!minPlayersRegex.test(formData.min_players)) {
      toast({
        title: 'Invalid minimum players',
        description: 'Please enter a minimum number of players between 1 and 20',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return false;
    }
    // Check for valid max players
    if (!maxPlayersRegex.test(formData.max_players)) {
      toast({
        title: 'Invalid maximum players',
        description: 'Please enter a maximum number of players between 1 and 20',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return false;
    }
    // Check max players is less than min players
    if (parseInt(formData.max_players) < parseInt(formData.min_players)) {
      toast({
        title: 'Invalid maximum players',
        description: 'The maximum number of players cannot be less than the minimum',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return false;
    }
    return true;
  }
  
  const handleSubmit = async (e) => {
    // Prevent default form submission behaviour
    e.preventDefault();
    // Validate form content, escape function if content invalid
    if(!validateGameInstanceForm()) {
      return;
    }
    // If form data is valid, submit to API
    try {
      const url = apiConfig.gameInstancesRoute;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString(),
      });
      // If response is okay:
      if (response.ok) {
        const data = await response.json();
        console.log('Game Instance Data submitted successfully.');
        // Close modal form
        onClose(true);
        // Create player registration for user creating game instance
        registerForGameInstance({gameInstanceId: data.game_instance_id, user: user});
        // Re-render the current game night tab
        onGameInstanceAdded();
        // Reset the form
        setFormData(initialFormData);
      } else {
        toast({
          title: 'Game Instance Creation Failed',
          description: 'If problem persists, please contact the administrator',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('Error creating Game Instance: ', error);
      toast({
        title: 'Game Instance Creation Failed',
        description: 'If problem persists, please contact the administrator',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  };

  // Use Effect hook to update initialFormData and current form data when the user logs in
  useEffect(() => {
    if (user && user.uid) {
      setInitialFormData((prevFormData) => ({
        ...prevFormData,
        host_id: user.uid,
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        host_id: user.uid
      }));
    }
  }, [user]);
  
    return (
    <>
    <Button onClick={onOpen} mb={4}>Create Game Instance</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Game Instance</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form key={gameNightId} onSubmit={handleSubmit}>
            <FormControl my={4}>
              <FormLabel>Game Name</FormLabel>
              <Input name="game_name" value ={formData.game_name} onChange={handleChange} />
            </FormControl>
            <FormControl my={4}>
              <FormLabel>Minimum Players</FormLabel>
              <Input name="min_players" value={formData.min_players} onChange={handleChange} />
            </FormControl>
            <FormControl my={4}>
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

  export default GameInstanceForm;