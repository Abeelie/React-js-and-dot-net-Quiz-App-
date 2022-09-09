import { Box, Card, CardContent, ListItemButton, Typography, List, CardHeader, LinearProgress, CardMedia } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, createAPIEndpoint, ENDPOINTS } from '../API';
import { getFormatedTime } from '../helper';
import useStateContext from '../hooks/useStateContext';

const Quiz = () => {
    const [question, setQuestion] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);
    const {context, setContext} = useStateContext();
    const navigate = useNavigate();
    let timer;

    const startTimer = () => {
        timer = setInterval(() => {
            setTimeTaken(prev => prev + 1);
        }, [1000]);
    }

    useEffect(() => {
        setContext({
            timeTaken: 0,
            selectedOptions: []
        });

        createAPIEndpoint(ENDPOINTS.question)
        .fetch()
        .then(res => {
            setQuestion(res.data);
            startTimer();
            console.log(res.data)
        })
        .catch(err => {console.log(err)});

        return () => { clearInterval(timer) }
    }, []);


    const updateAnswer = (qnId, optionsIdx) => {
        const temp = [...context.selectedOptions];
        temp.push({ qnId, selected: optionsIdx });

        if(questionIndex < 4){
            setContext({selectedOptions: [...temp]});
            setQuestionIndex(questionIndex + 1);
        }else{
            setContext({selectedOptions: [...temp], timeTaken});
            navigate("/result");
        }
    }

    return (
        question.length !== 0
        ? (
            <Card sx={{maxWidth: 640, mx: "auto", mt: 5,
            "& .MuiCardHeader-action": {m: 0, alignSelf: "center"}}}>
                <CardHeader 
                    title={"Question" + (questionIndex + 1) + " of 5"}
                    action={<Typography>{getFormatedTime(timeTaken)}</Typography>}>
                </CardHeader>
                <Box>
                    <LinearProgress variant='determinate' value={(questionIndex + 1)*100 / 5} />
                </Box>
                {question[questionIndex].imageName !== null ? 
                    <CardMedia 
                        component="img" 
                        image={BASE_URL + "images/" + question[questionIndex].imageName}
                        sx={{width: "400px", m: "10px auto"}}
                    /> 
                    : null
                }
                <CardContent>
                    <Typography variant='h6'>
                        {question[questionIndex].qnInWords}
                    </Typography>
                    <List>
                        {question[questionIndex].options.map((item, idx) => (
                            <ListItemButton key={idx} disableRipple onClick={() => updateAnswer(question[questionIndex].qnId, idx)}>
                                <div>
                                    <b>{String.fromCharCode(65+idx)+ " . "}</b> 
                                    {item}
                                </div>
                            </ListItemButton>
                        ))}
                    </List>
                </CardContent>
            </Card>
        )
        : null
    )
}


export default Quiz
