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
        user_name: 'Julian M',
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

    // Listener for add new active tab and remove the of the others.
    var tabsLinks = document.querySelectorAll('.tabs__link');
    tabsLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            tabsLinks.forEach(function(item) {
                item.classList.remove('tabs__link--active');
            });
            
            this.classList.add('tabs__link--active');

            var tabName = this.getAttribute('data-tab')
            if (tabFunctions[tabName]) {
                tabFunctions[tabName]();
            }
        });
    });

    loadMyTeamTab();
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

// TAB CONTENTS AREA
var tabFunctions = {
    myteam: loadMyTeamTab,
    athletes: loadAthletesTab,
    results: loadResultsTab,
    standings: loadStandingsTab,
    moregames: loadMoreGamesTab
};

function loadMyTeamTab() {
    var container = document.getElementById("tabContent");
    container.innerHTML = "";
    container.appendChild(createUnderConstructionSVG("My Team"));
}

function loadAthletesTab() {
    var container = document.getElementById("tabContent");
    container.innerHTML = "";
    container.appendChild(createUnderConstructionSVG("Athletes"));
}

function loadResultsTab() {
    var container = document.getElementById("tabContent");
    container.innerHTML = "";
    container.appendChild(createUnderConstructionSVG("Results"));
}

function loadStandingsTab() {
    var container = document.getElementById("tabContent");
    container.innerHTML = "";
    container.appendChild(createUnderConstructionSVG("Standings"));
}

function loadMoreGamesTab() {
    var container = document.getElementById("tabContent");
    container.innerHTML = "";
    container.appendChild(createUnderConstructionSVG("More Games"));
}

function createUnderConstructionSVG(tabName) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 600 400");

    // Triángulo de obras (se usa el amarillo #ffff00 en relleno)
    var triangle = document.createElementNS(svgNS, "polygon");
    triangle.setAttribute("points", "300,50 500,350 100,350");
    triangle.setAttribute("fill", "#ffff00");
    triangle.setAttribute("stroke", "#ffff00");
    triangle.setAttribute("stroke-width", "4");
    svg.appendChild(triangle);

    // Trabajador: cabezita (círculo)
    var head = document.createElementNS(svgNS, "circle");
    head.setAttribute("cx", "300");
    head.setAttribute("cy", "200");
    head.setAttribute("r", "20");
    head.setAttribute("fill", "#000");
    svg.appendChild(head);

    // Cuerpo (línea)
    var body = document.createElementNS(svgNS, "line");
    body.setAttribute("x1", "300");
    body.setAttribute("y1", "220");
    body.setAttribute("x2", "300");
    body.setAttribute("y2", "280");
    body.setAttribute("stroke", "#000");
    body.setAttribute("stroke-width", "4");
    svg.appendChild(body);

    // Brazo izquierdo
    var leftArm = document.createElementNS(svgNS, "line");
    leftArm.setAttribute("x1", "300");
    leftArm.setAttribute("y1", "240");
    leftArm.setAttribute("x2", "270");
    leftArm.setAttribute("y2", "260");
    leftArm.setAttribute("stroke", "#000");
    leftArm.setAttribute("stroke-width", "4");
    svg.appendChild(leftArm);

    // Brazo derecho (sostiene la pala)
    var rightArm = document.createElementNS(svgNS, "line");
    rightArm.setAttribute("x1", "300");
    rightArm.setAttribute("y1", "240");
    rightArm.setAttribute("x2", "330");
    rightArm.setAttribute("y2", "260");
    rightArm.setAttribute("stroke", "#000");
    rightArm.setAttribute("stroke-width", "4");
    svg.appendChild(rightArm);

    // Pierna izquierda
    var leftLeg = document.createElementNS(svgNS, "line");
    leftLeg.setAttribute("x1", "300");
    leftLeg.setAttribute("y1", "280");
    leftLeg.setAttribute("x2", "280");
    leftLeg.setAttribute("y2", "320");
    leftLeg.setAttribute("stroke", "#000");
    leftLeg.setAttribute("stroke-width", "4");
    svg.appendChild(leftLeg);

    // Pierna derecha
    var rightLeg = document.createElementNS(svgNS, "line");
    rightLeg.setAttribute("x1", "300");
    rightLeg.setAttribute("y1", "280");
    rightLeg.setAttribute("x2", "320");
    rightLeg.setAttribute("y2", "320");
    rightLeg.setAttribute("stroke", "#000");
    rightLeg.setAttribute("stroke-width", "4");
    svg.appendChild(rightLeg);

    // Pala: mango (línea) y pala (polígono)
    var shovelHandle = document.createElementNS(svgNS, "line");
    shovelHandle.setAttribute("x1", "330");
    shovelHandle.setAttribute("y1", "260");
    shovelHandle.setAttribute("x2", "370");
    shovelHandle.setAttribute("y2", "260");
    shovelHandle.setAttribute("stroke", "#654321");
    shovelHandle.setAttribute("stroke-width", "4");
    svg.appendChild(shovelHandle);

    var shovelBlade = document.createElementNS(svgNS, "polygon");
    shovelBlade.setAttribute("points", "370,250 390,265 370,280");
    shovelBlade.setAttribute("fill", "#654321");
    svg.appendChild(shovelBlade);

    // Texto que indica la construcción
    var textElem = document.createElementNS(svgNS, "text");
    textElem.setAttribute("x", "50%");
    textElem.setAttribute("y", "390");
    textElem.setAttribute("dominant-baseline", "middle");
    textElem.setAttribute("text-anchor", "middle");
    textElem.setAttribute("font-size", "24");
    textElem.setAttribute("fill", "#333");
    textElem.textContent = tabName + " content load is under construction";
    svg.appendChild(textElem);

    return svg;
}