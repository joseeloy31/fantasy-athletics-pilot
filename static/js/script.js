// Constant with the user data (ordered according to the INSERT)
const fat_user = [
    {
        email: 'arq.dschneir@gmail.com',
        user_name: 'Denise',
        password: 'arquidenise',
        user_type: 'user'
    },
    {
        email: 'davidbedoya@movistar.es',
        user_name: 'David',
        password: 'davidatletismo',
        user_type: 'user'
    },
    {
        email: 'jmoralesmw@gmail.com',
        user_name: 'Julian',
        password: 'optijulian',
        user_type: 'user'
    },
    {
        email: 'joseeloy@gmail.com',
        user_name: 'Eloy',
        password: 'joseeloy31',
        user_type: 'administrator'
    },
    {
        email: 'matedo15@gmail.com',
        user_name: 'Marco',
        password: 'marcthletic',
        user_type: 'user'
    },
    {
        email: 'pilarduartegarcia@gmail.com',
        user_name: 'Pilar',
        password: 'pilarpilar',
        user_type: 'user'
    },
    {
        email: 'tonybroker@hotmail.com',
        user_name: 'Tony F',
        password: 'fujitony',
        user_type: 'user'
    }
];

const data = {
    "group_competitions": [
        "Diamond League 2025",
        "Grand Slam Track 2025"
    ]
}

document.addEventListener('DOMContentLoaded', function() {

    const userData = getLoginCookie();
    if (userData) {
        // Mostrar botón de usuario
        document.getElementById("userButtonText").textContent = userData.user_name;
        document.getElementById("userButton").style.display = "flex";
        document.getElementById("loginBlock").style.display = "none";
    } else {
        // Mostrar login (por defecto ya está visible, pero por si acaso)
        document.getElementById("userButton").style.display = "none";
        document.getElementById("loginBlock").style.display = "flex";
    }

    // Insert the first competition name from the constant data into the header competition element.
    if (typeof data !== 'undefined' && data.group_competitions && data.group_competitions.length > 0) {
        document.querySelector('.header__competition').textContent = data.group_competitions[0];
    }
    
    // Listener for the tick icon: validation on click
    document.querySelectorAll('.header__login-tick').forEach(function(tick) {
        tick.addEventListener('click', function(e) {
            validatePassword(e);
        });
    });

    // Listener for the input: validation when pressing "Enter" (Return key)
    document.querySelectorAll('.header__login-input').forEach(function(input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                validatePassword(e);
            }
        });
    });

    // Listener for the X icon: clear the input field value
    document.querySelectorAll('.header__login-cross').forEach(function(cross) {
        cross.addEventListener('click', function(e) {
            // Prevent propagation to avoid triggering other events
            e.stopPropagation();
            let passwordBox = this.closest('.header__login-password-box');
            let inputField = passwordBox.querySelector('.header__login-input');
            inputField.value = '';
        });
    });
});

function getLoginCookie() {
    const name = "fat_user=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(name) === 0) {
            try {
                return JSON.parse(c.substring(name.length, c.length));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}

document.addEventListener('click', function(e) {
    const loginDropdown = document.getElementById("loginDropdown");
    const userDropdown = document.getElementById("userDropdown");
    const loginBlock = document.getElementById("loginBlock");
    const userButton = document.getElementById("userButton");

    if (loginDropdown.style.display === "block" &&
        !loginDropdown.contains(e.target) &&
        !loginBlock.contains(e.target)) {
        
        loginDropdown.style.display = "none";
        loginBlock.classList.remove("dropdown-open");
        
        closeAllPasswordBoxes();
        
        document.querySelectorAll('.header__login-input').forEach(function(input) {
            input.value = '';
        });
    }
    
    if (userDropdown.style.display === "block" &&
        !userDropdown.contains(e.target) &&
        !userButton.contains(e.target)) {
        
        userDropdown.style.display = "none";
    }
});

function logoutUser() {
    document.cookie = "fat_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    document.getElementById("userDropdown").style.display = "none";
    document.getElementById("userButton").style.display = "none";
    document.getElementById("loginBlock").style.display = "flex";
}

function toggleLoginDropdown() {
    var dropdown = document.getElementById("loginDropdown");
    var loginBlock = document.getElementById("loginBlock"); // Contenedor del login

    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
        loginBlock.classList.remove("dropdown-open");
    } else {
        dropdown.style.display = "block";
        loginBlock.classList.add("dropdown-open");
        closeAllPasswordBoxes();
    }
}

// Close all password boxes instantly (without transition)
function closeAllPasswordBoxes() {
    var boxes = document.querySelectorAll(".header__login-password-box.active");
    boxes.forEach(function(box) {
        // Simplemente quitamos la clase "active" para que se animate el cierre
        box.classList.remove("active");
    });
}

// Toggle the password box for a specific user.
function togglePasswordBox(userElement) {
    var passwordContainer = userElement.nextElementSibling;
    if (passwordContainer && passwordContainer.classList.contains("header__login-password-container")) {
        var passwordBox = passwordContainer.querySelector(".header__login-password-box");
        
        if (passwordBox.classList.contains("active")) {
            passwordBox.classList.remove("active");
        } else {
            closeAllPasswordBoxes();
            passwordBox.classList.add("active");
        }
    }
}

// Function to validate the user's password
function validatePassword(e) {
    // Get the password container associated with the clicked button (tick or Enter)
    let passwordBox = e.target.closest('.header__login-password-box');
    let inputField = passwordBox.querySelector('.header__login-input');
    let enteredPassword = inputField.value.trim();

    // It is assumed that the HTML list follows the structure in which the user li 
    // is immediately before the li containing the password input.
    let passwordContainerLI = passwordBox.parentElement;
    let userLI = passwordContainerLI.previousElementSibling;
    let userNameSpan = userLI.querySelector('.header__login-username');
    let userName = userNameSpan.textContent.trim();

    // Search for the corresponding record in the fat_user constant
    let userRecord = fat_user.find(function(user) {
        return user.user_name === userName;
    });

    // Validation: if the user is found and the password matches,
    // hide the login block and show the logged in user button;
    // otherwise, trigger a "shake" effect.
    if (userRecord && enteredPassword === userRecord.password) {
        // Clear all password input fields
        document.querySelectorAll('.header__login-input').forEach(function(input) {
            input.value = '';
        });

        // Hide the login dropdown and block
        document.getElementById("loginDropdown").style.display = "none";
        document.getElementById("loginBlock").style.display = "none";

        var loginBlock = document.getElementById("loginBlock");
        loginBlock.classList.remove("dropdown-open");

        // Set the username text in the user button
        document.getElementById("userButtonText").textContent = userName;
        // Show the logged in user button
        document.getElementById("userButton").style.display = "flex";
    
        // 💾 Set the login cookie
        setLoginCookie(userRecord);
    } else {
        triggerShake(passwordBox);
    }
}

// Function to toggle the user dropdown on user button click
document.getElementById("userButton").addEventListener("click", function(e) {
    // Toggle the display of the user dropdown
    let dropdown = document.getElementById("userDropdown");
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
});

function setLoginCookie(user) {
    const cookieValue = JSON.stringify({
        email: user.email,
        user_name: user.user_name,
        user_type: user.user_type
    });

    // La cookie expira en 7 días
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    document.cookie = `fat_user=${encodeURIComponent(cookieValue)}; expires=${expirationDate.toUTCString()}; path=/`;
}

// Function to apply the "shake" effect to an element
function triggerShake(element) {
    element.classList.add('shake');
    // Remove the class after the animation completes (300ms in this case)
    setTimeout(function() {
        element.classList.remove('shake');
    }, 300);
}