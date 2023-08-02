import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { FormControl, Button } from '@chakra-ui/react';
import { FormLabel, Input } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';


const GameInstanceForm = ({user, gameNightId, onGameInstanceAdded, registerForGameInstance}) => {

    const {isOpen, onOpen, onClose} = useDisclosure();
  
    const [initialFormData, setInitialFormData] = useState ({
      host_id: '',
      game_night_id: gameNightId,
      game_name: '',
      min_players: '',
      max_players: '',
    });
  
    const [formData, setFormData] = useState(initialFormData);
  
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
  
    //Update form data
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
          const data = await response.json();
          console.log('Game Instance Data submitted successfully.');
          //Close modal form
          onClose(true);
          //Create player registration for user creating game instance
          registerForGameInstance({gameInstanceId: data.game_instance_id, user: user});  //gameInstanceId, user
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
        console.error('Error creating Game Instance: ', error);
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
    <Button onClick={onOpen} my={4}>Create Game Instance</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Game Instance</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form key={gameNightId} onSubmit={handleSubmit}>
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

  export default GameInstanceForm;