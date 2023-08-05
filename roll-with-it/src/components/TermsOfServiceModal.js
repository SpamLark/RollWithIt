import { 
    useDisclosure,
    Button,
    Modal, 
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
    ModalFooter,
    OrderedList,
    UnorderedList,
    ListItem,
    Link
} from "@chakra-ui/react"

const TermsOfService = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <>
            <Link onClick={onOpen}>Terms of Service</Link>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Terms of Service</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>
                        Welcome to Roll With It, the Oxa Board Game Club web app ("the App"). 
                        By accessing and using the App, you agree to comply with these Terms of Service. 
                        These terms govern your use of the App, and they constitute a legally binding agreement between you and Roll With It.
                    </Text>
                    <br/>
                    <OrderedList>
                        <ListItem>Access and Eligibility</ListItem>
                        <UnorderedList>
                            <ListItem>The App is only accessible to employees of Oxa.</ListItem>
                            <ListItem>You must register using a valid Oxa email account to create an account on the App.</ListItem>
                            <ListItem>Users must be of working age to use the App.</ListItem>
                        </UnorderedList>
                        <ListItem>User Accounts</ListItem>
                        <UnorderedList>
                            <ListItem>During registration, we will collect your email address. After registration you may specify a username.</ListItem>
                        </UnorderedList>
                        <ListItem>User-Generated Content</ListItem>
                        <UnorderedList>
                            <ListItem>Users are responsible for the content they post within the App.</ListItem>
                            <ListItem>Any offensive content should be reported to the App administrator for review.</ListItem>
                            <ListItem>Roll With It reserves the right to remove or modify any content that violates these Terms of Service.</ListItem>
                        </UnorderedList>
                        <ListItem>No Monetization</ListItem>
                        <UnorderedList>
                            <ListItem>The App is a non-commercial hobby project and does not feature any advertisements or premium features.</ListItem>
                        </UnorderedList>
                        <ListItem>Authentication and Data Storage</ListItem>
                        <UnorderedList>
                            <ListItem>User authentication will be handled through Firebase.</ListItem>
                            <ListItem>Your email address will be stored in the App's main database to facilitate communication within the App.</ListItem>
                        </UnorderedList>
                        <ListItem>Individual Use Only</ListItem>
                        <UnorderedList>
                            <ListItem>User accounts are strictly for individual use, and sharing accounts is prohibited.</ListItem>
                        </UnorderedList>
                        <ListItem>Dispute Resolution</ListItem>
                        <UnorderedList>
                            <ListItem>Any disputes or issues should be directed to the App administrator for resolution.</ListItem>
                        </UnorderedList>
                        <ListItem>Termination of Accounts</ListItem>
                        <UnorderedList>
                            <ListItem>The App administrator reserves the right to terminate or suspend user accounts found to be in breach of these Terms of Service.</ListItem>
                            <ListItem>Oxa may also terminate or suspend the App service at any time without notice.</ListItem>
                        </UnorderedList>
                        <ListItem>Modifications to the Terms</ListItem>
                        <UnorderedList>
                            <ListItem>Oxa reserves the right to update or modify these Terms of Service at any time.</ListItem>
                            <ListItem>Users will be notified of any significant changes to the Terms through the email address associated with their account.</ListItem>
                        </UnorderedList>
                        <ListItem>Governing Law</ListItem>
                        <UnorderedList>
                            <ListItem>These Terms of Service are governed by the laws of the United Kingdom.</ListItem>
                        </UnorderedList>
                    </OrderedList>
                    <br/>
                    <Text>
                        By using the App, you acknowledge that you have read, understood, and agreed to these Terms of Service. 
                        If you do not agree with any part of these terms, you should refrain from using the App.
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default TermsOfService;