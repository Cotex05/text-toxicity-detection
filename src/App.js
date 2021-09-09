import React, { useState, useEffect } from 'react';
import './App.css';

import "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";
import { TextField, Button, Container, LinearProgress, Chip, Typography, Slider, Checkbox, FormControlLabel, CircularProgress, makeStyles } from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';

function App() {

  const [model, setModel] = useState();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState([]);

  const [displayLoading, setDisplayLoading] = useState("none");
  const [predBoxDisp, setPredBoxDisp] = useState("none");
  const [thresDisp, setThresDisp] = useState("none");
  const [check, setCheck] = useState(false);

  const [threshold, setThreshold] = useState(0.9);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  var thresValue = 0.9;

  const handleClassify = () => {
    if (input.trim().length === 0) {
      alert("Text input is Empty! 🗑 \nPlease write some sentence first.");
      return;
    } else {
      predict();
      setTimeout(() => {
        setDisplayLoading("none");
        setPredBoxDisp("inline-block");
        document.getElementById('predictionBox').scrollIntoView();
      }, 2000);
    }
  }

  const predict = () => {
    setDisplayLoading("flex");
    model.classify([input]).then((predictions) => {
      // console.log(JSON.stringify(predictions, null, 2));
      setResponse(predictions);
      // console.log(response);
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    // Loading tf model
    const loadModel = async () => {
      const loadedModel = await toxicity.load(threshold);
      setModel(loadedModel);
      console.log("Model loaded!");
    }
    loadModel();
    // console.log(threshold);
  }, [threshold])

  function valuetext(value) {
    thresValue = value;
    return `${value}`;
  }

  const handleCheck = () => {
    setCheck(!check);
    if (check === false) {
      setThresDisp("flex");
    } else {
      setThresDisp("none");
      setThreshold(0.9);
    }
  }

  const handleLoadModel = () => {
    if (!loading) {
      setThreshold(thresValue);
      setSuccess(false);
      setLoading(true);
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  }

  const useStyles = makeStyles(() => ({
    input: {
      color: "#FFF",
      fontFamily: 'serif',
      fontSize: '18px',
    },
  }));

  const classes = useStyles();

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: '100%', display: 'inline-block' }}>
          <h1 className="Nav-title">Text toxicity detection</h1>
          <a href="https://github.com/Cotex05/text-toxicity-detection" style={{ color: "whitesmoke", float: 'right', marginTop: '-45px', marginRight: '15px' }}>Github</a>
        </div>
      </header>
      <div className="main">
        <Container className="container" maxWidth="md">
          <div>
            <h2>Application of Machine Learning (NLP) </h2>
          </div>
          <p>
            The TensorFlow.js toxicity model is used, which classifies text according to whether it exhibits offensive attributes or not.
            The toxicity model detects whether text contains toxic content such as threatening language, insults, obscenities, identity-based hate, or any explicit language.
          </p>
          <hr />
          <TextField
            fullWidth
            multiline
            type="text"
            label="Text"
            placeholder="Write here..."
            variant="filled"
            color="secondary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            helperText="eg. Xyz is an idiot."
            InputProps={{
              className: classes.input
            }}
            onSubmit={handleClassify}
          />
          <hr />
          <FormControlLabel
            value="start"
            control={<Checkbox checked={check} onChange={handleCheck} color="secondary" />}
            label="Threshold"
            labelPlacement="end"
          />
          <div style={{ display: thresDisp }}>
            <Typography id="discrete-slider-small-steps" gutterBottom>
              Threshold Value
            </Typography>
            <Slider
              defaultValue={0.9}
              getAriaValueText={valuetext}
              aria-labelledby="discrete-slider-small-steps"
              step={0.05}
              marks
              min={0.1}
              max={1}
              color="secondary"
              valueLabelDisplay="auto"
            />
          </div>
          <div className="wrapper" style={{ display: thresDisp }}>
            <Button
              variant="contained"
              color="primary"
              className="buttonClassname"
              disabled={loading}
              onClick={handleLoadModel}
            >
              Load Model
            </Button>
            {loading === true ? <CircularProgress size={24} color="secondary" className="buttonProgress" /> : null}
            {success === true ? <CheckCircle className="buttonProgress" /> : null}
          </div>
          <div className="btn">
            <Button onClick={handleClassify} variant="contained" color="secondary"> Classify </Button>
          </div>
          <div>
            <LinearProgress color="secondary" style={{ display: displayLoading }} />
          </div>
        </Container>
        <br />
        <br />
        <div className="outerContainer">
          <Container id="predictionBox" style={{ display: predBoxDisp }} className="container_below" maxWidth="md">
            <div>
              <h2>Prediction</h2>
              <div>
                {response.map((item, i) => {
                  return (
                    <div key={i} className="params">
                      <Chip
                        label={item.label}
                        color="primary"
                        className="chip"
                      />
                      <LinearProgress className="progbar" variant="determinate" color="secondary" value={Math.floor(item.results[0].probabilities["1"] * 100) > 49 ? Math.floor(item.results[0].probabilities["1"] * 100) : 0} />
                    </div>
                  )
                })}
              </div>
            </div>
          </Container>
        </div>
      </div>
      <div class="footer">
        {/* eslint-disable-next-line react/jsx-no-target-blank */}
        <p>Developed by <a href="https://www.linkedin.com/in/md-faisal-farooquee/" target="_blank" style={{ color: 'lime' }}>Md Faisal Farooquee</a></p>
      </div>
    </div>
  );
}

export default App;
