var firebaseConfig = {
  apiKey: "AIzaSyBWOYsHghiKRepKMFRKMX6U4hf2A8A2QuM",
  authDomain: "sportowo-20862.firebaseapp.com",
  databaseURL: "https://sportowo-20862-default-rtdb.firebaseio.com",
  projectId: "sportowo-20862",
  storageBucket: "sportowo-20862.appspot.com",
  messagingSenderId: "823759230798",
  appId: "1:823759230798:web:c1c33fa4c443d9f7c8701f"
};

var avatarSelectedFromDiv = false;

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const database = firebase.database()

auth.onAuthStateChanged(user => {
  if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      const userId = user.uid;
  } else {
      localStorage.removeItem('loggedInUser');
  }
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

document.addEventListener('DOMContentLoaded', function () {
  checkUserAuthentication();
});

function checkUserAuthentication() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  if (user) {
    const userId = user.uid;
    const userRef = database.ref('users/' + userId);
    showProfileConfigButton();

    userRef.once('value')
      .then(function (snapshot) {
        const dziennikarzStatus = snapshot.val().dziennikarz;

        if (dziennikarzStatus === "tak") {
          const journalistBadge = document.getElementById("journalistBadge");
          journalistBadge.style.color = "green";
          journalistBadge.style.display = "inline-block";
        }
      })
      .catch(function (error) {
        console.error('Błąd podczas pobierania informacji o użytkowniku:', error);
        showProfileConfigButton();
      });
  }
}

let isArticleListVisible = false;

function displaySavedArticles() {
  const db = firebase.firestore();
  const user = auth.currentUser;

  if (user) {
    const savedArticlesRef = db.collection('users').doc(user.uid).collection('savedArticles');

    savedArticlesRef.get()
      .then((querySnapshot) => {
        const promises = [];
        const articleIds = [];

        querySnapshot.forEach((doc) => {
          const articleId = doc.id;
          articleIds.push(articleId);
          const promise = db.collection('articles').doc(articleId).get();
          promises.push(promise);
        });

        return Promise.all(promises).then((articleSnapshots) => {
          const articlesData = articleSnapshots.map((articleSnapshot) => {
            const articleData = articleSnapshot.data();
            const savedAt = articleData.savedAt ? new Date(articleData.savedAt.seconds * 1000) : new Date();
            return { title: articleData.title || "Bład podczas uzyskiwania tytułu", savedAt };
          });

          return { articleIds, articlesData };
        });
      })
      .then(({ articleIds, articlesData }) => {
        showArticleTitles(articleIds, articlesData);
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania zapisanych artykułów: ', error);
      });
  } else {
    alert('Musisz być zalogowany, aby zobaczyć zapisane artykuły.');
  }
}

function parseCustomDate(timestamp) {
  const date = new Date(timestamp.seconds * 1000);
  return date;
}

function formatTimestamp(timestamp) {
  const date = parseCustomDate(timestamp);
  return `${date.toLocaleDateString()} | ${date.toLocaleTimeString()}`;
}

function showArticleTitles(articleIds, articlesData) {
  const articleListContainer = document.getElementById('articleList');
  articleListContainer.innerHTML = '';
  const db = firebase.firestore();
  const user = auth.currentUser;

  articlesData.forEach(({ title, savedAt }, index) => {
    db.collection('users').doc(user.uid).collection('savedArticles').doc(articleIds[index]).get()
      .then((doc) => {
        if (doc.exists) {
          const articleData = doc.data();
          const czas = articleData.savedAt;
          const articleItem = document.createElement('div');
          articleItem.classList.add('articleItem');
          articleItem.innerHTML = `<strong>#${index + 1}</strong> - <a href="#" onclick="openArticle('${articleIds[index]}');">${title}</a><br><i class="far fa-clock"></i> Zapisano: ${formatTimestamp(doc.data().savedAt)} <button class="removeButton" data-article-id="${articleIds[index]}"><i class="fas fa-trash"></i></button><br>`;
          articleListContainer.appendChild(articleItem);

          const removeButton = articleItem.querySelector('.removeButton');
          removeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const articleId = event.target.dataset.articleId;
            removeArticle(articleId);
          });
        } else {
          console.error("Nie znaleziono artykułu w bazie danych.");
        }
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania artykułu z bazy danych:", error);
      });
  });

  if (!isArticleListVisible) {
    articleListContainer.style.display = 'block';
    isArticleListVisible = true;
  } else {
    articleListContainer.style.display = 'none';
    isArticleListVisible = false;
  }
}

function openArticle(articleId) {
  const db = firebase.firestore();
  const user = auth.currentUser;

  if (user) {
    db.collection('users').doc(user.uid).collection('savedArticles').doc(articleId).get()
      .then((doc) => {
        if (doc.exists) {
          const articleData = doc.data();
          const url = "https://xajper.github.io/sportowo" + articleData.url;
          window.open(url, '_blank');
        } else {
          console.error("Nie znaleziono artykułu w bazie danych.");
        }
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania artykułu z bazy danych:", error);
      });
  } else {
    console.error("Użytkownik niezalogowany.");
  }
}

function displayMessage(message, type) {
  const messageContainer = document.createElement('div');
  messageContainer.className = `alert alert-${type}`;
  messageContainer.textContent = message;

  document.body.insertBefore(messageContainer, document.body.firstChild);

  setTimeout(() => {
      messageContainer.remove();
  }, 3000);
}

function removeArticle(articleId) {
  const db = firebase.firestore();
  const user = auth.currentUser;

  if (user) {
    db.collection('users').doc(user.uid).collection('savedArticles').doc(articleId).delete()
      .then(() => {
        displayMessage('Artykuł został pomyślnie usunięty.', 'success');
      })
      .catch((error) => {
        displayMessage('Błąd podczas usuwania artykułu.', 'danger');
        console.error('Błąd podczas usuwania artykułu:', error);
      });
  } else {
    displayMessage('Użytkownik niezalogowany.', 'danger');
    console.error('Użytkownik niezalogowany.');
  }
}

function displayUserInfo() {
  const user = auth.currentUser;
  const userPointsElement = document.getElementById('userPoints');
  const userCommentsCountElement = document.getElementById('userCommentsCount');
  const usernameElement = document.getElementById('username'); 

  if (user) {
      const userRef = database.ref('users/' + user.uid);

      userRef.once('value')
          .then(function (snapshot) {
              const userPoints = snapshot.val().points;
              const userCommentsCount = snapshot.val().komentarze;
              const username = snapshot.val().full_name;

              // Aktualizuj elementy na stronie
              userPointsElement.textContent = userPoints;
              userCommentsCountElement.textContent = userCommentsCount;
              usernameElement.textContent = username;
          })
          .catch(function (error) {
              console.error('Error:', error);
          });
  }
}

function highlightInput(inputId) {
  const inputElement = document.getElementById(inputId);

  if (inputElement) {
      inputElement.style.background = '#ffff99'; // Kolor podświetlenia
      setTimeout(() => {
          inputElement.style.background = ''; // Usuń podświetlenie po 2 sekundach
      }, 2000);
  }
}

function register () {

email = document.getElementById('email_field').value
password = document.getElementById('password_field').value
full_name = document.getElementById('name_field').value


if (validate_email(email) == false || validate_password(password) == false) {
  alert('Uzupełnij hasło lub email!')
  return
}
if (validate_field(full_name) == false) {
  alert('Uzupełnij nazwę')
  return
}

auth.createUserWithEmailAndPassword(email, password)
.then(function() {

  var user = auth.currentUser

  var database_ref = database.ref()

  var user_data = {
    email : email,
    full_name : full_name,
    last_login : Date.now()
  }

  database_ref.child('users/' + user.uid).set(user_data)

  alert('Zarejestrowano poprawnie!')
})
.catch(function(error) {

  var error_code = error.code
  var error_message = error.message

  alert(error_message)
})
}

function login() {
  const email = document.getElementById('email_field').value;
  const password = document.getElementById('password_field').value;

  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Niepoprawne hasło lub email!');
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      const user = auth.currentUser;
      const database_ref = database.ref('users/' + user.uid);

      var user_data = {
        last_login: Date.now()
      };

      database_ref.update(user_data);

      database_ref.once('value')
        .then(function (snapshot) {
          const avatarPath = snapshot.val().avatar;
          const avatarUrl = avatarPath ? `sportowoavatary/${avatarPath}` : 'sportowoavatary/avatar0.png';

          const logoContainer = document.getElementById('logo_container');
          if (logoContainer) {
            logoContainer.style.width = '80px';
            logoContainer.style.height = '80px';
            logoContainer.style.backgroundImage = `url('${avatarUrl}')`;
            logoContainer.style.backgroundSize = 'cover';
            logoContainer.style.backgroundPosition = 'center';
            logoContainer.style.backgroundRepeat = 'no-repeat';
            logoContainer.style.border = '1px solid #F7F7F8';
            logoContainer.style.filter = 'drop-shadow(0px 0.5px 0.5px #EFEFEF) drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5))';
            logoContainer.style.borderRadius = '11px';
          }

          const user_name = snapshot.val().full_name;

          alert('Zalogowano się jako ' + user_name + '!');

          showProfileConfigButton();
        })
        .catch(function (error) {
          console.error('Error:', error);
        });
    })
    .catch(function (error) {
      var error_code = error.code;
      var error_message = error.message;

      alert(error_message);
    });
}

function validate_email(email) {
expression = /^[^@]+@\w+(\.\w+)+\w$/
if (expression.test(email) == true) {
  return true
} else {
  return false
}
}

function validate_password(password) {

if (password < 6) {
  return false
} else {
  return true
}
}

function validate_field(field) {
if (field == null) {
  return false
}

if (field.length <= 0) {
  return false
} else {
  return true
}
}

function togglePassword() {
  const passwordInput = document.getElementById('password_field');
  const toggleIcon = document.querySelector('.toggle-icon');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  }
}

function showProfileConfigButton() {
  const profileConfigButton = document.getElementById('profile-config_btn');
  if (profileConfigButton) {
    profileConfigButton.style.display = 'block';
  }
}

function openProfileModal() {
  const overlay = document.getElementById('overlay');
  const profileModal = document.getElementById('profileModal');
  const profileConfigButton = document.getElementById('profile-config_btn');

  overlay.style.display = 'block';
  profileModal.style.display = 'block';
  profileConfigButton.style.display = 'block';
  displayUserInfo();
}

function closeProfileModal() {
  const overlay = document.getElementById('overlay');
  const profileModal = document.getElementById('profileModal');

  overlay.style.display = 'none';
  profileModal.style.display = 'none';
}

function updateProfile() {
  const newPassword = document.getElementById('newPassword').value;
  const newName = document.getElementById('newName').value;
  const newAvatarInput = document.getElementById('avatar_input');
  const avatarInput = newAvatarInput.files[0];
  const logoContainer = document.getElementById('logo_container');

  if (newPassword) {
    const user = firebase.auth().currentUser;

    user.updatePassword(newPassword)
      .then(function () {
        alert('Hasło zaktualizowane pomyślnie!');
      })
      .catch(function (error) {
        alert('Błąd podczas aktualizacji hasła: ' + error.message);
      });
  }

  if (newName) {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: newName
    })
      .then(function () {
        alert('Nazwa zaktualizowana pomyślnie!');
      })
      .catch(function (error) {
        alert('Błąd podczas aktualizacji nazwy: ' + error.message);
      });
  }

  if (avatarInput && !avatarSelectedFromDiv) {
    const reader = new FileReader();

    reader.onload = function (e) {
      logoContainer.style.backgroundImage = `url('${e.target.result}')`;
    };

    reader.readAsDataURL(avatarInput);

    const user = firebase.auth().currentUser;

    firebase.database().ref('users/' + user.uid).update({ avatar: avatarInput.name })
      .then(function () {
        alert('Avatar zaktualizowany pomyślnie!');
        
        avatarSelectedFromDiv = false;

      })
      .catch(function (error) {
        alert('Błąd podczas aktualizacji avatara: ' + error.message);
      });
  }
}

function logout() {
  firebase.auth().signOut()
    .then(function () {
      location.reload();
    })
    .catch(function (error) {
      console.error('Błąd podczas wylogowywania:', error);
    });
}
