function calculateBMI() {

    var weight = parseFloat(document.getElementById("weight").value);
    var height = parseFloat(document.getElementById("height").value);

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        alert("Proszę wprowadzić prawidłowe wartości wagi i wzrostu.");
        return;
    }

    var bmi = weight / ((height / 100) ** 2);

    var resultElement = document.getElementById("result");
    resultElement.innerHTML = "Twoje BMI to: " + bmi.toFixed(2);

    var category = "";
    if (bmi < 18.5) {
        category = "Niedowaga";
    } else if (bmi < 24.9) {
        category = "Waga normalna";
    } else if (bmi < 29.9) {
        category = "Nadwaga";
    } else {
        category = "Otyłość";
    }

    resultElement.innerHTML += "<br>Twoja kategoria BMI to: " + category;
}

function blokujMysz(event) {
  if (event.button === 2 || event.which === 3) {
      event.preventDefault();
  }
}

function blokujKlawisze(event) {
  if (event.key === 'F12') {
      event.preventDefault();
  }

  if (event.ctrlKey && event.key === 'u') {
      event.preventDefault();
  }
}

document.addEventListener('mousedown', blokujMysz);

document.addEventListener('keydown', blokujKlawisze);

document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});
