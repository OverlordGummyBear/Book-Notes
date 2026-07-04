let currentRating = 0;

document.addEventListener('DOMContentLoaded', function(){
    const label = $("label");
    const labelArray = document.querySelectorAll("label");

    //Add checked (orange color) class clicked labels.    
    const zeroCheckbox = document.getElementById("0");
    if(zeroCheckbox) zeroCheckbox.checked = true; //mark it so it has a current rating of 0 if no clicks

    label.on("click", function(event) {
        const labelValue = $(this).attr("for"); //get the labelvalue for the clicked on radio
        document.getElementById(labelValue).checked = true; //get the radio with the labelvalue and set it to be clicked
        const ratingInputs = document.getElementsByName('rating'); 
        const selectedRating = Array.from(ratingInputs).find(input => input.checked); //get the rating value
        const rating = Number(selectedRating.value);

        label.removeClass("checked");        

        console.log(Number(currentRating) != Number(rating));
        console.log("Rating: " + rating);
        console.log("CurrentRating: " + currentRating);

        if(currentRating != rating){       
            for (let i = 0; i < labelValue; i++) {            
                $(labelArray[i]).addClass("checked");
                currentRating = rating;            
            }  

            document.getElementById("0").checked = false;
            
        } else{
            currentRating = 0;
            document.getElementById("0").checked = true;
        }   
    })   
});