// Import React elements
import React, { useState } from 'react';

// Import Chakra UI components
import {
  Text,
  Heading,
  Button,
  Center,
  Flex
} from '@chakra-ui/react';

// Import firebase elements
import { signOut } from 'firebase/auth';

// Import app components
import CreateGameNightModal from './CreateGameNightModal';
import MyAccountModal from './MyAccountModal';
import { ColorModeSwitcher } from './ColorModeSwitcher';

function PageHeader({handleGameNightChange, user, account, auth, fetchAccountInfoFromDatabase, toast}) {

    const [showCreateGameNightModal, setShowCreateGameNightModal] = useState(false);
    const [showMyAccountModal, setShowMyAccountModal] = useState(false);
    
    return(
      <>
        <Flex justifyContent='space-between'>
          <Text fontSize='sm'>Logged in as {user?.email}</Text>
          <ColorModeSwitcher />
        </Flex>
        <Flex>
          <Button maxWidth='100px' mr={4} onClick={() => setShowMyAccountModal(true)}>My Account</Button>
          <Button fontSize='sm' onClick={() => {signOut(auth)}}>Log Out</Button>
          <MyAccountModal 
            user={user} 
            account={account} 
            fetchAccountInfoFromDatabase={fetchAccountInfoFromDatabase}
            auth={auth}
            toast={toast}
            isOpen={showMyAccountModal} 
            onClose={() => setShowMyAccountModal(false)}
          />
        </Flex>
        <Heading mt={4} mb={2}>Roll With It</Heading>
        <Center>
          {account.isAdmin === 1 && (
            <Button 
              maxWidth='200px' 
              onClick={() => setShowCreateGameNightModal(true)}
              my={3}
            >
                Create Game Night
            </Button>
          )}
          <CreateGameNightModal 
            isOpen={showCreateGameNightModal}
            account={account}
            user={user}
            onClose={() => setShowCreateGameNightModal(false)} 
            handleGameNightChange={handleGameNightChange}
            toast={toast}
          />
        </Center>
      </>
    );
  }

  export default PageHeader;