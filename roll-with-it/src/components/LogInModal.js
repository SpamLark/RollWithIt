// Import React elements
import React, { useState } from 'react';

// Import Chakra UI components
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Box, 
  Link,
  FormControl,
  Button,
  FormLabel,
  Input
 } from '@chakra-ui/react';

// Import Firebase elements
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Import API config
import apiConfig from '../apiConfig';


const LogInModal = ({ isOpen, onClose, auth, toast }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFirebaseError = (errorMessage) => {
    if (errorMessage.includes('already-in-use')) {
      toast({
        title: 'Email Already In Use',
        description: 'If you have forgotten your password, please contact the administrator.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } else if (errorMessage.includes('invalid-email')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } else if (errorMessage.includes('missing-password')) {
      toast({
        title: 'Missing Password',
        description: 'Please enter a valid password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } else if (errorMessage.includes('user-not-found')) {
      toast({
        title: 'User Not Found',
        description: 'It doesn\'t look like you have an account',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } else {
      console.error('Registration error: ', errorMessage);
      toast({
        title: 'Firebase Error',
        description: 'If problem persists, please contact the administrator',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  };

  const handleSignIn = async (e) => {
    // Prevent default form behaviour
    e.preventDefault();
    try {
      // Attempt sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user);
      console.log('User email is: ', email);
      console.log('User UID is: ', user.uid);
      // Close the modal
      onClose();
    } catch (error) {
      // Pass Firebase error to helper function
      handleFirebaseError(error.message);
    }
  };

  const handleSignUp = async (e) => {
    // Prevent default form behaviour
    e.preventDefault();
    try {
      // Attempt to create new Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // If successful, save returned uid and supplied email to accountDetails
      const accountDetails = {
          uid: userCredential.user.uid,
          email: email,
        }
        // Attempt to create user account in Roll With It database
        createUserAccount(accountDetails);
        // Close the modal
        onClose();
    } catch (error) {
      // Pass Firebase error to helper function
      handleFirebaseError(error.message);
    } 
  };

  const createUserAccount = async (accountDetails) => {
    try {
      const url = apiConfig.usersRoute;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(accountDetails).toString(),
      });

      if (response.ok) {
        console.log('User submitted successfully.');
        //Add success steps
      } else {
        console.error('User creation failed.');
        //Add error handling
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
      //Add error handling
    }
  };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalBody>
            <form>
              <FormControl my={4}>
                  <FormLabel>Email Address</FormLabel>
                  <Input name="email_address" value={email} onChange={handleEmailChange} />
                </FormControl>
                <FormControl my={4}>
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