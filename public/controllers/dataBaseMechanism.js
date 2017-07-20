$(document).ready(function() {
  $('.cardDeck').hide().fadeIn('slow');
  setTimeout(function () {
    $('.addTestAlert').hide('slow');
  }, 1000);

  //global var for the func below
  var ourNameQuery;
  // Ajax request handling the search button:
  // $('#searchButton').on('click', function(button) {
  //   // button.preventDefault();
  //   var searchInput = $('#searchInput');
  //   // var ourNameQuery = searchInput.target.value;
  //   ourNameQuery = searchInput.val();
  //   console.log(`Nasz query: ${ourNameQuery}`);
  //   /* Act on the event */
  // });
  //  $.ajax({
  //    url: '/database/filter',
  //    type: 'POST',
  //    data: {name: `${ourNameQuery}`}
  //  })
  //  .done(function() {
  //    location.reload();
  //    console.log("success");
  //  })
  //  .fail(function() {
  //    console.log("error");
  //  })
  //  .always(function() {
  //    console.log("complete");
  //  });

});
