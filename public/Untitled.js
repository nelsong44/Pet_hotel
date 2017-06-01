$(document).ready(function(){
    console.log('JQ');
    getPets();

});


function getPets(){
  $.ajax({
    type: 'GET',
    url: '/pets',
    success: function( response ){
      console.log(response);
    }
  });
}
