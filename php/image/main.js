        
function form_img_function () {

    let form = document.getElementById("upload");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let formDATA = new FormData(form);
        formDATA.append("userID", 1);

        let req = new Request("updateImage.php", {
            method: "POST",
            body: formDATA
        });

        try {
    
            let response = await fetch(req);
            
            console.log(response);
            
            let recourse = await response.json();
            console.log(recourse);

            // let new_req = new Request(`http://localhost:8080/api/read-one.php?id=${recourse.id}`); 

            // try {
                // let response = await fetch(new_req);
                
                // let recourse = await response.json();

                // get_album_information(recourse);

            // } catch (error) {
                // missing_data(error)
            // }

        } catch (error) {
            console.log(error)
        }
    })
}


form_img_function ();