import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter} from '@chakra-ui/react';
import { FormControl, Button } from '@chakra-ui/react';
import { FormLabel, Input } from '@chakra-ui/react';
import moment from 'moment';

const CreateGameNightModal = ({ isOpen, onClose, handleGameNightChange, user, account}) => {

    const [location, setLocation] = useState('');
    const [dateTime, setDateTime] = useState('');

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    }

    const handleDateTimeChange = (e) => {
        setDateTime(e.target.value);
    }

    const handleCreateGameNight = async (e) => {
        const parsedMoment = moment(dateTime, 'YYYY-MM-DDTHH:mm');
        const formattedDateTime = parsedMoment.format('YYYY-MM-DD HH:mm:ss');
        console.log(location);
        console.log(formattedDateTime);
        console.log(account.isAdmin);
        const gameNightDetails = {
            game_night_location: location,
            game_night_datetime: formattedDateTime,
            is_admin: account.isAdmin,
        }
        console.log(gameNightDetails);
        e.preventDefault();
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
            if (data.message.includes('do not have permission')) {
                console.log('You do not have permission to perform that action');
            }
            else if(response.ok) {
                console.log('Game night submitted successfully.');
                //Add success steps
                handleGameNightChange();
                onClose();
            } else {
                console.log('Game night creation failed.');
                //Add error handling
            }
        } catch (error) {
            console.error('Error submitting form data: ', error);
            //Add error handling
        }
    };

    // Reset fields when the user closes the modal without submitting
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