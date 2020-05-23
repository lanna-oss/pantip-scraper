"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var iconv = require("iconv");
var express = require("express");
const request_promise_1 = __importDefault(require("request-promise"));
function getSearchfromTopic(topic) {
    return __awaiter(this, void 0, void 0, function* () {
        let numPage = 1;
        var results = [];
        let searchEndpoint = "https://pantip.com/search/search/get_search";
        // let topicEndPoint = "https://pantip.com/topic/[topicID]";
        let commentEndPoint = "https://pantip.com/forum/topic/render_comments?tid=[topicId]";
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
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
                    accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                formData: inputtext
            };
            const resp = yield request_promise_1.default(searchOptions);
            let convert = ic.convert(resp).toString("utf-8");
            let result = JSON.parse(convert);
            let response = JSON.parse(result.response);
            // console.log(response);
            nextPage = response.next_page;
            if (response.data) {
                response.data.map((topic) => __awaiter(this, void 0, void 0, function* () {
                    var commentOptions = {
                        url: commentEndPoint.replace("[topicId]", topic.topic_id),
                        encoding: "utf8",
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
                            accept: "application/json",
                            "X-Requested-With": "XMLHttpRequest"
                        }
                    };
                    // console.log(commentOptions);
                    let comment = yield request_promise_1.default(commentOptions);
                    let body = ic.convert(comment).toString("utf-8");
                    if (body) {
                        let result = JSON.parse(body);
                        if (result.hasOwnProperty("comments")) {
                            result.comments = result.comments.map((comment) => comment.message.replace(/<[^>]*>?/gm, ""));
                        }
                        console.log(`number of comments : ${result.comments.length}`);
                        console.log(`message of comment: ${result.comments}`);
                        results.push(result);
                    }
                }));
            }
        }
        return results;
    });
}
// req = request("http://pantip.com/topic/35614484", gotHTML);
var server = new express();
server.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let keyword = req.query.q;
    if (keyword && keyword !== "") {
        let searchKeyword = keyword.toLowerCase();
        console.log(`search query for keyword ${searchKeyword}`);
        const results = yield getSearchfromTopic(searchKeyword);
        // await saveSearchResult( keyword, results))
        // res.send(results);
    }
    else {
        res.send("Your topic for query is empty");
    }
}));
console.debug("Pantip scrape listen on port 3000");
server.listen(3000);
//# sourceMappingURL=index.js.map