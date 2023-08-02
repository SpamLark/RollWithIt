import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { FormControl,FormLabel, Input, Button } from '@chakra-ui/react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateEmail } from 'firebase/auth';


const MyAccountModal = ({isOpen, onClose, user, account, fetchAccountInfoFromDatabase, toast}) => {

    // Declare state constants
    const [username, setUsername] = useState(account?.username);
    const [newUsername, setNewUsername] = useState(account?.username);
    const [email, setEmail] = useState(user?.email);
    const [newEmail, setEmailNew] = useState(user?.email);
    const [passwordNew, setPasswordNew] = useState('');
    
    // If user or account props change, reset all state constants
    useEffect(() => {
        setUsername(account?.username);
        setNewUsername(account?.username);
        setEmail(user?.email);
        setEmailNew(user?.email);
        setPasswordNew('');
    }, [user, account]);

    // Update new username state constant as form field is updated
    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    }

    // Update new email state constant as form field is updated
    const handleEmailChange = (e) => {
        setEmailNew(e.target.value);
    }

    // Update new password state constant as form field is updated
    const handlePasswordNewChange = (e) => {
        setPasswordNew(e.target.value);
    }

    // Function calls API to update account details in Roll With It database
    const updateAccountInfo = async (username, email) => {
        const newAccountInfo = {
            uid: user.uid,
            username: username,
            email: email,
            isAdmin: account.isAdmin,
        }
        try {
            const url = `http://localhost:8000/users/${newAccountInfo.uid}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(newAccountInfo).toString(),
            });

            if (response.ok) {
                console.log('User details updated.');
            } else {
                console.log('User updated failed.')
            }
        } catch (error) {
            console.error('Error submitting user update: ', error);
        }
    }

    // Function called by submitting the form
    const handleAccountUpdate = async () => {
        // If account details are unchanged, close the modal and escape the function
        if (newEmail === email && passwordNew === '' && newUsername === username) {
            onClose();
            return;
        }
        // Prompt user to re-enter the password for re-authentication.
        const currentPassword = prompt('Please enter your current password:')
        const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
        );
        // Attempt to re-authenticate and escape function if this fails.
        try {
            await reauthenticateWithCredential(user, credential);
        } catch (error) {
            console.error('Error re-authenticating: ', error);
            toast({
                title: 'Error Re-authenticating',
                description: 'Please double check your current password and try again',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return;
        }
        // If email has been updated, submit it to Firebase and to RollWithIt database
        if (newEmail !== email) {
            try {
                await updateEmail(user, newEmail);
                console.log('Email changed successfully.');
                await updateAccountInfo(username, newEmail);
                // Set the email stored in state to the new email in case user tries to change email again.
                setEmail(newEmail);
                toast({
                    title: 'Email Updated',
                    description: 'Your email has been successfully changed',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
            } catch (error) {
                console.error('Error updating email: ', error)
                // Use handleModalClose to reset the form
                handleModalClose();
                if (error.message.includes('invalid')) {
                    toast({
                        title: 'Email Update Failed',
                        description: 'Please enter a valid email.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                      })
                } else if (error.message.includes('already-in-use')) {
                    toast({
                        title: 'Email Update Failed',
                        description: 'That email is already in use on a different account',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    })
                } else {
                    toast({
                        title: 'Email Update Failed',
                        description: 'Please contact the administrator',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    })
                }
            }
        }
        // If new password has been added, submit it to Firebase
        if (passwordNew !== '') {
            try {
                await updatePassword(user, passwordNew);
                console.log('Password changed successfully.');
                toast({
                    title: 'Password Updated',
                    description: 'Your password has been successfully changed',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
            } catch (error) {
                console.error('Error updating password: ', error)
                toast({
                    title: 'Password Update Failed',
                    description: 'If problem persists, please contact the administrator',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  })
            }
        }
        // If username has been updated, submit it to RollWithIt database
        if (newUsername !== username) {
            try {
                await updateAccountInfo(newUsername, newEmail);
                toast({
                    title: 'Username Changed',
                    description: 'Your username has been successfully changed',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                // Refresh account details in app
                fetchAccountInfoFromDatabase();
            } catch (error) {
                console.error('Error updating username: ', error);
                toast({
                    title: 'Username Update Failed',
                    description: 'If problem persists, please contact the administrator',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  })
            }
        }
        // Clear new password field
        setPasswordNew('');
        // Close modal
        onClose();
    }

    // Reset fields when the modal is closed
    const handleModalClose = () => {
        setEmailNew(email);
        setNewUsername(username);
        setPasswordNew('');
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {
            handleModalClose();
            onClose();
        }}>
            <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
            <ModalContent>
                <ModalHeader>My Account</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form>
                        <FormControl my={4}>
                            <FormLabel>Username</FormLabel>
                            <Input name="username" value={newUsername} onChange={handleUsernameChange}/>
                        </FormControl>
                        <FormControl my={4}>
                            <FormLabel>Email Address</FormLabel>
                            <Input name="email" value={newEmail} onChange={handleEmailChange}/>
                        </FormControl>
                        <FormControl my={4}>
                            <FormLabel>New Password</FormLabel>
                            <Input name="password-new" value={passwordNew} onChange={handlePasswordNewChange}/>
                        </FormControl>
                    </form>
                </ModalBody>
                <ModalFooter justifyContent="center">
                    <Button onClick={handleAccountUpdate}>Submit</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}

export default MyAccountModal;