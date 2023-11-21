import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isVisible, setIsVisible] = useState(false); //password visibility

    const handleSubmitFn = () => {
        alert(email);
    }
    const guestLoginFn = () => {
        
    }
    return (
        <VStack>
            <FormControl isRequired id='formEmail'>
                <FormLabel>Email</FormLabel>
                <Input
                    placehoder= 'Enter Your Email'
                    onChange = {(e) => setEmail(e.target.value)}
                    type='email'
                    value={email}
                />
            </FormControl>
            <FormControl isRequired id='formPassword'>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                    placehoder= 'Enter Your Password'
                    onChange = {(e) => setPassword(e.target.value)}
                    type= {isVisible ? "text" : "password"}
                    value={password}
                    />
                    <InputRightElement width="4.5rem">
                        <Button colorScheme='teal' variant='outline' h="1.75rem" size="sm" onClick={() => {setIsVisible(!isVisible)}}>
                            {isVisible ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button w="100%" colorScheme='teal' onClick={handleSubmitFn}>Submit</Button>
            <Button w="100%"
                onClick={() => {setEmail("guest@app.com");setPassword("guestPassword");}}
                >Guest Login</Button>
            </VStack>
    )
}

export default Login
