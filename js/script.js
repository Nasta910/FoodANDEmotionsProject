let emotionsData;
let cocktail1Data = [];
let cocktail2Data = [];
let cocktail3Data = [];
let averageCocktail1;
let averageCocktail2;
let averageCocktail3;
let cocktail1MoodsPerParticipants = {};
let cocktail2MoodsPerParticipants = {};
let cocktail3MoodsPerParticipants = {};
let cocktail1Moods = [];
let cocktail2Moods = [];
let cocktail3Moods = [];
let participantsList = [];
let cocktail1MoodsDuring = []
let cocktail2MoodsDuring = []
let cocktail3MoodsDuring = []
let averageMoodCocktail1;
let averageMoodCocktail2;
let averageMoodCocktail3;
let filteredData = [];

async function fetchData(){
    emotionsData = await d3.csv("data/Casus_foodEmotions_data.csv");
    for (var i = 0; i < emotionsData.length; i++) {
        if (emotionsData[i].Disgusted != "FIT_FAILED" && emotionsData[i].Disgusted != "FIND_FAILED"){
                filteredData.push(emotionsData[i]);
        }
    };
}

function putDataPerCocktail(minAge, maxAge, gender){
    cocktail1Data = [];
    cocktail2Data = [];
    cocktail3Data = [];
    for (var i = 0; i < filteredData.length; i++) {
        if(gender == "empty"){
            if(filteredData[i].Age >= minAge && filteredData[i].Age <= maxAge){
                if(filteredData[i].Event_Marker.includes("1")){
                    cocktail1Data.push(filteredData[i]);
                }
                else if(filteredData[i].Event_Marker.includes("2")){
                    cocktail2Data.push(filteredData[i]);
                }
                else{
                    cocktail3Data.push(filteredData[i]);
                }
            }
        }
        else{
            if(filteredData[i].Age >= minAge && filteredData[i].Age <= maxAge && filteredData[i].Gender == gender){
                if(filteredData[i].Event_Marker.includes("1")){
                    cocktail1Data.push(filteredData[i]);
                }
                else if(filteredData[i].Event_Marker.includes("2")){
                    cocktail2Data.push(filteredData[i]);
                }
                else{
                    cocktail3Data.push(filteredData[i]);
                }
            }
        }
    }
}

async function createPage(){
    await fetchData();
    putDataPerCocktail(0, 200, "empty");
    console.log(cocktail1Data)
    console.log(cocktail2Data)
    console.log(cocktail3Data)
    averageMoodCocktail1 = getAverageMood(cocktail1Data);
    averageMoodCocktail2 = getAverageMood(cocktail2Data);
    averageMoodCocktail3 = getAverageMood(cocktail3Data);

    d3.selectAll('[id="faceCocktail1"]').attr("class", averageMoodCocktail1)
    d3.selectAll('[id="faceCocktail2"]').attr("class", averageMoodCocktail2)
    d3.selectAll('[id="faceCocktail3"]').attr("class", averageMoodCocktail3)
    getParticipants(filteredData)
    
    getMoodsDuringCocktail(cocktail1Data, participantsList)
    getMoodsDuringCocktail(cocktail2Data, participantsList)
    getMoodsDuringCocktail(cocktail3Data, participantsList)
    
    
}

function resetData(){
    d3.selectAll('[id="faceCocktail1"]').attr("class", null)
    d3.selectAll('[id="faceCocktail2"]').attr("class", null)
    d3.selectAll('[id="faceCocktail3"]').attr("class", null)
    let minAge = document.getElementById('iMinAgeInput').value
    let maxAge = document.getElementById('iMaxAgeInput').value
    let gender = String(document.getElementById('sGenderInput').value)

    putDataPerCocktail(Number(minAge), Number(maxAge), gender);
    
    console.log(cocktail1Data)
    console.log(cocktail2Data)
    console.log(cocktail3Data)
    if (cocktail3Data.length != 0){
        averageMoodCocktail1 = getAverageMood(cocktail1Data);
        console.log(averageMoodCocktail1);
        averageMoodCocktail2 = getAverageMood(cocktail2Data);
        averageMoodCocktail3 = getAverageMood(cocktail3Data);
        d3.selectAll('[id="faceCocktail1"]').attr("class", averageMoodCocktail1)
        d3.selectAll('[id="faceCocktail2"]').attr("class", averageMoodCocktail2)
        d3.selectAll('[id="faceCocktail3"]').attr("class", averageMoodCocktail3)

        getMoodsDuringCocktail(cocktail1Data, participantsList)
        getMoodsDuringCocktail(cocktail2Data, participantsList)
        getMoodsDuringCocktail(cocktail3Data, participantsList)
    }
    else{
        window.alert("No data found");
        d3.selectAll('[id="faceCocktail1"]').attr("class", averageMoodCocktail1)
        d3.selectAll('[id="faceCocktail2"]').attr("class", averageMoodCocktail2)
        d3.selectAll('[id="faceCocktail3"]').attr("class", averageMoodCocktail3)

    }
    
    
}

function drinkAllCocktails(){
    emptyCocktail(Cocktail1Content)
    emptyCocktail(Cocktail2Content)
    emptyCocktail(Cocktail3Content)
    showMoodChanges(cocktail1MoodsDuring, "faceCocktail1", 0, averageMoodCocktail1, Cocktail1Content)
    showMoodChanges(cocktail2MoodsDuring, "faceCocktail2", 0, averageMoodCocktail2, Cocktail2Content)
    showMoodChanges(cocktail3MoodsDuring, "faceCocktail3", 0, averageMoodCocktail3, Cocktail3Content)    
}

function drinkCocktail(tableNumber){
    if(tableNumber == 1){
        emptyCocktail(Cocktail1Content)
        showMoodChanges(cocktail1MoodsDuring, "faceCocktail1", 0, averageMoodCocktail1, Cocktail1Content)  
    }
    else if (tableNumber == 2){
        emptyCocktail(Cocktail2Content)
        showMoodChanges(cocktail2MoodsDuring, "faceCocktail2", 0, averageMoodCocktail2, Cocktail2Content)  
    }
    else{
        emptyCocktail(Cocktail3Content)
        showMoodChanges(cocktail3MoodsDuring, "faceCocktail3", 0, averageMoodCocktail3, Cocktail3Content)  
    }
}

function getParticipants(data){
    data.forEach(element => {
        if (!participantsList.includes(element.Participant)){
            participantsList.push(element.Participant);
        }
    });
}

function getMoodsDuringCocktail(cocktail, participants){
    let cocktailNumber;
    for (let index = 0; index < participants.length; index++) {
        let highestMood;
        let participantID = participants[index];
        var moodsPerParticipant = [] 
        
        for (var i = 0; i < cocktail.length; i++) {
            if(cocktail[i].Participant == participantID){
            var moodsOfEntry = {Neutral: 0, Happy: 0, Sad: 0, Angry: 0, Surprised: 0, Scared: 0, Disgusted: 0}
            moodsOfEntry.Neutral = Number(cocktail[i].Neutral);
            moodsOfEntry.Happy = Number(cocktail[i].Happy);
            moodsOfEntry.Sad = Number(cocktail[i].Sad);
            moodsOfEntry.Angry =  Number(cocktail[i].Angry);
            moodsOfEntry.Surprised = Number(cocktail[i].Surprised);
            moodsOfEntry.Scared = Number(cocktail[i].Scared);
            moodsOfEntry.Disgusted = Number(cocktail[i].Disgusted);
            if (moodsOfEntry.Neutral > 0.8){
                highestMood = "Neutral"
            }
            else{
                let highestMoodValue = Math.max(moodsOfEntry.Happy, moodsOfEntry.Sad, moodsOfEntry.Angry, moodsOfEntry.Surprised, moodsOfEntry.Scared, moodsOfEntry.Disgusted)
                highestMood = Object.keys(moodsOfEntry).find(key => moodsOfEntry[key] === highestMoodValue);
            }
            
            moodsPerParticipant.push(highestMood);
            }
            
        }
        
        if (Object.keys(moodsPerParticipant).length != 0){
            if (cocktail[0].Event_Marker.includes("1")) {
                cocktailNumber = 1;
                cocktail1MoodsPerParticipants["participant"+participantID] = moodsPerParticipant;
            }
            else if (cocktail[0].Event_Marker.includes("2")) {
                cocktailNumber = 2;
                cocktail2MoodsPerParticipants["participant"+participantID] = moodsPerParticipant;
            }
            else{
                cocktailNumber = 3;
                cocktail3MoodsPerParticipants["participant"+participantID] = moodsPerParticipant;
            }
        }
        
    }
    switch(cocktailNumber) {
        case 1:
            cocktail1MoodsDuring = generalizeDataDuring(cocktail1MoodsPerParticipants)
            console.log("moods cocktail 1 "+ cocktail1MoodsDuring)
            break;
        case 2:
            cocktail2MoodsDuring = generalizeDataDuring(cocktail2MoodsPerParticipants)
            console.log("moods cocktail 2 "+ cocktail2MoodsDuring)
            break;
        default:
            cocktail3MoodsDuring = generalizeDataDuring(cocktail3MoodsPerParticipants);
            console.log("moods cocktail 3 "+ cocktail3MoodsDuring)
    }
}

function generalizeDataDuring(data){
    let dataToUse = data;
    let fullDataExtracted = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
    let moodsToReturn = []
    let numberOfMoods = 15;
    for (let index = 0; index < Object.entries(dataToUse).length; index++) {
        let slicedArray = []
        const moods = Object.entries(dataToUse)[index][1];
        let divider = Math.ceil(moods.length / numberOfMoods)
        for (let i = 0; i < numberOfMoods; i++) {
            slicedArray = moods.splice(0, divider);
            //
            var mf = 1;
            var m = 0;
            var item;
            for (var ic=0; ic<slicedArray.length; ic++)
            {
                    for (var j=ic; j<slicedArray.length; j++)
                    {
                            if (slicedArray[ic] == slicedArray[j])
                             m++;
                            if (mf<m)
                            {
                              mf=m; 
                              item = slicedArray[ic];
                            }
                    }
                    m=0;
            }
            //
            fullDataExtracted[i].push(item)
        }
    }
    for (let i = 0; i < numberOfMoods; i++) {  
        moodsToReturn.push(getMostFrequentValue(fullDataExtracted[i]))
    }
    return moodsToReturn
    
}

function getAverageMood(cocktailData){
    var Moods = []
    for (var i = 0; i < cocktailData.length; i++) {       
        var moodsOfEntry = {Neutral: 0, Happy: 0, Sad: 0, Angry: 0, Surprised: 0, Scared: 0, Disgusted: 0}
        moodsOfEntry.Neutral = Number(cocktailData[i].Neutral);
        moodsOfEntry.Happy = Number(cocktailData[i].Happy);
        moodsOfEntry.Sad = Number(cocktailData[i].Sad);
        moodsOfEntry.Angry =  Number(cocktailData[i].Angry);
        moodsOfEntry.Surprised = Number(cocktailData[i].Surprised);
        moodsOfEntry.Scared = Number(cocktailData[i].Scared);
        moodsOfEntry.Disgusted = Number(cocktailData[i].Disgusted);

        let highestMoodValue = Math.max(moodsOfEntry.Happy, moodsOfEntry.Sad, moodsOfEntry.Angry, moodsOfEntry.Surprised, moodsOfEntry.Scared, moodsOfEntry.Disgusted)
        let highestMood = Object.keys(moodsOfEntry).find(key => moodsOfEntry[key] === highestMoodValue);
        Moods.push(highestMood);
    }
    
    return(getMostFrequentValue(Moods))
}
function getMostFrequentValue(data){
    var mf = 1;
    var m = 0;
    var item;
    for (var i=0; i<data.length; i++)
    {
            for (var j=i; j<data.length; j++)
            {
                    if (data[i] == data[j])
                     m++;
                    if (mf<m)
                    {
                      mf=m; 
                      item = data[i];
                    }
            }
            m=0;
    }
    return(item)

}

function emptyCocktail(cocktailID){
    d3.select(cocktailID).selectAll("path")
    .transition() 
    .duration(42000)
    .style("transform", "translate(0px, 44px)");
}

function fillCocktail(cocktailID){
    d3.select(cocktailID).selectAll("path")
    .transition() 
    .duration(4000)
    .style("transform", "translate(0px, 0px)");
}

function showMoodChanges(moodSet, tableNumber, counter, averageMoodToReturn, cocktailId){
    let moodsInCodes = []
    moodSet.forEach(element => {
        switch(element) {
            case "Happy":
                moodsInCodes.push('#FFFF00');
              break;
            case "Sad":
                moodsInCodes.push('#65DAFF');
              break;
            case "Angry":
                moodsInCodes.push('#FF0000');
              break;
            case "Surprised":
                moodsInCodes.push('#FA00FF');
              break;
              case "Scared":
                moodsInCodes.push('#CBCBC6');
              break;
            case "Disgusted":
                moodsInCodes.push('#00FF00');
              break;
            default:
                moodsInCodes.push('#e2f5fa66');
          }
    });
      setTimeout(function() {   //  call a 3s setTimeout when the loop is called
        d3.selectAll('[id="'+tableNumber+'"]')
            .attr("class", null)
            // .attr("fill", "#CA9494")   //  your code here
            .transition()
            .duration(1000)
            .attr("fill", moodsInCodes[counter])   //  your code here
            console.log(counter, moodSet[counter]);
        counter++;                  //  increment the counter
        if (counter < moodSet.length) {           //  if the counter < 10, call the loop function)
            showMoodChanges(moodSet, tableNumber, counter, averageMoodToReturn, cocktailId);             //  ..  again which will trigger another 
        }                        //  ..  setTimeout()
        else{
            d3.selectAll('[id="'+tableNumber+'"]').attr("class", averageMoodToReturn)
            fillCocktail(cocktailId)
        }
      },2500)
}

createPage();

$("#Table3").on("click",function () {
    window.location.href = "/Table3";
});