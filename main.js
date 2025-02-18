// Function to Load Pages Dynamically
// function loadPage(page, specfic=null) {
//     fetch(page)
//         .then(response => response.text())
//         .then(html => {
//             document.getElementById("page-content").innerHTML = html;
//         })
//         .catch(error => console.error("Error loading page:", error));
// }
let lastAnim;

function loadPage(page, specfic=null) {
    const contentDiv = document.getElementById("page-content");
    lastAnim = specfic ? specfic: 'Appear';
    // Start fade out
    contentDiv.classList.add("fade-out");

    setTimeout(() => {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                contentDiv.innerHTML = html;
                contentDiv.classList.remove("fade-out");
                contentDiv.classList.add("fade-in");

                // Update URL without reloading
                history.pushState({ page: page }, "", page);
            })
            .catch(error => console.error("Error loading page:", error));
    }, 500);
}

// Handle browser back/forward navigation
window.addEventListener("popstate", (event) => {
    if (event.state && event.state.page) {
        console.log(lastAnim);
        loadPage(event.state.page);
        transition(lastAnim);
    }
});