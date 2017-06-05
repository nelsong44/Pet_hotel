$(document).ready(function(){
    console.log('JQ');
    // display pet info currently stored in db on page load
    getPets();
    //click events
    $("#register").on('click', addOwner);
    $("#addPet").on('click', addPet);
    $("#outPutTable").on('click', '#tdDelete', deleteData);
    $("#outPutTable").on('click', '#tdUpdate', updatePet);
}); // end onReady

// function to retrieve and display pet info stored in db on DOM
function getPets(){
  $.ajax({
    type: 'GET',
    url: '/pets',
    success: function( response ){
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        var x = response[i];
        var owner = x.firstname + ' ' + x.lastname;
        $('#ownerSelect').append('<option value="' + owner + '">' + owner + '</option>');
        if (x.petname === null) {
          alert(owner + ' pet registration needs to be finished');
        }
        else {
            $('#outPutTable').append('<tr class="new" id="' + i + '">' +
            '<td id="tdOwner"><input type="text" name="Owner" value="' + owner + '" value disabled="disabled"></td>' +
            '<td id="tdPet"><input type="text" name="Pet" value="' + x.petname + '"></td>' +
            '<td id="tdBreed"><input type="text" name="Breed" value="' + x.breed + '"></td>' +
            '<td id="tdColor"><input type="text" name="Color" value="' + x.color + '"></td>' +
            '<td id="tdUpdate"><button type="button" name="Update">GO</button></td>' +
            '<td id="tdDelete"><button type="button" name="Delete">GO</button></td>' +
            '<td id="tdCheck"><button id="in' + i + '" type="button" name="Check">IN</button>' +
            '<button id="out' + i + '" type="button" name="Check">OUT</button></td>' +
            '</tr>');
          } // end if statement
        } // end for loop
        // display checkin/checkout button depending on current status/ toggle buttons
        for (var k = 0; k < response.length; k++) {
          var y = response[k];
            if (y.checkin === null){
              $('#in' + k).css('display', 'inline');
              $('#out' + k).css('display', 'none');
              }
            else if (y.checkout === null){
              $('#in' + k).css('display', 'none');
              $('#out' + k).css('display', 'inline');
            } // end if statement
        } // end for loop
      } // end success
    }); // end ajax
  } // end getPets()

// function to add owner to db and display on DOM
function addOwner(){
  var first = $('#firstName').val();
  var last = $('#lastName').val();
  var owner = first + ' ' + last;
  // object to send
  var ownerToPost = {
    firstname: first,
    lastname: last
  }; // end object
  console.log(ownerToPost);
  $('#lastName').val('');
  $('#firstName').val('');

  $.ajax({
    type: 'POST',
    url: '/pets',
    data: ownerToPost,
    success: function( response ){
      console.log(response);
      $('#ownerSelect').append('<option value="' + owner + '">' + owner + '</option>');
    } // end success
  }); // end ajax
} // end addOwner()

// function to add new user-input pet info on button click
function addPet(){
  var owner = $('#ownerSelect').val();
  var petName = $('#pet').val();
  var breed = $('#breed').val();
  var color = $('#color').val();
  var seperate = owner.split(' ');
  console.log(seperate);
  // object to send
  var petRegisterToSend = {
    first: seperate[0],
    last: seperate[1],
    pet: petName,
    breed: breed,
    color: color
  }; // end object
    $.ajax({
      type: 'POST',
      url: '/petAdd',
      data: petRegisterToSend,
      success: function( response) {
        console.log(response);
        $('.new').remove();
        getPets();
      } // end success
    }); // end ajax
} // end add Pet()

// function to delete pet info on button click
function deleteData(){
  var data = $(this).siblings();
  console.log(data);
  var owner = data[0];
  console.log(owner.innerHTML);
  var seperate = owner.innerHTML;
  var after = seperate.split('"');
  console.log(after);
  var ownerName = after[5];
  console.log(ownerName);
  var petName = (data[1].innerHTML).split('"');
  console.log(petName[5]);

  var deleteToSend = {
    owner: ownerName,
    pet: petName[5]
  }; // end object

  $.ajax({
    type: 'DELETE',
    url: '/pet',
    data: deleteToSend,
    success: function( response) {
      console.log(response);
      $('.new').remove();
      getPets();
    } // end success
  }); // end ajax
} // end deleteData

// function to update pet info on button click
function updatePet(){
  var data = $(this).siblings();
  var petName = (data[1].innerHTML).split('"')[5];
  console.log(petName);
} // end updatePet()
