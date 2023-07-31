import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter} from '@chakra-ui/react';
import { FormControl, Button } from '@chakra-ui/react';
import { FormLabel, Input } from '@chakra-ui/react';
import moment from 'moment';

const CreateGameNightModal = ({ isOpen, onClose, handleGameNightChange}) => {

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
        const gameNightDetails = {
            game_night_location: location,
            game_night_datetime: formattedDateTime,
        }
        e.preventDefault();
        try {
            const url = 'http://localhost:8000/game-nights';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(gameNightDetails).toString(),
            });

            if(response.ok) {
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

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
            <ModalContent>
                <ModalHeader>Create Game Night</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form>
                        <FormControl>
                            <FormLabel>Location</FormLabel>
                            <Input name="location" value={location} onChange={handleLocationChange} />
                        </FormControl>
                        <FormControl>
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