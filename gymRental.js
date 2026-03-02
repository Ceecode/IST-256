$(document).ready(function() {
    let reservations = [];

    $('#reservationForm').on('submit', function(e) {
        e.preventDefault();

        // Capture field values
        const captain = $('#captainName').val().trim();
        const dateVal = $('#date').val();
        const timeVal = $('#timeSlot').val();
        const team = $('#teamName').val().trim();
        const players = $('#players').val();
        const cost = $('#costDisplay').text();

        // 1. Validation: All fields must be filled
        if (!captain || !dateVal || !timeVal || !team || !players) {
            alert("Error: All fields are required.");
            return;
        }

        // 2. Validation: Prevent dates in the past
        const selectedDate = new Date(dateVal + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert("Error: You cannot reserve a date in the past.");
            return;
        }

        // 3. Validation: Prevent double-booking same date/time
        const isConflict = reservations.some(res => res.date === dateVal && res.time === timeVal);
        if (isConflict) {
            alert(`Error: The slot ${timeVal} on ${dateVal} is already booked.`);
            return;
        }

        // Create the JSON object for storage
        const newEntry = {
            captain: captain,
            date: dateVal,
            time: timeVal,
            team: team,
            players: players,
            cost: cost
        };

        // Add to JSON array and update table
        reservations.push(newEntry);
        renderTable();
        
        // Console log for your JSON requirement
        console.log("Current Reservations JSON:", JSON.stringify(reservations));
        
        this.reset();
    });

    function renderTable() {
        const tableBody = $('#reservationTable');
        tableBody.empty();

        reservations.forEach(res => {
            tableBody.append(`
                <tr>
                    <td>${res.captain}</td>
                    <td>${res.date}</td>
                    <td>${res.time}</td>
                    <td>${res.team}</td>
                    <td>${res.players}</td>
                    <td>$${res.cost}</td>
                </tr>
            `);
        });
    }

    // jQuery Search functionality
    $('#searchInput').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        $("#reservationTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});