$(document).ready(function(){
    console.log('JQ');
    getPets();

    $("#register").on('click', addOwner);
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
        $('#outPutTable').append('<tr id="' + i + '">' +
          '<td id="tdOwner"><input type="text" name="Owner" value="' + owner + '" value disabled="disabled"></td>' +
          '<td id="tdPet"><input type="text" name="Pet" value="' + x.petname + '"></td>' +
          '<td id="tdBreed"><input type="text" name="Breed" value="' + x.breed + '"></td>' +
          '<td id="tdColor"><input type="text" name="Color" value="' + x.color + '"></td>' +
          '<td id="tdUpdate"><button type="button" name="Update">GO</button></td>' +
          '<td id="tdDelete"><button type="button" name="Delete">GO</button></td>' +
          '<td id="tdCheck"><button type="button" name="Check">IN</button></td>' +
          '</tr>');
        }
    }
  });
}

function addOwner(){
  var first = $('#firstName').val();
  var last = $('#lastName').val();
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
    }
  });
}
