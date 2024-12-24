let customValuesArray = [];

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

function addValue() {
    const customValuesInput = document.getElementById('customValues');
    const menu = document.getElementById('menu');
    const resultDiv = document.getElementById('result');
    const wheel = document.getElementById('wheel');

    const newValues = customValuesInput.value.split(',').map(value => value.trim());

    if (newValues.length > 0 && newValues[0] !== '') {
        customValuesArray = [...customValuesArray, ...newValues];

        newValues.forEach(newValue => {
            const valueTag = document.createElement('span');
            valueTag.className = 'menu-value';
            valueTag.textContent = newValue;
            valueTag.onclick = function() {
                removeValue(newValue);
            };
            menu.insertBefore(valueTag, customValuesInput);
        });

        customValuesInput.value = '';

        const existingSections = document.querySelectorAll('.wheel-section');
        existingSections.forEach(section => section.remove());

        const angle = 360 / customValuesArray.length;
        let rotation = 0;

        for (let i = 0; i < customValuesArray.length; i++) {
            const section = document.createElement('div');
            section.className = 'wheel-section';
            section.style.background = getRandomColor();
            section.style.transform = `rotate(${rotation}deg)`;
            section.setAttribute('data-value', customValuesArray[i]);
            wheel.appendChild(section);

            rotation += angle;
        }

        resultDiv.innerText = '';
    } else {
        resultDiv.innerText = 'Proszę wprowadzić co najmniej jedną wartość przed dodaniem do menu.';
    }
}

function removeValue(value) {
    const index = customValuesArray.indexOf(value);
    if (index !== -1) {
        customValuesArray.splice(index, 1);

        const menuValues = document.querySelectorAll('.menu-value');
        menuValues[index].remove();

        const existingSections = document.querySelectorAll('.wheel-section');
        existingSections.forEach(section => section.remove());

        const wheel = document.getElementById('wheel');
        const angle = 360 / customValuesArray.length;
        let rotation = 0;

        for (let i = 0; i < customValuesArray.length; i++) {
            const section = document.createElement('div');
            section.className = 'wheel-section';
            section.style.background = getRandomColor();
            section.style.transform = `rotate(${rotation}deg)`;
            section.setAttribute('data-value', customValuesArray[i]);
            wheel.appendChild(section);

            rotation += angle;
        }
    }
}

function showNotification(value) {
    const container = document.getElementById('notification-container');
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification';
    notificationDiv.textContent = `Wylosowano: ${value}`;
    container.appendChild(notificationDiv);

    // Dodaj animację wejścia
    notificationDiv.classList.add('notification-enter');

    // Dodaj animację konfetti
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = ''; // Wyczyść poprzednie konfetti

    for (let i = 0; i < 50; i++) {
        createConfetti(confettiContainer);
    }

    // Usuń powiadomienie po zakończeniu animacji
    setTimeout(() => {
        notificationDiv.classList.remove('notification-enter');
        notificationDiv.classList.add('notification-exit');
        setTimeout(() => {
            notificationDiv.remove();
            confettiContainer.innerHTML = ''; // Wyczyść konfetti po zakończeniu animacji
        }, 500); // Czas trwania animacji wyjścia (dopasuj do animacji CSS)
    }, 3000); // Czas trwania animacji wejścia (dopasuj do animacji CSS)
}

function spinWheel() {
    const resultDiv = document.getElementById('result');
    const wheel = document.getElementById('wheel');
    const pointer = document.getElementById('pointer');
    const confettiContainer = document.getElementById('confetti-container');

    if (!confettiContainer) {
        console.error('Nie można znaleźć elementu o id "confetti-container".');
        return;
    }

    if (customValuesArray.length < 2) {
        resultDiv.innerText = 'Proszę dodać co najmniej dwie wartości.';
        return;
    }

    // Wylosuj jedną z wartości
    const randomIndex = Math.floor(Math.random() * customValuesArray.length);
    const selectedValue = customValuesArray[randomIndex];

    // Oblicz kąt obrotu dla wylosowanej wartości
    const angle = 360 / customValuesArray.length;
    const rotation = randomIndex * angle + 720; // Dodaj 720 stopni, aby wykonać pełny obrót przed zatrzymaniem

    // Zatrzymaj animację kręcenia kołem
    wheel.style.animation = 'none';

    // Zaktualizuj wskaźnik
    pointer.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    // Zaktualizuj kąt obrotu strzałki
    const arrowRotation = 180 - rotation; // Obrót strzałki o 90 stopni względem sekcji koła
    pointer.style.transform = `translate(-50%, -50%) rotate(${arrowRotation}deg)`;

    // Dodaj animację kręcenia kołem po pewnym czasie (100ms opóźnienia)
    setTimeout(() => {
        wheel.style.animation = 'spin 3s ease-out';
        // Dodaj animację konfetti, ale tylko jeśli istnieje kontener konfetti
        if (confettiContainer) {
            for (let i = 0; i < 20; i++) {
                createConfetti(confettiContainer);
            }
        }

        // Wyświetl powiadomienie z animacją
        showNotification(selectedValue);
    }, 100);
}

function createConfetti(container) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    container.appendChild(confetti);

    confetti.addEventListener('animationend', () => {
        confetti.remove();
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
