import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Card, CardContent, Typography } from "@mui/material";
import Center from './Center';
import useForm from '../hooks/useForm';
import { createAPIEndpoint, ENDPOINTS } from '../API';
import { AxiosError } from 'axios';
import useStateContext from '../hooks/useStateContext';
import { useNavigate } from 'react-router-dom';


const getFreshModel = () => ({
    name: "",
    email: ""
});

const Login = () => {
    const {context, setContext, resetContext} = useStateContext();
    const navigate = useNavigate();

    const {
        values, 
        setValues,
        errors,
        setErrors,
        handleInputChange
    } = useForm(getFreshModel);

    useEffect(() => {
        resetContext();
    }, []);


    const onSubmit = e => {
        e.preventDefault();
        if(validate()){
            createAPIEndpoint(ENDPOINTS.participant)
            .post(values)
            .then(res => {
                setContext({participantId: res.data.participantId});
                navigate("/quiz");
            })
            .catch(error => console.log(error))
        }
    }

    const validate = () => {
        let temp = {};
        temp.email = (/\S+@\S+\.\S+/).test(values.email) ? "" : "Email is not valid";
        temp.name = values.name !== "" ? "" : "This field is required";
        setErrors(temp);
        return Object.values(temp).every(x => x === "");
    }

    return (
        <Center>
            <Card sx={{width: 400}}>
                <CardContent sx={{textAlign: "center"}}>
                    <Typography variant='h3' sx={{my: 3}}>Quiz App</Typography>
                        <Box sx={{
                            '& .MuiTextField-root': {
                                m: 1,
                                width: "90%"
                            }
                        }}>
                            <form noValidate autoComplete="off" onSubmit={onSubmit}>
                                <TextField 
                                    label="Email" 
                                    name="email" 
                                    variant="outlined" 
                                    value={values.email}
                                    onChange={handleInputChange}
                                    {...(errors.email && {error: true, helperText: errors.email})}
                                />
                                <TextField 
                                    label="Name" 
                                    name="name" 
                                    variant="outlined" 
                                    value={values.name}
                                    onChange={handleInputChange}
                                    {...(errors.name && {error: true, helperText: errors.name})}
                                />
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    size="large"
                                    sx={{width: "90%"}}
                                    >
                                        Start
                                </Button>
                            </form>
                        </Box>
                </CardContent>
            </Card>
        </Center>
    )
}


export default Login;