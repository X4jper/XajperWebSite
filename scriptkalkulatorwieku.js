function calculateAge() {
    const birthdateInput = document.getElementById('birthdate');
    const resultDiv = document.getElementById('result');

    const birthdate = new Date(birthdateInput.value);
    const today = new Date();

    if (!birthdateInput.value) {
        resultDiv.innerHTML = "📅 Wybierz datę, aby obliczyć wiek!";
        return;
    }

    resultDiv.innerHTML = `<div class="loader"></div>`;

    setTimeout(() => {
        const ageInMilliseconds = today - birthdate;
        const ageInSeconds = ageInMilliseconds / 1000;
        const ageInMinutes = ageInSeconds / 60;
        const ageInHours = ageInMinutes / 60;
        const ageInDays = ageInHours / 24;
        const ageInYears = ageInDays / 365.25;
        const moonCycles = ageInDays / 29.53;

        const earthOrbits = Math.floor(ageInYears); // Liczba obrotów Ziemi wokół Słońca
        const heartBeats = Math.floor(ageInMinutes * 75); // Zakładając 75 uderzeń serca na minutę
        const breaths = Math.floor(ageInMinutes * 12); // Zakładając 12 oddechów na minutę
        const fullMoons = Math.floor(moonCycles);

        const years = Math.floor(ageInYears);
        const months = Math.floor((ageInYears - years) * 12);
        const days = Math.floor(ageInDays - (years * 365.25 + months * (365.25 / 12)));

        const resultMessage = `
            🎉 Twój wiek: <br> 
            📆 ${years} lat, ${months} miesięcy i ${days} dni.<br>
            🌍 Ziemia obróciła się wokół Słońca ${earthOrbits} razy<br>
            ❤️ Twoje serce uderzyło około ${heartBeats.toLocaleString()} razy<br>
            🌬️ Oddychałeś(-aś) około ${breaths.toLocaleString()} razy<br>
            🌕 Doświadczyłeś(-aś) ${fullMoons} pełni księżyca<br>
        `;
        resultDiv.innerHTML = resultMessage;

        const isBirthday = birthdate.getDate() === today.getDate() && birthdate.getMonth() === today.getMonth();
        if (isBirthday) {
            playConfettiAnimation();
            resultDiv.innerHTML += "🎂 Wszystkiego najlepszego z okazji urodzin! 🎉";
        }
    }, 1000);
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
