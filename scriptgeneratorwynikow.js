const resultContainer = document.getElementById('result');
var matchData = {
    team1: {
        name: "",
        players: [],
        sztab: [],
        possession: 50,
        shots: 0,
        yellowCards: 0,
        redCards: 0,
        score: 0,
        spalone: 0,
    },
    team2: {
        name: "",
        players: [],
        sztab: [],
        possession: 50,
        shots: 0,
        yellowCards: 0,
        redCards: 0,
        score: 0,
        spalone: 0,
    },
    location: "",
    score: { team1: 0, team2: 0 },
    events: [],
    currentMinute: 0,
    currentSecond: 0,
    intervalId: null,
};

document.getElementById('team1').addEventListener('input', function() {
    this.value = this.value.toUpperCase(); // Zamień na wielkie litery
});

document.getElementById('team2').addEventListener('input', function() {
    this.value = this.value.toUpperCase(); // Zamień na wielkie litery
});

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

function initializePlayers(team) {
    team.players = []; // Wyczyść listę zawodników
    team.sztab = [];

    // Dodaj bramkarza
    team.players.push({
        name: "Bramkarz",
        position: "Bramkarz",
        yellowCards: 0,
        redCards: 0,
        goals: 0,
        injury: false, // Ustal, czy zawodnik ma kontuzję
        isRedCarded: false // Ustal, czy zawodnik ma czerwoną kartkę
    });

    // Dodaj obrońców
    for (let i = 1; i <= 4; i++) {
        team.players.push({
            name: `Obrońca ${i}`,
            position: "Obrońca",
            yellowCards: 0,
            redCards: 0,
            goals: 0,
            injury: false,
            isRedCarded: false
        });
    }

    // Dodaj pomocników
    for (let i = 1; i <= 4; i++) {
        team.players.push({
            name: `Pomocnik ${i}`,
            position: "Pomocnik",
            yellowCards: 0,
            redCards: 0,
            goals: 0,
            injury: false,
            isRedCarded: false
        });
    }

    // Dodaj napastników
    for (let i = 1; i <= 2; i++) {
        team.players.push({
            name: `Napastnik ${i}`,
            position: "Napastnik",
            yellowCards: 0,
            redCards: 0,
            goals: 0,
            injury: false,
            isRedCarded: false
        });
    }

    for (let i = 1; i <= 1; i++) {
        team.sztab.push({
            name: `Trener ${i}`,
            position: "Trener",
            yellowCards: 0,
            redCards: 0,
            isRedCarded: false,
            experience: 0, // Możesz dodać więcej właściwości, np. doświadczenie
            strategy: "Ofensywna", // Możesz ustawić strategię trenera
        });
    }

}

function updateStatusIndicators() {
    var breakStatus = document.getElementById("break-status");
    var inProgressStatus = document.getElementById("in-progress-status");
    var finishedStatus = document.getElementById("finished-status");
    var brakStatus = document.getElementById("brak-status");

    if (matchData.currentMinute < 45) {
        brakStatus.style.display = "block";
        breakStatus.style.display = "none";
        inProgressStatus.style.display = "none";
        finishedStatus.style.display = "none";
    } else if (matchData.currentMinute == 45) {
        brakStatus.style.display = "none";
        breakStatus.style.display = "block";
        inProgressStatus.style.display = "none";
        finishedStatus.style.display = "none";
    } else if (matchData.currentMinute > 45 && matchData.currentMinute < 90) {
        brakStatus.style.display = "none";
        breakStatus.style.display = "none";
        inProgressStatus.style.display = "block";
        finishedStatus.style.display = "none";
    } else if (matchData.currentMinute >= 90) {
        brakStatus.style.display = "none";
        breakStatus.style.display = "none";
        inProgressStatus.style.display = "none";
        finishedStatus.style.display = "block";
    }
}

function generateResult() {
    matchData.team1.name = document.getElementById("team1").value;
    matchData.team2.name = document.getElementById("team2").value;

    // Inicjalizacja składu drużyn
    initializePlayers(matchData.team1);
    initializePlayers(matchData.team2);

    var resultContainer = document.getElementById("result");

    // Rozpocznij aktualizacje wyniku i komentarzy co sekundę
    matchData.intervalId = setInterval(updateResult, 1000);

    updateResult();
}

function updateResult() {
    matchData.currentMinute += 1;
    simulateEvent();

    var eventsContainer = document.getElementById("events");

    if (matchData.currentMinute >= 90) {
        clearInterval(matchData.intervalId);
        eventsContainer.innerHTML += `<p>Końcowy gwizdek! Mecz zakończony!</p>`;
    } else if (matchData.currentMinute == 45) {
        eventsContainer.innerHTML += `<p>Koniec pierwszej połowy! Rozpoczęcie przerwy.</p>`;
    } else if (matchData.currentMinute > 45 && matchData.currentMinute < 90) {
        eventsContainer.innerHTML += `<p>Mecz w trakcie drugiej połowy!'</p>`;
    } else if (matchData.currentMinute >= 90) {
        eventsContainer.innerHTML += `<p>Koniec meczu!'</p>`;
    }

    displayEvents();
    updateStats();
    updateStatusIndicators();
    displayResult();
    displayPlayers(matchData.team1, 'team1-players');
    displayPlayers(matchData.team2, 'team2-players');
    checkGameStatus();
}

function aktualizujSedziego() {
    const sedzia = localStorage.getItem('wylosowanySedzia');
    localStorage.setItem('wylosowanySedzia', sedzia);
    document.querySelector('.referee strong').innerText = sedzia;
}
setInterval(aktualizujSedziego, 1000);

function odswiezInterfejs() {
    document.querySelector('.date strong').innerText = new Date().toLocaleTimeString();

}
setInterval(odswiezInterfejs, 1000);

function odswiezInterfejs() {
    aktualizujNazwyDruzyn();
    aktualizujWynik();
    aktualizujCzasIMinuty();
    aktualizujStatusMeczu();
}
setInterval(odswiezInterfejs, 1000);

function aktualizujCzasIMinuty() {
    const aktualnaData = new Date();

    const opcjeDaty = {
        day: '2-digit',
        month: 'long'
    };
    const sformatowanyDzien = aktualnaData.toLocaleDateString('pl-PL', opcjeDaty);

    const opcjeGodziny = {
        hour: '2-digit',
        minute: '2-digit'
    };
    const sformatowanaGodzina = aktualnaData.toLocaleTimeString('pl-PL', opcjeGodziny);

    const dateElement = document.querySelector('.date');
    dateElement.innerHTML = `${sformatowanyDzien} o <strong>${sformatowanaGodzina}</strong>`;
    document.querySelector('.time-lapsed').innerText = `${matchData.currentMinute}'`;
}

document.querySelector('.bet-place').addEventListener('click', function() {
    const overlayElement = document.querySelector('.overlay');

    if (!overlayElement) {
        console.error('Element .overlay nie został znaleziony');
        return;
    }

    html2canvas(overlayElement, {
        backgroundColor: null
    }).then(canvas => {

        if (!canvas) {
            console.error('Nie udało się utworzyć obrazu z elementu .overlay');
            return;
        }

        const link = document.createElement('a');
        link.download = 'widżet.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
        console.error('Błąd podczas generowania obrazu:', error);
    });
});

function aktualizujStatusMeczu() {
    const statusElement = document.querySelector('.status');

    if (matchData.currentMinute === 0) {
        statusElement.innerText = "Brak";
        statusElement.style.backgroundColor = "var(--color-bg-seconadry)";
        statusElement.style.color = "grey";
    } else if (matchData.currentMinute < 45) {
        statusElement.innerText = "Na żywo";
        statusElement.style.backgroundColor = "var(--color-bg-alert)";
        statusElement.style.color = "var(--color-text-alert)";
    } else if (matchData.currentMinute === 45) {
        statusElement.innerText = "Przerwa";
        statusElement.style.backgroundColor = "var(--color-bg-yellow)";
        statusElement.style.color = "white";
    } else if (matchData.currentMinute > 45 && matchData.currentMinute < 90) {
        statusElement.innerText = "Na żywo";
        statusElement.style.backgroundColor = "var(--color-bg-alert)";
        statusElement.style.color = "var(--color-text-alert)";
    } else if (matchData.currentMinute >= 90) {
        statusElement.innerText = "Koniec";
        statusElement.style.backgroundColor = "var(--color-bg-alert)";
        statusElement.style.color = "var(--color-text-alert)";
    }
}

function aktualizujWynik() {
    document.querySelector('.score-number--leading').innerText = matchData.score.team1;
    document.querySelector('.score-number:last-child').innerText = matchData.score.team2;
}

function aktualizujNazwyDruzyn() {
    document.querySelector('.team--home .team-name').innerText = matchData.team1.name;
    document.querySelector('.team--away .team-name').innerText = matchData.team2.name;
}

localStorage.removeItem('wylosowanySedzia')

function displayResult() {
    var resultContainer = document.getElementById("result");
    var statusIndicators = document.querySelector(".status-indicators");

    const wylosowanySedzia = localStorage.getItem('wylosowanySedzia');

    console.log("matchData:", matchData);

    document.getElementById("brak-status").style.display = "block";
    document.getElementById("break-status").style.display = "none";
    document.getElementById("finished-status").style.display = "none";
    document.getElementById("in-progress-status").style.display = "none";

    resultContainer.innerHTML = `<h2><img src="szczegoly.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Szczegóły:</h2>`;
    resultContainer.innerHTML += `<p><img src="mecz.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Mecz: ${matchData.team1.name} - ${matchData.team2.name}</p>`;
    resultContainer.innerHTML += `<p><img src="wynik.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Wynik: ${matchData.score.team1}:${matchData.score.team2} (${matchData.currentMinute}') - ${getStatusText()}</p>`;
    resultContainer.innerHTML += `<p><img src="sedzia.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Sędzia: ${wylosowanySedzia}</p>`;

    // Wyświetlanie wskaźników statusu
    statusIndicators.style.display = "flex";
}

const sedziowie = [
    "Szymon Marciniak",
    "Wojciech Myc",
    "Robert Gorol",
    "Anthony Taylor",
    "Clement Turpin",
    "Michael Oliver",
    "Daniele Orsato",
    "Pierluigi Collina",
    "Bartosz Frankowski",
    "Damian Sylwestrzak"
];

// Funkcja do losowania sędziego
function losowySedzia() {
    const index = Math.floor(Math.random() * sedziowie.length);
    return sedziowie[index];
}

// Sprawdzenie, czy sędzia już został wylosowany
if (!localStorage.getItem('wylosowanySedzia')) {
    const sedzia = losowySedzia();
    localStorage.setItem('wylosowanySedzia', sedzia);
    resultContainer.innerHTML += `<p><img src="sedzia.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Sędzia: ${sedzia}</p>`;
} else {
    const wylosowanySedzia = localStorage.getItem('wylosowanySedzia');
    resultContainer.innerHTML += `<p><img src="sedzia.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Sędzia: ${wylosowanySedzia}</p>`;
}

function getStatusText() {
    var breakStatus = document.getElementById("break-status");
    var inProgressStatus = document.getElementById("in-progress-status");
    var finishedStatus = document.getElementById("finished-status");
    var brakStatus = document.getElementById("brak-status");
    if (matchData.currentMinute < 45) {
        return "Mecz w trakcie pierwszej połowy!";
    } else if (matchData.currentMinute == 45) {
        return "Przerwa!";
    } else if (matchData.currentMinute > 45 && matchData.currentMinute < 90) {
        brakStatus.style.display = "none";
        breakStatus.style.display = "none";
        inProgressStatus.style.display = "block";
        finishedStatus.style.display = "none";
        return `Mecz w trakcie drugiej połowy!`;
    } else if (matchData.currentMinute >= 90) {
        brakStatus.style.display = "none";
        breakStatus.style.display = "none";
        inProgressStatus.style.display = "none";
        finishedStatus.style.display = "block";
        return `Koniec meczu!`;
    }
}

function checkGameStatus() {
    checkForWalkover();  // Check if any team has less than 7 players
    
    var eventsContainer = document.getElementById("events");

    if (matchData.currentMinute < 45) {
        hideAllStatus();
        document.getElementById("in-progress-status").style.display = "block";
    } else if (matchData.currentMinute == 45) {
        clearInterval(matchData.intervalId);
        eventsContainer.innerHTML += `<p>Koniec pierwszej połowy!</p>`;
        hideAllStatus();
        document.getElementById("break-status").style.display = "block";
    
        eventsContainer.innerHTML += `<p>Sędzia zaprasza piłkarzy do szatni...</p>`;
        setTimeout(() => {
            eventsContainer.innerHTML += `<p>Sędzia wznawia spotkanie...</p>`;
            matchData.intervalId = setInterval(updateResult, 1000);
            hideAllStatus();
            document.getElementById("in-progress-status").style.display = "block";
        }, 2000);

    } else if (matchData.currentMinute > 90) {
        clearInterval(matchData.intervalId);
        eventsContainer.innerHTML += `<p>Końcowy gwizdek! Mecz zakończony!</p>`;
        hideAllStatus();
        document.getElementById("finished-status").style.display = "block";
        displayResult();
        displayEvents();
        displayStats();
    }
}

function hideAllStatus() {
    document.getElementById("brak-status").style.display = "none";
    document.getElementById("break-status").style.display = "none";
    document.getElementById("finished-status").style.display = "none";
    document.getElementById("in-progress-status").style.display = "none";
}

function updateStats() {
    document.getElementById("possession-team1").innerText = matchData.team1.possession.toFixed(1);
    document.getElementById("possession-team2").innerText = matchData.team2.possession.toFixed(1);
    document.getElementById("yellow-cards-team1").innerText = matchData.team1.yellowCards;
    document.getElementById("yellow-cards-team2").innerText = matchData.team2.yellowCards;
    document.getElementById("red-cards-team1").innerText = matchData.team1.redCards;
    document.getElementById("red-cards-team2").innerText = matchData.team2.redCards;
    document.getElementById("shots-team1").innerText = matchData.team1.shots;
    document.getElementById("shots-team2").innerText = matchData.team2.shots;
    document.getElementById("spalone-team2").innerText = matchData.team1.spalone;
    document.getElementById("spalone-team2").innerText = matchData.team2.spalone;
}

function showPlayerStats(player) {
    // Find or create the stats modal
    let modal = document.getElementById("playerStatsModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "playerStatsModal";
        modal.className = "modal";
        document.body.appendChild(modal);
    }

    // Populate the modal with player stats
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closePlayerStats()">&times;</span>
            <h2>${player.name} (<em>${player.position}</em>)</h2>
            <p>Gole: <strong>${player.goals}</strong> <img src="zdobytygol.png" style="width: 16px; height: 16px; margin-left: 5px;" alt="Zdobyty gol" /></p>
            <p>Żółte kartki: <strong>${player.yellowCards}</strong> <img src="yellow_card.png" style="width: 16px; height: 16px; margin-left: 5px;" alt="Żółta kartka" /></p>
            <p>Czerwone kartki: <strong>${player.redCards}</strong> <img src="red_card.png" style="width: 16px; height: 16px; margin-left: 5px;" alt="Czerwona kartka" /></p>
            <p>Kontuzjowany: ${player.injury ? "<strong>Tak</strong>" : "<strong>Nie</strong>"} <img src="injury_icon.png" style="width: 16px; height: 16px; margin-left: 5px;" alt="Kontuzja" /></p>
            <p>Zmieniony: ${player.substituted ? "<strong>Tak</strong>" : "<strong>Nie</strong>"} <img src="zmiana.png" style="width: 16px; height: 16px; margin-left: 5px;" alt="Zmieniony" /></p>
        </div>
    `;
    
    // Display the modal
    modal.style.display = "block";
}

// Function to close the modal
function closePlayerStats() {
    let modal = document.getElementById("playerStatsModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Add click event to each player in formation
function addPlayerClickEvents(team, containerId) {
    let container = document.getElementById(containerId);
    container.querySelectorAll("li").forEach((li, index) => {
        li.addEventListener("click", () => showPlayerStats(team.players[index]));
    });
}

function displayPlayers(team, containerId) {
    let container = document.getElementById(containerId);

    if (!container) {
        console.error(`Nie znaleziono elementu o ID ${containerId}`);
        return;
    }

    container.innerHTML = ''; // Clear the container

    team.players.forEach(player => {
        let playerItem = document.createElement('li');

        if (player.isRedCarded) {
            playerItem.innerHTML = `<s>${player.name}</s>`; // Strike-through for red-carded players
        } else if (player.injury) {
            let injuryPart = getRandomInjuryPart(); // Get a random injury part
            playerItem.innerHTML = `<s>${player.name}</s> <img src="injury_icon.png" style="width: 16px; height: 16px; margin-left: 5px;" title="Kontuzja: ${injuryPart}" alt="Kontuzja">`;
            
            // Display substitution icon next to the injury icon
            if (player.substitutedBy) {
                playerItem.innerHTML += ` <img src="zmiana.png" style="width: 16px; height: 16px; margin-left: 5px;" title="Zmieniony przez: ${player.substitutedBy}" alt="Zmiana">`;
            }
        } else {
            playerItem.innerHTML = `${player.name}`; // Normal display for active players
        }
        
        // If the player was substituted (even if no injury), add the substitution icon
        if (player.substituted && player.substitutedBy && !player.injury) {
            playerItem.innerHTML += ` <img src="zmiana.png" style="width: 16px; height: 16px; margin-left: 5px;" title="Zmieniony przez: ${player.substitutedBy}" alt="Zmiana">`;
        }

        // Display goals
        for (let i = 0; i < player.goals; i++) {
            let goalImg = document.createElement('img');
            goalImg.src = 'zdobytygol.png'; // Make sure this is the correct image
            goalImg.style.width = '16px'; // Slightly smaller size
            goalImg.style.height = '16px';
            goalImg.style.verticalAlign = 'middle'; // Center vertically with text
            goalImg.style.marginLeft = '5px'; // Add spacing
            playerItem.appendChild(goalImg);
        }

        // Display yellow cards
        for (let i = 0; i < player.yellowCards; i++) {
            let yellowCardImg = document.createElement('img');
            yellowCardImg.src = 'yellow_card.png';
            yellowCardImg.style.width = '16px'; // Slightly smaller size
            yellowCardImg.style.height = '16px';
            yellowCardImg.style.verticalAlign = 'middle'; // Center vertically with text
            yellowCardImg.style.marginLeft = '5px'; // Add spacing
            playerItem.appendChild(yellowCardImg);
        }

        // Display red cards
        if (player.isRedCarded) {
            let redCardImg = document.createElement('img');
            redCardImg.src = 'red_card.png';
            redCardImg.style.width = '16px'; // Slightly smaller size
            redCardImg.style.height = '16px';
            redCardImg.style.verticalAlign = 'middle'; // Center vertically with text
            redCardImg.style.marginLeft = '5px'; // Add spacing
            playerItem.appendChild(redCardImg);
        }

        container.appendChild(playerItem);
    });

    addPlayerClickEvents(team, containerId);

    let separator = document.createElement('li');
    separator.style.listStyleType = 'none';
    separator.style.height = '10px';
    container.appendChild(separator);

    team.sztab.forEach(staff => {
        let staffItem = document.createElement('li');
        staffItem.style.listStyleType = 'none';
        staffItem.innerHTML = `<img src="trener.png" alt="Trener" style="width: 20px; height: 20px; margin-right: 5px;"> ${staff.name}`;
        container.appendChild(staffItem);
    });
}

function getRandomInjuryPart() {
    const injuryParts = ["uda", "kolana", "kostki", "plecy", "ramiona"];
    return injuryParts[Math.floor(Math.random() * injuryParts.length)];
}

function substitutePlayer(playerOut, playerIn) {
    playerOut.substituted = true;
    playerOut.substitutedBy = playerIn.name;
}

function displayEvents() {
    var eventsContainer = document.getElementById("events");
    eventsContainer.innerHTML = `<h2><img src="events.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Aktualne wydarzenia:</h2>`;

    matchData.events.forEach((eventData) => {
        var eventMinute = eventData.minute || matchData.currentMinute; // Use the event minute or current minute
        var formattedTime = formatTime(eventMinute);
        eventsContainer.innerHTML += `<p>${formattedTime} ${eventData.event}</p>`;
    });
}

function simulateEvent() {
    if (team1Substitutions >= 5 && team2Substitutions >= 5) return;  // Limit substitutions to 5 per team

    // Substitutions for Team 1
    if (matchData.currentMinute < 45 && Math.random() < 0.02 && team1Substitutions < 5) {  // Rare in the 1st half
        let playerOut = matchData.team1.players[Math.floor(Math.random() * matchData.team1.players.length)];
        let playerIn = { name: "Rezerwowy " + (team1Substitutions + 1), yellowCards: 0, redCards: 0, goals: 0, injury: false };
        substitutePlayer(playerOut, playerIn);
        team1Substitutions++;
        logEvent(matchData.currentMinute, `・ Zmiana w ${matchData.team1.name}: ${playerOut.name} schodzi, wchodzi ${playerIn.name}`);
    } else if (matchData.currentMinute >= 45 && Math.random() < 0.08 && team1Substitutions < 5) {  // More frequent in the 2nd half
        let playerOut = matchData.team1.players[Math.floor(Math.random() * matchData.team1.players.length)];
        let playerIn = { name: "Rezerwowy " + (team1Substitutions + 1), yellowCards: 0, redCards: 0, goals: 0, injury: false };
        substitutePlayer(playerOut, playerIn);
        team1Substitutions++;
        logEvent(matchData.currentMinute, `・ Zmiana w ${matchData.team1.name}: ${playerOut.name} schodzi, wchodzi ${playerIn.name}`);
    }
    
    // Substitutions for Team 2
    if (matchData.currentMinute < 45 && Math.random() < 0.02 && team2Substitutions < 5) {  // Rare in the 1st half
        let playerOut = matchData.team2.players[Math.floor(Math.random() * matchData.team2.players.length)];
        let playerIn = { name: "Rezerwowy " + (team2Substitutions + 1), yellowCards: 0, redCards: 0, goals: 0, injury: false };
        substitutePlayer(playerOut, playerIn);
        team2Substitutions++;
        logEvent(matchData.currentMinute, `・ Zmiana w ${matchData.team2.name}: ${playerOut.name} schodzi, wchodzi ${playerIn.name}`);
    } else if (matchData.currentMinute >= 45 && Math.random() < 0.08 && team2Substitutions < 5) {  // More frequent in the 2nd half
        let playerOut = matchData.team2.players[Math.floor(Math.random() * matchData.team2.players.length)];
        let playerIn = { name: "Rezerwowy " + (team2Substitutions + 1), yellowCards: 0, redCards: 0, goals: 0, injury: false };
        substitutePlayer(playerOut, playerIn);
        team2Substitutions++;
        logEvent(matchData.currentMinute, `・ Zmiana w ${matchData.team2.name}: ${playerOut.name} schodzi, wchodzi ${playerIn.name}`);
    }

    // Check if the match has ended
    if (matchData.currentMinute > 90) {
        return; // Match ended, do not add new events
    }

    // Filter out players who are injured or have received a red card
    let availablePlayersTeam1 = matchData.team1.players.filter(player => !player.injury && !player.isRedCarded);
    let availablePlayersTeam2 = matchData.team2.players.filter(player => !player.injury && !player.isRedCarded);

    // Combine available players from both teams
    let availablePlayers = [...availablePlayersTeam1, ...availablePlayersTeam2];

    if (availablePlayers.length === 0) {
        return; // No available players, nothing to simulate
    }

    // Randomly select a player from the available players list
    let randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    var players = ["Napastnik 1", "Napastnik 2", "Pomocnik 1", "Pomocnik 2", "Pomocnik 3", "Pomocnik 4", "Obrońca 1", "Obrońca 2", "Obrońca 3", "Obrońca 4", "Bramkarz"];
    var randomPlayerIndex = Math.floor(Math.random() * players.length);

    // Use the player's `name` or other properties for output
    console.log("Wybrany zawodnik:", randomPlayer.name); // This will display the player's name, not [object Object]

    // Determine the team for the randomPlayer
    var scoringTeam = availablePlayersTeam1.includes(randomPlayer) ? matchData.team1.name : matchData.team2.name;

    // Define probabilities for events
    let probabilityGoal = randomPlayer.position === "Napastnik" ? 0.15 :
                          randomPlayer.position === "Pomocnik" ? 0.08 :
                          randomPlayer.position === "Obrońca" ? 0.05 : 0.01; // Lowest for goalkeeper

    let probabilityYellowCard = randomPlayer.position === "Obrońca" ? 0.10 :
                                randomPlayer.position === "Pomocnik" ? 0.07 :
                                randomPlayer.position === "Napastnik" ? 0.03 : 0.01; // Lowest for goalkeeper

    let probabilityRedCard = 0.02; // Fixed probability for all positions
    let probabilityInjury = 0.03; // Fixed probability for all positions
    let probabilityShot = randomPlayer.position === "Napastnik" ? 0.20 :
                         randomPlayer.position === "Pomocnik" ? 0.12 :
                         randomPlayer.position === "Obrońca" ? 0.07 : 0.02; // Lowest for goalkeeper

    let probabilitySubstitution = 0.1; // Probability for substitution

    updatePossession();
    checkForWalkover();

    // Randomly determine the event
    var randomNum = Math.random();
    var randomEvent = '';

    if (randomNum < probabilitySubstitution) {
        // Select a player to substitute
        let teamPlayers = (scoringTeam === matchData.team1.name) ? matchData.team1.players : matchData.team2.players;
        let substitutes = (scoringTeam === matchData.team1.name) ? matchData.team1.substitutes : matchData.team2.substitutes; // Available substitutes
        
        let playerOut = teamPlayers[Math.floor(Math.random() * teamPlayers.length)]; // Player going out

        // Ensure there are available substitutes
        if (substitutes.length > 0) {
            // Randomly select a substitute
            let playerIn = substitutes[Math.floor(Math.random() * substitutes.length)]; 

            // Array of substitution messages
            const zmiany = [
                `Zmiana: ${playerOut.name} za ${playerIn.name}`,
                `Zmiana: ${playerOut.name} opuszcza boisko, wchodzi ${playerIn.name}`,
                `Zmiana: ${playerIn.name} zastępuje ${playerOut.name}`
            ];

            // Log the substitution event
            logEvent(matchData.currentMinute, zmiany[Math.floor(Math.random() * zmiany.length)]);
            
            // Update the player object
            playerOut.substituted = true; // Mark the player as substituted
            playerOut.substitutedBy = playerIn.name; // Store the name of the player coming in
        }
        return; // Exit to avoid further event processing in this cycle
    }

    // Check for other events (goal, cards, etc.)
    if (randomNum < probabilityGoal) {
        const goalEvents = [
            `Bramka! ${randomPlayer.name} <img src="gol.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;"> GOOOL (${scoringTeam})`,
            `Karny! Bramka! ${randomPlayer.name} <img src="gol.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;"> GOOOL (${scoringTeam})`,
            `Strzał zza pola karnego! ${randomPlayer.name} <img src="gol.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;"> GOOOL (${scoringTeam})`,
            `${randomPlayer.name} zdecydował się na strzał z dystansu, i piłka ląduje w siatce! Fantastyczny gol <img src="gol.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;"> GOOOL (${scoringTeam})`
        ];
        randomEvent = goalEvents[Math.floor(Math.random() * goalEvents.length)];
        assignGoal(randomPlayer.name, scoringTeam); // Assign the goal
        scoringTeam.score += 1; // Update score

        // Increase stats for the appropriate team
        if (scoringTeam === matchData.team1.name) {
            matchData.score.team1 += 1;
            matchData.team1.shots += 1; // Increase shots for team1
        } else {
            matchData.score.team2 += 1;
            matchData.team2.shots += 1; // Increase shots for team2
        }

    } else if (randomNum < probabilityGoal + probabilityYellowCard) {
        // Yellow card event
        const yellowCardEvents = [
            `Żółta kartka dla ${randomPlayer.name}! <img src="yellow_card.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;"> ŻÓŁTA KARTKA (${scoringTeam})`,
            `Sędzia pokazuje żółtą kartkę ${randomPlayer.name}! <img src="yellow_card.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;"> ŻÓŁTA KARTKA (${scoringTeam})`,
            `${randomPlayer.name} dostaje żółtą kartkę za faul! <img src="yellow_card.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;"> ŻÓŁTA KARTKA (${scoringTeam})`
        ];
        randomEvent = yellowCardEvents[Math.floor(Math.random() * yellowCardEvents.length)];
        assignCard('yellow', randomPlayer.name, scoringTeam); // Assign yellow card
        if (scoringTeam === matchData.team1.name) {
            matchData.team1.yellowCards += 1; // Increase shots for team1
        } else {
            matchData.team2.yellowCards += 1; // Increase shots for team2
        }

    } else if (randomNum < probabilityGoal + probabilityYellowCard + probabilityRedCard) {
        // Red card event
        const redCardEvents = [
            `Czerwona kartka dla ${randomPlayer.name}! <img src="red_card.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;"> CZERWONA KARTKA (${scoringTeam})`,
            `Wykluczenie dla ${randomPlayer.name}! <img src="red_card.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;"> CZERWONA KARTKA (${scoringTeam})`,
            `Sędzia pokazuje czerwoną kartkę ${randomPlayer.name}! <img src="red_card.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;"> CZERWONA KARTKA (${scoringTeam})`
        ];
        randomEvent = redCardEvents[Math.floor(Math.random() * redCardEvents.length)];
        assignCard('red', randomPlayer.name, scoringTeam); // Assign red card
        if (scoringTeam === matchData.team1.name) {
            matchData.team1.redCards += 1; // Increase shots for team1
        } else {
            matchData.team2.redCards += 1; // Increase shots for team2
        }

    } else if (randomNum < probabilityGoal + probabilityYellowCard + probabilityRedCard + probabilityInjury) {
        // Injury event
        const injuryEvents = [
            `Kontuzja: ${randomPlayer.name} opuszcza boisko.`,
            `Kontuzja: ${randomPlayer.name} zmuszony do zmiany.`,
            `Kontuzja: ${randomPlayer.name} nie może kontynuować gry.`
        ];
        
        randomEvent = injuryEvents[Math.floor(Math.random() * injuryEvents.length)];
        randomPlayer.injury = true; // Mark the player as injured
        let playerIn = substitutes[Math.floor(Math.random() * substitutes.length)];
        substitutePlayer(randomPlayer, playerIn); // Correctly substitute the injured player

    } else if (randomNum < probabilityGoal + probabilityYellowCard + probabilityRedCard + probabilityInjury + probabilityShot) {
        // Wybór zdarzenia związanego z niecelnym strzałem
        const shotEvents = [
            `${randomPlayer.name} próbował zaskoczyć bramkarza, ale piłka poszła daleko obok bramki, słaby strzał`,
            `${randomPlayer.name} chciał zaskoczyć golkipera, ale piłka minęła bramkę o kilka metrów, nieudany strzał`,
            `${randomPlayer.name} próbował zrobić niespodziankę bramkarzowi, ale piłka poleciała daleko w bok, kiepski strzał`,
            `${randomPlayer.name} zamierzał zagiąć bramkarza, ale piłka nie trafiła w światło bramki, słaba próba`,
            `${randomPlayer.name} strzelił, ale piłka poszybowała daleko obok słupka, marny strzał`,
            `${randomPlayer.name} postanowił uderzyć, lecz piłka nie miała szans na trafienie do siatki, beznadziejny strzał`,
            `${randomPlayer.name} próbuje szczęścia z daleka, ale nie trafia w światło bramki`,
            `${randomPlayer.name} oddaje strzał z dalekiego dystansu, jednak piłka mija bramkę o wiele metrów`,
            `${randomPlayer.name} uderza z daleka, lecz piłka leci wysoko nad poprzeczką`,
            `${randomPlayer.name} strzela z dalekiego zasięgu, ale niecelnie i piłka ląduje poza boiskiem`,
            `${randomPlayer.name} wykonuje strzał z daleka, lecz piłka nie ma szans na trafienie do bramki`,
            `${randomPlayer.name} decyduje się na strzał z dystansu, lecz piłka leci daleko od bramki`,
            `Strzał w słupek przez ${randomPlayer.name}!`,
            `Trafienie w poprzeczkę przez ${randomPlayer.name}!`,
            `Strzał w obramowanie bramki przez ${randomPlayer.name}!`,
            `Uderzenie w słupek przez ${randomPlayer.name}!`,
            `Strzał w spojenie przez ${randomPlayer.name}!`,
            `Piłka odbija się od słupka po strzale ${randomPlayer.name}!`,
            `Strzał w słupek przez ${randomPlayer.name}!`,
            `Trafienie w poprzeczkę przez ${randomPlayer.name}!`,
            `Strzał w metal przez ${randomPlayer.name}!`,
            `Uderzenie w słupek przez ${randomPlayer.name}!`,
            `Strzał w spojenie przez ${randomPlayer.name}!`,
            `Piłka odbija się od słupka po strzale ${randomPlayer.name}!`,
            `Korner: ${randomPlayer.name} zmusił do interwencji bramkarza przeciwnika`
        ];
        randomEvent = shotEvents[Math.floor(Math.random() * shotEvents.length)];

        // Zwiększanie statystyk dla odpowiedniej drużyny
        if (scoringTeam === matchData.team1.name) {
            matchData.team1.shots += 1; // Zwiększ liczbę strzałów dla team1
        } else {
            matchData.team2.shots += 1; // Zwiększ liczbę strzałów dla team2
        }

    } else {
        // Wybór neutralnego wydarzenia, jeśli nie było innych zdarzeń
        const neutralEvents = [
            `${randomPlayer.name} powstrzymał niebezpieczną akcję rywala i odbił piłkę na aut`,
            `Drużyna gości buduje atak pozycyjny`,
            `Drużyna gości nie może przedostać się na połowę przeciwnika`,
            `Drużyna przyjezdnych powoli rozgrywa akcję`,
            `Drużyna gospodarzy buduje atak pozycyjny`,
            `Drużyna gospodarzy nie może przedostać się na połowę przeciwnika`,
            `Gospodarze powoli rozgrywają akcję`,
            `${randomPlayer.name} był na pozycji spalonej`,
            `Spalony: ${randomPlayer.name} znalazł się za linią obrony przeciwnika`,
            `Spalony, ${randomPlayer.name} zagrał z ofsajdu`,
            `Spalony: ${randomPlayer.name} był przedostatnim zawodnikiem na boisku`,
            `Spalony: ${randomPlayer.name} nie zdołał wrócić na czas za linią obrońców`,
            `Faul: ${randomPlayer.name} sfaulował ${players[randomPlayerIndex + 1]} i dostaje upomnienie od sędziego`,
            `Przewinienie, ${randomPlayer.name} zagrał nieczysto na ${players[randomPlayerIndex + 1]} i otrzymuje ostrzeżenie od sędziego`,
            `Niebezpieczna gra: ${randomPlayer.name} podciął ${players[randomPlayerIndex + 1]}`,
            `${randomPlayer.name} zaatakował ${players[randomPlayerIndex + 1]} i musi się liczyć z konsekwencjami od sędziego`,
            `${randomPlayer.name} powalił ${players[randomPlayerIndex + 1]} i słyszy gwizdek sędziego`,
            `${randomPlayer.name} próbował zaskoczyć bramkarza, ale piłka poszła daleko obok bramki, słaby strzał`,
            `${randomPlayer.name} chciał zaskoczyć golkipera, ale piłka minęła bramkę o kilka metrów, nieudany strzał`,
            `${randomPlayer.name} zatrzymał groźny atak przeciwnika i wybił piłkę na aut`,
            `${randomPlayer.name} powstrzymał niebezpieczną akcję rywala i odbił piłkę na aut`,
            `${randomPlayer.name} zniweczył groźną ofensywę przeciwnika i wykopał piłkę na aut`,
            `${randomPlayer.name} zatrzymał zagrożenie ze strony rywala i wyrzucił piłkę na aut`,
            `${randomPlayer.name} udaremnił niepokojący atak przeciwnika i wybił piłkę poza boisko`,
            `${randomPlayer.name} zakończył groźną sytuację rywala i odbił piłkę na linię boczną`,
            `Rzut rożny: ${randomPlayer.name} wywalczył korner dla swojej drużyny`,
            `Róg: ${randomPlayer.name} wypracował sobie dogodną sytuację do dośrodkowania`,
            `Rzut z narożnika: ${randomPlayer.name} zaskoczył obrońcę i wywalczył rzut rożny`,
            `Rzut z rogu: ${randomPlayer.name} zagrał sprytnie i zyskał korner dla swojej drużyny`,
            `Rzut rożny: ${randomPlayer.name} zagrał na aut bramkarza rywali`
        ];
        randomEvent = neutralEvents[Math.floor(Math.random() * neutralEvents.length)];
    
        // Sprawdzanie, czy randomEvent zawiera "Spalony"
        if (randomEvent.includes("Spalony")) {
            // Zwiększenie statystyki spalonego
            if (scoringTeam === matchData.team1.name) {
                matchData.team1.spalone = (matchData.team1.spalone || 0) + 1; // Inicjalizacja do 0 jeśli nie istnieje
            } else {
                matchData.team2.spalone = (matchData.team2.spalone || 0) + 1; // Inicjalizacja do 0 jeśli nie istnieje
            }
        }
    }

    // Add the minute of the match to the event content
    var eventMinute = matchData.currentMinute;
    logEvent(matchData.currentMinute, `・ ${randomEvent}`);
}


function isPlayerInGame(teamPlayers, playerName) {
    return teamPlayers.some(player => player.name === playerName);
}

function formatTime(minutes) {
    var minutesPart = Math.floor(minutes);
    return `${String(minutesPart)}'`;
}

function assignGoal(playerName, teamName) {
    let team = teamName === matchData.team1.name ? matchData.team1 : matchData.team2;
    let player = team.players.find(player => player.name === playerName);
    
    if (player) {
        player.goals += 1; // Zwiększa liczbę goli        
        matchData.events.push(`Gol! ${playerName} zdobywa bramkę dla ${teamName}!`);
    } else {
        console.error(`Zawodnik ${playerName} nie został znaleziony w drużynie ${teamName}`);
    }
}

function assignCard(cardType, playerName, teamName) {
    let team = teamName === matchData.team1.name ? matchData.team1 : matchData.team2;
    let player = team.players.find(player => player.name === playerName);

    if (player) {
        if (cardType === 'yellow') {
            player.yellowCards += 1; // Zwiększa liczbę żółtych kartek
            if (player.yellowCards === 2) {
                player.redCards += 1; // Przypisz czerwoną kartkę
                player.isRedCarded = true; // Oznacz, że zawodnik ma czerwoną kartkę
                matchData.events.push(`Czerwona kartka dla ${playerName} (z powodu 2 żółtych)! (${teamName})`);
            } else {
                matchData.events.push(`Żółta kartka dla ${playerName}! (${teamName})`);
            }
        } else if (cardType === 'red') {
            player.redCards += 1; // Zwiększa liczbę czerwonych kartek
            player.isRedCarded = true; // Oznacz, że zawodnik ma czerwoną kartkę
            matchData.events.push(`Czerwona kartka dla ${playerName}! (${teamName})`);
        }
    } else {
        console.error(`Zawodnik ${playerName} nie został znaleziony w drużynie ${teamName}`);
    }
}

function checkForWalkover() {
    // Check both teams for player count below 7
    if (matchData.team1.players.filter(p => !p.isRedCarded).length < 7) {
        matchData.team2.score += 3;
        matchData.events.push(`Walkower dla ${matchData.team2.name}, ${matchData.team1.name} ma mniej niż 7 graczy.`);
        clearInterval(matchData.intervalId); // End match
    } else if (matchData.team2.players.filter(p => !p.isRedCarded).length < 7) {
        matchData.team1.score += 3;
        matchData.events.push(`Walkower dla ${matchData.team1.name}, ${matchData.team2.name} ma mniej niż 7 graczy.`);
        clearInterval(matchData.intervalId); // End match
    }
}

let team1Substitutions = 0;
let team2Substitutions = 0;
function simulateSubstitution(team) {
    if (team === matchData.team1.name && team1Substitutions < 5) {
        team1Substitutions += 1;

    } else if (team === matchData.team2.name && team2Substitutions < 5) {
        team2Substitutions += 1;

    }
}

function displayStats() {
    var statsContainer = document.getElementById("stats");
    statsContainer.innerHTML = `<h2><img src="statystyki.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Statystyki:</h2>`;
    
    statsContainer.innerHTML +=
        `<p><img src="posiadanie.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Posiadanie piłki: ${matchData.team1.possession}% - ${matchData.team2.possession}%</p>`;
    
    statsContainer.innerHTML +=
        `<p><img src="yellow_card.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Żółte kartki: ${matchData.team1.yellowCards} - ${matchData.team2.yellowCards}</p>`;
    
    statsContainer.innerHTML += 
        `<p><img src="red_card.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Czerwone kartki: ${matchData.team1.redCards} - ${matchData.team2.redCards}</p>`;
    
    statsContainer.innerHTML += 
        `<p><img src="shoot.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Strzały: ${matchData.team1.shots} - ${matchData.team2.shots}</p>`;

    statsContainer.innerHTML += 
        `<p><img src="spalony.png" style="width: 20px; height: 20px; margin-bottom: -5px; margin-right: 5px;">Spalone: ${matchData.team1.spalone} - ${matchData.team2.spalone}</p>`;
}

function updatePossession() {
    const cardPenalty = 0.005; // Posiadanie maleje o 0.5% (0.005 w zapisie dziesiętnym)
    const homeAdvantage = 1.2; // Gospodarz ma przewagę

    // Obliczanie karnych kart
    let team1CardPenalty = (matchData.team1.yellowCards + matchData.team1.redCards) * cardPenalty;
    let team2CardPenalty = (matchData.team2.yellowCards + matchData.team2.redCards) * cardPenalty;

    // Siła drużyn
    let team1Strength = 0.8 * (matchData.location === "home" ? homeAdvantage : 1);
    let team2Strength = 0.6;

    // Wzrost szansy na posiadanie dla drużyny przeciwnika w przypadku kary
    if (matchData.team1.redCards > 0) {
        team2Strength *= 1.5; // Zwiększenie szans drużyny gości
    }
    if (matchData.team2.redCards > 0) {
        team1Strength *= 1.5; // Zwiększenie szans drużyny gospodarzy
    }

    // Losowanie posiadania piłki
    let possessionChange;
    if (Math.random() < team1Strength / (team1Strength + team2Strength)) {
        possessionChange = 0.5 - team1CardPenalty; // Drużyna 1 zdobywa posiadanie
        matchData.team1.possession += possessionChange;
        matchData.team2.possession -= possessionChange; // Drużyna 2 traci posiadanie
    } else {
        possessionChange = 0.5 - team2CardPenalty; // Drużyna 2 zdobywa posiadanie
        matchData.team2.possession += possessionChange;
        matchData.team1.possession -= possessionChange; // Drużyna 1 traci posiadanie
    }

    // Aktualizacja posiadania
    matchData.team1.possession = Math.min(Math.max(matchData.team1.possession, 0), 100);
    matchData.team2.possession = Math.min(Math.max(matchData.team2.possession, 0), 100);
}

// Dodaj funkcje do kontrolowania symulacji
function speedUp() {
    clearInterval(matchData.intervalId);
    matchData.intervalId = setInterval(updateResult, 500); // Przyśpiesz co 0.5 sekundy
}

function slowDown() {
    clearInterval(matchData.intervalId);
    matchData.intervalId = setInterval(updateResult, 2000); // Zwolnij co 2 sekundy
}

function skip() {
    // Ustaw czas na 90 minut
    matchData.currentMinute = 90;

    // Symuluj wydarzenia przez pozostałe minuty
    while (matchData.currentMinute < 90) {
        simulateEvent();
        matchData.currentMinute++;
    }

    // Po zakończeniu symulacji, wyświetl wynik
    displayMatchResults();
}

function finish() {
    // Ustaw czas na 90 minut
    matchData.currentMinute = 90;

    // Wyświetl wynik od razu
    displayMatchResults();
}

function displayMatchResults() {
    // Wyświetl wynik meczu
    alert(`Mecz zakończony! 
Drużyna A: ${matchData.team1.score} - ${matchData.team2.score} Drużyna B`);

    // Wyświetl wszystkie wydarzenia
    matchData.events.forEach(event => {
        console.log(`Minuta ${event.minute}: ${event.event}`);
    });

    // Możesz też dodać logikę, aby zaktualizować interfejs użytkownika
    displayPlayers(matchData.team1, 'team1-players');
    displayPlayers(matchData.team2, 'team2-players');
}

function updateRemainingStats() {
    // Aktualizuj statystyki do 90. minuty z użyciem funkcji setTimeout
    function updateStatsAsync() {
        if (matchData.currentMinute < 90) {
            updateStats();
            matchData.currentMinute += 1;
            setTimeout(updateStatsAsync, 0);
        } else {
            // Po zakończeniu aktualizacji statystyk, wyświetl wszystkie wiadomości i wynik meczu
            displayResult();
            displayEvents();
            displayStats();
        }
    }

    // Rozpocznij asynchroniczną aktualizację statystyk
    updateStatsAsync();
}

function downloadResult() {
    // Check if the match has ended
    if (matchData.currentMinute < 90) {
        alert("Mecz jeszcze się nie zakończył. Poczekaj na końcowy gwizdek.");
        return;
    }

    const filename = "wynik.txt";
    const content = generateMatchDetails();
    const blob = new Blob([content], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to generate match details for download
function generateMatchDetails() {
    let details = `Mecz: ${matchData.team1.name} vs ${matchData.team2.name}\n`;
    details += `Wynik: ${matchData.score.team1}:${matchData.score.team2}\n\n`;

    details += "Statystyki:\n";
    details += `Posiadanie piłki: ${matchData.team1.possession.toFixed(1)}% - ${matchData.team2.possession.toFixed(1)}%\n`;
    details += `Żółte kartki: ${matchData.team1.yellowCards} - ${matchData.team2.yellowCards}\n`;
    details += `Czerwone kartki: ${matchData.team1.redCards} - ${matchData.team2.redCards}\n`;
    details += `Strzały: ${matchData.team1.shots} - ${matchData.team2.shots}\n\n`;
    details += `Spalone: ${matchData.team1.spalone} - ${matchData.team2.spalone}\n\n`;

    details += "Wydarzenia:\n";
    matchData.events.forEach(event => {
        details += `${event.minute}' ${event.event}\n`; // Log the event correctly
    });
    return details;
}

function logEvent(minute, description) {
    matchData.events.push({ minute: minute, event: description }); // Ensure the event structure is correct
}

function toggleMatch() {
    var matchElement = document.querySelector('.match');
    var overlayElement = document.querySelector('.overlay');

    if (matchElement.style.display === 'none' || matchElement.style.display === '') {
        matchElement.style.display = 'flex';
        overlayElement.classList.add('active');
    } else {
        matchElement.style.display = 'none';
        overlayElement.classList.remove('active');
    }
}
