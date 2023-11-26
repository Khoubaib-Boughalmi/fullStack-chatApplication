import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast} from '@chakra-ui/react';
import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isVisible, setIsVisible] = useState(false); //password visibility
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast()

    const navigate = useNavigate();
    
    const handleSubmitFn = async() => {
        if(!email || !password) {
            return toast({
                title: "Missing Input",
                description: "Email and Password are required",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
        setIsLoading(true);
        try {
            const user = await axios.post("http://localhost:8080/api/user/login", {email, password});
            toast({
                title: "Connected Successfully",
                description: "Welcome Back",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            setIsLoading(false);
            console.log(user);
            localStorage.setItem('userInfo', JSON.stringify(user.data));   
            navigate("/api/chats");
        } catch (error) {
            toast({
                title: "Wrong Credentials",
                description: "Please Provide Correct email and password",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setIsLoading(false);
        }
    }
    const guestLoginFn = () => {
        setEmail("guest@app.com");
        setPassword("urMomIsGay");
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
            <Button w="100%" colorScheme='teal' onClick={handleSubmitFn} isLoading={isLoading}>Submit</Button>
            <Button w="100%" onClick={guestLoginFn}>Guest Login</Button>
        </VStack>
    )
}

export default Login
