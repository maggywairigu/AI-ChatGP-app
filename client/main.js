//import the picture of the user and the alien from the assets folder.
import alien from './assets/alienpic.jpg';
import user from './assets/userg.jpg'

//import the form and container from the html file using the document.query selector
const form = document.querySelector('form');
const container = document.querySelector('#chat_container');

let loadInterval;

//function that will load the messages
//It will return three dots as the alien 'thinks' of an answer
function loader(element) {
  //ensures that the element is empty at the start
  element.textContent = "";
  //will you the setInterval function to load the three dots
  loadInterval = setInterval(() => {
    element.textContent += ".";
  //if the loading indicator reaches three dots it will reset again to an empty string
    if (element.textContent === "...."){
      element.textContent = "";
    }
  }, 300)
}

//function that will make it look like the alien is writing the answers step by step
function typeText(element, text) {
  //variable to store the index of the text
   let index = 0;
   let interval = setInterval(() => {
    //Checks if the index is less than length. If true that will mean that the alien still typing
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
   }, 20)
}

//Generates a unique ID for every message to be able to match overthem.
function generateID(){
  //create the date
   const timeStamp = Date.now();
   //create a random number
   const randomNum = Math.random();
   //covert random number to hexadecimal
   const hexaDecimalString = randomNum.toString(16);

   return `id-${timeStamp}-${hexaDecimalString}`;
}


//function that will create a chatStripe for either the alien or the user
function chatStripe (isAlien, value, uniqueID){
   return(
    `
     <div class="wrapper ${isAlien && 'ai'}">
      <div class="chat">
       <div class="profile">
        <img src="${isAlien ? alien : user}" alt="${isAlien ? 'alien' : 'user'}"/>
       </div>
       <div class="message" id="${uniqueID}">
       ${value}
       <div/>
      </div>
     </div>
    `
   )
}

//It will handle submission of your question to the alien
const handleSubmit = async(e) => {
  //prevents the browser from reloding after you submit your form
   e.preventDefault();
   //It will get the data that you submitted from the form.
   const data = new FormData(form);

   //Will generate the user chat stripe
   //We will get into the contain, add its contents to the data that you filled into the form.
   container.innerHTML += chatStripe(false, data.get('prompt'));
   //Will reset the text area after you submit inorder to have a clear input
   form.reset();



   //alien response stripe
   const uniqueID = generateID();
   //The second parameter will be empty because the loader function will be filling the alien chatstrip as it 'thinks'
   container.innerHTML += chatStripe(true, " ", uniqueID);
   //As you are typing in the text area, you want to be able to scroll down so that you can see your message if its too long.
   container.scrollTop = container.scrollHeight;

   //Will help us fetch the message which we initially gave the id='uniqueID' at the chatStripe function
   const messageDiv = document.getElementById(uniqueID);
   //Will initalize the loader function that we created in the beggining
   loader(messageDiv);

   //We will fetch the data from the server and get the aliens response
   //We will create a new response
   const response = await fetch("https://alien51-code-guru-from-the-galaxies.onrender.com", { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
   })
 
   clearInterval(loadInterval);
   messageDiv.innerHTML = "";

   if(response.ok){
     const data = await response.json();
     const parsedData = data.bot.trim();

     typeText(messageDiv, parsedData);

   }else{
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong";
    alert(err);
   }
}

//Will call the handleSubmit function when you click submit
form.addEventListener('submit', handleSubmit);
//Will call the handleSubmit function when press the enter key
form.addEventListener('keyup', (e) => {
   if(e.keyCode === 13){
    handleSubmit(e);
   }
})