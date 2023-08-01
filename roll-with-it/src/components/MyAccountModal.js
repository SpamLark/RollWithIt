import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { FormControl,FormLabel, Input, Button } from '@chakra-ui/react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateEmail } from 'firebase/auth';


const MyAccountModal = ({isOpen, onClose, user, account, fetchAccountInfoFromDatabase}) => {

    const [username, setUsername] = useState(account?.username);
    const [newUsername, setNewUsername] = useState(account?.username);
    const [email, setEmail] = useState(user?.email);
    const [newEmail, setEmailNew] = useState(user?.email);
    const [passwordNew, setPasswordNew] = useState('');
    
    useEffect(() => {
        setUsername(account?.username);
        setNewUsername(account?.username);
        setEmail(user?.email);
        setEmailNew(user?.email);
        setPasswordNew('');
    }, [user, account]);

    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmailNew(e.target.value);
    }

    const handlePasswordNewChange = (e) => {
        setPasswordNew(e.target.value);
    }

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
            return;
        }
        // If email has been updated, submit it to Firebase and to RollWithIt database
        if (newEmail !== email) {
            try {
                await updateEmail(user, newEmail);
                console.log('Email changed successfully.');
                await updateAccountInfo(username, newEmail);
            } catch (error) {
                console.error('Error updating email: ', error)
            }
        }
        // If new password has been added, submit it to Firebase
        if (passwordNew !== '') {
            try {
                await updatePassword(user, passwordNew);
                console.log('Password changed successfully.');
            } catch (error) {
                console.error('Error updating password: ', error)
            }
        }
        // If username has been updated, submit it to RollWithIt database
        if (newUsername !== username) {
            try {
                await updateAccountInfo(newUsername, newEmail);
                // Refresh account details in app
                fetchAccountInfoFromDatabase();
            } catch (error) {
                console.error('Error updating username: ', error);
            }
        }
        console.log(account.username);
        // Clear new password field
        setPasswordNew('');
        // Close modal
        onClose();
    }

    // Reset fields when the user closes the modal without submitting
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
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input name="username" value={newUsername} onChange={handleUsernameChange}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email Address</FormLabel>
                            <Input name="email" value={newEmail} onChange={handleEmailChange}/>
                        </FormControl>
                        <FormControl>
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