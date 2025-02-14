// Function to Load Pages Dynamically
function loadPage(page, specfic=null) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.getElementById("page-content").innerHTML = html;
        })
        .catch(error => console.error("Error loading page:", error));
}
