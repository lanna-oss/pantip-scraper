var cheerio = require("cheerio");
var request = require("request-promise");
var iconv = require("iconv");
var fs = require("fs");
var express = require("express");

function gotHTML(err, resp, html) {
  if (err) return console.error(err);
  var parser = cheerio.load(html);
  topic = {};
  topic.title = parser("h2").text();
  topic.story = parser(".display-post-story", ".main-post").text();
  var options = {
    url: "http://pantip.com/forum/topic/render_comments?tid=35614484",
    encoding: "utf8",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
      accept: "application/json",
      "X-Requested-With": "XMLHttpRequest"
    }
  };

  var ic = new iconv.Iconv("utf-8", "tis-620");

  request(options, function(err, resp, html) {
    try {
      body = ic.convert(resp.body).toString("utf-8");
      var result = JSON.parse(body);
      console.log(result.comments[10].message);
    } catch (err) {
      console.error(`error: ${err}`);
    }
  });
}

async function getSearchfromTopic(topic) {
  var numPage = 1;
  var results = [];
  let searchEndpoint = "https://pantip.com/search/search/get_search";
  // let topicEndPoint = "https://pantip.com/topic/[topicID]";
  let commentEndPoint =
    "https://pantip.com/forum/topic/render_comments?tid=[topicId]";

  var ic = new iconv.Iconv("utf-8", "tis-620");

  var nextPage = true;

  while (nextPage) {
    let inputtext = {
      inputtext: topic,
      page: numPage++
    };
    console.log(inputtext);
    var searchOptions = {
      method: "POST",
      url: searchEndpoint,
      encoding: "utf8",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
        accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      formData: inputtext
    };
    const resp = await request(searchOptions);
    let convert = ic.convert(resp).toString("utf-8");
    let result = JSON.parse(convert);
    let response = JSON.parse(result.response);

    // console.log(response);
    nextPage = response.next_page;
    if (response.data) {
      response.data.map(async topic => {
        var commentOptions = {
          url: commentEndPoint.replace("[topicId]", topic.topic_id),
          encoding: "utf8",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
            accept: "application/json",
            "X-Requested-With": "XMLHttpRequest"
          }
        };

        // console.log(commentOptions);
        let comment = await request(commentOptions);
        body = ic.convert(comment).toString("utf-8");
        let result = JSON.parse(body);

        result.comments = result.comments.map(comment =>
          comment.message.replace(/<[^>]*>?/gm, "")
        );

        // console.log(comments.length);
        // console.log(result.comments[0].message);
        results.push(result);
      });
    }
  }

  return results;
}

// req = request("http://pantip.com/topic/35614484", gotHTML);

var server = new express();

server.get("/search", async (req, res) => {
  let keyword = req.query.q;
  if (keyword !== "") {
    let searchKeyword = keyword.toLowerCase();
    const results = await getSearchfromTopic(searchKeyword);
    res.send(
      `search query for keyword ${searchKeyword} is ${JSON.stringify(results)}`
    );
  } else {
    res.send("Your keyword for query is empty");
  }
});

console.debug("Pantip scraper  listen on port 3000");
server.listen(3000);
