let registrations = JSON.parse(localStorage.getItem('teamData')) || [];
let editIndex = -1; 

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    renderTable();

    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            teamName: document.getElementById('teamName').value.trim(),
            numPlayers: parseInt(document.getElementById('numPlayers').value),
            avgAge: parseFloat(document.getElementById('avgAge').value),
            school: document.getElementById('school').value.trim().toUpperCase() // Formats to uppercase
        };

        if (!validateForm(formData)) return;

        if (editIndex > -1) {
            registrations[editIndex] = formData;
            editIndex = -1;
            alert("Team registration updated!");
        } else {
            registrations.push(formData);
            alert("Team registered successfully!");
        }

        localStorage.setItem('teamData', JSON.stringify(registrations));
        
        registrationForm.reset();
        renderTable();
    });
});

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (data.fullName === "") {
        alert("Full Name is required.");
        return false;
    }
    if (!emailRegex.test(data.email)) {
        alert("Please enter a valid Email Address.");
        return false;
    }
    if (!phoneRegex.test(data.phone)) {
        alert("Phone Number must be exactly 10 digits (e.g., 1234567890).");
        return false;
    }
    if (data.teamName === "") {
        alert("Team Name is required.");
        return false;
    }
    if (isNaN(data.numPlayers) || data.numPlayers < 5 || data.numPlayers > 15) {
        alert("Number of Players must be between 5 and 15.");
        return false;
    }
    if (isNaN(data.avgAge) || data.avgAge < 18 || data.avgAge > 28) {
        alert("Average Age must be between 18 and 28.");
        return false;
    }

    if (data.school === "") {
        alert("Please enter a School or Affiliation.");
        return false;
    }

    return true;
}

function renderTable() {
    const tableBody = document.getElementById('registrationTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    registrations.forEach((entry, index) => {
        const row = `
            <tr>
                <td>${entry.teamName}</td>
                <td>${entry.school}</td>
                <td>${entry.fullName}</td>
                <td>${entry.numPlayers}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editEntry(${index})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEntry(${index})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

window.editEntry = function(index) {
    const entry = registrations[index];
    document.getElementById('fullName').value = entry.fullName;
    document.getElementById('email').value = entry.email;
    document.getElementById('phone').value = entry.phone;
    document.getElementById('teamName').value = entry.teamName;
    document.getElementById('numPlayers').value = entry.numPlayers;
    document.getElementById('avgAge').value = entry.avgAge;
    document.getElementById('school').value = entry.school;
    
    editIndex = index;
    window.scrollTo(0, 0); 
};

window.deleteEntry = function(index) {
    if (confirm("Delete this team registration?")) {
        registrations.splice(index, 1);
        localStorage.setItem('teamData', JSON.stringify(registrations));
        renderTable();
    }
};