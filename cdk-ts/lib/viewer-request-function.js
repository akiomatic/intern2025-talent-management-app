function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // URIの末尾が「/」の場合、index.htmlを補完する
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // URIに「.」(拡張子)が含まれていない場合、.htmlを補完する
    else if (!uri.includes('.')) {
        request.uri += '.html';
    }

    return request;
}