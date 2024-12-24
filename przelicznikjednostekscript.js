function toggleUnits() {
    const unitType = document.getElementById('unitFrom').value;
    const lengthUnits = document.getElementById('lengthUnits');
    const weightUnits = document.getElementById('weightUnits');

    if (unitType === 'length') {
        lengthUnits.classList.remove('hidden');
        weightUnits.classList.add('hidden');
    } else if (unitType === 'weight') {
        lengthUnits.classList.add('hidden');
        weightUnits.classList.remove('hidden');
    }
}

function convert() {
    const inputValue = parseFloat(document.getElementById('inputValue').value);
    
    if (isNaN(inputValue)) {
        document.getElementById('result').innerText = 'Wprowadź poprawną wartość.';
        return;
    }

    const unitType = document.getElementById('unitFrom').value;
    let result = '';

    switch (unitType) {
        case 'length':
            result = convertLength(inputValue, document.getElementById('lengthUnitFrom').value);
            break;
        case 'weight':
            result = convertWeight(inputValue, document.getElementById('weightUnitFrom').value);
            break;
        default:
            result = 'Nieprawidłowy typ jednostki';
    }

    document.getElementById('result').innerText = result;
}

function convertLength(value, unitFrom) {
    let result = '';

    switch (unitFrom) {
        case 'meter':
            result = `${value} metrów jest równe:
                      ${value * 0.001} kilometrów,
                      ${value * 100} centymetrów.`;
            break;
        case 'kilometer':
            result = `${value} kilometrów jest równe:
                      ${value * 1000} metrów,
                      ${value * 100000} centymetrów.`;
            break;
        case 'centimeter':
            result = `${value} centymetrów jest równe:
                      ${value * 0.01} metrów,
                      ${value * 0.00001} kilometrów.`;
            break;
        default:
            result = 'Nieprawidłowa jednostka długości';
    }

    return result;
}

function convertWeight(value, unitFrom) {
    let result = '';

    switch (unitFrom) {
        case 'gram':
            result = `${value} gramów jest równe:
                      ${value * 0.001} kilogramów,
                      ${value * 0.00220462} funtów.`;
            break;
        case 'kilogram':
            result = `${value} kilogramów jest równe:
                      ${value * 1000} gramów,
                      ${value * 2.20462} funtów.`;
            break;
        case 'pound':
            result = `${value} funtów jest równe:
                      ${value * 453.592} gramów,
                      ${value * 0.453592} kilogramów.`;
            break;
        default:
            result = 'Nieprawidłowa jednostka wagi';
    }

    return result;
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
