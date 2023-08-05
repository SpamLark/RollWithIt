import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter} from '@chakra-ui/react';
import { FormControl, Button } from '@chakra-ui/react';
import { FormLabel, Input } from '@chakra-ui/react';
import moment from 'moment';

const CreateGameNightModal = ({ isOpen, onClose, handleGameNightChange, user, account, toast}) => {

    const [location, setLocation] = useState('');
    const [dateTime, setDateTime] = useState('');

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    }

    const handleDateTimeChange = (e) => {
        setDateTime(e.target.value);
    }

    // Validate form data
    const validateGameNightForm = (formattedDateTime) => {
        // Check user is admin
        if (account.isAdmin === 0) {
            toast({
                title: 'Incorrect Permissions',
                description: 'Only administrators may submit this form',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return false;
        }
        // Check that the location field has been populated
        if (location === '') {
            toast({
                title: 'Invalid Location',
                description: 'Please enter a valid location',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return false;
        }
        // Check that the date time field contains a valid date and time
        if (formattedDateTime === 'Invalid date') {
            toast({
                title: 'Invalid Date & Time',
                description: 'Please enter a valid data and time',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return false;
        }
        // Return true confirming form data is valid
        return true;
    }

    // Handle form submission
    const handleCreateGameNight = async (e) => {
        // Prevent default form behaviour
        e.preventDefault();
        // User moment to parse entered date time string
        const parsedMoment = moment(dateTime, 'YYYY-MM-DDTHH:mm');
        // Convert parse date time to format required for the Roll With It database
        const formattedDateTime = parsedMoment.format('YYYY-MM-DD HH:mm:ss');
        // Validate form data and escape function if invalid
        if (!validateGameNightForm(formattedDateTime)) {
            return;
        }
        // Prepare message body for API call
        const gameNightDetails = {
            game_night_location: location,
            game_night_datetime: formattedDateTime,
            is_admin: account.isAdmin,
        }
        // Call the API to create a Game Night
        try {
            const url = 'http://localhost:8000/game-nights';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: user.uid
                },
                body: new URLSearchParams(gameNightDetails).toString(),
            });
            const data = await response.json();
            // Permission error
            if (data.message.includes('do not have permission')) {
                console.log('You do not have permission to perform that action');
                toast({
                    title: 'Incorrect Permissions',
                    description: 'You do not have permission to perform that action',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  })
            }
            // Game night created successfully
            else if(response.ok) {
                toast({
                    title: 'Game Night created',
                    description: 'Game Night created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                handleGameNightChange();
                handleModalClose();
                onClose();
            } else {
                // General failure message
                console.log('Game night creation failed.');
                toast({
                    title: 'Game Night creation failed',
                    description: 'If problem persists, please contact the administrator',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
            }
        } catch (error) {
            // General error message
            console.error('Error submitting form data: ', error);
            toast({
                title: 'Game Night creation failed',
                description: 'If problem persists, please contact the administrator',
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
        }
    };

    // Reset fields when the modal closes
    const handleModalClose = () => {
        setLocation('');
        setDateTime('');
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {
            handleModalClose();
            onClose();
        }}>
            <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
            <ModalContent>
                <ModalHeader>Create Game Night</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form>
                        <FormControl my={4}>
                            <FormLabel>Location</FormLabel>
                            <Input name="location" value={location} onChange={handleLocationChange} />
                        </FormControl>
                        <FormControl my={4}>
                            <FormLabel>Date and Time</FormLabel>
                            <Input type="datetime-local" name='date_time' value={dateTime} onChange={handleDateTimeChange} />
                        </FormControl>
                    </form>
                </ModalBody>
                <ModalFooter justifyContent="center">
                    <Button onClick={handleCreateGameNight}>Submit</Button>
                </ModalFooter>
            </ModalContent>   
        </Modal>
    )
};

export default CreateGameNightModal;