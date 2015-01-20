function loadData() {

  var $body = $('body');
  var $wikiElem = $('#wikipedia-links');
  var $nytHeaderElem = $('#nytimes-header');
  var $nytElem = $('#nytimes-articles');
  var $greeting = $('#greeting');

  // clear out old data before new request
  $wikiElem.text("");
  $nytElem.text("");

  // load streetview
  var street = $('#street').val()
  var city = $('#city').val()
  var address = [street, city].join(', ')

  var streetview_url = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location='+ address + '"'

  $greeting.text("So you want to live at " + address + "?")
  $body.append('<img class="bgimg" src="'+ streetview_url + '">');

  // load nyt articles
  var nyt_url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&sort=newest&api-key=ea820f776342a25d51f81844fae95dc9:0:62445861'

  $.getJSON(nyt_url, function(data){
    $nytHeaderElem.text('New York Times Articles About ' + city);
    $.each(data.response.docs, function(i, value) {
      var article = data.response.docs[i];
      $nytElem.append('<li class="article"><a href="'+ article.web_url +'">' + article.headline.main +'</a><p>' + article.lead_paragraph + '</p></li>');
    });
  }).error(function(e){
     $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
  });

  // load wikipedia links
  var wiki_url = "http://en.wikipedia.org/w/api.php?format=json&action=opensearch&search="+ city + "&callback=wikiCallback"

  $.ajax({
    url: wiki_url,
    dataType:'jsonp',
    //jsonp: callback,
    success: function(data){
      var article_list = data[1];

      $.each(article_list, function(i, value){
        var page = article_list[i];
        $wikiElem.append('<li><a href="http://en.wikipedia.org/wiki/'+ page + '">'+ page +'</a></li>');
      });
    }
  });

  return false;
};

$('#form-container').submit(loadData);

// loadData();
