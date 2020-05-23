var iconv = require("iconv");
var express = require("express");

import request from "request-promise";
import { saveSearchResult } from "./repository/result";

async function getSearchfromTopic(topic: string) {
  let numPage: number = 1;
  var results: any = [];
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
    //  console.log(inputtext);
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
      response.data.map(async (topic: any) => {
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
        let body = ic.convert(comment).toString("utf-8");
        if (body) {
          let result = JSON.parse(body);

          if (result.hasOwnProperty("comments")) {
            result.comments = result.comments.map((comment: any) =>
              comment.message.replace(/<[^>]*>?/gm, "")
            );
          }
          console.log(`number of comments : ${result.comments.length}`);
          console.log(`message of comment: ${result.comments}`);
          results.push(result);
        }
      });
    }
  }

  return results;
}

// req = request("http://pantip.com/topic/35614484", gotHTML);

var server = new express();

server.get("/search", async (req: any, res: any) => {
  let keyword = req.query.q;
  if (keyword && keyword !== "") {
    let searchKeyword = keyword.toLowerCase();
    console.log(`search query for keyword ${searchKeyword}`);
    const results = await getSearchfromTopic(searchKeyword);
    // await saveSearchResult( keyword, results))
    // res.send(results);
  } else {
    res.send("Your topic for query is empty");
  }
});

console.debug("Pantip scrape listen on port 3000");
server.listen(3000);
