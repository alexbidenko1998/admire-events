#include <iostream>
#include <string>
#include <stdlib.h>

using namespace std;

void set_content_type(string content_type) {
    cout << "Content-type: " << content_type << "\r\n\r\n";
}

void set_page_title(string title) {
    cout << "<title>" << title << "</title>\n";
}

void h1_text(string text) {
    cout << "<h1>" << text << "</h1>" << "\n";
}

void p(string text) {
    cout << "<p>" << text << "</p>" << "\n";
}

int main() {
    set_content_type("text/html");
    cout << "<!doctype html>\n";
    cout << "<html lang=\"en\">\n";
    cout << "<head>\n";
    set_page_title("Hello, World!");
    cout << "</head>\n";
    cout << "<body>\n";
    h1_text("Hello, World!");
    p(getenv("REQUEST_URI"));
    p(getenv("REMOTE_ADDR"));
    p(getenv("REQUEST_METHOD"));
    p(getenv("DOCUMENT_ROOT"));
    p(getenv("QUERY_STRING"));
    cout << "</body>\n";
    cout << "</html>";
    return 0;
}