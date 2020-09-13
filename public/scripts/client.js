/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

$(document).ready(() => {
  //use an escape function to prevent XSS
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };



  const createTweetElement = function(tweetObj) {
    const $tweet = $(`
      <article class="tweet">

        <header>
          <div>
            <img src="${tweetObj.user.avatars}" alt="profile picture"> 
            <p>${tweetObj.user.name}</p>
          </div>
          <a class="handle">${tweetObj.user.handle}</a>
        </header>

        <main>
          <p>${escape(tweetObj.content.text)}</p>
        </main>

        <footer>
          <p>${tweetObj.created_at}</p>
          <p><3<3<3</p>
        </footer>

      </article>`);

    return $tweet;
  };

  const renderTweets = function(tweets) {
    $('#tweet-container').empty();    //empty tweet container before starting the loop

    for (let tweet of tweets) {  // loops through tweets
      //let $tweet = createTweetElement(tweet);  // calls createTweetElement for each tweet
      $('#tweet-container').prepend(createTweetElement(tweet));  // takes return value and appends it to the tweets container
    }
  };


  $('.tweet-form').on("submit", ((event) => {
    event.preventDefault();

    if ($('#tweet-text').val().length === 0) {
      alert('you cannot submit empty tweet!');

    } else if ($('#tweet-text').val().length > 140) {
      alert('Your tweet is too long! make it shorter!');

    } else {

      const serialized = $('.tweet-form').serialize();
      //console.log(serialized);

      $.ajax({
        type: 'POST',
        url: '/tweets/',
        data: serialized,
        complete: function() {
          //console.log('request is complete');
          loadTweets();
        }
      });
      //Reset counter
      $('.counter').val(140);
      //Reset input field
      $('#tweet-text').val("");
            
    }
  
  }));
  
  const loadTweets = function() {
    $.ajax('/tweets/', { method: 'GET' })
      .then(function(response) {
        renderTweets(response);
      });
  };
  
  loadTweets();



  // Test driver code (temporary).
  const data = [
    {
      "user": {
        "name": "Newton",
        "avatars": "https://i.imgur.com/73hZDYK.png"
        ,
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": "https://i.imgur.com/nlhLi3I.png",
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    }
  ];
    
  renderTweets(data);


});
