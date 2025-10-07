import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let form = document.querySelector(".form");
let inputDelay = document.querySelector(`input[name="delay"]`);

let delay = null;
let timerId = null;

let promise;

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    if(timerId) {
        return;
    }

    delay = Number(inputDelay.value);
    let selectedValue = form.querySelector(`input[name="state"]:checked`)?.value;

    promise = new Promise((resolve, reject) => {
        if(selectedValue === "fulfilled") {
            timerId = setTimeout(() => {
                resolve(`✅ Fulfilled promise in ${delay}ms`);
            }, delay);
        } else {
            timerId = setTimeout(() => {
                reject(`❌ Rejected promise in ${delay}ms`);
            }, delay);   
        }

    }).then(value => {
        iziToast.success({
            title: "Success",
            message: value,
        });
        clearTimeout(timerId);
        timerId = null;
        })
        .catch(value => {
            iziToast.error({
                title: "Error",
                message: value,
            });
            clearTimeout(timerId);
            timerId = null;
        });


});
