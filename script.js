const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-password-display]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector("#generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const  symbols='~`!@#$%^&*()_-+={}[]\|;:"<,>.?/';

let password="";
let passwordLength=10;
let Checkcount=0;

handleSlider();
setIndicator('#ccc');

//ste strength colour to grey

//it sets passwords length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"

}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxshadow='0px 0px 12px 1px ${color}';
}
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min; 

}
function generateRandomNumbers(){
    return getRndInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generatesymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);

}
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSymb=false;
    if(uppercaseCheck.checked)hasUpper=true;
    if(lowercaseCheck.checked)hasLower=true;
    if(numbersCheck.checked)hasNum=true;
    if(symbolsCheck.checked)hasSymb=true;
    if(hasUpper && hasLower && (hasNum|| hasSymb)&& passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper)&&(hasNum||hasSymb)&&passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
    
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    //To make copy wala span visible below code
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){

    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}
function handleCheckBoxChange(){
    Checkcount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        Checkcount++;
    });
    //Conditon if lenght of password is less than checkcount then
    if(passwordLength<Checkcount){
        passwordLength=Checkcount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(password!=""){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    //none of checkbox is selected
    if(Checkcount==0)return;

    if(passwordLength<Checkcount){
        passwordLength=Checkcount;
        handleSlider();
    }
    password="";
    //lets put the  stuff mentioned by checkboxes like whats the demand from user
    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumbers();
    // }
    // if(symbolsCheck.checked){
    //     password+=generatesymbol();
    // }
    let funcArr=[];
    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumbers);
    if(symbolsCheck.checked)
        funcArr.push(generatesymbol);

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    //shuffle the password
    password=shufflePassword(Array.from(password));
    //show in UI
    passwordDisplay.value=password;
    //calculate strenght
    calcStrength();
})
