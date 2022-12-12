        
function form_img_function () {

    let form = document.getElementById("upload");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let formDATA = new FormData(form);
        formDATA.append("userID", 1);

        let req = new Request("update-image.php", {
            method: "POST",
            body: formDATA
        });

        try {
    
            let response = await fetch(req);
            
            console.log(response);
            
            let recourse = await response.json();
            console.log(recourse);

        } catch (error) {
            console.log(error)
        }
    })
}


form_img_function ();