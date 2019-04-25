pragma solidity ^0.4.17;

contract Articles {
    address public owner;
    address public author;
    uint256 public numArticles;

    struct Article {
        string title;
        string hash;
    }

    Article[] articles;

    function Articles(address givenAuthor)
        public
    {
        require(givenAuthor != 0x0);
        owner = msg.sender;
        author = givenAuthor;
    }

    function publish(string title, string hash)
        public
    {
        require(msg.sender == author);

        Article memory article = Article(
            title,
            hash
        );
        articles.push(article);
        numArticles += 1;
    }

    function getArticle(uint256 index)
        public
        constant returns (string, string)
    {
        return (articles[index].title, articles[index].hash);
    }
}
