let registrations = [];
let editIndex = -1;

// Load data on page start
document.addEventListener('DOMContentLoaded', () => {
    try {
        const savedData = localStorage.getItem('teamData');
        if (savedData) {
            registrations = JSON.parse(savedData);
            renderTable();
        }
    } catch (e) {
        console.error("Storage access denied or empty.");
    }
});

const registrationForm = document.getElementById('registrationForm');

registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        teamName: document.getElementById('teamName').value.trim(),
        numPlayers: parseInt(document.getElementById('numPlayers').value),
        avgAge: parseInt(document.getElementById('avgAge').value),
        school: document.getElementById('school').value.trim().toUpperCase()
    };

    // Validations
    if (data.fullName === "") return alert("Please enter the Team Captain's Name.");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) return alert("Please enter a valid Email.");

    const phoneRegex = /^\d{10}$/; 
    if (!phoneRegex.test(data.phone)) return alert("Phone Number must be exactly 10 digits.");

    if (data.teamName === "") return alert("Please enter a Team Name.");

    if (isNaN(data.numPlayers) || data.numPlayers < 5 || data.numPlayers > 15) {
        return alert("Number of Players must be between 5 and 15.");
    }

    if (isNaN(data.avgAge) || data.avgAge < 18 || data.avgAge > 28) {
        return alert("Average Age must be between 18 and 28.");
    }

    if (data.school === "") return alert("Please enter a School abbreviation.");

    // Update or Push
    if (editIndex > -1) {
        registrations[editIndex] = data;
        editIndex = -1;
        document.getElementById('submitBtn').innerText = "Submit Registration";
        alert("Entry updated successfully!");
    } else {
        registrations.push(data);
        alert("Registration successful!");
    }

    localStorage.setItem('teamData', JSON.stringify(registrations));
    registrationForm.reset();
    renderTable();
});

// THE DISPLAY FIX IS HERE
function renderTable() {
    const tableBody = document.getElementById('registrationTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';

    registrations.forEach((entry, index) => {
        // Ensure there are 5 <td> tags to match the 5 <th> tags in your HTML
        tableBody.innerHTML += `
            <tr>
                <td>${entry.teamName}</td>
                <td>${entry.school}</td>
                <td>${entry.fullName}</td>
                <td>${entry.numPlayers}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editEntry(${index})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEntry(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

window.editEntry = (index) => {
    const entry = registrations[index];
    document.getElementById('fullName').value = entry.fullName;
    document.getElementById('email').value = entry.email;
    document.getElementById('phone').value = entry.phone;
    document.getElementById('teamName').value = entry.teamName;
    document.getElementById('numPlayers').value = entry.numPlayers;
    document.getElementById('avgAge').value = entry.avgAge;
    document.getElementById('school').value = entry.school;
    
    editIndex = index;
    document.getElementById('submitBtn').innerText = "Update Entry";
    window.scrollTo(0, 0);
};

window.deleteEntry = (index) => {
    if (confirm("Are you sure you want to delete this registration?")) {
        registrations.splice(index, 1);
        localStorage.setItem('teamData', JSON.stringify(registrations));
        renderTable();
    }
};
