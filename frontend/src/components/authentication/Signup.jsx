import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, flattenTokens, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'

import axios from "axios";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");

    const [isVisible, setIsVisible] = useState(false); //password visibility
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast()

    const handleSubmitFn = async() => {
        setIsLoading(true);
        if(!name || !email || !password || !avatar)
        {
            setIsLoading(false);
            return toast({
                title: 'Please fill all required fields.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
        try {
            const response = await axios.post("http://10.12.11.4:8080/api/user/", {name, email, password, avatar});
            setIsLoading(false);
            setEmail("");setName("");setPassword(""),setAvatar("");
            return toast({
                title: "Account Created Successfully",
                description: "Please SignIn with your newly created account",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        } catch (error) {
            setIsLoading(false);
            return toast({
                title: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }
    return (
        <VStack>
            <FormControl isRequired id='formName'>
                <FormLabel>Name</FormLabel>
                <Input
                    placehoder= 'Enter Your Name'
                    onChange = {(e) => setName(e.target.value)}
                    type='text'
                    value={name}
                />
            </FormControl>
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
            <FormControl isRequired id='formAvatar'>
                <FormLabel>Avatar Url</FormLabel>
                <Input
                    placehoder= 'Enter Your Avatar'
                    onChange = {(e) => setAvatar(e.target.value)}
                    type='url'
                    value={avatar}
                />
            </FormControl>
            <Button w="100%" colorScheme='teal' isLoading={isLoading} onClick={handleSubmitFn}>Submit</Button>
        </VStack>
    )
}

export default Signup
