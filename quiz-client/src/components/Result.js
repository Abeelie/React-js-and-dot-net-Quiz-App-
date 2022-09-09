import { Alert, Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../API';
import { getFormatedTime } from '../helper';
import useStateContext from '../hooks/useStateContext';
import { green } from "@mui/material/colors";
import Answer from "./Answer";
import resultImage from "../../public/result.jpg";

const Result = () => {
  const {context, setContext} = useStateContext();
  const [score, setScore] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const ids = context.selectedOptions.map(x => x.qnId);
    createAPIEndpoint(ENDPOINTS.getAnswers)
    .post(ids)
    .then(res => {
      const questionAndAnswers = context.selectedOptions
      .map(x => ({
        ...x, 
        ...(res.data.find(y => y.qnId === x.qnId))
      }));

      setQuestionAnswers(questionAndAnswers);
      console.log(questionAndAnswers)
      calculateScore(questionAndAnswers);
    })
    .catch(error => console.log(error))
  }, []);


  const calculateScore = questionAndAnswers => {
    const tempScore = questionAndAnswers.reduce((acc, curr) => {
      return curr.answer === curr.selected ?
      acc + 1 : acc;
    }, 0);

    setScore(tempScore);
  }

  const restart = () => {
    setContext({
      timeTaken: 0,
      selectedOptions: []
    });

    navigate("/quiz");
  }

  const submitScore = () => {
    createAPIEndpoint(ENDPOINTS.participant)
    .put(context.participantId, {
      participantId: context.participantId,
      score: score,
      timeTaken: context.timeTaken
    })
    .then(res => {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
    })
    .catch(error => console.log(error));
  }


  return (
    <>
      <Card sx={{ mt: 5, display: 'flex', width: '100%', maxWidth: 640, mx: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
            <Typography variant="h4">Congratulations!</Typography>
            <Typography variant="h6">
              YOUR SCORE
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              <Typography variant="span" color={green[500]}>
                {score}
              </Typography>/5
            </Typography>
            <Typography variant="h6">
              Took {getFormatedTime(context.timeTaken) + ' mins'}
            </Typography>
            <Button variant="contained"
              sx={{ mx: 1 }}
              size="small"
              onClick={submitScore}>
              Submit
            </Button>
            <Button variant="contained"
              sx={{ mx: 1 }}
              size="small"
              onClick={restart}>
              Re-try
            </Button>
            <Alert
              severity="success"
              variant="string"
              sx={{
                width: '60%',
                m: 'auto',
                visibility: showAlert ? 'visible' : 'hidden'
              }}>
              Score Updated.
            </Alert>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 220 }}
          image={resultImage}
        />
      </Card>
      <Answer questionAnswers ={questionAnswers} />
    </>
  )
}


export default Result
