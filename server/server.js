import express from 'express';
//It will allow us to get data from the .env file
import * as dotenv from 'dotenv';
//It will allow us to make cross origin requests
import cors from 'cors';
import { Configuration, OpenAIApi} from 'openai';

//allows us to use the .env variables
dotenv.config();
  

//configuration functions which accepts the api key as an object
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

//creates an instance of open ai and pass in the configuration we created above
const openai = new OpenAIApi(configuration);

//Initializes our express application
const app = express()
//We are setting up a couple of middlewares
//allows us to make cross origin requests and allow the server to be called from the frontend 
app.use(cors())
//allows us to pass json from the frontend to the backend
app.use(express.json())

//We are creating a route
app.get('/', async(req, res) => {
    res.status(200).send({
        message: 'Hello from Ayzen'
    })
});

//We are creating an app.post route
//With get route you can't recieve a lot of data from the frontend but the post one allows us to have the body for a lot of data
app.post('/', async (req, res) => {
    try {
      const prompt = req.body.prompt;
  
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${prompt}`,
        temperature: 0, // Higher values means the model will take more risks.
        max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
        top_p: 1, // alternative to sampling with temperature, called nucleus sampling
        frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
        presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
      });
  
      res.status(200).send({
        bot: response.data.choices[0].text
      });
  
    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));