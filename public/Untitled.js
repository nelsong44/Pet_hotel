$(document).ready(function(){
    console.log('JQ');
    getPets();

    $("#register").on('click', addOwner);
    $("#addPet").on('click', addPet);
});

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
            $('#outPutTable').append('<tr id="' + i + '">' +
            '<td id="tdOwner"><input type="text" name="Owner" value="' + owner + '" value disabled="disabled"></td>' +
            '<td id="tdPet"><input type="text" name="Pet" value="' + x.petname + '"></td>' +
            '<td id="tdBreed"><input type="text" name="Breed" value="' + x.breed + '"></td>' +
            '<td id="tdColor"><input type="text" name="Color" value="' + x.color + '"></td>' +
            '<td id="tdUpdate"><button type="button" name="Update">GO</button></td>' +
            '<td id="tdDelete"><button type="button" name="Delete">GO</button></td>' +
            '<td id="tdCheck"><button id="in' + i + '" type="button" name="Check">IN</button>' +
            '<button id="out' + i + '" type="button" name="Check">OUT</button></td>' +
            '</tr>');
          }
        } //for loop end
        for (var k = 0; k < response.length; k++) {
          var y = response[k];
            if (y.checkin === null){
              $('#in' + k).css('display', 'inline');
              $('#out' + k).css('display', 'none');
              }
            else if (y.checkout === null){
              $('#in' + k).css('display', 'none');
              $('#out' + k).css('display', 'inline');
        }
      }
      }
    });
  }

function addOwner(){
  var first = $('#firstName').val();
  var last = $('#lastName').val();
  var owner = first + ' ' + last;
  var ownerToPost = {
    firstname: first,
    lastname: last
  };
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
    }
  });
}


function addPet(){
  var owner = $('#ownerSelect').val();
  var petName = $('#pet').val();
  var breed = $('#breed').val();
  var color = $('#color').val();
  var seperate = owner.split(' ');
  console.log(seperate);
  var petRegisterToSend = {
    first: seperate[0],
    last: seperate[1],
    pet: petName,
    breed: breed,
    color: color
  };
    $.ajax({
      type: 'POST',
      url: '/petAdd',
      data: petRegisterToSend,
      success: function( response) {
        console.log(response);
      }
    });
}
