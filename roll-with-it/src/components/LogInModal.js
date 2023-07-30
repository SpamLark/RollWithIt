import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, Link } from '@chakra-ui/react';
import { FormControl, Button } from '@chakra-ui/react';
import { FormLabel, Input } from '@chakra-ui/react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const LogInModal = ({ isOpen, onClose, auth }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User logged in:', userCredential.user);
        onClose();
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User logged in:', userCredential.user);
        onClose();
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input name="email_address" value={email} onChange={handleEmailChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input name="password" value={password} onChange={handlePasswordChange}/>
                </FormControl>
            </form>
            <Box display="flex" justifyContent="center">
              <Button onClick={handleSignIn}>Log-in</Button>
            </Box>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Link onClick={handleSignUp}>Register</Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  export default LogInModal;