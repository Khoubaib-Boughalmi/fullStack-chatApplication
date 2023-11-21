import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");

    const [isVisible, setIsVisible] = useState(false); //password visibility

    const handleSubmitFn = () => {
        alert(name);
    }
    return (
        <VStack>
            <FormControl isRequired id='formName'>
                <FormLabel>Name</FormLabel>
                <Input
                    placehoder= 'Enter Your Name'
                    onChange = {(e) => setName(e.target.value)}
                    type='text'
                />
            </FormControl>
            <FormControl isRequired id='formEmail'>
                <FormLabel>Email</FormLabel>
                <Input
                    placehoder= 'Enter Your Email'
                    onChange = {(e) => setEmail(e.target.value)}
                    type='email'
                />
            </FormControl>
            <FormControl isRequired id='formPassword'>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                    placehoder= 'Enter Your Password'
                    onChange = {(e) => setPassword(e.target.value)}
                    type= {isVisible ? "text" : "password"}
                    />
                    <InputRightElement width="4.5rem">
                        <Button colorScheme='teal' variant='outline' h="1.75rem" size="sm" onClick={() => {setIsVisible(!isVisible)}}>
                            {isVisible ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl isRequired id='formAvatar'>
                <FormLabel>Avatar Url</FormLabel>
                <Input
                    placehoder= 'Enter Your Avatar'
                    onChange = {(e) => setAvatar(e.target.value)}
                    type='url'
                />
            </FormControl>
            <Button w="100%" colorScheme='teal' onClick={handleSubmitFn}>Submit</Button>
        </VStack>
    )
}

export default Signup
