document.addEventListener('DOMContentLoaded', function(){
    const label = $("label");
    const labelArray = document.querySelectorAll("label");

    //Add checked (orange color) class clicked labels.    
    let currentRating = 0;
    label.on("click", function(event) {
        const labelValue = $(this).attr("for"); //get the labelvalue for the clicked on radio
        document.getElementById(labelValue).checked = true; //get the radio with the labelvalue and set it to be clicked
        const ratingInputs = document.getElementsByName('rating'); 
        const selectedRating = Array.from(ratingInputs).find(input => input.checked); //get the rating value
        const rating = Number(selectedRating.value);
        
        label.removeClass("checked");        

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