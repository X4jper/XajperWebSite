document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.category-btn');
    const cards = document.querySelectorAll('.command-card');
    const randomCommandBtn = document.getElementById('randomCommandBtn');
    const commandCounter = document.getElementById('commandCounter');

    let totalCommands = cards.length;
    commandCounter.textContent = `Przeglądaj dostępne komendy i poznaj wszystkie możliwości bota! (${totalCommands})`;

    commandCounter.classList.add('counter-animation');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');

            cards.forEach(card => {
                card.style.display = card.getAttribute('data-category') === category || category === "all" ? 'block' : 'none';
            });
        });
    });

    randomCommandBtn.addEventListener('click', () => {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        cards.forEach(card => card.style.display = 'none');
        randomCard.style.display = 'block';
    });

    setTimeout(() => {
        cards.forEach(card => card.classList.add('animate'));
    }, 100);
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
