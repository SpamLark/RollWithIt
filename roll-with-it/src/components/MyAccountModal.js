import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, Link } from '@chakra-ui/react';
import { FormControl, Button } from '@chakra-ui/react';
import { FormLabel, Input } from '@chakra-ui/react';


const MyAccountModal = ({isOpen, onClose, user}) => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(user?.email);
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleAccountUpdate = (e) => {
        e.preventDefault();
        console.log(username);
        console.log(email);
        console.log(password);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
            <ModalContent>
                <ModalHeader>My Account</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input name="username" value={username} onChange={handleUsernameChange}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email Address</FormLabel>
                            <Input name="email" value={email} onChange={handleEmailChange}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input name="password" value={password} onChange={handlePasswordChange}/>
                        </FormControl>
                    </form>
                </ModalBody>
                <ModalFooter justifyContent="center">
                    <Button onClick={handleAccountUpdate}>Submit</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
    //Update username
    //Update email
    //Update password
}

export default MyAccountModal;